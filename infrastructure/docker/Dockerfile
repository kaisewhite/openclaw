ARG BASE_IMAGE=openclaw-base:local
FROM ${BASE_IMAGE}

USER root

ARG OPENCLAW_AGENT_APT_PACKAGES="ca-certificates curl wget git git-lfs gh jq yq ripgrep fd-find unzip zip tar less procps psmisc tree rsync openssh-client python3 python3-pip python3-venv make build-essential awscli shellcheck yamllint pre-commit sqlite3 postgresql-client default-mysql-client redis-tools dnsutils netcat-openbsd lsof iputils-ping"

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends ${OPENCLAW_AGENT_APT_PACKAGES} && \
    npm install -g @linear/cli@0.0.5 nodemon@3 && \
    BUN_INSTALL=/usr/local/bun curl -fsSL https://bun.sh/install | bash && \
    ln -sf /usr/local/bun/bin/bun /usr/local/bin/bun && \
    ln -sf /usr/local/bun/bin/bunx /usr/local/bin/bunx && \
    pip3 install --no-cache-dir poetry==1.8.3 && \
    arch="$(dpkg --print-architecture)" && \
    case "${arch}" in \
      amd64) sam_arch="x86_64" ;; \
      arm64) sam_arch="arm64" ;; \
      *) echo "Unsupported architecture for SAM CLI: ${arch}" >&2; exit 1 ;; \
    esac && \
    curl -fsSL "https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-${sam_arch}.zip" -o /tmp/aws-sam-cli.zip && \
    unzip -q /tmp/aws-sam-cli.zip -d /tmp/sam-installation && \
    /tmp/sam-installation/install --update && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/* && \
    rm -rf /tmp/aws-sam-cli.zip /tmp/sam-installation && \
    if command -v fdfind >/dev/null 2>&1 && ! command -v fd >/dev/null 2>&1; then ln -sf "$(command -v fdfind)" /usr/local/bin/fd; fi && \
    git lfs install --system || true

COPY infrastructure/docker/openclaw-entrypoint.sh /usr/local/bin/openclaw-entrypoint.sh
COPY infrastructure/docker/openclaw-bootstrap.mjs /usr/local/bin/openclaw-bootstrap.mjs
COPY infrastructure/agent-assets/skills /opt/openclaw/skills

RUN chmod 0755 /usr/local/bin/openclaw-entrypoint.sh /usr/local/bin/openclaw-bootstrap.mjs && \
    chown -R node:node /opt/openclaw/skills

USER node

ENTRYPOINT ["/usr/local/bin/openclaw-entrypoint.sh"]
