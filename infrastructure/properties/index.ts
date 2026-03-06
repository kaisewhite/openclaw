export type EnvironmentKey = "mgmt";

export interface AgentRuntimeConfig {
  cpu: number;
  memoryLimitMiB: number;
  desiredCount: number;
}

export interface AgentModelConfig {
  provider: string;
  model: string;
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
  soulPromptPath: string;
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

const hostedBrowserOverrides = {
  browser: {
    defaultProfile: "openclaw",
    headless: true,
    noSandbox: true,
  },
} as const;

const defaultAgentDefaults = {
  compaction: {
    mode: "safeguard",
    reserveTokensFloor: 24000,
    memoryFlush: {
      enabled: true,
      softThresholdTokens: 6000,
      systemPrompt: "Session nearing compaction. Store durable memories now.",
      prompt:
        "Write any lasting notes to memory/YYYY-MM-DD.md; reply with NO_REPLY if nothing to store.",
    },
  },
  memorySearch: {
    enabled: true,
    provider: "gemini",
    model: "gemini-embedding-001",
  },
} as const;

const defaultOpenclawOverrides = {
  ...defaultSlackOverrides,
  ...defaultSkillsOverrides,
  ...defaultPluginsOverrides,
  ...hostedBrowserOverrides,
  agents: {
    defaults: defaultAgentDefaults,
  },
} as const;

const architectSubagentOverrides = {
  ...defaultOpenclawOverrides,
  agents: {
    defaults: {
      ...defaultAgentDefaults,
      subagents: {
        maxConcurrent: 3,
        runTimeoutSeconds: 900,
        archiveAfterMinutes: 60,
      },
    },
  },
} as const;

const fullstackSubagentOverrides = {
  ...defaultOpenclawOverrides,
  agents: {
    defaults: {
      ...defaultAgentDefaults,
      subagents: {
        maxConcurrent: 3,
        runTimeoutSeconds: 900,
        archiveAfterMinutes: 60,
      },
    },
  },
} as const;

const directEnvSharedKeys = [
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
  anthropic: ["ANTHROPIC_SETUP_TOKEN"],
  "openai-codex": ["OPENAI_API_KEY"],
} as const;

type SupportedDirectEnvProvider = keyof typeof directEnvProviderKeys;

const buildDirectEnvKeys = (params: {
  provider: SupportedDirectEnvProvider;
  extra?: string[];
}): string[] => {
  const { provider, extra = [] } = params;
  return [...new Set([
    ...directEnvProviderKeys[provider],
    ...directEnvSharedKeys,
    ...extra,
  ])];
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
        cpu: 8192,
        memoryLimitMiB: 16384,
        desiredCount: 1,
      },
      model: {
        provider: "anthropic",
        model: "claude-opus-4-5",
      },
      openclaw: {
        soulPromptPath: "agent-assets/agents/architect-agent.md",
        allowTools: ["*"],
        denyTools: [],
        configOverrides: architectSubagentOverrides,
      },
      secrets: {
        secretName: "/openclaw/mgmt/agents/architect-agent",
        directEnvKeys: buildDirectEnvKeys({
          provider: "anthropic",
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
        provider: "anthropic",
        model: "claude-opus-4-5",
      },
      openclaw: {
        soulPromptPath: "agent-assets/agents/senior-fullstack-agent.md",
        allowTools: ["*"],
        denyTools: [],
        configOverrides: fullstackSubagentOverrides,
      },
      secrets: {
        secretName: "/openclaw/mgmt/agents/fullstack-agent",
        directEnvKeys: buildDirectEnvKeys({
          provider: "anthropic",
        }),
      },
    },
    {
      id: "codex-agent",
      displayName: "Codex Agent",
      description: "Scoped implementation and delivery agent",
      runtime: {
        cpu: 8192,
        memoryLimitMiB: 16384,
        desiredCount: 1,
      },
      model: {
        provider: "openai-codex",
        model: "gpt-5.3-codex",
      },
      openclaw: {
        soulPromptPath: "agent-assets/agents/codex-agent.md",
        allowTools: ["*"],
        denyTools: [],
        configOverrides: fullstackSubagentOverrides,
      },
      secrets: {
        secretName: "/openclaw/mgmt/agents/codex-agent",
        directEnvKeys: buildDirectEnvKeys({
          provider: "openai-codex",
        }),
      },
    },
    {
      id: "qa-agent",
      displayName: "QA Agent",
      description: "Automated quality and regression gate",
      runtime: {
        cpu: 2048,
        memoryLimitMiB: 4096,
        desiredCount: 1,
      },
      model: {
        provider: "openai-codex",
        model: "gpt-5.3-codex",
      },
      openclaw: {
        soulPromptPath: "agent-assets/agents/qa-automation-agent.md",
        allowTools: ["*"],
        denyTools: ["agentToAgent"],
        configOverrides: defaultOpenclawOverrides,
      },
      secrets: {
        secretName: "/openclaw/mgmt/agents/qa-agent",
        directEnvKeys: buildDirectEnvKeys({
          provider: "openai-codex",
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
        provider: "anthropic",
        model: "claude-sonnet-4-5",
      },
      openclaw: {
        soulPromptPath: "agent-assets/agents/product-agent.md",
        allowTools: ["*"],
        denyTools: ["agentToAgent"],
        configOverrides: defaultOpenclawOverrides,
      },
      secrets: {
        secretName: "/openclaw/mgmt/agents/pm-agent",
        directEnvKeys: buildDirectEnvKeys({
          provider: "anthropic",
        }),
      },
    },
  ],
};
