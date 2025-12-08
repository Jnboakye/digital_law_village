import React, { useState, useEffect } from "react";
import { createVapi, Vapi } from "../lib/vapiService";

const VoiceAgentButton: React.FC = () => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_VOICE_AGENT_API_KEY!;
  const assistantId = process.env.NEXT_PUBLIC_VOICE_AGENT_ASSISTANT_ID!;

  useEffect(() => {
    const vapiInstance = createVapi(apiKey, assistantId, {
      onCallStart: () => setIsConnected(true),
      onCallEnd: () => {
        setIsConnected(false);
        setIsSpeaking(false);
      },
      onSpeechStart: () => setIsSpeaking(true),
      onSpeechEnd: () => setIsSpeaking(false),
    });

    setVapi(vapiInstance);

    return () => {
      vapiInstance?.stop();
    };
  }, [apiKey, assistantId]);

  const toggleCall = () => {
    if (!vapi) return;
    if (isConnected) {
      vapi.stop();
    } else {
      vapi.start(assistantId);
    }
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={toggleCall}
        className={`px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 ${
          isConnected
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-amber-600 hover:bg-amber-700 text-white"
        }`}
      >
        {isConnected
          ? isSpeaking
            ? "⚖️ Explaining..."
            : "📚 End Study Session"
          : "⚖️ Ask Digital Law Bot"}
      </button>
    </div>
  );
};

export default VoiceAgentButton;
