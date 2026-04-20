# Android Studio In Agent Image Spec

**Date:** 2026-04-12

**Requested change:** Install Android Studio for Linux in the Dockerfile used by the OpenClaw agents.

**Repo context captured while planning:**

- The agent image is built in two stages:
  - `openclaw/Dockerfile` builds the base OpenClaw image.
  - `infrastructure/docker/Dockerfile` wraps that base with the agent toolchain.
- The operational build/push path is `infrastructure/scripts/docker/build-push-openclaw-image.sh`.
- The Android app lives at `openclaw/apps/android`.

**Constraints / expectations:**

- Use the Linux Android Studio distribution, not a macOS-specific path.
- Keep the install reproducible by pinning the download artifact and checksum.
- Add verification so image builds fail fast if Android Studio is missing or broken.
- Update docs that describe the wrapped agent image toolchain.
- Preserve the existing non-root runtime model for agents.

**Planning assumption:**

- This change is for the wrapped ECS agent image, not the optional sandbox/browser images.
- If later work needs the Android Studio GUI to run headfully inside a container, that may require a separate display-capable image path; this plan only covers installing the Linux IDE into the current agent image.
