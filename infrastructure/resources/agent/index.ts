import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as efs from "aws-cdk-lib/aws-efs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as logs from "aws-cdk-lib/aws-logs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as path from "node:path";
import * as fs from "node:fs";
import { Agent } from "../../properties";
import { addStandardTags } from "../../helpers/tag_resources";

export interface AgentFargateStackProps extends cdk.StackProps {
  readonly environment: string;
  readonly project: string;
  readonly agent: Agent;
  readonly vpc: ec2.IVpc;
  readonly cluster: ecs.ICluster;
  readonly fileSystem: efs.FileSystem;
  readonly taskSecurityGroup: ec2.ISecurityGroup;
  readonly ecrRepositoryName: string;
  readonly imageTag: string;
}

const readFileIfExists = (relativePath: string): string => {
  const absolutePath = path.resolve(process.cwd(), relativePath);
  if (!fs.existsSync(absolutePath)) {
    return "";
  }
  return fs.readFileSync(absolutePath, "utf8");
};

const generateContainerSecrets = (
  secret: secretsmanager.ISecret,
  directEnvKeys: string[] = [],
): Record<string, ecs.Secret> => {
  const containerSecrets: Record<string, ecs.Secret> = {};

  for (const key of [...new Set(directEnvKeys)]) {
    const trimmed = key.trim();
    if (!trimmed) {
      continue;
    }
    containerSecrets[trimmed] = ecs.Secret.fromSecretsManager(secret, trimmed);
  }

  return containerSecrets;
};

export class AgentFargateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AgentFargateStackProps) {
    super(scope, id, props);

    const prefix = `${props.environment}-${props.agent.id}`;
    const crossAccountDeveloperRoleArn = "arn:aws:iam::896502667345:role/cross-account-developer";
    const secret = secretsmanager.Secret.fromSecretNameV2(this, `${prefix}-secret`, props.agent.secrets.secretName);
    const repository = ecr.Repository.fromRepositoryName(this, `${prefix}-repo`, props.ecrRepositoryName);

    const accessPoint = props.fileSystem.addAccessPoint(`${prefix}-access-point`, {
      path: `/agents/${props.agent.id}`,
      createAcl: {
        ownerGid: "1000",
        ownerUid: "1000",
        permissions: "750",
      },
      posixUser: {
        gid: "1000",
        uid: "1000",
      },
    });

    const executionRole = new iam.Role(this, `${prefix}-execution-role`, {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      roleName: `${props.agent.id}-execution-role`,
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AmazonECSTaskExecutionRolePolicy")],
    });

    const taskRole = new iam.Role(this, `${prefix}-task-role`, {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      roleName: `${props.agent.id}-task-role`,
    });

