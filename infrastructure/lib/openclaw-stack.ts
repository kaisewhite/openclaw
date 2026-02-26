import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { project, EnvironmentKey } from "../properties";
import * as dotenv from "dotenv";
import { MainStack } from "../resources/main";
import { DevOpsStack } from "../resources/shared";

dotenv.config();

const deploymentEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

export class OpenclawStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    if (!deploymentEnv.account || !deploymentEnv.region) {
      throw new Error("CDK_DEFAULT_ACCOUNT and CDK_DEFAULT_REGION must be set.");
    }

    const devOpsStack = new DevOpsStack(this, `${project.name}-devops-stack-cdk`, {
      project: project.name,
      ecrRepositoryName: project.ecrRepositoryName,
      stackName: `${project.name}-devops-stack-cdk`,
      env: deploymentEnv,
      description: `DevOps stack for ${project.name} shared ECR resources`,
    });

    project.envs.forEach((environment) => {
      const env = environment as EnvironmentKey;

      const imageTag = project.imageTagByEnv?.[env] ?? env;

      const mainStack = new MainStack(this, `${project.name}-cdk`, {
        environment,
        project: project.name,
        agents: project.agents,
        ecrRepositoryName: project.ecrRepositoryName,
        imageTag,
        vpcId: `${process.env[`${environment.toUpperCase()}_VPC`]}`,
        stackName: `${project.name}-cdk`,
        env: deploymentEnv,
        description: `OpenClaw agent stack for ${project.name}`,
      });

      mainStack.addDependency(devOpsStack);
    });
  }
}
