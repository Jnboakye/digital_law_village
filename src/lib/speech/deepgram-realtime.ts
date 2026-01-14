import { createClient } from '@deepgram/sdk';

let deepgramClient: ReturnType<typeof createClient> | null = null;

/**
 * Get or create Deepgram client
 */
function getDeepgramClient() {
  if (!deepgramClient) {
    const apiKey = process.env.DEEPGRAM_API_KEY;

    if (!apiKey) {
      throw new Error('DEEPGRAM_API_KEY is not set in environment variables');
    }

    deepgramClient = createClient(apiKey);
  }

  return deepgramClient;
}

/**
 * Get a Deepgram WebSocket token for real-time transcription
 */
export async function getDeepgramToken(): Promise<string> {
  try {
    const deepgram = getDeepgramClient();
    
    // Create a token for real-time transcription
    const { result, error } = await deepgram.listen.manage.createProjectKey(
      process.env.DEEPGRAM_PROJECT_ID || 'default',
      {
        scopes: ['usage:write'],
        tags: ['voice-chat'],
      }
    );

    if (error) {
      // If project key creation fails, use the API key directly
      // For real-time, we can use the API key as a token
      return process.env.DEEPGRAM_API_KEY || '';
    }

    return result?.key || process.env.DEEPGRAM_API_KEY || '';
  } catch (error) {
    console.error('Error creating Deepgram token:', error);
    // Fallback to API key
    return process.env.DEEPGRAM_API_KEY || '';
  }
}

// I used deepgram since open AI's tts and sts seems not to work
//Deep gram seems to have issues
