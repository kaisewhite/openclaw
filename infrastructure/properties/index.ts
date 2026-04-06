export type EnvironmentKey = "mgmt";

export interface AgentRuntimeConfig {
  cpu: number;
  memoryLimitMiB: number;
  desiredCount: number;
}

export interface AgentModelConfig {
  provider: string;
  model: string;
  fallbacks?: string[];
}

export interface AgentSecretsConfig {
  /**
   * Secrets Manager secret name/path.
   * Example: /openclaw/mgmt/agents/fullstack-agent
   */
  secretName: string;
  /**
   * Secret JSON fields to inject directly as container env vars.
   * These are mapped via ecs.Secret.fromSecretsManager(secret, field).
   */
  directEnvKeys?: string[];
}

export interface AgentOpenclawConfig {
  agentsPromptPath?: string;
  soulPromptPath: string;
  toolsPromptPath?: string;
  identityPromptPath?: string;
  userPromptPath?: string;
  heartbeatPromptPath?: string;
  allowTools: string[];
  denyTools: string[];
  configOverrides?: Record<string, unknown>;
  authProfiles?: Record<string, unknown>;
}

export interface Agent {
  id: string;
  displayName: string;
  description: string;
  runtime: AgentRuntimeConfig;
  model: AgentModelConfig;
  openclaw: AgentOpenclawConfig;
  secrets: AgentSecretsConfig;
}

export interface Project {
  name: string;
  envs: EnvironmentKey[];
  ecrRepositoryName: string;
  imageTagByEnv?: Partial<Record<EnvironmentKey, string>>;
  agents: Agent[];
}

const GEMINI_PROVIDER = "google" as const;
const GEMINI_DEFAULT_MODEL = "gemini-3-flash-preview" as const;
const ANTHROPIC_PROVIDER = "anthropic" as const;
const ANTHROPIC_BACKUP_MODEL = "anthropic/claude-3-7-sonnet-latest" as const;

const defaultSlackOverrides = {
  channels: {
    slack: {
      enabled: true,
      allowBots: true,
      dmPolicy: "open",
      allowFrom: ["*"],
      groupPolicy: "open",
      streaming: "off",
      nativeStreaming: false,
    },
  },
} as const;

const defaultSkillsOverrides = {
  skills: {
    load: {
      extraDirs: ["/opt/openclaw/skills"],
    },
  },
} as const;

const defaultPluginsOverrides = {
  plugins: {
    slots: {
      memory: "memory-core",
    },
  },
} as const;

const defaultToolsOverrides = {
  tools: {
    elevated: {
      enabled: true,
      allowFrom: {
        slack: ["*"],
      },
    },
    exec: {
      host: "gateway",
      security: "full",
      ask: "off",
    },
  },
} as const;

const hostedBrowserOverrides = {
  browser: {
    defaultProfile: "openclaw",
    headless: true,
    noSandbox: true,
  },
} as const;

const defaultCronOverrides = {
  cron: {
    enabled: true,
    maxConcurrentRuns: 2,
    sessionRetention: "24h",
    runLog: {
      maxBytes: "2mb",
      keepLines: 2000,
    },
  },
} as const;

const sharedPromptDocs = {
  agentsPromptPath: "agent-assets/shared/AGENTS.md",
} as const;

const agentPromptPaths = (agentId: string) => ({
  toolsPromptPath: `agent-assets/agents/${agentId}/TOOLS.md`,
  identityPromptPath: `agent-assets/agents/${agentId}/IDENTITY.md`,
  userPromptPath: `agent-assets/agents/${agentId}/USER.md`,
  heartbeatPromptPath: `agent-assets/agents/${agentId}/HEARTBEAT.md`,
  soulPromptPath: `agent-assets/agents/${agentId}/SOUL.md`,
});

const defaultAgentDefaults = {
  model: {
    fallbacks: [ANTHROPIC_BACKUP_MODEL],
  },
  compaction: {
    mode: "safeguard",
    reserveTokensFloor: 24000,
    memoryFlush: {
      enabled: true,
      softThresholdTokens: 6000,
      systemPrompt: "Session nearing compaction. Store durable memories now.",
      prompt: "Write any lasting notes to memory/YYYY-MM-DD.md; reply with NO_REPLY if nothing to store.",
    },
  },
  memorySearch: {
    enabled: true,
    provider: "gemini",
    model: "gemini-embedding-001",
  },
  heartbeat: {
    every: "1h",
  },
  contextPruning: {
    mode: "cache-ttl",
    ttl: "1h",
  },
  elevatedDefault: "full",
  subagents: {
    maxConcurrent: 10,
    runTimeoutSeconds: 900,
    archiveAfterMinutes: 60,
  },
} as const;

