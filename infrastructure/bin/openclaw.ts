#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { OpenclawStack } from "../lib/openclaw-stack";
import * as dotenv from "dotenv";
dotenv.config();

const mgmt = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };

const app = new cdk.App();
new OpenclawStack(app, "OpenclawStack", {
  env: mgmt,
  stackName: "openclaw-root-cdk",
  description: "CDK root stack for OpenClaw project",
});
