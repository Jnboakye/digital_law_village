import { NextResponse } from 'next/server';
import { synthesizeSpeech, VoiceType } from '@/lib/speech/tts';

export async function POST(req: Request) {
  try {
    const { text, voice = 'nova' } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    // Synthesize speech
    const audioBuffer = await synthesizeSpeech(text, voice as VoiceType);

    // Convert Buffer to Uint8Array for NextResponse
    const audioArray = new Uint8Array(audioBuffer);

    // Return audio as MPEG
    return new NextResponse(audioArray, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error in synthesize API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to synthesize speech' },
      { status: 500 }
    );
  }
}

