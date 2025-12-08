import { openai } from '@/lib/ai/openai';

export type VoiceType = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

/**
 * Synthesize text to speech using OpenAI TTS
 */
export async function synthesizeSpeech(
  text: string,
  voice: VoiceType = 'nova'
): Promise<Buffer> {
  try {
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice,
      input: text,
    });

    // Convert response to buffer
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    throw new Error(`Failed to synthesize speech: ${error}`);
  }
}

