import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session/manager';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId query parameter is required' },
        { status: 400 }
      );
    }

    const session = await getSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error getting session history:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get session history' },
      { status: 500 }
    );
  }
}

