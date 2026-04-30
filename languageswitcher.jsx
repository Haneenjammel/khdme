import React from 'react';
import { useLang } from '@/lib/LanguageContext';

const LANGS = [
  { key: 'en', label: 'EN', flag: '🇬🇧' },
  { key: 'ar', label: 'ع',  flag: '🇱🇧' },
  { key: 'fr', label: 'FR', flag: '🇫🇷' },
];

export default function LanguageSwitcher({ className = '' }) {
  const { lang, changeLang } = useLang();

  return (
    <div className={`flex gap-1 ${className}`}>
      {LANGS.map(({ key, label, flag }) => (
        <button
          key={key}
          onClick={() => changeLang(key)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all duration-200 ${
            lang === key
              ? 'bg-white/30 text-white backdrop-blur-sm'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <span>{flag}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
