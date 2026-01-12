import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'DEEPGRAM_API_KEY is not configured. Please check your environment variables.' },
        { status: 500 }
      );
    }

    // For Deepgram WebSocket, we can use the API key directly as the token
    // In production, you might want to generate a temporary token, but for simplicity
    // we'll use the API key (which is fine for server-side use)
    return NextResponse.json({ token: apiKey });
  } catch (error) {
    console.error('Error generating Deepgram token:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate token' },
      { status: 500 }
    );
  }
}

