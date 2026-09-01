'use client';

import React, { useState } from 'react';
import { X, Printer, Copy, Check, Download, Award, FileText, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from './MessageItem';

interface HomeworkReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  studentName: string;
  setStudentName: (name: string) => void;
  schoolName: string;
  setSchoolName: (school: string) => void;
  classNameVal: string;
  setClassNameVal: (className: string) => void;
  studentNumber: string;
  setStudentNumber: (num: string) => void;
}

export const HomeworkReportModal: React.FC<HomeworkReportModalProps> = ({
  isOpen,
  onClose,
  messages,
  studentName,
  setStudentName,
  schoolName,
  setSchoolName,
  classNameVal,
  setClassNameVal,
  studentNumber,
  setStudentNumber,
}) => {
  const [copied, setCopied] = useState(false);

  const todayStr = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const generateFullTranscriptText = () => {
    let text = `=================================================================\n`;
    text += `             T.C. MİLLİ EĞİTİM BAKANLIĞI\n`;
    text += `         TARİH DERSİ: "ATATÜRK İLE RÖPORTAJ" ÖDEVİ\n`;
    text += `=================================================================\n\n`;
    text += `Okul          : ${schoolName || 'Belirtilmedi'}\n`;
    text += `Öğrenci Adı   : ${studentName || 'Öğrenci'}\n`;
    text += `Sınıf / No    : ${classNameVal || '-'} / ${studentNumber || '-'}\n`;
    text += `Tarih         : ${todayStr}\n`;
    text += `Dönem         : Kurtuluş Savaşı ve Milli Mücadele (1919-1923)\n\n`;
    text += `-----------------------------------------------------------------\n`;
    text += `                  RÖPORTAJ METNİ VE DİYALOGLAR\n`;
    text += `-----------------------------------------------------------------\n\n`;

    messages.forEach((msg, idx) => {
      if (msg.role === 'user') {
        text += `[ÖĞRENCİ]: ${msg.content}\n\n`;
      } else {
        text += `[GAZİ MUSTAFA KEMAL ATATÜRK]:\n${msg.content}\n\n`;
        text += `-----------------------------------------------------------------\n\n`;
      }
    });

    text += `=================================================================\n`;
    text += `"Egemenlik, kayıtsız şartsız milletindir!"\n`;
    text += `=================================================================\n`;
    return text;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateFullTranscriptText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    const text = generateFullTranscriptText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ataturk_Roportaji_Odevi_${(studentName || 'Ogrenci').replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-xs"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-3xl bg-stone-950 border border-stone-800 rounded-2xl flex flex-col max-h-[90vh] z-10 shadow-2xl overflow-hidden text-stone-100"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-900/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-950/70 border border-amber-800/40 text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-display text-amber-200">
                    Tarih Dersi Ödev Raporu
                  </h2>
                  <p className="text-xs text-stone-400">
                    Öğretmeninize teslim edebileceğiniz tam röportaj dökümü
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

            {/* Content & Inputs */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* Student form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
                <div>
                  <label className="text-[11px] font-semibold text-amber-300 block mb-1">
                    Okul Adı:
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="Örn: Atatürk Anadolu Lisesi"
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs text-stone-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-amber-300 block mb-1">
                    Öğrenci Adı Soyadı:
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Örn: Zeynep Demir"
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs text-stone-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-amber-300 block mb-1">
                    Sınıf / Şube:
                  </label>
                  <input
                    type="text"
                    value={classNameVal}
                    onChange={(e) => setClassNameVal(e.target.value)}
                    placeholder="Örn: 8-A veya 11-B"
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs text-stone-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-amber-300 block mb-1">
                    Okul Numarası:
                  </label>
                  <input
                    type="text"
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    placeholder="Örn: 452"
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs text-stone-100 outline-none"
                  />
                </div>
              </div>

              {/* Printable Document Preview */}
              <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 font-serif-vintage text-xs leading-relaxed space-y-4">
                <div className="text-center pb-3 border-b border-stone-700">
                  <h3 className="font-bold text-sm font-display text-amber-200 uppercase tracking-wide">
                    T.C. MİLLİ EĞİTİM BAKANLIĞI TARİH DERSİ
                  </h3>
                  <h4 className="text-xs font-semibold text-stone-300">
                    &quot;KURTULUŞ SAVAŞI (1919-1923) DÖNEMİ ATATÜRK İLE RÖPORTAJ&quot;
                  </h4>
                  <p className="text-[10px] text-stone-400 mt-1 font-mono">Tarih: {todayStr}</p>
                </div>

                <div className="space-y-3">
                  {messages.map((msg, i) => (
                    <div
                      key={msg.id || i}
                      className={`p-2.5 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-stone-950/80 border-l-2 border-amber-500 font-sans'
                          : 'bg-stone-950/40 text-stone-200'
                      }`}
                    >
                      <span className="font-bold text-[11px] text-amber-300 block mb-1">
                        {msg.role === 'user' ? `[ÖĞRENCİ - ${studentName || 'Talebe'}]:` : '[GAZİ MUSTAFA KEMAL ATATÜRK]:'}
                      </span>
                      <p className="whitespace-pre-line text-xs">{msg.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-stone-800 bg-stone-900/80 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Kopyalandı' : 'Metni Kopyala'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.txt İndir</span>
                </button>
              </div>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 transition shadow-md shadow-amber-950/40"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Raporu Yazdır / PDF</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
