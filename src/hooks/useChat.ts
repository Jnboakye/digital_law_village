import { useState, useCallback } from 'react';
import { Message } from '@/types/chat';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = useCallback(async () => {
    try {
      const response = await fetch('/api/session/create', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to create session');
      }
      
      const data = await response.json();
      setSessionId(data.sessionId);
      return data.sessionId;
    } catch (err) {
      console.error('Error creating session:', err);
      setError('Failed to create session');
      return null;
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      // Create session if it doesn't exist
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = await createSession();
        if (!currentSessionId) {
          throw new Error('Failed to create session');
        }
      }

      // Use streaming for faster perceived response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          sessionId: currentSessionId,
          stream: true, // Enable streaming
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Check if response is streaming (text/event-stream) or JSON
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('text/event-stream')) {
        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        
        if (!reader) {
          throw new Error('No response body');
        }

        // Create temporary assistant message for streaming
        const assistantMessageId = `temp-assistant-${Date.now()}`;
        const assistantMessage: Message = {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          sources: [],
        };
        
        setMessages(prev => [...prev, assistantMessage]);

        let buffer = '';
        let fullAnswer = '';
        let finalSources: any[] = [];
        let finalSessionId = currentSessionId;

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.chunk) {
                  // Append chunk to answer
                  fullAnswer += data.chunk;
                  
                  // Update message in real-time
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId
                      ? { ...msg, content: fullAnswer }
                      : msg
                  ));
                }
                
                if (data.done) {
                  // Final message received
                  finalSources = data.sources || [];
                  finalSessionId = data.sessionId || currentSessionId;
                  
                  // Replace temporary message with final one
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId
                      ? {
                          ...msg,
                          id: data.message?.id || assistantMessageId,
                          sources: finalSources.map((src: any) => ({
                            content: src.content,
                            pageNumber: src.pageNumber,
                            score: src.score,
                          })),
                        }
                      : msg
                  ));
                  
                  setSessionId(finalSessionId);
                }
                
                if (data.error) {
                  throw new Error(data.error);
                }
              } catch (e) {
                console.error('Error parsing stream data:', e);
              }
            }
          }
        }
      } else {
        // Fallback to non-streaming JSON response
        const data = await response.json();
        setMessages(prev => [...prev, data.message]);
        setSessionId(data.sessionId);
      }

    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      
      // Remove the user message if request failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, createSession]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}