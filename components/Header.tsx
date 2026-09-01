'use client';

import React from 'react';
import { BookOpen, Calendar, Download, Volume2, VolumeX, Sparkles, LogOut, User } from 'lucide-react';

interface HeaderProps {
  onOpenTimeline: () => void;
  onOpenNotebook: () => void;
  savedNotesCount: number;
  isTtsEnabled: boolean;
  onToggleTts: () => void;
  onExportReport: () => void;
  messageCount: number;
  userName?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTimeline,
  onOpenNotebook,
  savedNotesCount,
  isTtsEnabled,
  onToggleTts,
  onExportReport,
  messageCount,
  userName,
  onLogout,
}) => {
  return (
    <header className="border-b border-stone-800 bg-stone-950/90 backdrop-blur-md sticky top-0 z-30 px-4 py-3 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-amber-700 via-red-800 to-stone-900 border border-amber-500/40 shadow-lg shadow-red-950/50">
            <span className="text-xl" role="img" aria-label="Hilal ve Yıldız">
              🇹🇷
            </span>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-stone-900">
              1919
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-stone-100 font-display flex items-center gap-2">
                Atatürk ile Röportaj
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] bg-red-950/80 text-amber-300 font-medium px-2 py-0.5 rounded border border-red-800/60">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Kurtuluş Savaşı (1919-1923)
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Tarih Dersi İnteraktif Öğrenme & Tarihsel Söyleşi
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Audio TTS Toggle */}
          <button
            id="tts-toggle-btn"
            onClick={onToggleTts}
            title={isTtsEnabled ? "Sesli Okuma Açık (Kapatmak için tıklayın)" : "Sesli Okuma Kapalı (Açmak için tıklayın)"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              isTtsEnabled
                ? 'bg-amber-950/60 border-amber-600/60 text-amber-300 shadow-sm shadow-amber-900/30'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            {isTtsEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isTtsEnabled ? 'Sesli Yanıt: Açık' : 'Ses: Kapalı'}</span>
          </button>

          {/* Timeline / Kronoloji */}
          <button
            id="timeline-drawer-btn"
            onClick={onOpenTimeline}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-all shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Zaman Çizelgesi</span>
          </button>

          {/* Notebook / Notlarım */}
          <button
            id="notebook-modal-btn"
            onClick={onOpenNotebook}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-all shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-red-400" />
            <span>Not Defterim</span>
            {savedNotesCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-amber-600 text-stone-950 rounded-full">
                {savedNotesCount}
              </span>
            )}
          </button>

          {/* Export Report / Ödev Çıktısı */}
          {messageCount > 1 && (
            <button
              id="export-report-btn"
              onClick={onExportReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold transition-all shadow-md shadow-amber-950/40"
              title="Röportajı ödev raporu olarak indir veya yazdır"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ödev Raporu Al</span>
            </button>
          )}

          {/* User info & Logout */}
          {userName && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-amber-300 font-medium">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="max-w-[120px] truncate">{userName}</span>
            </div>
          )}

          {onLogout && (
            <button
              id="logout-btn"
              onClick={onLogout}
              title="Oturumu Kapat / Çıkış Yap"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-950/50 hover:bg-red-900/60 text-red-300 hover:text-red-200 border border-red-800/50 transition-all shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Çıkış Yap</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