const defaultOpenclawOverrides = {
  ...defaultSlackOverrides,
  ...defaultSkillsOverrides,
  ...defaultPluginsOverrides,
  ...defaultToolsOverrides,
  ...hostedBrowserOverrides,
  ...defaultCronOverrides,
  agents: {
    defaults: defaultAgentDefaults,
  },
} as const;

const pmDailyStandupMessage = [
  "Produce the Mostrom daily delivery standup for the last 24 hours.",
  "Review active assigned Linear issues, current ownership, latest Linear comments, and any pushed branch or commit evidence.",
  "Post one consolidated update for Slack channel C0AGWNWB2MV.",
  "Use one section each for architect-agent, fullstack-agent, and qa-agent.",
  "For each section include: worked in last 24h, current focus, blockers or missing handoff steps, and required next action.",
  "Call out stale tickets, missing branch or commit evidence, missing Linear updates, and broken reassignment explicitly.",
  "Do not invent work. If no evidence exists, say so directly.",
].join(" ");

const pmCronBootstrapOverrides = {
  bootstrap: {
    cronJobs: [
      {
        id: "pm-daily-standup",
        agentId: "pm-agent",
        name: "PM Daily Standup",
        description: "Daily 9 AM ET delivery standup in #development",
        enabled: true,
        deleteAfterRun: false,
        schedule: {
          kind: "cron",
          expr: "0 9 * * *",
          tz: "America/New_York",
          staggerMs: 0,
        },
        sessionTarget: "isolated",
        wakeMode: "next-heartbeat",
        payload: {
          kind: "agentTurn",
          message: pmDailyStandupMessage,
          timeoutSeconds: 900,
        },
        delivery: {
          mode: "announce",
          channel: "slack",
          to: "channel:C0AGWNWB2MV",
          bestEffort: false,
        },
      },
    ],
  },
} as const;

const pmAgentOpenclawOverrides = {
  ...defaultOpenclawOverrides,
  ...pmCronBootstrapOverrides,
  agents: {
    defaults: {
      ...defaultAgentDefaults,
      heartbeat: {
        ...defaultAgentDefaults.heartbeat,
        every: "30m",
        target: "slack",
        to: "C0AGWNWB2MV",
      },
    },
  },
} as const;

const directEnvSharedKeys = [
  "ANTHROPIC_API_KEY",
  "CONTEXT7_API_KEY",
  "GEMINI_API_KEY",
  "GITHUB_TOKEN",
  "GMAIL_APP_PASSWORD",
  "GMAIL_EMAIL",
  "GMAIL_PASSWORD",
  "GOOGLE_VOICE_NUMBER",
  "LINEAR_API_KEY",
  "NOTION_API_KEY",
  "OPENCLAW_GATEWAY_TOKEN",
  "SLACK_APP_TOKEN",
  "SLACK_BOT_TOKEN",
] as const;

const directEnvProviderKeys = {
  [GEMINI_PROVIDER]: ["GEMINI_API_KEY"],
  [ANTHROPIC_PROVIDER]: ["ANTHROPIC_API_KEY"],
} as const;

type SupportedDirectEnvProvider = keyof typeof directEnvProviderKeys;

const buildDirectEnvKeys = (params: { provider: SupportedDirectEnvProvider; extra?: string[] }): string[] => {
  const { provider, extra = [] } = params;
  return [...new Set([...directEnvProviderKeys[provider], ...directEnvSharedKeys, ...extra])];
};

