import base64
import hashlib
import hmac
import json
import logging
import os
import time
import urllib.error
import urllib.request
from typing import Any, Dict, Optional, Tuple

import boto3

LOGGER = logging.getLogger(__name__)
LOGGER.setLevel(os.getenv("LOG_LEVEL", "INFO").upper())
LINEAR_GRAPHQL_URL = os.getenv("LINEAR_GRAPHQL_URL", "https://api.linear.app/graphql").strip()

SECRETS = boto3.client("secretsmanager")
CONFIG_CACHE: Optional[Dict[str, Any]] = None


def _response(status_code: int, body: Any) -> Dict[str, Any]:
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": body if isinstance(body, str) else json.dumps(body),
    }


def _normalize_headers(event: Dict[str, Any]) -> Dict[str, str]:
    headers = event.get("headers") or {}
    if not isinstance(headers, dict):
        return {}
    return {str(key).lower(): str(value) for key, value in headers.items()}


def _raw_body(event: Dict[str, Any]) -> bytes:
    body = event.get("body") or ""
    if not isinstance(body, str):
        raise ValueError("Body must be a string.")
    if event.get("isBase64Encoded"):
        return base64.b64decode(body)
    return body.encode("utf-8")


def _parse_mapping(value: Any, *, lowercase_keys: bool = False) -> Dict[str, str]:
    if value is None:
        return {}
    parsed = value
    if isinstance(value, str):
        raw = value.strip()
        if not raw:
            return {}
        parsed = json.loads(raw)
    if not isinstance(parsed, dict):
        raise ValueError("Mapping must be a JSON object.")
    result: Dict[str, str] = {}
    for key, mapped in parsed.items():
        normalized = str(key).strip()
        if lowercase_keys:
            normalized = normalized.lower()
        result[normalized] = str(mapped).strip()
    return result


def _load_config() -> Dict[str, Any]:
    global CONFIG_CACHE
    if CONFIG_CACHE is not None:
        return CONFIG_CACHE

    secret_name = os.getenv("DISPATCHER_SECRET_NAME", "").strip()
    if not secret_name:
        raise RuntimeError("DISPATCHER_SECRET_NAME is not configured.")

    response = SECRETS.get_secret_value(SecretId=secret_name)
    secret_string = response.get("SecretString") or "{}"
    payload = json.loads(secret_string)
    if not isinstance(payload, dict):
        raise RuntimeError("Dispatcher secret must be a JSON object.")

    config = {str(key): value for key, value in payload.items()}
    for env_key in [
        "LINEAR_WEBHOOK_SECRET",
        "LINEAR_API_KEY",
        "SLACK_BOT_TOKEN",
        "SLACK_CHANNEL_ID",
        "LINEAR_ASSIGNEE_TO_SLACK_USER_MAP",
        "LINEAR_ASSIGNEE_EMAIL_TO_SLACK_USER_MAP",
    ]:
        env_value = os.getenv(env_key)
        if env_value:
            config[env_key] = env_value

    for required_key in ["LINEAR_WEBHOOK_SECRET", "LINEAR_API_KEY", "SLACK_BOT_TOKEN", "SLACK_CHANNEL_ID"]:
        required_value = config.get(required_key)
        if not isinstance(required_value, str) or not required_value.strip():
            raise RuntimeError(f"Dispatcher secret missing required key '{required_key}'.")

    config["LINEAR_ASSIGNEE_TO_SLACK_USER_MAP"] = _parse_mapping(config.get("LINEAR_ASSIGNEE_TO_SLACK_USER_MAP"))
    config["LINEAR_ASSIGNEE_EMAIL_TO_SLACK_USER_MAP"] = _parse_mapping(
        config.get("LINEAR_ASSIGNEE_EMAIL_TO_SLACK_USER_MAP"), lowercase_keys=True
    )

    CONFIG_CACHE = config
    return config


def _verify_signature(raw_body: bytes, signature_header: str, secret: str) -> bool:
    if not signature_header:
        return False
    expected = hmac.new(secret.encode("utf-8"), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature_header.strip().lower())


def _verify_timestamp(payload: Dict[str, Any]) -> bool:
    timestamp = payload.get("webhookTimestamp")
    if timestamp is None:
        return False
    try:
        timestamp_ms = int(timestamp)
    except (TypeError, ValueError):
        return False
    max_skew = int(os.getenv("LINEAR_WEBHOOK_MAX_SKEW_MS", "60000"))
    return abs(int(time.time() * 1000) - timestamp_ms) <= max_skew


