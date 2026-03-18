#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const resolveStateDir = () => {
  const explicitStateDir = process.env.OPENCLAW_STATE_DIR?.trim();
  if (explicitStateDir) {
    return explicitStateDir;
  }
  const explicitHome = process.env.OPENCLAW_HOME?.trim();
  if (explicitHome) {
    return explicitHome.endsWith("/.openclaw") ? explicitHome : path.join(explicitHome, ".openclaw");
  }
  return "/home/node/.openclaw";
};

const STATE_DIR = resolveStateDir();
const WORKSPACE_DIR = process.env.OPENCLAW_WORKSPACE_DIR?.trim() || path.join(STATE_DIR, "workspace");
const CONFIG_PATH = process.env.OPENCLAW_CONFIG_PATH?.trim() || path.join(STATE_DIR, "openclaw.json");
const AGENT_ID = (process.env.OPENCLAW_AGENT_ID?.trim() || "main").replaceAll("/", "-");
const AGENT_NAME = process.env.OPENCLAW_AGENT_NAME?.trim() || AGENT_ID;
const AGENT_DIR =
  process.env.OPENCLAW_AGENT_DIR?.trim() || path.join(STATE_DIR, "agents", AGENT_ID, "agent");
const SESSIONS_DIR = path.join(path.dirname(AGENT_DIR), "sessions");
const AUTH_PROFILES_PATH =
  process.env.OPENCLAW_AUTH_PROFILES_PATH?.trim() || path.join(AGENT_DIR, "auth-profiles.json");
const AGENTS_PATH = process.env.OPENCLAW_AGENTS_PATH?.trim() || path.join(WORKSPACE_DIR, "AGENTS.md");
const SOUL_PATH = process.env.OPENCLAW_SOUL_PATH?.trim() || path.join(WORKSPACE_DIR, "SOUL.md");
const TOOLS_PATH = process.env.OPENCLAW_TOOLS_PATH?.trim() || path.join(WORKSPACE_DIR, "TOOLS.md");
const IDENTITY_PATH =
  process.env.OPENCLAW_IDENTITY_PATH?.trim() || path.join(WORKSPACE_DIR, "IDENTITY.md");
const USER_PATH = process.env.OPENCLAW_USER_PATH?.trim() || path.join(WORKSPACE_DIR, "USER.md");
const HEARTBEAT_PATH =
  process.env.OPENCLAW_HEARTBEAT_PATH?.trim() || path.join(WORKSPACE_DIR, "HEARTBEAT.md");

const KNOWN_BIND_MODES = new Set(["loopback", "lan", "tailnet", "auto", "custom"]);

const asArray = (value) => (Array.isArray(value) ? value : []);

