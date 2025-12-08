import { NextResponse } from 'next/server';
import { transcribeAudio } from '@/lib/speech/stt';

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

    // Transcribe audio
    const text = await transcribeAudio(audioBuffer);

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error in transcribe API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}

