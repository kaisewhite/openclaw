import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as efs from "aws-cdk-lib/aws-efs";
import * as iam from "aws-cdk-lib/aws-iam";
import { addStandardTags } from "../../helpers/tag_resources";

export interface DevOpsStackProps extends cdk.StackProps {
  readonly project: string;
  readonly ecrRepositoryName: string;
}

export class DevOpsStack extends cdk.Stack {
  public readonly repository: ecr.Repository;

  constructor(scope: Construct, id: string, props: DevOpsStackProps) {
    super(scope, id, props);

    addStandardTags(this, {
      project: props.project,
      service: "devops",
      environment: "shared",
      customTags: {
        Stack: "devops",
      },
    });

    this.repository = new ecr.Repository(this, `${props.project}-openclaw-repository`, {
      repositoryName: props.ecrRepositoryName,
      imageScanOnPush: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      lifecycleRules: [
        { tagPrefixList: ["latest", "mgmt"], maxImageCount: 10 },
        { tagStatus: ecr.TagStatus.UNTAGGED, maxImageCount: 5 },
      ],
    });

    addStandardTags(this.repository, {
      project: props.project,
      service: "openclaw",
      environment: "shared",
      customTags: {
        ResourceType: "ecr-repository",
      },
    });

    const accountPrincipals = [process.env.CDK_DEFAULT_ACCOUNT]
      .filter((account): account is string => Boolean(account))
      .map((account) => new iam.AccountPrincipal(account));

    accountPrincipals.forEach((principal) => this.repository.grantPull(principal));
    this.repository.grantPull(new iam.ServicePrincipal("ecs-tasks.amazonaws.com"));

    new cdk.CfnOutput(this, `${props.project}-openclaw-ecr-repository-name`, {
      value: this.repository.repositoryName,
      exportName: `${props.project}-openclaw-ecr-repository-name`,
    });

    new cdk.CfnOutput(this, `${props.project}-openclaw-ecr-repository-arn`, {
      value: this.repository.repositoryArn,
      exportName: `${props.project}-openclaw-ecr-repository-arn`,
    });
  }
}

export interface SharedServicesStackProps extends cdk.StackProps {
  readonly environment: string;
  readonly project: string;
  readonly vpcId: string;
}

export class SharedServicesStack extends cdk.Stack {
  public readonly vpc: ec2.IVpc;
  public readonly cluster: ecs.Cluster;
  public readonly fileSystem: efs.FileSystem;
  public readonly taskSecurityGroup: ec2.SecurityGroup;
  public readonly efsSecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: SharedServicesStackProps) {
    super(scope, id, props);

    const prefix = `${props.environment}-${props.project}`;

    addStandardTags(this, {
      project: props.project,
      service: "shared",
      environment: props.environment,
      customTags: {
        Stack: "shared",
      },
    });

    this.vpc = ec2.Vpc.fromLookup(this, `${prefix}-vpc`, {
      isDefault: false,
      vpcId: props.vpcId,
    });

    this.efsSecurityGroup = new ec2.SecurityGroup(this, `${prefix}-efs-sg`, {
      vpc: this.vpc,
      securityGroupName: `${props.project}-efs-sg`,
      description: "EFS NFS access",
      allowAllOutbound: true,
    });

    this.efsSecurityGroup.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    this.taskSecurityGroup = new ec2.SecurityGroup(this, `${prefix}-tasks-sg`, {
      vpc: this.vpc,
      securityGroupName: `${props.project}-tasks-sg`,
      description: "OpenClaw agent tasks",
      allowAllOutbound: true,
    });

    this.taskSecurityGroup.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    this.efsSecurityGroup.addIngressRule(this.taskSecurityGroup, ec2.Port.tcp(2049), "Allow NFS from ECS tasks");

    addStandardTags(this.efsSecurityGroup, {
      project: props.project,
      service: "efs",
      environment: props.environment,
    });

    addStandardTags(this.taskSecurityGroup, {
      project: props.project,
      service: "ecs-tasks",
      environment: props.environment,
    });

    this.cluster = new ecs.Cluster(this, `${prefix}-cluster`, {
      vpc: this.vpc,
      clusterName: `${props.project}`,
      enableFargateCapacityProviders: true,
      containerInsights: true,
    });

    this.cluster.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    addStandardTags(this.cluster, {
      project: props.project,
      service: "ecs-cluster",
      environment: props.environment,
    });

    const selectOneSubnetPerAz = (subnets: ec2.ISubnet[]): ec2.ISubnet[] => {
      const byAz = new Map<string, ec2.ISubnet>();
      for (const subnet of subnets) {
        if (!byAz.has(subnet.availabilityZone)) {
          byAz.set(subnet.availabilityZone, subnet);
        }
      }
      return [...byAz.values()];
    };

    const preferredSubnets = this.vpc.privateSubnets.length > 0 ? this.vpc.privateSubnets : this.vpc.publicSubnets;
    const efsSubnets = selectOneSubnetPerAz(preferredSubnets);

    this.fileSystem = new efs.FileSystem(this, `${prefix}-efs`, {
      vpc: this.vpc,
      vpcSubnets: { subnets: efsSubnets },
      encrypted: true,
      fileSystemName: `${props.project}-openclaw`,
      securityGroup: this.efsSecurityGroup,
      performanceMode: efs.PerformanceMode.GENERAL_PURPOSE,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    addStandardTags(this.fileSystem, {
      project: props.project,
      service: "efs",
      environment: props.environment,
    });

    new cdk.CfnOutput(this, `${prefix}-ecs-cluster-name`, {
      value: this.cluster.clusterName,
      exportName: `${prefix}-ecs-cluster-name`,
    });

    new cdk.CfnOutput(this, `${prefix}-efs-id`, {
      value: this.fileSystem.fileSystemId,
      exportName: `${prefix}-efs-id`,
    });

    new cdk.CfnOutput(this, `${prefix}-task-sg-id`, {
      value: this.taskSecurityGroup.securityGroupId,
      exportName: `${prefix}-task-sg-id`,
    });
  }
}
