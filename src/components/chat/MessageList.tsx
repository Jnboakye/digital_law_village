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
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to AI Digital Law Bot! ⚖️
          </h2>
          <p className="text-gray-600">
            Ask me anything about Ghanaian law. I&apos;m here to help you learn and understand legal concepts.
          </p>
          <p className="mt-6 text-sm text-gray-500">
            Click on a suggested question below to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-4 min-h-full">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-3 ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <div className="whitespace-pre-wrap wrap-break-word">
              {message.content}
            </div>
            
            {message.sources && message.sources.length > 0 && (
              <Citation sources={message.sources} />
            )}
            
            <div className={`text-xs mt-2 ${
              message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
      ))}
      
      {isLoading && <TypingIndicator />}
    </div>
  );
}