def _is_issue_assignment_event(payload: Dict[str, Any]) -> bool:
    event_type = str(payload.get("type") or "").lower()
    if event_type != "issue":
        return False

    action = str(payload.get("action") or "").lower()
    data = payload.get("data") or {}
    if not isinstance(data, dict):
        return False

    assignee_id = str(data.get("assigneeId") or "").strip()
    if action == "create":
        return bool(assignee_id)
    if action != "update":
        return False

    updated_from = payload.get("updatedFrom") or {}
    if not isinstance(updated_from, dict):
        return False
    if "assigneeId" not in updated_from:
        return False
    return bool(assignee_id)


def _is_comment_event(payload: Dict[str, Any]) -> bool:
    event_type = str(payload.get("type") or "").lower()
    action = str(payload.get("action") or "").lower()
    return event_type == "comment" and action == "create"


def _resolve_slack_target_from_issue(issue_data: Dict[str, Any], config: Dict[str, Any]) -> Tuple[str, str]:
    if not isinstance(issue_data, dict):
        return "", "no_data"

    assignee_id = str(issue_data.get("assigneeId") or "").strip()
    if assignee_id:
        by_id = config["LINEAR_ASSIGNEE_TO_SLACK_USER_MAP"].get(assignee_id, "")
        if by_id:
            return by_id, "assignee_id"

    assignee = issue_data.get("assignee") or {}
    if isinstance(assignee, dict):
        nested_id = str(assignee.get("id") or "").strip()
        if nested_id:
            by_nested_id = config["LINEAR_ASSIGNEE_TO_SLACK_USER_MAP"].get(nested_id, "")
            if by_nested_id:
                return by_nested_id, "assignee_nested_id"

        email = str(assignee.get("email") or "").strip().lower()
        if email:
            by_email = config["LINEAR_ASSIGNEE_EMAIL_TO_SLACK_USER_MAP"].get(email, "")
            if by_email:
                return by_email, "assignee_email"

    return "", "no_route"


def _extract_assignee_id(issue_data: Dict[str, Any]) -> str:
    if not isinstance(issue_data, dict):
        return ""
    direct = str(issue_data.get("assigneeId") or "").strip()
    if direct:
        return direct
    assignee = issue_data.get("assignee") or {}
    if isinstance(assignee, dict):
        return str(assignee.get("id") or "").strip()
    return ""


def _issue_line(issue_data: Dict[str, Any], fallback_url: str = "") -> str:
    identifier = str(issue_data.get("identifier") or "").strip()
    title = _slack_escape(str(issue_data.get("title") or "Untitled issue"))
    issue_url = str(issue_data.get("url") or fallback_url or "").strip()
    issue_title = f"{identifier} {title}".strip() if identifier else title
    return f"<{issue_url}|{issue_title}>" if issue_url else issue_title


def _slack_escape(value: str) -> str:
    return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _build_assignment_message(payload: Dict[str, Any], slack_user_id: str, route_reason: str) -> str:
    issue_data = payload.get("data") or {}
    if not isinstance(issue_data, dict):
        issue_data = {}
    action = _slack_escape(str(payload.get("action") or "update"))
    issue_line = _issue_line(issue_data, str(payload.get("url") or "").strip())

    return "\n".join(
        [
            f"<@{slack_user_id}> Linear issue assignment update",
            f"*Issue:* {issue_line}",
            f"*Event:* `{action}` (route: `{_slack_escape(route_reason)}`)",
        ]
    )


def _truncate_single_line(text: str, max_chars: int = 240) -> str:
    one_line = " ".join(text.split())
    if len(one_line) <= max_chars:
        return one_line
    return one_line[: max_chars - 3].rstrip() + "..."


