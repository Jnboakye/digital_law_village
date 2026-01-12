import { createClient } from '@deepgram/sdk';

let deepgramClient: ReturnType<typeof createClient> | null = null;

/**
 * Get or create Deepgram client
 */
function getDeepgramClient() {
  if (!deepgramClient) {
    const apiKey = process.env.DEEPGRAM_API_KEY;

    if (!apiKey) {
      console.error('⚠️  DEEPGRAM_API_KEY is not set in environment variables');
      console.error('   Please add it to your .env.local file');
      throw new Error('DEEPGRAM_API_KEY is not set in environment variables');
    }

    deepgramClient = createClient(apiKey);
  }

  return deepgramClient;
}

/**
 * Transcribe audio using Deepgram
 * Supports various audio formats including webm, mp4, wav, etc.
 */
export async function transcribeAudioWithDeepgram(audioBuffer: Buffer, mimeType: string = 'audio/webm'): Promise<string> {
  try {
    const deepgram = getDeepgramClient();

    // Determine the audio format for Deepgram
    let source: { buffer: Buffer; mimetype?: string } = {
      buffer: audioBuffer,
    };

    // Set mimetype if we know it
    if (mimeType) {
      source.mimetype = mimeType;
    }

    // Transcribe using Deepgram
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(source, {
      model: 'nova-2', // Use Deepgram's latest model
      language: 'en',
      smart_format: true, // Automatically format punctuation, numbers, etc.
      punctuate: true,
    });

    if (error) {
      console.error('Deepgram transcription error:', error);
      throw new Error(`Deepgram transcription failed: ${error.message || 'Unknown error'}`);
    }

    if (!result?.results?.channels?.[0]?.alternatives?.[0]?.transcript) {
      throw new Error('No transcription result from Deepgram');
    }

    const transcript = result.results.channels[0].alternatives[0].transcript;
    return transcript.trim();
  } catch (error) {
    console.error('Error transcribing with Deepgram:', error);
    throw new Error(`Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

