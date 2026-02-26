ARG BASE_IMAGE=openclaw-base:local
FROM ${BASE_IMAGE}

USER root

ARG OPENCLAW_AGENT_APT_PACKAGES="ca-certificates curl wget git git-lfs gh jq yq ripgrep fd-find unzip zip tar less procps psmisc tree rsync openssh-client python3 python3-pip python3-venv make build-essential awscli shellcheck yamllint pre-commit"

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends ${OPENCLAW_AGENT_APT_PACKAGES} && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/* && \
    if command -v fdfind >/dev/null 2>&1 && ! command -v fd >/dev/null 2>&1; then ln -sf "$(command -v fdfind)" /usr/local/bin/fd; fi && \
    git lfs install --system || true

COPY infrastructure/docker/openclaw-entrypoint.sh /usr/local/bin/openclaw-entrypoint.sh
COPY infrastructure/docker/openclaw-bootstrap.mjs /usr/local/bin/openclaw-bootstrap.mjs

RUN chmod 0755 /usr/local/bin/openclaw-entrypoint.sh /usr/local/bin/openclaw-bootstrap.mjs

USER node

ENTRYPOINT ["/usr/local/bin/openclaw-entrypoint.sh"]
