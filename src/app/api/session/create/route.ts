import { NextResponse } from 'next/server';
import { createSession } from '@/lib/session/manager';

export async function POST() {
  try {
    const sessionId = await createSession();
    const createdAt = new Date();

    return NextResponse.json({
      sessionId,
      createdAt,
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create session' },
      { status: 500 }
    );
  }
}

