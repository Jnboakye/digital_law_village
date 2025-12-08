import { NextResponse } from 'next/server';
import { generateEmbedding } from '@/lib/rag/embeddings';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    const embedding = await generateEmbedding(text);

    return NextResponse.json({ embedding });
  } catch (error) {
    console.error('Error generating embedding:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate embedding' },
      { status: 500 }
    );
  }
}

