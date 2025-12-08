import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error('⚠️  OPENAI_API_KEY is not set in environment variables');
      console.error('   Please add it to your .env.local file');
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    openaiClient = new OpenAI({
      apiKey: apiKey,
    });
  }
  return openaiClient;
}

// Export a lazy-initialized client
export const openai = new Proxy({} as OpenAI, {
  get(_target, prop) {
    const client = getOpenAIClient();
    const value = client[prop as keyof OpenAI];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

export const AI_CONFIG = {
  model: 'gpt-4o-mini', // Fast and cost-effective for tutoring
  temperature: 0.7, // Balanced between creativity and consistency
  maxTokens: 1000, // Reasonable length for tutoring responses
} as const;