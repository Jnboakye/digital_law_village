import { openai } from '@/lib/ai/openai';

/**
 * Transcribe audio to text using OpenAI Whisper
 */
export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    // Convert Buffer to Blob for File constructor
    const blob = new Blob([new Uint8Array(audioBuffer)], { type: 'audio/webm' });
    const file = new File([blob], 'audio.webm', { type: 'audio/webm' });

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'en', // Can be made configurable
    });

    return transcription.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error(`Failed to transcribe audio: ${error}`);
  }
}