    const efsPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["elasticfilesystem:ClientMount", "elasticfilesystem:ClientWrite", "elasticfilesystem:ClientRootAccess"],
      resources: [props.fileSystem.fileSystemArn],
      conditions: {
        StringEquals: {
          "elasticfilesystem:AccessPointArn": accessPoint.accessPointArn,
        },
      },
    });

    executionRole.addToPolicy(efsPolicy);
    taskRole.addToPolicy(efsPolicy);

    const scopedSecretReadPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["secretsmanager:GetSecretValue", "secretsmanager:DescribeSecret"],
      resources: [secret.secretArn],
    });

    executionRole.addToPolicy(scopedSecretReadPolicy);

    const allSecretsReadOnlyPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret",
        "secretsmanager:ListSecretVersionIds",
        "secretsmanager:ListSecrets",
        "secretsmanager:BatchGetSecretValue",
      ],
      resources: ["*"],
    });

    taskRole.addToPolicy(allSecretsReadOnlyPolicy);

    const route53DomainAvailabilityPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["route53domains:CheckDomainAvailability", "route53domains:GetDomainSuggestions"],
      resources: ["*"],
    });

    taskRole.addToPolicy(route53DomainAvailabilityPolicy);

    const crossAccountAssumeRolePolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["sts:AssumeRole"],
      resources: [crossAccountDeveloperRoleArn],
    });

    taskRole.addToPolicy(crossAccountAssumeRolePolicy);

    const logGroup = new logs.LogGroup(this, `${prefix}-log-group`, {
      logGroupName: `/aws/ecs/openclaw/${props.agent.id}`,
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, `${prefix}-task-definition`, {
      cpu: props.agent.runtime.cpu,
      memoryLimitMiB: props.agent.runtime.memoryLimitMiB,
      family: prefix,
      executionRole,
      taskRole,
      volumes: [
        {
          name: "openclaw-state",
          efsVolumeConfiguration: {
            fileSystemId: props.fileSystem.fileSystemId,
            transitEncryption: "ENABLED",
            authorizationConfig: {
              accessPointId: accessPoint.accessPointId,
              iam: "ENABLED",
            },
          },
        },
      ],
    });

    const soulPrompt = readFileIfExists(props.agent.openclaw.soulPromptPath);
    const openclawJson = JSON.stringify({
      id: props.agent.id,
      displayName: props.agent.displayName,
      model: props.agent.model,
      tools: {
        allow: props.agent.openclaw.allowTools,
        deny: props.agent.openclaw.denyTools,
      },
      overrides: props.agent.openclaw.configOverrides ?? {},
    });

    const authProfiles = JSON.stringify(props.agent.openclaw.authProfiles ?? {});
    const allSecretMap = generateContainerSecrets(secret, props.agent.secrets.directEnvKeys);
    if (Object.keys(allSecretMap).length === 0) {
      throw new Error(`No directEnvKeys configured for agent '${props.agent.id}'`);
    }

    const container = taskDefinition.addContainer(`${prefix}-container`, {
      image: ecs.ContainerImage.fromEcrRepository(repository, props.imageTag),
      essential: true,
      logging: ecs.LogDrivers.awsLogs({
        logGroup,
        streamPrefix: props.agent.id,
      }),
      portMappings: [{ containerPort: 18789, protocol: ecs.Protocol.TCP }],
      secrets: allSecretMap,
      interactive: true,
      environment: {
        OPENCLAW_AGENT_ID: props.agent.id,
        OPENCLAW_AGENT_NAME: props.agent.displayName,
        OPENCLAW_MODEL_PROVIDER: props.agent.model.provider,
        OPENCLAW_MODEL: props.agent.model.model,
        OPENCLAW_STATE_DIR: "/home/node/.openclaw",
        OPENCLAW_CONFIG_PATH: "/home/node/.openclaw/openclaw.json",
        OPENCLAW_GATEWAY_BIND: "lan",
        OPENCLAW_GATEWAY_PORT: "18789",
        // ECS runs immutable images; disable in-container self-update checks by default.
        OPENCLAW_AUTO_UPDATE: "false",
        OPENCLAW_UPDATE_CHANNEL: "stable",
        OPENCLAW_SOUL_MD: soulPrompt,
        OPENCLAW_JSON: openclawJson,
        OPENCLAW_AUTH_PROFILES_JSON: authProfiles,
        OPENCLAW_ALLOW_TOOLS: props.agent.openclaw.allowTools.join(","),
        OPENCLAW_DENY_TOOLS: props.agent.openclaw.denyTools.join(","),
      },
    });

    container.addMountPoints({
      sourceVolume: "openclaw-state",
      containerPath: "/home/node/.openclaw",
      readOnly: false,
    });

    const subnets = props.vpc.publicSubnets.length > 0 ? props.vpc.publicSubnets : props.vpc.privateSubnets;

    const service = new ecs.FargateService(this, `${prefix}-service`, {
      serviceName: props.agent.id,
      cluster: props.cluster,
      taskDefinition,
      desiredCount: props.agent.runtime.desiredCount,
      healthCheckGracePeriod: cdk.Duration.minutes(10),
      assignPublicIp: true,
      vpcSubnets: { subnets },
      securityGroups: [props.taskSecurityGroup],
      enableExecuteCommand: true,
      circuitBreaker: {
        enable: true,
        rollback: true,
      },
      minHealthyPercent: 50,
      maxHealthyPercent: 200,
      capacityProviderStrategies: [{ capacityProvider: "FARGATE", weight: 1 }],
    });

    addStandardTags(this, {
      project: props.project,
      service: props.agent.id,
      environment: props.environment,
      customTags: {
        Stack: "agent",
      },
    });

    addStandardTags(logGroup, {
      project: props.project,
      service: props.agent.id,
      environment: props.environment,
    });

    addStandardTags(taskDefinition, {
      project: props.project,
      service: props.agent.id,
      environment: props.environment,
    });

    addStandardTags(service, {
      project: props.project,
      service: props.agent.id,
      environment: props.environment,
    });

    new cdk.CfnOutput(this, `${prefix}-service-name`, {
      value: service.serviceName,
      exportName: `${prefix}-service-name`,
    });
  }
}
