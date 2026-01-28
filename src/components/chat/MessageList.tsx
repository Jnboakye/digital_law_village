'use client';

import { Message } from '@/types/chat';
import { Citation } from './Citation';
import { TypingIndicator } from './TypingIndicator';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="max-w-md rounded-2xl bg-slate-50 px-6 py-6 text-center shadow-inner">
          <h2 className="mb-2 text-2xl font-semibold text-slate-900">
            Welcome to AI Digital Law Bot ⚖️
          </h2>
          <p className="text-sm text-slate-600">
            Ask anything about Ghanaian law. I&apos;ll explain concepts, give examples, and cite your materials.
          </p>
          <p className="mt-4 text-xs text-slate-500">
            Click on a suggested question below to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      {messages.map((message) => {
        const isUser = message.role === 'user';
        return (
          <div
            key={message.id}
            className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!isUser && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 shadow-sm">
                AI
              </div>
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                isUser
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-slate-50 text-slate-900 border border-slate-200 rounded-bl-sm'
              }`}
            >
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
              
              {message.sources && message.sources.length > 0 && (
                <Citation sources={message.sources} />
              )}
              
              <div
                className={`mt-2 text-[10px] ${
                  isUser ? 'text-blue-100' : 'text-slate-400'
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
            {isUser && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white shadow-sm">
                You
              </div>
            )}
          </div>
        );
      })}
      
      {isLoading && <TypingIndicator />}
    </div>
  );
}

