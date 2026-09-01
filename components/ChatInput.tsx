'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Sparkles, RotateCcw } from 'lucide-react';
import { useIsClient } from '@/hooks/use-client-storage';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onResetChat: () => void;
  suggestedQuestions: string[];
  currentInputText?: string;
  onInputChange?: (text: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onResetChat,
  suggestedQuestions,
  currentInputText = '',
  onInputChange,
}) => {
  const [isListening, setIsListening] = useState(false);
  const isClient = useIsClient();
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasSpeechRec =
    isClient &&
    typeof window !== 'undefined' &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  // Setup speech recognition instance
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition && !recognitionRef.current) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'tr-TR';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (onInputChange) {
            onInputChange(currentInputText ? `${currentInputText} ${transcript}` : transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [currentInputText, onInputChange]);

  const handleToggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentInputText.trim() || isLoading) return;
    onSendMessage(currentInputText.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-stone-800 bg-stone-950/95 p-3 sm:p-4 backdrop-blur-md">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Suggested Question Chips */}
        {suggestedQuestions && suggestedQuestions.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] font-semibold text-amber-400/90 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Örnek Sorular:</span>
            </span>
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (onInputChange) onInputChange(q);
                  if (textareaRef.current) textareaRef.current.focus();
                }}
                className="shrink-0 px-2.5 py-1 rounded-full bg-stone-900 hover:bg-amber-950/60 text-stone-300 hover:text-amber-200 border border-stone-800 hover:border-amber-700/50 transition text-[11px]"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          {/* Reset / New interview */}
          <button
            type="button"
            onClick={onResetChat}
            className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white border border-stone-800 transition shrink-0"
            title="Röportajı Sıfırla / Baştan Başla"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Text Input Area */}
          <div className="relative flex-1 bg-stone-900/90 border border-stone-800 focus-within:border-amber-500 rounded-xl overflow-hidden transition shadow-inner">
            <textarea
              ref={textareaRef}
              value={currentInputText}
              onChange={(e) => {
                if (onInputChange) onInputChange(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Mustafa Kemal Paşa'ya Kurtuluş Savaşı hakkında bir soru sor veya sorusunu yanıtla..."
              rows={2}
              className="w-full bg-transparent px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-500 outline-none resize-none"
            />

            {/* Mic button inside textarea */}
            {hasSpeechRec && (
              <button
                type="button"
                onClick={handleToggleListening}
                className={`absolute right-2 bottom-2 p-1.5 rounded-lg transition ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                }`}
                title={isListening ? 'Dinleme durduruluyor...' : 'Sesli soru sor (Türkçe)'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!currentInputText.trim() || isLoading}
            className={`p-3 rounded-xl flex items-center justify-center transition shrink-0 font-medium ${
              currentInputText.trim() && !isLoading
                ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-lg shadow-amber-950/50 cursor-pointer'
                : 'bg-stone-800 text-stone-600 cursor-not-allowed'
            }`}
            title="Soruyu Gönder (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
          <span>MEB Tarih Dersi 1919-1923 Müfredatına Uygundur</span>
          <span className="hidden sm:inline">Göndermek için <b>Enter</b>, yeni satır için <b>Shift+Enter</b></span>
        </div>
      </div>
    </div>
  );
};