export const project: Project = {
  name: "openclaw",
  envs: ["mgmt"],
  ecrRepositoryName: "openclaw-gateway",
  imageTagByEnv: {
    mgmt: "latest",
  },
  agents: [
    {
      id: "architect-agent",
      displayName: "Architect Agent",
      description: "Architecture and technical design review agent",
      runtime: {
        cpu: 2048,
        memoryLimitMiB: 4096,
        desiredCount: 1,
      },
      model: {
        provider: GEMINI_PROVIDER,
        model: GEMINI_DEFAULT_MODEL,
        fallbacks: [ANTHROPIC_BACKUP_MODEL],
      },
      openclaw: {
        ...sharedPromptDocs,
        ...agentPromptPaths("architect-agent"),
        allowTools: ["*"],
        denyTools: [],
        configOverrides: defaultOpenclawOverrides,
      },
      secrets: {
        secretName: "/openclaw/mgmt/agents/architect-agent",
        directEnvKeys: buildDirectEnvKeys({
          provider: GEMINI_PROVIDER,
        }),
      },
    },
    {
      id: "fullstack-agent",
      displayName: "Fullstack Agent",
      description: "Implementation and delivery agent",
      runtime: {
        cpu: 8192,
        memoryLimitMiB: 16384,
        desiredCount: 1,
      },
      model: {
        provider: GEMINI_PROVIDER,
        model: GEMINI_DEFAULT_MODEL,
        fallbacks: [ANTHROPIC_BACKUP_MODEL],
      },
      openclaw: {
        ...sharedPromptDocs,
        ...agentPromptPaths("fullstack-agent"),
        allowTools: ["*"],
        denyTools: [],
        configOverrides: defaultOpenclawOverrides,
      },
      secrets: {
        secretName: "/openclaw/mgmt/agents/fullstack-agent",
        directEnvKeys: buildDirectEnvKeys({
          provider: GEMINI_PROVIDER,
        }),
      },
    },
    {
      id: "qa-agent",
      displayName: "QA Agent",
      description: "Automated quality and regression gate",
      runtime: {
        cpu: 8192,
        memoryLimitMiB: 16384,
        desiredCount: 1,
      },
      model: {
        provider: GEMINI_PROVIDER,
        model: GEMINI_DEFAULT_MODEL,
        fallbacks: [ANTHROPIC_BACKUP_MODEL],
      },
      openclaw: {
        ...sharedPromptDocs,
        ...agentPromptPaths("qa-agent"),
        allowTools: ["*"],
        denyTools: ["agentToAgent"],
        configOverrides: defaultOpenclawOverrides,
      },
      secrets: {
        secretName: "/openclaw/mgmt/agents/qa-agent",
        directEnvKeys: buildDirectEnvKeys({
          provider: GEMINI_PROVIDER,
        }),
      },
    },
    {
      id: "pm-agent",
      displayName: "PM Agent",
      description: "Product discovery and requirements agent",
      runtime: {
        cpu: 2048,
        memoryLimitMiB: 4096,
        desiredCount: 1,
      },
      model: {
        provider: GEMINI_PROVIDER,
        model: GEMINI_DEFAULT_MODEL,
        fallbacks: [ANTHROPIC_BACKUP_MODEL],
      },
      openclaw: {
        ...sharedPromptDocs,
        ...agentPromptPaths("pm-agent"),
        allowTools: ["*"],
        denyTools: ["agentToAgent"],
        configOverrides: pmAgentOpenclawOverrides,
      },
      secrets: {
        secretName: "/openclaw/mgmt/agents/pm-agent",
        directEnvKeys: buildDirectEnvKeys({
          provider: GEMINI_PROVIDER,
        }),
      },
    },
    {
      id: "vacation-planner-agent",
      displayName: "Vacation Planner Agent",
      description: "WhatsApp vacation planning assistant for Méribel ski trip",
      runtime: {
        cpu: 1024,
        memoryLimitMiB: 2048,
        desiredCount: 0,
      },
      model: {
        provider: GEMINI_PROVIDER,
        model: GEMINI_DEFAULT_MODEL,
        fallbacks: [ANTHROPIC_BACKUP_MODEL],
      },
      openclaw: {
        ...sharedPromptDocs,
        ...agentPromptPaths("vacation-planner-agent"),
        allowTools: ["*"],
        denyTools: [],
        configOverrides: defaultOpenclawOverrides,
      },
      secrets: {
        secretName: "/openclaw/mgmt/agents/vacation-planner-agent",
        directEnvKeys: buildDirectEnvKeys({
          provider: GEMINI_PROVIDER,
        }),
      },
    },
  ],
};
