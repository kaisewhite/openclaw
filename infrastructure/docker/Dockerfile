ARG BASE_IMAGE=openclaw-base:local
FROM ${BASE_IMAGE}

USER root

ARG DEMBRANDT_VERSION=0.6.1
ARG SUPERPOWERS_COMMIT=8ea39819eed74fe2a0338e71789f06b30e953041
ARG OPENCLAW_AGENT_APT_PACKAGES="ca-certificates curl wget git git-lfs gh jq yq ripgrep fd-find unzip zip tar less procps psmisc tree rsync openssh-client python3 python3-pip python3-venv python3-poetry pipx make build-essential awscli shellcheck yamllint pre-commit sqlite3 postgresql-client default-mysql-client redis-tools dnsutils netcat-openbsd lsof iputils-ping chromium"

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends ${OPENCLAW_AGENT_APT_PACKAGES} && \
    npm install -g @linear/cli@0.0.5 nodemon@3 ctx7@0.3.6 @upstash/context7-mcp@2.1.4 dembrandt@${DEMBRANDT_VERSION} && \
    mkdir -p /home/node/.cache/ms-playwright && \
    PLAYWRIGHT_BROWSERS_PATH=/home/node/.cache/ms-playwright npm --prefix "$(npm root -g)/dembrandt" run install-browser && \
    curl -fsSL https://bun.sh/install | BUN_INSTALL=/usr/local/bun bash && \
    test -x /usr/local/bun/bin/bun && \
    ln -sf /usr/local/bun/bin/bun /usr/local/bin/bun && \
    printf '%s\n' '#!/usr/bin/env bash' 'exec /usr/local/bin/bun x "$@"' > /usr/local/bin/bunx && \
    chmod 0755 /usr/local/bin/bunx && \
    test -x /usr/bin/poetry && \
    PIPX_HOME=/opt/pipx PIPX_BIN_DIR=/usr/local/bin pipx install aws-sam-cli==1.154.0 && \
    command -v sam >/dev/null 2>&1 && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/* && \
    if command -v fdfind >/dev/null 2>&1; then ln -sf "$(command -v fdfind)" /usr/local/bin/fd; fi && \
    chown -R node:node /home/node/.cache/ms-playwright && \
    (git lfs install --system || true)

COPY infrastructure/docker/openclaw-entrypoint.sh /usr/local/bin/openclaw-entrypoint.sh
COPY infrastructure/docker/openclaw-bootstrap.mjs /usr/local/bin/openclaw-bootstrap.mjs
COPY infrastructure/agent-assets/skills /opt/openclaw/skills

RUN tmpdir="$(mktemp -d)" && \
    curl -fsSL "https://github.com/obra/superpowers/archive/${SUPERPOWERS_COMMIT}.tar.gz" -o "${tmpdir}/superpowers.tar.gz" && \
    tar -xzf "${tmpdir}/superpowers.tar.gz" -C "${tmpdir}" && \
    src_dir="$(find "${tmpdir}" -maxdepth 1 -type d -name 'superpowers-*' | head -n1)" && \
    test -n "${src_dir}" && \
    rsync -a "${src_dir}/skills/" /opt/openclaw/skills/ && \
    rm -rf "${tmpdir}" && \
    chmod 0755 /usr/local/bin/openclaw-entrypoint.sh /usr/local/bin/openclaw-bootstrap.mjs && \
    chown -R node:node /opt/openclaw/skills

USER node

ENTRYPOINT ["/usr/local/bin/openclaw-entrypoint.sh"]
