import { useState, useCallback, useRef } from 'react';

export function useVoice() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const transcriptRef = useRef<string>('');

  const startRecording = useCallback(async () => {
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Microphone access is not supported in this browser. Please use a modern browser.');
    }

    try {
      console.log('Requesting microphone access...');
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      streamRef.current = stream;
      console.log('Microphone access granted');

      // Get Deepgram token
      setIsTranscribing(true);
      const tokenResponse = await fetch('/api/voice/deepgram-token');
      
      if (!tokenResponse.ok) {
        throw new Error('Failed to get Deepgram token');
      }
      
      const { token } = await tokenResponse.json();
      
      if (!token) {
        throw new Error('No Deepgram token received');
      }

      // Create WebSocket connection to Deepgram
      // Deepgram WebSocket uses API key as query parameter
      const socket = new WebSocket(
        `wss://api.deepgram.com/v1/listen?model=nova-2&language=en&smart_format=true&punctuate=true&encoding=linear16&sample_rate=16000&token=${encodeURIComponent(token)}`
      );

      socketRef.current = socket;
      transcriptRef.current = '';

      // Set up WebSocket event handlers
      socket.onopen = () => {
        console.log('Deepgram WebSocket connected');
        setIsTranscribing(false);
        setIsRecording(true);
      };

      socket.onerror = (error) => {
        console.error('Deepgram WebSocket error:', error);
        setIsTranscribing(false);
        setIsRecording(false);
        throw new Error('Failed to connect to Deepgram');
      };

      socket.onclose = () => {
        console.log('Deepgram WebSocket closed');
        setIsRecording(false);
        setIsTranscribing(false);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.channel?.alternatives?.[0]?.transcript) {
            const transcript = data.channel.alternatives[0].transcript;
            
            if (data.is_final) {
              // Final transcript - append to full transcript
              transcriptRef.current += (transcriptRef.current ? ' ' : '') + transcript;
            }
            // We'll handle interim results if needed
          }
        } catch (error) {
          console.error('Error parsing Deepgram message:', error);
        }
      };

      // Set up audio processing
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      
      // Use ScriptProcessorNode for audio processing (works in all browsers)
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (event) => {
        if (socket.readyState === WebSocket.OPEN) {
          const inputData = event.inputBuffer.getChannelData(0);
          
          // Convert Float32Array to Int16Array for Deepgram
          const int16Data = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            // Clamp and convert to 16-bit PCM
            const s = Math.max(-1, Math.min(1, inputData[i]));
            int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          }
          
          // Send audio data to Deepgram
          socket.send(int16Data.buffer);
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

    } catch (error) {
      // Clean up on error
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      console.error('Error starting recording:', error);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          throw new Error('Microphone permission denied. Please allow microphone access in your browser settings and try again.');
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          throw new Error('No microphone found. Please connect a microphone and try again.');
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          throw new Error('Microphone is being used by another application. Please close other apps using the microphone and try again.');
        }
      }
      
      throw new Error(`Failed to start recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);

  const stopRecording = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current || !isRecording) {
        reject(new Error('No active recording'));
        return;
      }

      const socket = socketRef.current;
      const transcript = transcriptRef.current;

      // Close WebSocket connection
      socket.onclose = () => {
        console.log('Recording stopped, final transcript:', transcript);
        
        // Clean up audio
        if (processorRef.current) {
          processorRef.current.disconnect();
          processorRef.current = null;
        }
        
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => {
            track.stop();
            streamRef.current?.removeTrack(track);
          });
          streamRef.current = null;
        }

        setIsRecording(false);
        
        if (transcript.trim()) {
          resolve(transcript.trim());
        } else {
          reject(new Error('No speech detected'));
        }
      };

      // Send close message to Deepgram
      socket.send(JSON.stringify({ type: 'CloseStream' }));
      socket.close();
    });
  }, [isRecording]);

  const transcribe = useCallback(async (text: string): Promise<string> => {
    // For Deepgram real-time, transcription happens during recording
    // This function is kept for compatibility but just returns the text
    return text;
  }, []);

  // Cleanup function to stop recording and release resources
  const cleanup = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        streamRef.current?.removeTrack(track);
      });
      streamRef.current = null;
    }

    transcriptRef.current = '';
    setIsRecording(false);
    setIsTranscribing(false);
  }, []);

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    transcribe,
    cleanup,
  };
}
