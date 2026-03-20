---
name: context7-rest-api
description: Use the Context7 REST API directly with curl or HTTP clients when you need raw library search and context retrieval via CONTEXT7_API_KEY. Use this skill for scripted lookups, debugging Context7 results, or when the user explicitly wants the HTTP API instead of the ctx7 CLI.
---

# Context7 REST API

Use this skill when the user wants direct Context7 HTTP requests instead of the `ctx7` CLI.

Do not use this skill for normal doc lookup if `context7-cli` or `find-docs` already fits better. Use it when:

- the user explicitly asks for `curl`, REST, or HTTP usage
- you need to script Context7 requests in shell or code
- you are debugging Context7 results or auth outside the CLI

## Auth

Context7 REST API requests need:

```bash
-H "Authorization: Bearer $CONTEXT7_API_KEY"
```

Do not inline real API keys into committed files, scripts, or logs.

## Workflow

Always use the two-step flow:

1. Search for the library and get the exact `libraryId`
2. Fetch context with that `libraryId`

## Step 1: Search Libraries

Use `/api/v2/libs/search` to find the correct library.

```bash
curl -X GET "https://context7.com/api/v2/libs/search?libraryName=next.js&query=setup+ssr" \
  -H "Authorization: Bearer $CONTEXT7_API_KEY"
```

Guidance:

- `libraryName` should be the product or package name the user mentioned
- `query` should be the actual task or question, URL-encoded
- pick the best returned `libraryId` before moving to step 2

## Step 2: Fetch Context

Use `/api/v2/context` with the exact `libraryId` from search.

```bash
curl -X GET "https://context7.com/api/v2/context?libraryId=/vercel/next.js&query=setup+ssr&type=txt" \
  -H "Authorization: Bearer $CONTEXT7_API_KEY"
```

Guidance:

- `libraryId` must come from search or an exact known Context7 library ID
- `query` should stay specific to the user task
- `type=txt` is the default text-oriented response shape for prompt/context use

## Shell Tips

- URL-encode spaces as `+` or `%20`
- quote the full URL so the shell does not split `&`
- prefer environment variables over hardcoded keys

Example with variables:

```bash
LIBRARY_NAME="next.js"
QUERY="setup ssr"

curl -X GET "https://context7.com/api/v2/libs/search?libraryName=${LIBRARY_NAME}&query=setup+ssr" \
  -H "Authorization: Bearer $CONTEXT7_API_KEY"
```

## Common Mistakes

- calling `/context` before resolving a valid `libraryId`
- using a plain package name instead of a Context7 `libraryId`
- forgetting the `Authorization` header
- pasting the real API key into chat output or source files
- using vague queries like `hooks` or `auth` instead of the concrete user task

## Failure Handling

- `401` or `403`: missing, invalid, or unauthorized `CONTEXT7_API_KEY`
- `404`: invalid `libraryId` or endpoint misuse
- `429`: rate limit or quota issue; retry later or confirm account limits

If the REST call fails, report the exact HTTP error and whether the failure happened during `search` or `context`.
