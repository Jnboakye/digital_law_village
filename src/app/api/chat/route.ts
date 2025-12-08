import { NextResponse } from 'next/server';
import { processQuery, ChatMessage } from '@/lib/ai/chat-handler';
import { createSession, getSession, addMessageToSession } from '@/lib/session/manager';
import { Message } from '@/types/chat';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  try {
    const { message, sessionId: providedSessionId } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Get or create session
    let sessionId = providedSessionId;
    let session = null;

    if (sessionId) {
      session = await getSession(sessionId);
      if (!session) {
        // Session expired or doesn't exist, create new one
        sessionId = await createSession();
        session = await getSession(sessionId);
      }
    } else {
      sessionId = await createSession();
      session = await getSession(sessionId);
    }

    if (!session) {
      throw new Error('Failed to create or retrieve session');
    }

    // Convert session messages to ChatMessage format for processing
    const conversationHistory: ChatMessage[] = session.messages
      .slice(-10) // Last 10 messages for context
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

    // Process query with RAG
    let response;
    try {
      response = await processQuery(message, conversationHistory);
    } catch (error) {
      console.error('Error processing query:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Provide helpful error messages
      if (errorMessage.includes('OPENAI_API_KEY') || errorMessage.includes('apiKey')) {
        return NextResponse.json(
          { error: 'OpenAI API key is not configured. Please check your environment variables.' },
          { status: 500 }
        );
      }
      
      if (errorMessage.includes('PINECONE') || errorMessage.includes('Pinecone')) {
        return NextResponse.json(
          { error: 'Pinecone is not configured or knowledge base is not set up. Please run: npm run setup-kb' },
          { status: 500 }
        );
      }
      
      throw error; // Re-throw if unknown error
    }

    // Create user message
    const userMessage: Message = {
      id: randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    // Create assistant message
    const assistantMessage: Message = {
      id: randomUUID(),
      role: 'assistant',
      content: response.answer,
      timestamp: new Date(),
      sources: response.sources.map(src => ({
        content: src.content,
        pageNumber: src.pageNumber,
        score: src.score,
      })),
    };

    // Save messages to session
    await addMessageToSession(sessionId, userMessage);
    await addMessageToSession(sessionId, assistantMessage);

    return NextResponse.json({
      message: assistantMessage,
      sessionId,
      sources: response.sources,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
