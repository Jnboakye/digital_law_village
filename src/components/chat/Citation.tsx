'use client';

import { useState } from 'react';
import { Source } from '@/types/chat';

interface CitationProps {
  sources: Source[];
}

export function Citation({ sources }: CitationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 border-t border-gray-200 pt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
      >
        <span>{sources.length} source{sources.length > 1 ? 's' : ''}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-2">
          {sources.map((source, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-3 text-sm"
            >
              <div className="flex items-start justify-between mb-1">
                <span className="font-medium text-gray-700">
                  Source {index + 1}
                </span>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {source.pageNumber && (
                    <span>Page {source.pageNumber}</span>
                  )}
                  <span>Score: {(source.score * 100).toFixed(1)}%</span>
                </div>
              </div>
              <p className="text-gray-600 mt-1 line-clamp-3">
                {source.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

