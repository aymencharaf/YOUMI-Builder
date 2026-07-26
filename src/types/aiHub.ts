export interface AIAgent {
  id: string;
  name: string;
  nameAr?: string;
  category: 'agents' | 'prompts' | 'workflows' | 'automations' | 'components' | 'templates' | 'plugins' | 'extensions' | 'widgets' | 'chatbots' | 'apis' | 'models' | 'integrations' | 'solutions';
  provider: 'OpenAI' | 'Google Gemini' | 'Claude' | 'DeepSeek' | 'Meta Llama' | 'Mistral' | 'Grok' | 'OpenRouter' | 'Ollama' | 'HuggingFace' | 'Replicate' | 'Stability AI' | 'Cohere' | 'Together AI' | 'Anthropic';
  price: number; // 0 for free, subscription or one-time
  rating: number;
  downloads: number;
  version: string;
  author: {
    name: string;
    badge?: 'Verified Creator' | 'Gold Creator' | 'Elite Creator';
    avatar: string;
  };
  description: string;
  descriptionAr?: string;
  tags: string[];
  features: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewRelease?: boolean;
  isStaffPick?: boolean;
}

export interface AIRecipe {
  id: string;
  title: string;
  titleAr: string;
  icon: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  estimatedSavings: string;
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'provider' | 'database' | 'response';
  title: string;
  icon: string;
  status: 'idle' | 'running' | 'success' | 'error';
  config: Record<string, any>;
  x: number;
  y: number;
}

export interface WorkflowConnection {
  fromId: string;
  toId: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  systemInstruction: string;
  userTemplate: string;
  variables: string[];
  version: string;
  forks: number;
  likes: number;
}
