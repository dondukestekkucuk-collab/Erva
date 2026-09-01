'use client';

import React, { useState } from 'react';
import { MILESTONES, TOPIC_CATEGORIES, Milestone } from '@/lib/curriculumData';
import { X, Calendar, MessageSquare, Compass, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TimelineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export const TimelineDrawer: React.FC<TimelineDrawerProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredMilestones = selectedCategory === 'all'
    ? MILESTONES
    : MILESTONES.filter((m) => m.category === selectedCategory);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg bg-stone-950 border-l border-stone-800 h-full flex flex-col z-10 shadow-2xl text-stone-100"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-900/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/40 text-amber-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-display text-amber-200">
                    Kurtuluş Savaşı Kronolojisi
                  </h2>
                  <p className="text-xs text-stone-400">
                    1919 - 1923 Önemli Tarihi Dönüm Noktaları
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

            {/* Category Filter Chips */}
            <div className="p-3 border-b border-stone-800/80 bg-stone-950 flex gap-1.5 overflow-x-auto text-xs no-scrollbar">
              {TOPIC_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-amber-600 text-stone-950 font-semibold'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Timeline List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div className="relative border-l-2 border-amber-800/40 ml-4 space-y-6">
                {filteredMilestones.map((item, index) => (
                  <div key={item.id} className="relative pl-6 group">
                    {/* Node Dot */}
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-stone-900 border-2 border-amber-500 group-hover:bg-amber-500 transition-colors" />

                    <div className="bg-stone-900/80 hover:bg-stone-900 border border-stone-800/90 hover:border-amber-700/50 rounded-xl p-3.5 transition-all shadow-sm">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/40">
                          {item.date}
                        </span>
                        <span className="text-[10px] text-stone-500 uppercase tracking-wider font-mono">
                          {item.category}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-stone-200 group-hover:text-amber-300 transition-colors mb-1">
                        {item.title}
                      </h3>

                      <p className="text-xs text-stone-400 mb-3 leading-relaxed">
                        {item.shortDesc}
                      </p>

                      <button
                        onClick={() => {
                          onSelectPrompt(item.suggestedPrompt);
                          onClose();
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-amber-600/10 hover:bg-amber-600 text-amber-300 hover:text-stone-950 border border-amber-600/30 hover:border-transparent transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Paşamıza Bu Konuyu Sor</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Tip */}
            <div className="p-3.5 bg-stone-900/90 border-t border-stone-800 text-xs text-stone-400 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Bir konuya tıklayarak Atatürk ile doğrudan o hadise üzerine röportaj başlatabilirsiniz.</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
