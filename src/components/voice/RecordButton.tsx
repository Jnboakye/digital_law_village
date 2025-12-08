'use client';

interface RecordButtonProps {
  isRecording: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function RecordButton({ isRecording, onClick, disabled }: RecordButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
        isRecording
          ? 'bg-red-600 hover:bg-red-700 animate-pulse'
          : 'bg-green-600 hover:bg-green-700'
      } disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl transform hover:scale-105 active:scale-95`}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
    >
      <div
        className={`absolute inset-0 rounded-full ${
          isRecording ? 'bg-red-600 animate-ping opacity-75' : ''
        }`}
      />
      <svg
        className="w-16 h-16 text-white relative z-10"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        {isRecording ? (
          <path d="M6 6h12v12H6z" />
        ) : (
          <path d="M12 14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2s-2 .9-2 2v6c0 1.1.9 2 2 2zm5-3c0 2.8-2.2 5-5 5s-5-2.2-5-5H5c0 3.3 2.7 6 6 6s6-2.7 6-6h-1z" />
        )}
      </svg>
    </button>
  );
}

