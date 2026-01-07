import { NextResponse } from 'next/server';
import { processStreamingQuery, ChatMessage } from '@/lib/ai/chat-handler';
import { createSession, getSession, addMessageToSession } from '@/lib/session/manager';
import { Message } from '@/types/chat';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  try {
    const { message, sessionId: providedSessionId, stream = true } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Get or create session (parallel with RAG retrieval if possible)
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

    // Create user message
    const userMessage: Message = {
      id: randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    // Save user message immediately (non-blocking)
    addMessageToSession(sessionId, userMessage).catch(console.error);

    // Use streaming for faster perceived response time
    if (stream) {
      // Create a ReadableStream for streaming response
      const encoder = new TextEncoder();

      const stream = new ReadableStream({
        async start(controller) {
          try {
            let fullAnswer = '';
            
            // Process query with streaming
            const response = await processStreamingQuery(
              message,
              conversationHistory,
              (chunk: string) => {
                // Send chunk to client immediately
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
              }
            );

            // Get full answer from response (it accumulates internally)
            fullAnswer = response.answer;
            const sources = response.sources;

            // Create assistant message
            const assistantMessage: Message = {
              id: randomUUID(),
              role: 'assistant',
              content: fullAnswer,
              timestamp: new Date(),
              sources: sources.map(src => ({
                content: src.content,
                pageNumber: src.pageNumber,
                score: src.score,
              })),
            };

            // Save assistant message (non-blocking)
            addMessageToSession(sessionId, assistantMessage).catch(console.error);

            // Send final message with sources
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ 
                  done: true, 
                  message: assistantMessage,
                  sessionId,
                  sources: sources 
                })}\n\n`
              )
            );
            controller.close();
          } catch (error) {
            console.error('Error processing streaming query:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            
            // Provide helpful error messages
            if (errorMessage.includes('OPENAI_API_KEY') || errorMessage.includes('apiKey')) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ 
                    error: 'OpenAI API key is not configured. Please check your environment variables.' 
                  })}\n\n`
                )
              );
            } else if (errorMessage.includes('PINECONE') || errorMessage.includes('Pinecone')) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ 
                    error: 'Pinecone is not configured or knowledge base is not set up. Please run: npm run setup-kb' 
                  })}\n\n`
                )
              );
            } else {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ 
                    error: errorMessage || 'Internal server error' 
                  })}\n\n`
                )
              );
            }
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Fallback to non-streaming for compatibility
      const { processQuery } = await import('@/lib/ai/chat-handler');
      const response = await processQuery(message, conversationHistory);

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

      await addMessageToSession(sessionId, assistantMessage);

      return NextResponse.json({
        message: assistantMessage,
        sessionId,
        sources: response.sources,
      });
    }
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
