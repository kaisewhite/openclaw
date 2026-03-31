# OpenClaw

A self-hosted, multi-channel AI assistant that runs on your own devices and connects to the messaging platforms you already use.

## Overview

OpenClaw is a personal AI assistant built around a local-first gateway architecture. It receives and responds to messages across 15+ channels -- WhatsApp, Telegram, Slack, Discord, Signal, iMessage, Microsoft Teams, Google Chat, Matrix, and more -- through a single control plane running on your machine. It supports voice interaction, browser automation, a live visual canvas, and an extensible skills/plugin system.

## Key Features

- **Multi-channel messaging** -- Unified inbox across WhatsApp, Telegram, Slack, Discord, Signal, iMessage, Microsoft Teams, Google Chat, Matrix, Zalo, and WebChat
- **Voice interaction** -- Always-on wake word detection and talk mode on macOS, iOS, and Android via ElevenLabs
- **Local-first architecture** -- Gateway runs on your hardware; no third-party relay or cloud dependency for the control plane
- **Extensible skills and plugins** -- Bundled skills, workspace skills, managed skills, and a full plugin SDK for custom integrations
- **Native companion apps** -- macOS menu bar app, iOS app, and Android app with canvas, camera, and screen recording support
- **Browser automation** -- Built-in Chromium control with snapshots, actions, and profile management via Playwright
- **Live Canvas** -- Agent-driven visual workspace with A2UI (Agent-to-UI) push rendering
- **Multi-agent routing** -- Route channels, accounts, and peers to isolated agent workspaces
- **Security defaults** -- DM pairing, allowlists, and explicit opt-in for public access

## Quick Start

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
openclaw gateway --port 18789 --verbose
```

Requires **Node >= 22**. Works with npm, pnpm, or bun.

For full setup instructions, see the [application README](./openclaw/README.md).

## Tech Stack

| Layer            | Technology                                                        |
| ---------------- | ----------------------------------------------------------------- |
| Runtime          | Node.js 22+, TypeScript (ESM)                                    |
| Package manager  | pnpm (primary), bun and npm supported                             |
| AI providers     | Anthropic, OpenAI, AWS Bedrock, and others via pluggable models   |
| Messaging        | Baileys (WhatsApp), grammY (Telegram), Bolt (Slack), discord.js   |
| Browser          | Playwright (Chromium)                                             |
| Voice            | ElevenLabs TTS, native STT                                       |
| Native apps      | SwiftUI (macOS/iOS), Kotlin (Android)                             |
| Web UI           | Lit (Web Components)                                              |
| Infrastructure   | AWS CDK (TypeScript)                                              |
| Database         | SQLite with sqlite-vec for embeddings                             |
| Build            | tsdown, Vitest, oxlint, oxfmt                                    |

## Repository Structure

```
openclaw/          Main application source, CLI, gateway, channels,
                   plugins, native app sources, docs, and tests.
                   See openclaw/README.md for full documentation.

infrastructure/    AWS CDK stacks for deploying OpenClaw infrastructure.
                   See infrastructure/package.json for dependencies.
```

## Documentation

- **[Application README](./openclaw/README.md)** -- Installation, configuration, channels, security, and development
- **[Vision](./openclaw/VISION.md)** -- Project direction and contribution guidelines
- **[Infrastructure](./infrastructure/)** -- AWS CDK deployment configuration

## License

MIT
