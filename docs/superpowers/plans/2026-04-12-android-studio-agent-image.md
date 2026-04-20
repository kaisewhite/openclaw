# Android Studio Agent Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reproducible Android Studio for Linux install to the OpenClaw wrapped agent image, validate it during image builds, and document the new toolchain baseline.

**Architecture:** Keep the OpenClaw base image focused on the gateway/runtime build and install Android Studio in the wrapped agent image at `infrastructure/docker/Dockerfile`, because that is the image shipped to ECS agents today. Pin the Android Studio Linux tarball version and SHA-256 from the official Android Developers download page, expose stable paths and environment variables, and extend the existing image validation script so bad downloads or broken symlinks fail before push/deploy.

**Tech Stack:** Docker, Debian/Bookworm apt packages, Bash, Vitest, Android Studio for Linux, ECS image build scripts.

---

## File Structure

- Modify: `infrastructure/docker/Dockerfile`
  - Install Android Studio Linux into a stable location such as `/opt/android-studio`.
  - Add the minimal runtime libraries Android Studio needs on Debian-based Linux.
  - Pin `ANDROID_STUDIO_VERSION`, download URL, and SHA-256.
  - Create a stable launcher symlink for `studio.sh` and preserve the bundled JetBrains Runtime.
- Modify: `infrastructure/scripts/docker/build-push-openclaw-image.sh`
  - Extend the image validation step to assert Android Studio is installed and executable.
  - Add fast-fail checks for the expected install directory and launcher path.
- Modify: `infrastructure/README.md`
  - Add Android Studio to the wrapped image toolchain baseline and note where it is installed.
  - Document any important caveat about GUI/display support versus CLI/build usage.
- Create: `openclaw/src/agent-image-dockerfile.test.ts`
  - Add static coverage that the wrapped agent Dockerfile contains the Android Studio install contract and pinned metadata.
- Optional modify if needed during implementation: `openclaw/apps/android/README.md`
  - Only update if the final install path or env vars are important enough to call out for contributors using the agent image.

## External Reference Snapshot

- As of **April 12, 2026**, the official Android Developers download page lists:
  - Android Studio Linux package: `android-studio-panda3-linux.tar.gz`
  - Version label: `Android Studio Panda 3 | 2025.3.3`
  - SHA-256: `341ac0fc17dbc987d0530e0cfb327125480533d6733a889f2137636becd486a5`
- Source: `https://developer.android.com/studio`

### Task 1: Add Dockerfile Test Coverage For The Wrapped Agent Image

**Files:**
- Create: `openclaw/src/agent-image-dockerfile.test.ts`
- Modify: `openclaw/package.json` only if the new test file location needs no script changes; otherwise leave untouched
- Test: `openclaw/src/agent-image-dockerfile.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");

describe("wrapped agent Dockerfile", () => {
  it("pins and installs Android Studio for Linux", async () => {
    const dockerfile = await readFile(
      resolve(repoRoot, "infrastructure/docker/Dockerfile"),
      "utf8",
    );

    expect(dockerfile).toContain("ARG ANDROID_STUDIO_VERSION=");
    expect(dockerfile).toContain("ARG ANDROID_STUDIO_SHA256=");
    expect(dockerfile).toContain("android-studio");
    expect(dockerfile).toContain("/opt/android-studio");
    expect(dockerfile).toContain("studio.sh");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd openclaw && pnpm vitest run src/agent-image-dockerfile.test.ts`
Expected: FAIL because the test file is new and `infrastructure/docker/Dockerfile` does not yet contain the Android Studio install block.

- [ ] **Step 3: Write minimal implementation in the test file**

```ts
// Keep assertions limited to the install contract:
// pinned version/checksum, stable install dir, and launcher presence.
```

- [ ] **Step 4: Run test to verify it still fails for the right reason**

Run: `cd openclaw && pnpm vitest run src/agent-image-dockerfile.test.ts`
Expected: FAIL with missing Android Studio assertions, confirming the implementation work is still outstanding.

- [ ] **Step 5: Commit**

```bash
git add openclaw/src/agent-image-dockerfile.test.ts
git commit -m "test: cover wrapped agent android studio install contract"
```

### Task 2: Install Android Studio In The Wrapped Agent Image

**Files:**
- Modify: `infrastructure/docker/Dockerfile`
- Test: `openclaw/src/agent-image-dockerfile.test.ts`

- [ ] **Step 1: Write the failing install-contract assertions you actually need**

```ts
expect(dockerfile).toContain("ARG ANDROID_STUDIO_VERSION=2025.3.3");
expect(dockerfile).toContain(
  "ARG ANDROID_STUDIO_SHA256=341ac0fc17dbc987d0530e0cfb327125480533d6733a889f2137636becd486a5",
);
expect(dockerfile).toContain("/opt/android-studio");
expect(dockerfile).toContain("/usr/local/bin/android-studio");
expect(dockerfile).toContain("ANDROID_SDK_ROOT");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd openclaw && pnpm vitest run src/agent-image-dockerfile.test.ts`
Expected: FAIL because the exact pinned version, checksum, launcher symlink, and env vars do not exist yet.