def _linear_graphql(config: Dict[str, Any], query: str, variables: Dict[str, Any]) -> Dict[str, Any]:
    request = urllib.request.Request(
        LINEAR_GRAPHQL_URL,
        method="POST",
        data=json.dumps({"query": query, "variables": variables}).encode("utf-8"),
        headers={
            "Authorization": str(config["LINEAR_API_KEY"]).strip(),
            "Content-Type": "application/json; charset=utf-8",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            body = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        error_body = error.read().decode("utf-8", errors="replace") if error.fp else ""
        raise RuntimeError(f"Linear GraphQL request failed: HTTP {error.code} {error_body}") from error
    except urllib.error.URLError as error:
        raise RuntimeError(f"Linear GraphQL request failed: {error.reason}") from error

    if body.get("errors"):
        raise RuntimeError(f"Linear GraphQL returned errors: {body.get('errors')}")
    data = body.get("data") or {}
    if not isinstance(data, dict):
        raise RuntimeError("Linear GraphQL response missing data object.")
    return data


def _fetch_issue_from_linear(config: Dict[str, Any], issue_id: str) -> Dict[str, Any]:
    query = """
    query DispatcherIssue($id: String!) {
      issue(id: $id) {
        id
        identifier
        title
        url
        assignee {
          id
          email
          name
        }
      }
    }
    """
    data = _linear_graphql(config, query, {"id": issue_id})
    issue = data.get("issue") or {}
    return issue if isinstance(issue, dict) else {}


def _merge_issue_data(base: Dict[str, Any], enriched: Dict[str, Any]) -> Dict[str, Any]:
    merged = dict(base)
    for key in ["id", "identifier", "title", "url", "assigneeId"]:
        if not merged.get(key) and enriched.get(key):
            merged[key] = enriched[key]

    base_assignee = merged.get("assignee") if isinstance(merged.get("assignee"), dict) else {}
    enriched_assignee = enriched.get("assignee") if isinstance(enriched.get("assignee"), dict) else {}
    if base_assignee or enriched_assignee:
        merged_assignee = dict(base_assignee)
        for key in ["id", "email", "name"]:
            if not merged_assignee.get(key) and enriched_assignee.get(key):
                merged_assignee[key] = enriched_assignee[key]
        merged["assignee"] = merged_assignee

    if not merged.get("assigneeId"):
        assignee = merged.get("assignee") if isinstance(merged.get("assignee"), dict) else {}
        assignee_id = str(assignee.get("id") or "").strip()
        if assignee_id:
            merged["assigneeId"] = assignee_id

    return merged


def _extract_commenter(data: Dict[str, Any], payload: Dict[str, Any]) -> Tuple[str, str]:
    direct_user_id = str(data.get("userId") or data.get("creatorId") or data.get("actorId") or "").strip()

    user_data = data.get("user") if isinstance(data.get("user"), dict) else {}
    actor_data = payload.get("actor") if isinstance(payload.get("actor"), dict) else {}

    nested_user_id = str(user_data.get("id") or actor_data.get("id") or "").strip()
    commenter_id = direct_user_id or nested_user_id

    display_name = str(user_data.get("name") or user_data.get("displayName") or "").strip()
    if not display_name:
        display_name = str(user_data.get("email") or "").strip()
    if not display_name:
        display_name = str(actor_data.get("name") or actor_data.get("displayName") or actor_data.get("email") or "").strip()
    if not display_name:
        display_name = commenter_id or "Unknown user"

    return commenter_id, display_name


def _extract_comment_issue(payload: Dict[str, Any], config: Dict[str, Any]) -> Tuple[Dict[str, Any], str, str, str, str]:
    data = payload.get("data") or {}
    if not isinstance(data, dict):
        return {}, "", "", "", ""

    issue_data = data.get("issue") if isinstance(data.get("issue"), dict) else {}
    issue_id = str(data.get("issueId") or issue_data.get("id") or "").strip()

    if issue_id:
        try:
            enriched_issue = _fetch_issue_from_linear(config, issue_id)
            issue_data = _merge_issue_data(issue_data, enriched_issue)
            if not issue_data.get("id"):
                issue_data["id"] = issue_id
        except Exception as error:  # noqa: BLE001
            LOGGER.warning("Failed to enrich comment issue '%s' from Linear API: %s", issue_id, error)

    commenter_id, commenter_display = _extract_commenter(data, payload)
    comment_body = str(data.get("body") or "").strip()
    comment_url = str(data.get("url") or payload.get("url") or "").strip()
    return issue_data, commenter_id, commenter_display, comment_body, comment_url


def _build_comment_message(
    payload: Dict[str, Any],
    issue_data: Dict[str, Any],
    slack_user_id: str,
    route_reason: str,
    commenter_display: str,
    comment_body: str,
    comment_url: str,
) -> str:
    action = _slack_escape(str(payload.get("action") or "create"))
    issue_line = _issue_line(issue_data, str(payload.get("url") or "").strip())

    lines = [
        f"<@{slack_user_id}> New comment on your assigned Linear issue",
        f"*Issue:* {issue_line}",
        f"*Comment by:* `{_slack_escape(commenter_display)}`",
    ]

    if comment_body:
        preview = _slack_escape(_truncate_single_line(comment_body))
        lines.append(f"*Comment:* {preview}")
    if comment_url:
        lines.append(f"*Comment Link:* <{comment_url}|Open in Linear>")

    lines.append(f"*Event:* `{action}` (route: `{_slack_escape(route_reason)}`)")
    return "\n".join(lines)


def _post_to_slack(bot_token: str, channel_id: str, text: str) -> None:
    request = urllib.request.Request(
        "https://slack.com/api/chat.postMessage",
        method="POST",
        data=json.dumps(
            {
                "channel": channel_id,
                "text": text,
                "mrkdwn": True,
                "unfurl_links": False,
                "unfurl_media": False,
            }
        ).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {bot_token}",
            "Content-Type": "application/json; charset=utf-8",
        },
    )

    with urllib.request.urlopen(request, timeout=10) as response:
        body = json.loads(response.read().decode("utf-8"))
    if not body.get("ok"):
        raise RuntimeError(f"Slack chat.postMessage failed: {body.get('error') or 'unknown_error'}")


def lambda_handler(event: Dict[str, Any], _context: Any) -> Dict[str, Any]:
    try:
        config = _load_config()
    except Exception as error:  # noqa: BLE001
        LOGGER.error("Dispatcher config error: %s", error)
        return _response(500, {"ok": False, "error": "dispatcher_config_error"})

    try:
        headers = _normalize_headers(event)
        raw = _raw_body(event)
        payload = json.loads(raw.decode("utf-8")) if raw else {}
    except Exception as error:  # noqa: BLE001
        LOGGER.warning("Invalid webhook payload: %s", error)
        return _response(400, {"ok": False, "error": "invalid_payload"})

    if not isinstance(payload, dict):
        return _response(400, {"ok": False, "error": "invalid_payload"})

    signature = headers.get("linear-signature", "")
    if not _verify_signature(raw, signature, config["LINEAR_WEBHOOK_SECRET"]):
        LOGGER.warning("Rejected webhook due to invalid Linear signature.")
        return _response(401, {"ok": False, "error": "invalid_signature"})

    if not _verify_timestamp(payload):
        LOGGER.warning("Rejected webhook due to stale/missing webhookTimestamp.")
        return _response(401, {"ok": False, "error": "invalid_timestamp"})

    if _is_issue_assignment_event(payload):
        issue_data = payload.get("data") or {}
        if not isinstance(issue_data, dict):
            issue_data = {}

        slack_user_id, route_reason = _resolve_slack_target_from_issue(issue_data, config)
        if not slack_user_id:
            return _response(200, {"ok": True, "notified": False, "reason": "no_matching_route"})

        try:
            text = _build_assignment_message(payload, slack_user_id, route_reason)
            _post_to_slack(config["SLACK_BOT_TOKEN"], config["SLACK_CHANNEL_ID"], text)
        except Exception as error:  # noqa: BLE001
            LOGGER.exception("Failed to send Slack notification: %s", error)
            return _response(500, {"ok": False, "error": "slack_dispatch_failed"})

        return _response(200, {"ok": True, "notified": True, "route": route_reason, "kind": "issue_assignment"})

    if _is_comment_event(payload):
        issue_data, commenter_id, commenter_display, comment_body, comment_url = _extract_comment_issue(payload, config)
        if not issue_data:
            return _response(200, {"ok": True, "notified": False, "reason": "missing_issue_context"})

        assignee_id = _extract_assignee_id(issue_data)
        if assignee_id and commenter_id and assignee_id == commenter_id:
            return _response(200, {"ok": True, "notified": False, "reason": "self_comment"})

        slack_user_id, route_reason = _resolve_slack_target_from_issue(issue_data, config)
        if not slack_user_id:
            return _response(200, {"ok": True, "notified": False, "reason": "no_matching_route"})

        try:
            text = _build_comment_message(
                payload,
                issue_data,
                slack_user_id,
                route_reason,
                commenter_display,
                comment_body,
                comment_url,
            )
            _post_to_slack(config["SLACK_BOT_TOKEN"], config["SLACK_CHANNEL_ID"], text)
        except Exception as error:  # noqa: BLE001
            LOGGER.exception("Failed to send Slack notification: %s", error)
            return _response(500, {"ok": False, "error": "slack_dispatch_failed"})

        return _response(200, {"ok": True, "notified": True, "route": route_reason, "kind": "issue_comment"})

    return _response(200, {"ok": True, "notified": False, "reason": "irrelevant_event"})
