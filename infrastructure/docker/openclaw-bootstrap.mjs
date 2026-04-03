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
const CRON_STORE_PATH =
  process.env.OPENCLAW_CRON_STORE_PATH?.trim() || path.join(STATE_DIR, "cron", "jobs.json");
const AGENT_ID = (process.env.OPENCLAW_AGENT_ID?.trim() || "main").replaceAll("/", "-");
const AGENT_NAME = process.env.OPENCLAW_AGENT_NAME?.trim() || AGENT_ID;
const AGENT_DIR =
  process.env.OPENCLAW_AGENT_DIR?.trim() || path.join(STATE_DIR, "agents", AGENT_ID, "agent");
const SESSIONS_DIR = path.join(path.dirname(AGENT_DIR), "sessions");
const AUTH_PROFILES_PATH =
  process.env.OPENCLAW_AUTH_PROFILES_PATH?.trim() || path.join(AGENT_DIR, "auth-profiles.json");
const CODEX_CONFIG_PATH = process.env.OPENCLAW_CODEX_CONFIG_PATH?.trim() || "/home/node/.codex/config.toml";
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

const parseJsonFileStrict = async (filePath, missingFallback) => {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    const code = error && typeof error === "object" ? error.code : "";
    if (code === "ENOENT") {
      return missingFallback;
    }
    throw error;
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

const resolveModelFallbacks = (payload) => {
  const envFallbacks = parseCsv(process.env.OPENCLAW_MODEL_FALLBACKS);
  if (envFallbacks.length > 0) {
    return envFallbacks;
  }
  const payloadFallbacks = payload?.model?.fallbacks;
  if (!Array.isArray(payloadFallbacks)) {
    return [];
  }
  return payloadFallbacks.map((entry) => String(entry ?? "").trim()).filter(Boolean);
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

const upsertManagedTextBlock = async (params) => {
  const { filePath, startMarker, endMarker, block } = params;
  let existing = "";
  try {
    existing = await fs.readFile(filePath, "utf8");
  } catch (error) {
    const code = error && typeof error === "object" ? error.code : "";
    if (code !== "ENOENT") {
      throw error;
    }
  }

  const start = existing.indexOf(startMarker);
  const end = existing.indexOf(endMarker);
  let next = existing;

  if (start !== -1 && end !== -1 && end > start) {
    const afterEnd = end + endMarker.length;
    const tail = existing.slice(afterEnd).replace(/^\n+/, "");
    const head = existing.slice(0, start).replace(/\n*$/, "\n\n");
    next = `${head}${block}\n${tail}`.replace(/\n{3,}/g, "\n\n");
  } else if (existing.trim().length === 0) {
    next = `${block}\n`;
  } else {
    next = `${existing.replace(/\n*$/, "\n\n")}${block}\n`;
  }

  await writeTextFile(filePath, next);
};

const writeManagedCodexMcpConfig = async () => {
  const block = [
    "# BEGIN OPENCLAW MANAGED MCP SERVERS",
    "[mcp_servers.playwright]",
    'command = "playwright-mcp"',
    "",
    '[mcp_servers."native-devtools"]',
    'command = "native-devtools-mcp"',
    "",
    "[mcp_servers.context7]",
    'command = "context7-mcp"',
    "",
    "[mcp_servers.github]",
    'url = "https://api.githubcopilot.com/mcp/"',
    'bearer_token_env_var = "GITHUB_TOKEN"',
    "# END OPENCLAW MANAGED MCP SERVERS",
  ].join("\n");

  await upsertManagedTextBlock({
    filePath: CODEX_CONFIG_PATH,
    startMarker: "# BEGIN OPENCLAW MANAGED MCP SERVERS",
    endMarker: "# END OPENCLAW MANAGED MCP SERVERS",
    block,
  });
};

const writeWorkspaceDocFromEnv = async (envName, filePath) => {
  const value = process.env[envName];
  if (typeof value !== "string" || value.trim() === "") {
    return;
  }
  const content = value.endsWith("\n") ? value : `${value}\n`;
  await writeTextFile(filePath, content);
};

const loadCronStore = async (filePath) => {
  const parsed = await parseJsonFileStrict(filePath, { version: 1, jobs: [] });
  const parsedRecord = isObjectRecord(parsed) ? parsed : {};
  return {
    version: 1,
    jobs: Array.isArray(parsedRecord.jobs) ? parsedRecord.jobs.filter(isObjectRecord) : [],
  };
};

const normalizeCronJob = (value) => {
  if (!isObjectRecord(value)) {
    return null;
  }
  const id = String(value.id ?? "").trim();
  const name = String(value.name ?? "").trim();
  if (!id || !name) {
    throw new Error("bootstrap.cronJobs entries require non-empty id and name");
  }
  return {
    ...value,
    id,
    name,
  };
};

const stripVolatileCronState = (value) => {
  const state = normalizeObjectRecord(value);
  delete state.nextRunAtMs;
  delete state.runningAtMs;
  return state;
};

const buildManagedCronJob = (params) => {
  const { desired, previous, defaultAgentId, nowMs } = params;
  const previousRecord = isObjectRecord(previous) ? previous : {};
  const desiredRecord = isObjectRecord(desired) ? desired : {};
  const mergedState = stripVolatileCronState(
    deepMerge(normalizeObjectRecord(previousRecord.state), normalizeObjectRecord(desiredRecord.state)),
  );
  const nextAgentId = String(
    desiredRecord.agentId ?? previousRecord.agentId ?? defaultAgentId ?? "",
  ).trim();

  return {
    ...previousRecord,
    ...desiredRecord,
    agentId: nextAgentId || undefined,
    enabled: desiredRecord.enabled ?? previousRecord.enabled ?? true,
    deleteAfterRun: desiredRecord.deleteAfterRun ?? previousRecord.deleteAfterRun ?? false,
    createdAtMs:
      typeof previousRecord.createdAtMs === "number" ? previousRecord.createdAtMs : nowMs,
    updatedAtMs: nowMs,
    state: mergedState,
  };
};

const reconcileBootstrapCronJobs = async (params) => {
  const { desiredJobs, storePath, defaultAgentId } = params;
  if (!Array.isArray(desiredJobs) || desiredJobs.length === 0) {
    return [];
  }

  const normalizedDesired = desiredJobs.map(normalizeCronJob).filter(Boolean);
  const existingStore = await loadCronStore(storePath);
  const nextJobs = [...existingStore.jobs];
  const managedIds = [];
  const nowMs = Date.now();

  for (const desiredJob of normalizedDesired) {
    managedIds.push(desiredJob.id);
    const existingIndex = nextJobs.findIndex((job) => job?.id === desiredJob.id);
    const previous = existingIndex >= 0 ? nextJobs[existingIndex] : undefined;
    const nextJob = buildManagedCronJob({
      desired: desiredJob,
      previous,
      defaultAgentId,
      nowMs,
    });
    if (existingIndex >= 0) {
      nextJobs[existingIndex] = nextJob;
    } else {
      nextJobs.push(nextJob);
    }
  }

  const nextStore = {
    version: 1,
    jobs: nextJobs,
  };

  if (JSON.stringify(existingStore) !== JSON.stringify(nextStore)) {
    await writeJsonFile(storePath, nextStore);
  }

  return managedIds;
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

  if ("bootstrap" in config) {
    delete config.bootstrap;
    removed.push("bootstrap");
  }

  return removed;
};

const bootstrap = async () => {
  const payload = parseJsonEnv("OPENCLAW_JSON", {});
  const payloadOverrides =
    payload && typeof payload === "object" && !Array.isArray(payload) && payload.overrides
      ? payload.overrides
      : {};
  const runtimeConfigOverrides = { ...normalizeObjectRecord(payloadOverrides) };
  const bootstrapConfig = normalizeObjectRecord(runtimeConfigOverrides.bootstrap);
  delete runtimeConfigOverrides.bootstrap;
  const payloadFragment = pickConfigFragment(payload);
  const authProfilesPayload = parseJsonEnv("OPENCLAW_AUTH_PROFILES_JSON", null);
  const authProfilesPatch = normalizeObjectRecord(authProfilesPayload);
  const hasAuthProfilesPatch = Object.keys(authProfilesPatch).length > 0;
  const bootstrapCronJobs = Array.isArray(bootstrapConfig.cronJobs) ? bootstrapConfig.cronJobs : [];
  const anthropicSetupToken = process.env.ANTHROPIC_SETUP_TOKEN?.trim() || "";
  const gatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN?.trim() || "";

  const modelRef = resolveModelRef(payload);
  const modelFallbacks = resolveModelFallbacks(payload);
  const modelSelection = modelRef
    ? {
        primary: modelRef,
        ...(modelFallbacks.length > 0 ? { fallbacks: modelFallbacks } : {}),
      }
    : undefined;
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
        ...(modelSelection ? { model: modelSelection } : {}),
      },
      list: [
        {
          id: AGENT_ID,
          default: true,
          name: AGENT_NAME,
          workspace: WORKSPACE_DIR,
          agentDir: AGENT_DIR,
          ...(modelSelection ? { model: modelSelection } : {}),
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
    deepMerge(deepMerge(existingConfig, payloadFragment), runtimeConfigOverrides),
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
  await writeManagedCodexMcpConfig();

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

  const managedCronJobIds = await reconcileBootstrapCronJobs({
    desiredJobs: bootstrapCronJobs,
    storePath: CRON_STORE_PATH,
    defaultAgentId: AGENT_ID,
  });
  if (managedCronJobIds.length > 0) {
    console.log(`[bootstrap] Cron jobs reconciled: ${managedCronJobIds.join(", ")}`);
  }

  console.log(
    `[bootstrap] Config reconciled for agent '${AGENT_ID}' (workspace='${WORKSPACE_DIR}', config='${CONFIG_PATH}')`,
  );
};

bootstrap().catch((error) => {
  console.error(`[bootstrap] Failed to reconcile config: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
