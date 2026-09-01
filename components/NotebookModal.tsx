'use client';

import React, { useState } from 'react';
import { X, BookOpen, Trash2, Copy, Check, Download, FileText, Sparkles, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface SavedNote {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}

interface NotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedNotes: SavedNote[];
  onRemoveNote: (id: string) => void;
  studentName: string;
  setStudentName: (name: string) => void;
  personalNotes: string;
  setPersonalNotes: (notes: string) => void;
}

export const NotebookModal: React.FC<NotebookModalProps> = ({
  isOpen,
  onClose,
  savedNotes,
  onRemoveNote,
  studentName,
  setStudentName,
  personalNotes,
  setPersonalNotes,
}) => {
  const [copied, setCopied] = useState(false);

  const generateReportText = () => {
    const today = new Date().toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    let report = `=================================================\n`;
    report += `    T.C. MİLLİ EĞİTİM BAKANLIĞI TARİH DERSİ\n`;
    report += `       "ATATÜRK İLE RÖPORTAJ" ÖDEV RAPORU\n`;
    report += `=================================================\n\n`;
    report += `Öğrenci Adı Soyadı : ${studentName || 'Öğrenci'}\n`;
    report += `Röportaj Tarihi    : ${today}\n`;
    report += `Konu               : Kurtuluş Savaşı Dönemi (1919-1923)\n\n`;
    report += `-------------------------------------------------\n`;
    report += `              RÖPORTAJ SORU VE YANITLARI\n`;
    report += `-------------------------------------------------\n\n`;

    if (savedNotes.length === 0) {
      report += `(Henüz not defterine kaydedilmiş röportaj maddesi bulunmamaktadır.)\n\n`;
    } else {
      savedNotes.forEach((note, index) => {
        report += `[SORU ${index + 1}]: ${note.question}\n`;
        report += `[ATATÜRK'ÜN YANITI]:\n${note.answer}\n`;
        report += `-------------------------------------------------\n\n`;
      });
    }

    if (personalNotes.trim()) {
      report += `\nÖĞRENCİ DEĞERLENDİRMESİ VE KAZANIMLARI:\n`;
      report += `${personalNotes}\n\n`;
    }

    report += `=================================================\n`;
    report += `"Milletin istiklalini yine milletin azim ve kararı kurtaracaktır."\n`;
    report += `=================================================\n`;

    return report;
  };

  const handleCopyReport = async () => {
    const text = generateReportText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadReport = () => {
    const text = generateReportText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ataturk_Roportaj_Raporu_${studentName.replace(/\s+/g, '_') || 'Odev'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl bg-stone-950 border border-stone-800 rounded-2xl flex flex-col max-h-[90vh] z-10 shadow-2xl overflow-hidden text-stone-100"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-900/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-red-950/70 border border-red-800/40 text-red-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-display text-amber-200">
                    Röportaj Not Defterim
                  </h2>
                  <p className="text-xs text-stone-400">
                    Kaydedilen Tarihi Sözler & Ödev Raporu
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* Student Metadata Card */}
              <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-3.5 space-y-2">
                <label className="text-xs font-semibold text-amber-300 block">
                  Öğrenci Adı Soyadı (Ödev için):
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Örn: Ahmet Yılmaz"
                  className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-lg px-3 py-1.5 text-sm text-stone-100 outline-none transition"
                />
              </div>

              {/* Saved Notes List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-300 flex items-center gap-1.5">
                    <Quote className="w-4 h-4 text-amber-400" />
                    <span>Kaydedilen Röportaj Yanıtları ({savedNotes.length})</span>
                  </h3>
                  <span className="text-[11px] text-stone-500">
                    Sohbetteki 📌 butonuna tıklayarak ekleyebilirsiniz
                  </span>
                </div>

                {savedNotes.length === 0 ? (
                  <div className="text-center py-8 px-4 bg-stone-900/30 border border-dashed border-stone-800 rounded-xl">
                    <BookOpen className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                    <p className="text-sm text-stone-400 font-medium">Henüz kaydedilmiş bir yanıt yok</p>
                    <p className="text-xs text-stone-500 mt-1">
                      Atatürk&apos;ün yanıtlarının altındaki &quot;Notlarıma Ekle&quot; butonuna basarak buraya ekleyebilirsiniz.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedNotes.map((note, index) => (
                      <div
                        key={note.id}
                        className="bg-stone-900/80 border border-stone-800/90 rounded-xl p-3.5 space-y-2 relative group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/50">
                            Soru #{index + 1}
                          </span>
                          <button
                            onClick={() => onRemoveNote(note.id)}
                            className="text-stone-500 hover:text-red-400 p-1 transition"
                            title="Notu sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-xs font-medium text-stone-300 italic">
                          &quot;{note.question}&quot;
                        </p>

                        <div className="text-xs text-stone-300 font-serif-vintage bg-stone-950/60 p-2.5 rounded-lg border border-stone-800/80 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-line">
                          {note.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Personal Student Reflections */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-amber-300 block">
                  Öğrenci Kişisel Notları ve Kazanımları:
                </label>
                <textarea
                  value={personalNotes}
                  onChange={(e) => setPersonalNotes(e.target.value)}
                  placeholder="Bu röportajdan Kurtuluş Savaşı hakkında öğrendikleriniz, çıkardığınız dersler ve düşünceleriniz..."
                  rows={3}
                  className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-lg p-3 text-xs text-stone-200 outline-none resize-none transition"
                />
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-stone-800 bg-stone-900/80 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-stone-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>MEB Tarih Dersi Ödev Formatında Hazırlanmıştır</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyReport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Kopyalandı!' : 'Raporu Kopyala'}</span>
                </button>

                <button
                  onClick={handleDownloadReport}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 transition shadow-md shadow-amber-950/40"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Raporu .txt İndir</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
