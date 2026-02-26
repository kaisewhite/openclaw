import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Agent } from "../../properties";
import { addStandardTags } from "../../helpers/tag_resources";
import { SharedServicesStack } from "../shared";
import { AgentFargateStack } from "../agent";
import { LinearSlackDispatcherLambda } from "../lambda";

export interface MainStackProps extends cdk.StackProps {
  readonly environment: string;
  readonly project: string;
  readonly vpcId: string;
  readonly ecrRepositoryName: string;
  readonly imageTag: string;
  readonly agents: Agent[];
}

export class MainStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MainStackProps) {
    super(scope, id, props);

    addStandardTags(this, {
      project: props.project,
      service: "main",
      environment: props.environment,
      customTags: {
        Stack: "main",
      },
    });

    new LinearSlackDispatcherLambda(this, `${props.project}-linear-dispatcher`, {
      project: props.project,
      environment: props.environment,
    });

    const shared = new SharedServicesStack(this, `${props.project}-shared-services-cdk`, {
      stackName: `${props.project}-shared-services-cdk`,
      environment: props.environment,
      project: props.project,
      vpcId: props.vpcId,
      env: { account: this.account, region: this.region },
      tags: {
        Environment: props.environment,
        Project: props.project,
        Service: "shared",
      },
    });

    props.agents.forEach((agent) => {
      const agentStack = new AgentFargateStack(this, `${props.project}-${agent.id}-cdk`, {
        stackName: `${props.project}-${agent.id}-cdk`,
        environment: props.environment,
        project: props.project,
        agent,
        vpc: shared.vpc,
        cluster: shared.cluster,
        fileSystem: shared.fileSystem,
        taskSecurityGroup: shared.taskSecurityGroup,
        ecrRepositoryName: props.ecrRepositoryName,
        imageTag: props.imageTag,
        env: { account: this.account, region: this.region },
        tags: {
          Environment: props.environment,
          Project: props.project,
          Service: agent.id,
        },
      });

      agentStack.addDependency(shared);
    });
  }
}