const parseCsv = (value) =>
  String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const parseJsonEnv = (name, fallback) => {
  const raw = process.env[name];
  if (!raw || raw.trim() === "") {
    return fallback;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid JSON in ${name}: ${String(error)}`);
  }
};

const isObjectRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

const normalizeObjectRecord = (value) => (isObjectRecord(value) ? value : {});

const parseConfigFile = async (filePath) => {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    const code = error && typeof error === "object" ? error.code : "";
    if (code === "ENOENT") {
      return {};
    }
    return {};
  }
};

const deepMerge = (base, patch) => {
  if (Array.isArray(base) || Array.isArray(patch)) {
    return Array.isArray(patch) ? patch.slice() : Array.isArray(base) ? base.slice() : patch;
  }
  if (!base || typeof base !== "object") {
    return patch;
  }
  if (!patch || typeof patch !== "object") {
    return base;
  }

  const merged = { ...base };
  for (const [key, patchValue] of Object.entries(patch)) {
    const baseValue = merged[key];
    if (
      baseValue &&
      patchValue &&
      typeof baseValue === "object" &&
      typeof patchValue === "object" &&
      !Array.isArray(baseValue) &&
      !Array.isArray(patchValue)
    ) {
      merged[key] = deepMerge(baseValue, patchValue);
      continue;
    }
    merged[key] = patchValue;
  }
  return merged;
};

const boolTrue = (value) => /^(1|true|yes|on)$/i.test(String(value ?? "").trim());

const normalizeBindMode = (rawBind) => {
  const bind = String(rawBind ?? "").trim();
  if (!bind || bind === "0.0.0.0") {
    return "lan";
  }
  if (bind === "127.0.0.1") {
    return "loopback";
  }
  if (KNOWN_BIND_MODES.has(bind)) {
    return bind;
  }
  return "lan";
};

const resolveModelRef = (payload) => {
  const envModel = process.env.OPENCLAW_MODEL?.trim();
  if (envModel?.includes("/")) {
    return envModel;
  }

  const envProvider = process.env.OPENCLAW_MODEL_PROVIDER?.trim();
  if (envProvider && envModel) {
    return `${envProvider}/${envModel}`;
  }

  if (payload?.model && typeof payload.model === "string" && payload.model.includes("/")) {
    return payload.model;
  }
  if (payload?.model?.provider && payload?.model?.model) {
    return `${payload.model.provider}/${payload.model.model}`;
  }
  return undefined;
};

const resolvePort = () => {
  const raw = process.env.OPENCLAW_GATEWAY_PORT?.trim() || "18789";
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 18789;
};

const pickConfigFragment = (payload) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {};
  }
  const keys = [
    "gateway",
    "agents",
    "channels",
    "bindings",
    "messages",
    "tools",
    "hooks",
    "plugins",
    "cron",
    "memory",
    "skills",
    "session",
    "update",
    "browser",
  ];
  return keys.reduce((acc, key) => {
    if (key in payload) {
      acc[key] = payload[key];
    }
    return acc;
  }, {});
};

const writeJsonFile = async (filePath, value) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  try {
    await fs.chmod(filePath, 0o600);
  } catch {
    // best effort
  }
};

const writeTextFile = async (filePath, value) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, value, "utf8");
};

const writeWorkspaceDocFromEnv = async (envName, filePath) => {
  const value = process.env[envName];
  if (typeof value !== "string" || value.trim() === "") {
    return;
  }
  const content = value.endsWith("\n") ? value : `${value}\n`;
  await writeTextFile(filePath, content);
};

const pruneLegacyInvalidConfigKeys = (config) => {
  if (!isObjectRecord(config)) {
    return [];
  }

  const removed = [];
  const agents = normalizeObjectRecord(config.agents);
  const defaults = normalizeObjectRecord(agents.defaults);
  const subagents = normalizeObjectRecord(defaults.subagents);

  if ("allowAgents" in subagents) {
    delete subagents.allowAgents;
    removed.push("agents.defaults.subagents.allowAgents");
  }

  if (Object.keys(subagents).length > 0) {
    defaults.subagents = subagents;
  } else if ("subagents" in defaults) {
    delete defaults.subagents;
  }

  if (Object.keys(defaults).length > 0) {
    agents.defaults = defaults;
  } else if ("defaults" in agents) {
    delete agents.defaults;
  }

  if (Object.keys(agents).length > 0) {
    config.agents = agents;
  } else if ("agents" in config) {
    delete config.agents;
  }

  return removed;
};

const bootstrap = async () => {
  const payload = parseJsonEnv("OPENCLAW_JSON", {});
  const payloadOverrides =
    payload && typeof payload === "object" && !Array.isArray(payload) && payload.overrides
      ? payload.overrides
      : {};
  const payloadFragment = pickConfigFragment(payload);
  const authProfilesPayload = parseJsonEnv("OPENCLAW_AUTH_PROFILES_JSON", null);
  const authProfilesPatch = normalizeObjectRecord(authProfilesPayload);
  const hasAuthProfilesPatch = Object.keys(authProfilesPatch).length > 0;
  const anthropicSetupToken = process.env.ANTHROPIC_SETUP_TOKEN?.trim() || "";
  const gatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN?.trim() || "";

  const modelRef = resolveModelRef(payload);
  const bindMode = normalizeBindMode(process.env.OPENCLAW_GATEWAY_BIND);
  const port = resolvePort();
  const allowTools = parseCsv(process.env.OPENCLAW_ALLOW_TOOLS);
  const denyTools = parseCsv(process.env.OPENCLAW_DENY_TOOLS);

  const payloadAllow = asArray(payload?.tools?.allow);
  const payloadDeny = asArray(payload?.tools?.deny);
  const mergedAllow = allowTools.length > 0 ? allowTools : payloadAllow;
  const mergedDeny = denyTools.length > 0 ? denyTools : payloadDeny;

  const desiredConfig = {
    gateway: {
      mode: "local",
      bind: bindMode,
      port,
      auth: {
        mode: "token",
        ...(gatewayToken ? { token: gatewayToken } : {}),
      },
      ...(bindMode !== "loopback"
        ? {
            controlUi: {
              dangerouslyAllowHostHeaderOriginFallback: true,
            },
          }
        : {}),
    },
    agents: {
      defaults: {
        workspace: WORKSPACE_DIR,
        ...(modelRef ? { model: modelRef } : {}),
      },
      list: [
        {
          id: AGENT_ID,
          default: true,
          name: AGENT_NAME,
          workspace: WORKSPACE_DIR,
          agentDir: AGENT_DIR,
          ...(modelRef ? { model: modelRef } : {}),
        },
      ],
    },
    tools: {
      ...(mergedAllow.length > 0 ? { allow: mergedAllow } : {}),
      ...(mergedDeny.length > 0 ? { deny: mergedDeny } : {}),
    },
    update: {
      auto: {
        enabled: boolTrue(process.env.OPENCLAW_AUTO_UPDATE),
      },
      ...(process.env.OPENCLAW_UPDATE_CHANNEL
        ? { channel: process.env.OPENCLAW_UPDATE_CHANNEL.trim() }
        : {}),
    },
  };

  const existingConfig = await parseConfigFile(CONFIG_PATH);
  const mergedConfig = deepMerge(
    deepMerge(deepMerge(existingConfig, payloadFragment), payloadOverrides),
    desiredConfig,
  );
  const removedKeys = pruneLegacyInvalidConfigKeys(mergedConfig);

  await fs.mkdir(WORKSPACE_DIR, { recursive: true });
  await fs.mkdir(AGENT_DIR, { recursive: true });
  await fs.mkdir(SESSIONS_DIR, { recursive: true });

  await writeJsonFile(CONFIG_PATH, mergedConfig);
  if (removedKeys.length > 0) {
    console.log(`[bootstrap] Removed stale config keys: ${removedKeys.join(", ")}`);
  }

  await writeWorkspaceDocFromEnv("OPENCLAW_AGENTS_MD", AGENTS_PATH);
  await writeWorkspaceDocFromEnv("OPENCLAW_SOUL_MD", SOUL_PATH);
  await writeWorkspaceDocFromEnv("OPENCLAW_TOOLS_MD", TOOLS_PATH);
  await writeWorkspaceDocFromEnv("OPENCLAW_USER_MD", USER_PATH);
  await writeWorkspaceDocFromEnv("OPENCLAW_HEARTBEAT_MD", HEARTBEAT_PATH);

  const identityDoc = process.env.OPENCLAW_IDENTITY_MD?.trim();
  const agentDescription = process.env.OPENCLAW_AGENT_DESCRIPTION?.trim() || "";
  const defaultIdentity = [
    "# IDENTITY.md",
    "",
    `- Name: ${AGENT_NAME}`,
    `- Agent ID: ${AGENT_ID}`,
    ...(agentDescription ? [`- Role: ${agentDescription}`] : []),
    "- Operating Style: direct, decisive, evidence-based",
    "",
  ].join("\n");
  await writeTextFile(IDENTITY_PATH, identityDoc ? `${identityDoc}\n` : defaultIdentity);

  const existingAuthProfiles = normalizeObjectRecord(await parseConfigFile(AUTH_PROFILES_PATH));
  let nextAuthProfiles = existingAuthProfiles;

  if (hasAuthProfilesPatch) {
    nextAuthProfiles = deepMerge(nextAuthProfiles, authProfilesPatch);
  }

  if (anthropicSetupToken) {
    const previousDefault = normalizeObjectRecord(nextAuthProfiles["anthropic:default"]);
    nextAuthProfiles = {
      ...nextAuthProfiles,
      "anthropic:default": {
        ...previousDefault,
        type: "token",
        provider: "anthropic",
        token: anthropicSetupToken,
      },
    };
  }

  if (hasAuthProfilesPatch || anthropicSetupToken) {
    await writeJsonFile(AUTH_PROFILES_PATH, nextAuthProfiles);
  }

  console.log(
    `[bootstrap] Config reconciled for agent '${AGENT_ID}' (workspace='${WORKSPACE_DIR}', config='${CONFIG_PATH}')`,
  );
};

bootstrap().catch((error) => {
  console.error(`[bootstrap] Failed to reconcile config: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