- [ ] **Step 3: Write the minimal Dockerfile implementation**

```dockerfile
ARG ANDROID_STUDIO_VERSION=2025.3.3
ARG ANDROID_STUDIO_LINUX_BUNDLE=android-studio-panda3-linux.tar.gz
ARG ANDROID_STUDIO_SHA256=341ac0fc17dbc987d0530e0cfb327125480533d6733a889f2137636becd486a5

ENV ANDROID_STUDIO_HOME=/opt/android-studio \
    ANDROID_SDK_ROOT=/home/node/Android/Sdk \
    ANDROID_HOME=/home/node/Android/Sdk

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
      libxext6 libxrender1 libxtst6 libxi6 libfreetype6 libxrandr2 libatk1.0-0 \
      libc6 libnss3 libx11-6 libxcursor1 libxdamage1 libxfixes3 libasound2 && \
    curl -fsSL "https://redirector.gvt1.com/edgedl/android/studio/ide-zips/${ANDROID_STUDIO_VERSION}/${ANDROID_STUDIO_LINUX_BUNDLE}" -o /tmp/android-studio.tar.gz && \
    echo "${ANDROID_STUDIO_SHA256}  /tmp/android-studio.tar.gz" | sha256sum -c - && \
    tar -xzf /tmp/android-studio.tar.gz -C /opt && \
    ln -sf /opt/android-studio/bin/studio.sh /usr/local/bin/android-studio && \
    mkdir -p /home/node/Android/Sdk && \
    chown -R node:node /opt/android-studio /home/node/Android
```

- [ ] **Step 4: Run the static test to verify it passes**

Run: `cd openclaw && pnpm vitest run src/agent-image-dockerfile.test.ts`
Expected: PASS

- [ ] **Step 5: Build the wrapped image locally to verify the install really works**

Run: `docker build --platform linux/amd64 --build-arg OPENCLAW_INSTALL_BROWSER=1 -t openclaw-base:local -f openclaw/Dockerfile openclaw`
Expected: PASS and base image built locally.

- [ ] **Step 6: Build the wrapped agent image**

Run: `docker build --platform linux/amd64 --build-arg BASE_IMAGE=openclaw-base:local -t openclaw-agent:android-studio -f infrastructure/docker/Dockerfile .`
Expected: PASS and Android Studio download/checksum/extract steps complete successfully.

- [ ] **Step 7: Smoke test the installed binary inside the image**

Run: `docker run --rm --platform linux/amd64 --entrypoint /bin/bash openclaw-agent:android-studio -lc 'set -euo pipefail; test -x /usr/local/bin/android-studio; test -x /opt/android-studio/bin/studio.sh; test -x /opt/android-studio/jbr/bin/java; /opt/android-studio/jbr/bin/java -version; timeout 20s xvfb-run -a /opt/android-studio/bin/studio.sh >/tmp/android-studio-launch.log 2>&1 || status=$?; test "${status:-0}" = 0 -o "${status:-0}" = 124; echo $ANDROID_SDK_ROOT'`
Expected: PASS, prints the bundled JetBrains Runtime version, and prints `/home/node/Android/Sdk`. A `124` timeout exit is acceptable because it proves the launcher stayed alive long enough to start under Xvfb instead of crashing immediately on missing dependencies.

- [ ] **Step 8: Commit**

```bash
git add infrastructure/docker/Dockerfile openclaw/src/agent-image-dockerfile.test.ts
git commit -m "feat: install android studio in wrapped agent image"
```

### Task 3: Extend Build-Script Validation So Broken Installs Fail Fast

**Files:**
- Modify: `infrastructure/scripts/docker/build-push-openclaw-image.sh`
- Test: local script execution using the new image validation command

- [ ] **Step 1: Write the failing validation change**

```bash
# Extend the existing binary loop or add explicit checks:
command -v android-studio >/dev/null 2>&1
test -x /opt/android-studio/bin/studio.sh
test -d /home/node/Android/Sdk
```

- [ ] **Step 2: Run the validation command manually before editing to prove the gap**

Run: `docker run --rm --platform linux/amd64 --entrypoint /bin/bash openclaw-agent:android-studio -lc 'command -v android-studio >/dev/null 2>&1 && test -x /opt/android-studio/bin/studio.sh && test -d /home/node/Android/Sdk'`
Expected: If Task 2 is not complete yet, FAIL. If Task 2 is complete, this command becomes the target validation to encode in the script.

- [ ] **Step 3: Update the build/push script minimally**

```bash
docker run --rm \
  --platform "$DOCKER_PLATFORM" \
  --entrypoint /bin/bash \
  "$ECR_IMAGE" \
  -lc 'set -euo pipefail; for b in bun bunx fd sam poetry lin nodemon chromium dembrandt android-studio xvfb-run; do command -v "$b" >/dev/null 2>&1 || { echo "Missing required binary: $b" >&2; exit 1; }; done; test -x /opt/android-studio/bin/studio.sh; test -x /opt/android-studio/jbr/bin/java; /opt/android-studio/jbr/bin/java -version; timeout 20s xvfb-run -a /opt/android-studio/bin/studio.sh >/tmp/android-studio-launch.log 2>&1 || status=$?; test "${status:-0}" = 0 -o "${status:-0}" = 124; test -d /home/node/Android/Sdk'
```

