'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { PromptSuggestions } from './PromptSuggestions';
import { useChat } from '@/hooks/useChat';

export function ChatInterface() {
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-slate-50 to-indigo-50 px-4 py-6">
      <div className="mx-auto flex h-[calc(100vh-3rem)] max-w-4xl flex-col rounded-2xl bg-white/80 shadow-xl ring-1 ring-slate-200 backdrop-blur">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              aria-label="Back to home"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-slate-900 sm:text-lg">
                  AI Digital Law Bot
                </h1>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-blue-100">
                  Ghanaian Law Tutor
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                Ask questions about Ghanaian law and get clear, cited explanations.
              </p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors sm:px-4 sm:text-sm"
          >
            New Chat
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-4 mt-3 rounded-xl border-l-4 border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6">
            {error}
          </div>
        )}

        {/* Messages - Scrollable container */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-2 pb-2 pt-3 sm:px-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          <MessageList messages={messages} isLoading={isLoading} />
          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestions - Show when no messages */}
        {!hasMessages && !isLoading && (
          <div className="border-t border-slate-100">
            <PromptSuggestions onSelectPrompt={sendMessage} disabled={isLoading} />
          </div>
        )}

        {/* Input */}
        <div className="shrink-0 border-t border-slate-100">
          <MessageInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}

