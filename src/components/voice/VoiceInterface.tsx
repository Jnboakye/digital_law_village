'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RecordButton } from './RecordButton';
import { AudioPlayer } from './AudioPlayer';
import { useVoice } from '@/hooks/useVoice';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useChat } from '@/hooks/useChat';

export function VoiceInterface() {
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const { isRecording, isTranscribing, startRecording, stopRecording, transcribe, cleanup } = useVoice();
  const { isPlaying, isSynthesizing, synthesizeAndPlay, stop } = useAudioPlayer();
  const [status, setStatus] = useState<string>('');

  const handleRecord = async () => {
    try {
      if (isRecording) {
        // Stop recording (transcription happens in real-time)
        setStatus('Processing...');
        const text = await stopRecording();
        
        if (!text || !text.trim()) {
          setStatus('No speech detected. Please try again.');
          setTimeout(() => setStatus(''), 3000);
          return;
        }

        // Send message
        setStatus('Thinking...');
        await sendMessage(text);
        setStatus('');
      } else {
        // Start recording
        setStatus('Connecting...');
        await startRecording();
        setStatus('Recording... Click again to stop');
      }
    } catch (err) {
      console.error('Error in voice recording:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setStatus(errorMessage);
      
      // Clear status after showing error
      setTimeout(() => setStatus(''), 7000);
      
      // Also set error in chat hook if it's a critical error
      if (errorMessage.includes('permission') || errorMessage.includes('microphone')) {
        // Error will be shown in the error banner
      }
    }
  };

  // Auto-play bot responses when new assistant message arrives
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage &&
      lastMessage.role === 'assistant' &&
      !isPlaying &&
      !isSynthesizing &&
      !isLoading &&
      !isTranscribing
    ) {
      synthesizeAndPlay(lastMessage.content).catch((err) => {
        console.error('Error playing audio:', err);
      });
    }
  }, [messages, isPlaying, isSynthesizing, isLoading, isTranscribing, synthesizeAndPlay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Back to home"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Voice Chat</h1>
            <p className="text-sm text-gray-500">Speak your questions about Ghanaian law</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          New Chat
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Status message */}
      {status && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-4 mt-4">
          <p className="text-sm text-blue-700 font-medium">{status}</p>
        </div>
      )}

      {/* Main content - Voice button centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🎤 Voice Chat
          </h2>
          <p className="text-gray-600">
            Click the button below to start speaking your question
          </p>
        </div>

        {/* Recording button - Large and centered */}
        <div className="flex flex-col items-center gap-6">
          <RecordButton
            isRecording={isRecording}
            onClick={handleRecord}
            disabled={isLoading || isTranscribing || isSynthesizing}
          />
          
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isRecording
                ? '🎙️ Recording... Click to stop'
                : isTranscribing
                ? '📝 Transcribing...'
                : isLoading
                ? '🤔 Thinking...'
                : isSynthesizing
                ? '🔊 Preparing audio...'
                : isPlaying
                ? '🔊 Playing response...'
                : 'Click to talk'}
            </p>
            {isRecording && (
              <p className="text-sm text-gray-500 mt-2">
                Speak your question, then click again when done
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Audio player - Fixed at bottom */}
      {(isPlaying || isSynthesizing) && (
        <div className="shrink-0 px-4 pb-4">
          <AudioPlayer isPlaying={isPlaying} onStop={stop} />
        </div>
      )}
    </div>
  );
}

