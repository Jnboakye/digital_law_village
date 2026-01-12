import { NextResponse } from 'next/server';
import { transcribeAudioWithDeepgram } from '@/lib/speech/deepgram';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    // Get MIME type from the file
    const mimeType = audioFile.type || 'audio/webm';

    // Transcribe audio using Deepgram
    const text = await transcribeAudioWithDeepgram(audioBuffer, mimeType);

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'No speech detected in audio' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error in transcribe API:', error);
    
    // Provide helpful error messages
    const errorMessage = error instanceof Error ? error.message : 'Failed to transcribe audio';
    
    if (errorMessage.includes('DEEPGRAM_API_KEY')) {
      return NextResponse.json(
        { error: 'Deepgram API key is not configured. Please check your environment variables.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

