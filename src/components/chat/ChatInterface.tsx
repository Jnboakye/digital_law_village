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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300&display=swap');

        .chat-root {
          min-height: 100vh;
          background: #0d1b2a;
          background-image:
            radial-gradient(ellipse 80% 50% at 20% 0%, rgba(191, 144, 0, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(0, 100, 60, 0.07) 0%, transparent 55%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          padding: 1.5rem 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Source Serif 4', Georgia, serif;
        }

        .chat-shell {
          width: 100%;
          max-width: 52rem;
          height: calc(100vh - 3rem);
          display: flex;
          flex-direction: column;
          border-radius: 1rem;
          overflow: hidden;
          background: #111e2e;
          border: 1px solid rgba(191, 144, 0, 0.2);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.03),
            0 32px 80px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(191, 144, 0, 0.15);
        }

        /* ─── Header ─── */
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          background: linear-gradient(135deg, #0d1b2a 0%, #0f2235 100%);
          border-bottom: 1px solid rgba(191, 144, 0, 0.18);
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }

        .chat-header::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(191,144,0,0.4), transparent);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          border: 1px solid rgba(191, 144, 0, 0.25);
          background: rgba(191, 144, 0, 0.06);
          color: #c8a84b;
          transition: all 0.2s ease;
          flex-shrink: 0;
          text-decoration: none;
        }

        .back-btn:hover {
          background: rgba(191, 144, 0, 0.15);
          border-color: rgba(191, 144, 0, 0.5);
          color: #e0c068;
        }

        .header-title-group h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: #e8d9b0;
          letter-spacing: 0.01em;
          line-height: 1.2;
          margin: 0;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          margin-top: 0.25rem;
          font-size: 0.65rem;
          font-family: 'Source Serif 4', sans-serif;
          font-weight: 400;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #c8a84b;
          opacity: 0.85;
        }

        .badge::before {
          content: '';
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 6px #4ade80;
          animation: pulse-dot 2.5s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }

        .header-subtitle {
          margin: 0;
          font-size: 0.7rem;
          color: rgba(180, 190, 200, 0.55);
          font-style: italic;
          letter-spacing: 0.01em;
          line-height: 1.3;
        }

        .new-chat-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 1rem;
          border-radius: 100px;
          border: 1px solid rgba(191, 144, 0, 0.25);
          background: rgba(191, 144, 0, 0.07);
          color: #c8a84b;
          font-size: 0.72rem;
          font-family: 'Source Serif 4', serif;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .new-chat-btn:hover {
          background: rgba(191, 144, 0, 0.15);
          border-color: rgba(191, 144, 0, 0.5);
          color: #e0c068;
        }

        /* ─── Ghana accent bar ─── */
        .ghana-bar {
          display: flex;
          height: 3px;
          flex-shrink: 0;
        }

        .ghana-bar span {
          flex: 1;
        }

        .ghana-bar .red   { background: #ce1126; }
        .ghana-bar .gold  { background: #fcd116; }
        .ghana-bar .green { background: #006b3f; }

        /* ─── Error ─── */
        .error-banner {
          margin: 0.75rem 1.25rem 0;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border-left: 3px solid #f87171;
          background: rgba(239, 68, 68, 0.08);
          font-size: 0.8rem;
          color: #fca5a5;
          flex-shrink: 0;
        }

        /* ─── Messages area ─── */
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem 1rem 0.5rem;
          scroll-behavior: smooth;
        }

        .messages-area::-webkit-scrollbar {
          width: 4px;
        }

        .messages-area::-webkit-scrollbar-track {
          background: transparent;
        }

        .messages-area::-webkit-scrollbar-thumb {
          background: rgba(191, 144, 0, 0.2);
          border-radius: 2px;
        }

        .messages-area::-webkit-scrollbar-thumb:hover {
          background: rgba(191, 144, 0, 0.4);
        }

        /* ─── Prompt suggestions wrapper ─── */
        .suggestions-wrapper {
          border-top: 1px solid rgba(191, 144, 0, 0.1);
          background: rgba(0, 0, 0, 0.1);
        }

        /* ─── Input area ─── */
        .input-wrapper {
          flex-shrink: 0;
          border-top: 1px solid rgba(191, 144, 0, 0.12);
          background: rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(8px);
        }

        /* ─── Empty state watermark ─── */
        .empty-watermark {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem 1rem;
          gap: 0.5rem;
          opacity: 0.3;
          pointer-events: none;
          user-select: none;
        }

        .watermark-seal {
          width: 52px;
          height: 52px;
          border: 1.5px solid #c8a84b;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: #c8a84b;
          margin-bottom: 0.25rem;
        }

        .watermark-text {
          font-family: 'Playfair Display', serif;
          font-size: 0.75rem;
          color: #c8a84b;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
      `}</style>

      <div className="chat-root">
        <div className="chat-shell">

          {/* Ghana-flag accent bar */}
          <div className="ghana-bar">
            <span className="red" />
            <span className="gold" />
            <span className="green" />
          </div>

          {/* Header */}
          <header className="chat-header">
            <div className="header-left">
              <Link href="/" className="back-btn" aria-label="Back to home">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div className="header-title-group">
                <h1>AI Digital Law Bot</h1>
                <div className="badge">Ghanaian Law Tutor</div>
                <p className="header-subtitle">Ask questions about Ghanaian law and get clear, cited explanations.</p>
              </div>
            </div>

            <button onClick={clearChat} className="new-chat-btn">
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
          </header>

          {/* Error */}
          {error && (
            <div className="error-banner">{error}</div>
          )}

          {/* Messages */}
          <div ref={messagesContainerRef} className="messages-area">
            {!hasMessages && !isLoading && (
              <div className="empty-watermark">
                <div className="watermark-seal">⚖</div>
                <span className="watermark-text">Lex Ghana</span>
              </div>
            )}
            <MessageList messages={messages} isLoading={isLoading} />
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt suggestions */}
          {!hasMessages && !isLoading && (
            <div className="suggestions-wrapper">
              <PromptSuggestions onSelectPrompt={sendMessage} disabled={isLoading} />
            </div>
          )}

          {/* Input */}
          <div className="input-wrapper">
            <MessageInput onSend={sendMessage} disabled={isLoading} />
          </div>

        </div>
      </div>
    </>
  );
}