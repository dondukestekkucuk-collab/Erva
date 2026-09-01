'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, BookmarkPlus, Check, Copy, HelpCircle, Sparkles, User, Feather } from 'lucide-react';
import { motion } from 'motion/react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface MessageItemProps {
  message: ChatMessage;
  onSaveToNotebook?: (question: string, answer: string) => void;
  lastUserQuestion?: string;
  isSaved?: boolean;
  onAnswerQuestion?: (questionText: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onSaveToNotebook,
  lastUserQuestion = '',
  isSaved = false,
  onAnswerQuestion,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  const isAssistant = message.role === 'assistant';

  // Extract closing question if Atatürk asked one
  const extractClosingQuestion = (text: string): string | null => {
    if (!isAssistant) return null;
    const sentences = text.split(/(?<=[.?!])\s+/);
    // Find last sentence ending with ?
    for (let i = sentences.length - 1; i >= 0; i--) {
      const s = sentences[i].trim();
      if (s.endsWith('?')) {
        return s;
      }
    }
    return null;
  };

  const closingQuestion = extractClosingQuestion(message.content);

  // Web Speech API for Turkish TTS
  const handlePlayTTS = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Tarayıcınız ses sentezini desteklememektedir.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop existing

    // Clean markdown or bracket artifacts
    const cleanText = message.content.replace(/[*_#]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.95; // Dignified, calm pace
    utterance.pitch = 0.95;

    // Try to find a Turkish voice
    const voices = window.speechSynthesis.getVoices();
    const trVoice = voices.find((v) => v.lang.includes('tr') || v.name.toLowerCase().includes('turkish'));
    if (trVoice) {
      utterance.voice = trVoice;
    }

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 sm:gap-4 py-4 px-3 sm:px-5 rounded-2xl transition-all ${
        isAssistant
          ? 'bg-stone-900/90 border border-amber-900/40 text-stone-100 shadow-md shadow-black/40'
          : 'bg-stone-800/80 border border-stone-700/60 text-stone-200 ml-auto max-w-2xl'
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0 pt-0.5">
        {isAssistant ? (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-700 via-red-900 to-stone-900 border-2 border-amber-500/60 flex items-center justify-center shadow-lg relative">
            <span className="text-sm font-bold text-amber-200">MK</span>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 rounded-full flex items-center justify-center text-[8px] text-white border border-stone-900">
              ★
            </div>
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-stone-700 border border-stone-600 flex items-center justify-center text-stone-300">
            <User className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Content Column */}
      <div className="flex-1 space-y-2 min-w-0">
        {/* Header Name & Timestamp */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${isAssistant ? 'text-amber-300 font-display' : 'text-stone-300'}`}>
              {isAssistant ? 'Gazi Mustafa Kemal Paşa' : 'Öğrenci (Siz)'}
            </span>
            {isAssistant && (
              <span className="text-[10px] bg-red-950/80 text-amber-300 px-1.5 py-0.5 rounded border border-red-900/60 font-mono">
                1919-1923
              </span>
            )}
          </div>
          <span className="text-[11px] text-stone-500 font-mono">{message.timestamp}</span>
        </div>

        {/* Message Body */}
        <div
          className={`text-sm leading-relaxed whitespace-pre-wrap ${
            isAssistant
              ? 'font-serif-vintage text-stone-200 text-[15px] space-y-2'
              : 'text-stone-300 font-sans'
          }`}
        >
          {message.content}
        </div>

        {/* Closing Question Box (If present on Atatürk's turn) */}
        {isAssistant && closingQuestion && (
          <div className="mt-3 p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/40 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Paşamızın Size Yönelttiği Soru:</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-200 italic font-medium">
              &quot;{closingQuestion}&quot;
            </p>
            {onAnswerQuestion && (
              <button
                onClick={() => onAnswerQuestion(`Paşam, bu sorunuza istinaden düşüncem şudur: `)}
                className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-600/20 hover:bg-amber-600 text-amber-200 hover:text-stone-950 border border-amber-600/40 transition-all"
              >
                <Feather className="w-3 h-3" />
                <span>Bu Soruya Yanıt Ver</span>
              </button>
            )}
          </div>
        )}

        {/* Action Buttons for Atatürk's message */}
        {isAssistant && (
          <div className="flex items-center gap-2 pt-2 border-t border-stone-800/80 text-xs flex-wrap">
            {/* Audio TTS Button */}
            <button
              onClick={handlePlayTTS}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition border ${
                isPlayingAudio
                  ? 'bg-amber-600 text-stone-950 border-amber-500 font-bold animate-pulse'
                  : 'bg-stone-800/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border-stone-700/60'
              }`}
              title="Atatürk'ün sözlerini sesli dinle"
            >
              {isPlayingAudio ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-amber-400" />}
              <span>{isPlayingAudio ? 'Durdur' : 'Seslendir'}</span>
            </button>

            {/* Save to Notebook */}
            {onSaveToNotebook && (
              <button
                onClick={() => onSaveToNotebook(lastUserQuestion || 'Kurtuluş Savaşı Röportajı', message.content)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition border ${
                  isSaved
                    ? 'bg-red-950/80 text-red-300 border-red-800/60'
                    : 'bg-stone-800/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border-stone-700/60'
                }`}
                title="Not Defterime Ekle"
              >
                {isSaved ? <Check className="w-3 h-3 text-emerald-400" /> : <BookmarkPlus className="w-3 h-3 text-red-400" />}
                <span>{isSaved ? 'Kaydedildi' : 'Not Defterime Ekle'}</span>
              </button>
            )}

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-800/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700/60 transition"
              title="Metni Kopyala"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