- [ ] **Step 4: Re-run the local validation command and, if safe, the full local build script path up to the docker-run checks**

Run: `bash -n infrastructure/scripts/docker/build-push-openclaw-image.sh`
Expected: PASS

Run: `DOCKER_PLATFORM=linux/amd64 OPENCLAW_IMAGE_TAG=android-studio-test OPENCLAW_ECR_REPOSITORY=dry-run ./infrastructure/scripts/docker/build-push-openclaw-image.sh`
Expected: Only run this if you intentionally want the full push/deploy behavior; otherwise stop after manual `docker build` + `docker run` verification because this script pushes to ECR and forces ECS deployments.

- [ ] **Step 5: Commit**

```bash
git add infrastructure/scripts/docker/build-push-openclaw-image.sh
git commit -m "chore: validate android studio launcher in agent image builds"
```

### Task 4: Document The New Agent Tooling Baseline

**Files:**
- Modify: `infrastructure/README.md`
- Optional modify: `openclaw/apps/android/README.md`
- Test: documentation lint/check if touched under `openclaw/docs`; for README-only changes, use formatting checks as appropriate

- [ ] **Step 1: Add the failing documentation delta on paper before editing**

```md
- `android-studio` launcher
- Android Studio installed at `/opt/android-studio`
- SDK home pre-created at `/home/node/Android/Sdk`
- Caveat: install does not imply a full desktop/VNC path for GUI use
```

- [ ] **Step 2: Update the docs minimally**

```md
The wrapped image pre-installs:
- `android-studio`

Android tooling notes:
- Android Studio for Linux is installed at `/opt/android-studio`.
- Launcher symlink: `/usr/local/bin/android-studio`
- `ANDROID_HOME` and `ANDROID_SDK_ROOT` default to `/home/node/Android/Sdk`.
- GUI launch may still require a display-capable container/session; this image change guarantees installation, not a desktop runtime.
```

- [ ] **Step 3: Run the relevant checks**

Run: `cd openclaw && pnpm format:check`
Expected: PASS

Run: `oxfmt --check infrastructure/README.md`
Expected: PASS

Run: `cd openclaw && pnpm vitest run src/dockerfile.test.ts src/agent-image-dockerfile.test.ts`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add infrastructure/README.md openclaw/apps/android/README.md
git commit -m "docs: document android studio in agent image"
```

### Task 5: Final Verification And Handoff

**Files:**
- Verify only:
  - `infrastructure/docker/Dockerfile`
  - `infrastructure/scripts/docker/build-push-openclaw-image.sh`
  - `infrastructure/README.md`
  - `openclaw/src/agent-image-dockerfile.test.ts`

- [ ] **Step 1: Run focused automated verification**

Run: `cd openclaw && pnpm vitest run src/dockerfile.test.ts src/agent-image-dockerfile.test.ts`
Expected: PASS

Run: `docker build --platform linux/amd64 --build-arg OPENCLAW_INSTALL_BROWSER=1 -t openclaw-base:local -f openclaw/Dockerfile openclaw`
Expected: PASS

Run: `docker build --platform linux/amd64 --build-arg BASE_IMAGE=openclaw-base:local -t openclaw-agent:android-studio -f infrastructure/docker/Dockerfile .`
Expected: PASS

- [ ] **Step 2: Run container smoke verification**

Run: `docker run --rm --platform linux/amd64 --entrypoint /bin/bash openclaw-agent:android-studio -lc 'set -euo pipefail; command -v android-studio; command -v xvfb-run; test -x /opt/android-studio/bin/studio.sh; test -x /opt/android-studio/jbr/bin/java; /opt/android-studio/jbr/bin/java -version; ldd /opt/android-studio/jbr/bin/java | (! grep "not found"); timeout 20s xvfb-run -a /opt/android-studio/bin/studio.sh >/tmp/android-studio-launch.log 2>&1 || status=$?; test "${status:-0}" = 0 -o "${status:-0}" = 124; test -d /home/node/Android/Sdk'`
Expected: PASS on launcher presence, bundled runtime execution, shared-library resolution, and a launch-oriented smoke check under Xvfb.

- [ ] **Step 3: Review git diff carefully**

Run: `git diff -- infrastructure/docker/Dockerfile infrastructure/scripts/docker/build-push-openclaw-image.sh infrastructure/README.md openclaw/src/agent-image-dockerfile.test.ts openclaw/apps/android/README.md`
Expected: Only the intended Android Studio install, validation, test, and documentation changes are present.

- [ ] **Step 4: Commit the final verification-safe state**

```bash
git add infrastructure/docker/Dockerfile infrastructure/scripts/docker/build-push-openclaw-image.sh infrastructure/README.md openclaw/src/agent-image-dockerfile.test.ts openclaw/apps/android/README.md
git commit -m "feat: add android studio to openclaw agent image"
```
