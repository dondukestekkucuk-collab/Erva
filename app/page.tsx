'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { MessageItem, ChatMessage } from '@/components/MessageItem';
import { ChatInput } from '@/components/ChatInput';
import { TimelineDrawer } from '@/components/TimelineDrawer';
import { NotebookModal, SavedNote } from '@/components/NotebookModal';
import { HomeworkReportModal } from '@/components/HomeworkReportModal';
import { ATATURK_INITIAL_MESSAGE, INITIAL_SUGGESTIONS, MILESTONES } from '@/lib/curriculumData';
import { Flag, Compass, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

import { useLocalStorage } from '@/hooks/use-client-storage';

const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

const getTimeString = () =>
  new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: ATATURK_INITIAL_MESSAGE,
      timestamp: '09:00',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [savedNotes, setSavedNotes] = useLocalStorage<SavedNote[]>('ataturk_roportaj_notes', []);
  const [studentName, setStudentName] = useLocalStorage<string>('ataturk_roportaj_student', '');
  const [schoolName, setSchoolName] = useLocalStorage<string>('ataturk_roportaj_school', '');
  const [classNameVal, setClassNameVal] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');

  // Fetch logged in user info
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
          if (!studentName) {
            setStudentName(data.user.name);
          }
        }
      })
      .catch((err) => console.error('Failed to get user session:', err));
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    if (window.confirm('Oturumu kapatıp çıkış yapmak istediğinize emin misiniz?')) {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (e) {
        console.error('Logout error:', e);
      }
      window.location.href = '/giris';
    }
  };

  // Modals
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Input helper
  const [currentInputText, setCurrentInputText] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle Send Message
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: createId('user'),
      role: 'user',
      content: text.trim(),
      timestamp: getTimeString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);
    setCurrentInputText('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Yanıt alınamadı');
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: createId('assistant'),
        role: 'assistant',
        content: data.text || 'Milli mücadelemizin ateşi daima kalbimizdedir.',
        timestamp: getTimeString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If TTS enabled, speak automatically
      if (isTtsEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const clean = assistantMsg.content.replace(/[*_#]/g, '');
        const utter = new SpeechSynthesisUtterance(clean);
        utter.lang = 'tr-TR';
        utter.rate = 0.95;
        const voices = window.speechSynthesis.getVoices();
        const tr = voices.find((v) => v.lang.includes('tr'));
        if (tr) utter.voice = tr;
        window.speechSynthesis.speak(utter);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: ChatMessage = {
        id: createId('assistant-err'),
        role: 'assistant',
        content:
          'Sevgili evladım, telgraf hattımızda geçici bir aksaklık oldu. Lütfen sorunu tekrar ilet veya başka bir sual ile devam edelim.',
        timestamp: getTimeString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    if (window.confirm('Röportajı sıfırlayıp baştan başlamak istediğinize emin misiniz?')) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setMessages([
        {
          id: createId('init'),
          role: 'assistant',
          content: ATATURK_INITIAL_MESSAGE,
          timestamp: getTimeString(),
        },
      ]);
    }
  };

  const handleSaveToNotebook = (question: string, answer: string) => {
    if (savedNotes.some((n) => n.answer === answer)) return;

    const newNote: SavedNote = {
      id: createId('note'),
      question: question || 'Kurtuluş Savaşı Röportajı',
      answer,
      timestamp: getTimeString(),
    };

    setSavedNotes((prev) => [newNote, ...prev]);

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveNote = (id: string) => {
    setSavedNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Find the last user question to pair with notes
  const getLastUserQuestion = (currentIndex: number): string => {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        return messages[i].content;
      }
    }
    return 'Giriş Konuşması ve Hoşgeldiniz';
  };

  return (
    <div className="flex flex-col h-screen bg-stone-950 text-stone-100 selection:bg-amber-800 selection:text-white">
      {/* Header Bar */}
      <Header
        onOpenTimeline={() => setIsTimelineOpen(true)}
        onOpenNotebook={() => setIsNotebookOpen(true)}
        savedNotesCount={savedNotes.length}
        isTtsEnabled={isTtsEnabled}
        onToggleTts={() => {
          setIsTtsEnabled(!isTtsEnabled);
          if (isTtsEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
        }}
        onExportReport={() => setIsReportOpen(true)}
        messageCount={messages.length}
        userName={currentUser?.name}
        onLogout={handleLogout}
      />

      {/* Main Conversation Container */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Historical Period Badge & Quote */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 via-red-950/40 to-stone-900 border border-stone-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-300">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-700/40 text-amber-300">
                <Flag className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="font-bold text-amber-200 uppercase tracking-wider text-[11px]">
                  Milli Mücadele Dönemi (1919 - 1923)
                </p>
                <p className="text-stone-400 text-[11px] italic">
                  &quot;Geldikleri gibi giderler!&quot; &bull; &quot;Ya istiklal ya ölüm!&quot;
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTimelineOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 transition flex items-center gap-1.5 font-medium"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Olayları İncele</span>
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          {messages.map((msg, index) => {
            const isSaved = savedNotes.some((n) => n.answer === msg.content);
            const lastQ = getLastUserQuestion(index);

            return (
              <MessageItem
                key={msg.id || index}
                message={msg}
                lastUserQuestion={lastQ}
                isSaved={isSaved}
                onSaveToNotebook={handleSaveToNotebook}
                onAnswerQuestion={(text) => {
                  setCurrentInputText(text);
                }}
              />
            );
          })}

          {/* Quick starter topics cards (Visible only on initial state) */}
          {messages.length === 1 && (
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Röportaja Başlamak İçin Bir Konu Seçebilirsiniz:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {MILESTONES.slice(0, 6).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSendMessage(m.suggestedPrompt)}
                    className="text-left p-3 rounded-xl bg-stone-900/90 hover:bg-amber-950/40 border border-stone-800 hover:border-amber-700/60 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-amber-400 font-semibold mb-1">
                        <span>{m.date}</span>
                        <span className="text-stone-500 font-mono uppercase">{m.category}</span>
                      </div>
                      <h4 className="text-xs font-bold text-stone-200 group-hover:text-amber-300 transition-colors">
                        {m.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                        {m.shortDesc}
                      </p>
                    </div>
                    <span className="mt-2 text-[11px] font-medium text-amber-400/90 group-hover:text-amber-300 flex items-center gap-1">
                      <span>Bu Konuyu Sor &rarr;</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-stone-900/80 border border-amber-900/30 text-stone-300 max-w-md">
              <div className="w-8 h-8 rounded-full bg-amber-700/40 border border-amber-500/40 flex items-center justify-center animate-pulse">
                <span className="text-xs font-bold text-amber-300">MK</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-amber-300 font-display">
                  Gazi Mustafa Kemal Paşa düşünüyor...
                </p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Chat Input Bar */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onResetChat={handleResetChat}
        suggestedQuestions={INITIAL_SUGGESTIONS.slice(0, 4)}
        currentInputText={currentInputText}
        onInputChange={setCurrentInputText}
      />

      {/* Timeline Drawer */}
      <TimelineDrawer
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        onSelectPrompt={(prompt) => {
          handleSendMessage(prompt);
        }}
      />

      {/* Notebook Modal */}
      <NotebookModal
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        savedNotes={savedNotes}
        onRemoveNote={handleRemoveNote}
        studentName={studentName}
        setStudentName={setStudentName}
        personalNotes={personalNotes}
        setPersonalNotes={setPersonalNotes}
      />

      {/* Full Homework Transcript Modal */}
      <HomeworkReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        messages={messages}
        studentName={studentName}
        setStudentName={setStudentName}
        schoolName={schoolName}
        setSchoolName={setSchoolName}
        classNameVal={classNameVal}
        setClassNameVal={setClassNameVal}
        studentNumber={studentNumber}
        setStudentNumber={setStudentNumber}
      />
    </div>
  );
}
