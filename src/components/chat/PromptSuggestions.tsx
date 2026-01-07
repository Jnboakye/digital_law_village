'use client';

interface PromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

const SUGGESTED_PROMPTS = [
  'What is evidence?',
  'Explain contract law in Ghana',
  'What are property rights?',
  'What is the constitution of Ghana?',
  'Explain criminal law in Ghana',
  'What are human rights?',
  'Explain tort law',
  'What is family law?',
];

export function PromptSuggestions({ onSelectPrompt, disabled }: PromptSuggestionsProps) {
  return (
    <div className="px-4 py-3 bg-white border-t border-gray-200">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs text-gray-500 mb-2 font-medium">Suggested questions:</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((prompt, index) => (
            <button
              key={index}
              onClick={() => onSelectPrompt(prompt)}
              disabled={disabled}
              className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 active:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-blue-200 hover:border-blue-300"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

