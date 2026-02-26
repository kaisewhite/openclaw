import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import * as path from "node:path";
import { addStandardTags } from "../../helpers/tag_resources";

export interface LinearSlackDispatcherLambdaProps {
  readonly project: string;
  readonly environment: string;
  readonly secretName?: string;
}

export class LinearSlackDispatcherLambda extends Construct {
  public readonly handler: lambda.Function;
  public readonly functionUrl: lambda.FunctionUrl;

  constructor(scope: Construct, id: string, props: LinearSlackDispatcherLambdaProps) {
    super(scope, id);

    const secretName = props.secretName ?? `/openclaw/${props.environment}/integrations/linear-slack-dispatcher`;
    const functionName = `${props.project}-linear-dispatcher`;
    const secret = secretsmanager.Secret.fromSecretNameV2(this, `${props.project}-linear-dispatcher-secret`, secretName);
    const existingLogGroup = logs.LogGroup.fromLogGroupName(
      this,
      `${props.project}-linear-dispatcher-existing-log-group`,
      `/aws/lambda/${functionName}`
    );

    this.handler = new lambda.Function(this, `${props.project}-linear-dispatcher`, {
      runtime: lambda.Runtime.PYTHON_3_12,
      architecture: lambda.Architecture.ARM_64,
      functionName,
      logGroup: existingLogGroup,
      handler: "app.lambda_handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "lambda_code")),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      description: "Linear webhook receiver that dispatches assignment notifications to Slack",
      environment: {
        DISPATCHER_SECRET_NAME: secretName,
        LINEAR_WEBHOOK_MAX_SKEW_MS: "60000",
        LOG_LEVEL: "INFO",
      },
    });

    secret.grantRead(this.handler);

    this.functionUrl = this.handler.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    addStandardTags(this.handler, {
      project: props.project,
      service: "linear-dispatcher",
      environment: props.environment,
      customTags: {
        Stack: "integration",
      },
    });

    new cdk.CfnOutput(this, `${props.project}-linear-dispatcher-url`, {
      value: this.functionUrl.url,
      exportName: `${props.project}-linear-dispatcher-url`,
      description: "Public webhook URL for Linear -> Slack dispatch",
    });
  }
}
