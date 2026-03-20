#!/usr/bin/env bash
set -euo pipefail

export AWS_REGION="us-east-1"
# Set AWS profile for management account
AWS_PROFILE="mostrom_mgmt"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
INFRA_DIR="$ROOT_DIR/infrastructure"
OPENCLAW_DIR="$ROOT_DIR/openclaw"

REPOSITORY_NAME="${OPENCLAW_ECR_REPOSITORY:-openclaw-gateway}"
IMAGE_TAG="${OPENCLAW_IMAGE_TAG:-latest}"
BASE_IMAGE_TAG="${OPENCLAW_BASE_IMAGE_TAG:-openclaw-base:local}"
DOCKER_PLATFORM="${DOCKER_PLATFORM:-linux/amd64}"
CLUSTER_NAME="${OPENCLAW_ECS_CLUSTER:-openclaw}"
OPENCLAW_INSTALL_BROWSER="${OPENCLAW_INSTALL_BROWSER:-1}"

echo "NOTE: This script builds/pushes images and forces ECS deployments."
echo "NOTE: It does NOT push/update Secrets Manager values. Run ./scripts/secrets/push-agent-secrets.sh for secret changes."

if ! command -v aws >/dev/null 2>&1; then
  echo "ERROR: aws CLI not found." >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: docker not found." >&2
  exit 1
fi

AWS_ACCOUNT_ID="$(aws sts get-caller-identity --profile "$AWS_PROFILE" --region "$AWS_REGION" --query Account --output text)"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
ECR_IMAGE="${ECR_REGISTRY}/${REPOSITORY_NAME}:${IMAGE_TAG}"

echo "==> Building OpenClaw base image from source: ${BASE_IMAGE_TAG}"
docker build \
  --platform "$DOCKER_PLATFORM" \
  --build-arg "OPENCLAW_INSTALL_BROWSER=${OPENCLAW_INSTALL_BROWSER}" \
  -t "$BASE_IMAGE_TAG" \
  -f "$OPENCLAW_DIR/Dockerfile" \
  "$OPENCLAW_DIR"

echo "==> Building wrapped gateway image: ${ECR_IMAGE}"
docker build \
  --platform "$DOCKER_PLATFORM" \
  --build-arg "BASE_IMAGE=${BASE_IMAGE_TAG}" \
  -t "$ECR_IMAGE" \
  -f "$INFRA_DIR/docker/Dockerfile" \
  "$ROOT_DIR"

echo "==> Validating required binaries in image"
docker run --rm \
  --platform "$DOCKER_PLATFORM" \
  --entrypoint /bin/bash \
  "$ECR_IMAGE" \
  -lc 'for b in bun bunx fd sam poetry lin nodemon chromium dembrandt; do command -v "$b" >/dev/null 2>&1 || { echo "Missing required binary: $b" >&2; exit 1; }; done'

echo "==> Ensuring ECR repository exists: ${REPOSITORY_NAME}"
if ! aws ecr describe-repositories \
  --repository-names "$REPOSITORY_NAME" \
  --profile "$AWS_PROFILE" \
  --region "$AWS_REGION" >/dev/null 2>&1; then
  aws ecr create-repository \
    --repository-name "$REPOSITORY_NAME" \
    --profile "$AWS_PROFILE" \
    --region "$AWS_REGION" >/dev/null
fi

echo "==> Logging in to ECR: ${ECR_REGISTRY}"
aws ecr get-login-password --profile "$AWS_PROFILE" --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ECR_REGISTRY"

echo "==> Pushing image: ${ECR_IMAGE}"
docker push "$ECR_IMAGE"

echo "==> Forcing ECS service deployments in cluster: ${CLUSTER_NAME}"
service_arns="$(aws ecs list-services \
  --cluster "$CLUSTER_NAME" \
  --profile "$AWS_PROFILE" \
  --region "$AWS_REGION" \
  --output text \
  --query 'serviceArns[*]')"

for service_arn in $service_arns; do
  service_name="$(basename "$service_arn")"
  echo " -> ${service_name}"
  aws ecs update-service \
    --cluster "$CLUSTER_NAME" \
    --service "$service_name" \
    --force-new-deployment \
    --profile "$AWS_PROFILE" \
    --region "$AWS_REGION" >/dev/null
done

echo "Done."
echo "Image pushed: ${ECR_IMAGE}"
