'use client';

interface AudioPlayerProps {
  isPlaying: boolean;
  onStop: () => void;
}

export function AudioPlayer({ isPlaying, onStop }: AudioPlayerProps) {
  if (!isPlaying) {
    return null;
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          <div className="w-1 h-6 bg-green-500 rounded animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-1 h-8 bg-green-500 rounded animate-pulse" style={{ animationDelay: '100ms' }} />
          <div className="w-1 h-4 bg-green-500 rounded animate-pulse" style={{ animationDelay: '200ms' }} />
          <div className="w-1 h-6 bg-green-500 rounded animate-pulse" style={{ animationDelay: '300ms' }} />
          <div className="w-1 h-8 bg-green-500 rounded animate-pulse" style={{ animationDelay: '400ms' }} />
        </div>
        <span className="text-sm text-green-700 font-medium">Playing audio...</span>
      </div>
      <button
        onClick={onStop}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
      >
        Stop
      </button>
    </div>
  );
}

