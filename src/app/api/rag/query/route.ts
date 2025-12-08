import { NextResponse } from 'next/server';
import { retrieveRelevantChunks } from '@/lib/rag/retriever';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    const result = await retrieveRelevantChunks(query);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error querying RAG:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to query RAG' },
      { status: 500 }
    );
  }
}

