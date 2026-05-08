import React from 'react';
import type { Language } from '@/data/mockData';

const LANG_STYLES: Record<Language, string> = {
  'Rust': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  'C++': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Go': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
};

export default function LanguageBadge({ language }: { language: Language }) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider border font-mono-data ${LANG_STYLES[language]}`}
    >
      {language}
    </span>
  );
}