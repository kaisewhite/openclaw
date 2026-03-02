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
   * Keys expected in the JSON secret object and mapped to env vars.
   */
  requiredKeys: string[];
  optionalKeys?: string[];
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

const defaultRequiredSecretKeys = [
  "OPENCLAW_GATEWAY_TOKEN",
  "SLACK_BOT_TOKEN",
  "SLACK_APP_TOKEN",
  "LINEAR_API_KEY",
  "NOTION_API_KEY",
  "GEMINI_API_KEY",
  "GMAIL_EMAIL",
  "GMAIL_PASSWORD",
];
const defaultSlackOverrides = {
  channels: {
    slack: {
      enabled: true,
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

const defaultOpenclawOverrides = {
  ...defaultSlackOverrides,
  ...defaultSkillsOverrides,
  ...defaultPluginsOverrides,
} as const;

const architectSubagentOverrides = {
  ...defaultOpenclawOverrides,
  agents: {
    defaults: {
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
      subagents: {
        maxConcurrent: 3,
        runTimeoutSeconds: 900,
        archiveAfterMinutes: 60,
      },
    },
  },
} as const;

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
        requiredKeys: [...defaultRequiredSecretKeys, "ANTHROPIC_SETUP_TOKEN", "GITHUB_TOKEN"],
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
        requiredKeys: [...defaultRequiredSecretKeys, "ANTHROPIC_SETUP_TOKEN", "GITHUB_TOKEN"],
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
        requiredKeys: [...defaultRequiredSecretKeys, "GITHUB_TOKEN"],
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
        requiredKeys: [...defaultRequiredSecretKeys, "ANTHROPIC_SETUP_TOKEN", "GITHUB_TOKEN"],
      },
    },
  ],
};
