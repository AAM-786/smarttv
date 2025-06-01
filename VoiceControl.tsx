import { useState, useRef } from "react";

interface VoiceControlProps {
  onCommand: (command: string) => void;
}

export function VoiceControl({ onCommand }: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      onCommand(command);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsSupported(true);
  };

  return (
    <button
      className={`tv-focus p-4 rounded-xl font-semibold transition-all duration-300 ${
        isListening 
          ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
          : 'bg-card hover:bg-muted'
      }`}
      onClick={startVoiceRecognition}
      disabled={!isSupported && isSupported !== undefined}
      tabIndex={0}
    >
      <i className={`fas fa-microphone text-xl ${isListening ? 'text-white' : 'text-primary'}`}></i>
    </button>
  );
}
