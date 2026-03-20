# Linear -> Slack Dispatcher Lambda

## Purpose
Receives Linear webhook events and posts Slack assignment notifications tagging the mapped agent account.

This is intended for task routing patterns like:
- PM Agent creates task
- task gets assigned in Linear
- Lambda posts to Slack group with `<@AgentBot>` mention

## Deployed Resource
- Construct: `LinearSlackDispatcherLambda`
- Runtime: Python 3.12
- Endpoint: Lambda Function URL (public, no auth) for Linear webhook delivery

## Secret Configuration
Secret name default:
- `/openclaw/mgmt/integrations/linear-slack-dispatcher`

Required secret keys:
- `LINEAR_WEBHOOK_SECRET`
- `LINEAR_API_KEY`
- `SLACK_BOT_TOKEN`
- `SLACK_CHANNEL_ID`

Optional secret keys:
- `LINEAR_ASSIGNEE_TO_SLACK_USER_MAP` (JSON string object, key = Linear assignee ID)
- `LINEAR_ASSIGNEE_EMAIL_TO_SLACK_USER_MAP` (JSON string object)

## Event Handling
- Verifies webhook authenticity with `Linear-Signature` (HMAC-SHA256 over raw body).
- Validates freshness using payload `webhookTimestamp` (default max skew: 60s).
- Processes Issue assignment events for:
  - `action=create` with `assigneeId`
  - `action=update` where `updatedFrom.assigneeId` changed and `assigneeId` is set
- Resolves Slack mention target by assignee ID/email mapping.
- Ignores Linear comment events; assigned agents must read Linear comments directly before starting work.
- Slack assignment posts mention the mapped Slack target and the issue only; they do not echo Linear assignee email identities into channel messages.

Secret format note:
- Keep Secrets Manager values flat key/value strings.
- For mapping fields, store JSON as an escaped string value.

## Slack Requirements
- Bot token must include `chat:write`.
- Bot must be present in `SLACK_CHANNEL_ID`.
