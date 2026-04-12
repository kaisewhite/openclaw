ARG BASE_IMAGE=openclaw-base:local
FROM ${BASE_IMAGE}

USER root

ARG DEMBRANDT_VERSION=0.6.1
ARG SUPERPOWERS_COMMIT=8ea39819eed74fe2a0338e71789f06b30e953041
# Android Studio markets this release as 2025.3.3, but the Linux download path is versioned as 2025.3.3.6.
ARG ANDROID_STUDIO_VERSION=2025.3.3
ARG ANDROID_STUDIO_DOWNLOAD_VERSION=2025.3.3.6
ARG ANDROID_STUDIO_LINUX_BUNDLE=android-studio-panda3-linux.tar.gz
ARG ANDROID_STUDIO_SHA256=341ac0fc17dbc987d0530e0cfb327125480533d6733a889f2137636becd486a5
ARG OPENCLAW_AGENT_APT_PACKAGES="ca-certificates curl wget git git-lfs gh jq yq ripgrep fd-find unzip zip tar less procps psmisc tree rsync openssh-client python3 python3-pip python3-venv make build-essential shellcheck yamllint sqlite3 postgresql-client default-mysql-client redis-tools dnsutils netcat-openbsd lsof iputils-ping chromium"

ENV ANDROID_STUDIO_HOME=/opt/android-studio \
    ANDROID_SDK_ROOT=/home/node/Android/Sdk \
    ANDROID_HOME=/home/node/Android/Sdk

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    ${OPENCLAW_AGENT_APT_PACKAGES} \
    libxext6 libxrender1 libxtst6 libxi6 libfreetype6 libxrandr2 libatk1.0-0 \
    libc6 libnss3 libx11-6 libxcursor1 libxdamage1 libxfixes3 libasound2 xauth && \
    npm install -g @linear/cli@0.0.5 nodemon@3 ctx7@0.3.6 @upstash/context7-mcp@2.1.4 @playwright/mcp native-devtools-mcp dembrandt@${DEMBRANDT_VERSION} && \
    mkdir -p /home/node/.cache/ms-playwright && \
    PLAYWRIGHT_BROWSERS_PATH=/home/node/.cache/ms-playwright npm --prefix "$(npm root -g)/dembrandt" run install-browser && \
    curl -fsSL https://bun.sh/install | BUN_INSTALL=/usr/local/bun bash && \
    test -x /usr/local/bun/bin/bun && \
    ln -sf /usr/local/bun/bin/bun /usr/local/bin/bun && \
    printf '%s\n' '#!/usr/bin/env bash' 'exec /usr/local/bin/bun x "$@"' > /usr/local/bin/bunx && \
    chmod 0755 /usr/local/bin/bunx && \
    arch="$(dpkg --print-architecture)" && \
    case "${arch}" in \
      amd64) aws_arch="x86_64" ;; \
      arm64) aws_arch="aarch64" ;; \
      *) echo "Unsupported architecture for awscli installer: ${arch}" >&2; exit 1 ;; \
    esac && \
    curl -fsSL "https://awscli.amazonaws.com/awscli-exe-linux-${aws_arch}.zip" -o /tmp/awscliv2.zip && \
    unzip -q /tmp/awscliv2.zip -d /tmp && \
    /tmp/aws/install --bin-dir /usr/local/bin --install-dir /usr/local/aws-cli --update && \
    command -v aws >/dev/null 2>&1 && \
    rm -rf /tmp/aws /tmp/awscliv2.zip && \
    python3 -m pip install --no-cache-dir --break-system-packages pipx==1.7.1 && \
    command -v pipx >/dev/null 2>&1 && \
    PIPX_HOME=/opt/pipx PIPX_BIN_DIR=/usr/local/bin pipx install poetry==1.8.5 && \
    command -v poetry >/dev/null 2>&1 && \
    PIPX_HOME=/opt/pipx PIPX_BIN_DIR=/usr/local/bin pipx install pre-commit==4.3.0 && \
    command -v pre-commit >/dev/null 2>&1 && \
    PIPX_HOME=/opt/pipx PIPX_BIN_DIR=/usr/local/bin pipx install aws-sam-cli==1.154.0 && \
    command -v sam >/dev/null 2>&1 && \
    curl -fsSL "https://redirector.gvt1.com/edgedl/android/studio/ide-zips/${ANDROID_STUDIO_DOWNLOAD_VERSION}/${ANDROID_STUDIO_LINUX_BUNDLE}" -o /tmp/android-studio.tar.gz && \
    echo "${ANDROID_STUDIO_SHA256}  /tmp/android-studio.tar.gz" | sha256sum -c - && \
    tar -xzf /tmp/android-studio.tar.gz -C /opt && \
    rm -f /tmp/android-studio.tar.gz && \
    ln -sf /opt/android-studio/bin/studio.sh /usr/local/bin/android-studio && \
    mkdir -p /home/node/Android/Sdk && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/* && \
    if command -v fdfind >/dev/null 2>&1; then ln -sf "$(command -v fdfind)" /usr/local/bin/fd; fi && \
    chown -R node:node /home/node/.cache/ms-playwright /opt/android-studio /home/node/Android && \
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
