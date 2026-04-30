import React from 'react';
import { useLang } from '@/lib/LanguageContext';

const LANGS = [
  { key: 'en', label: 'English', flag: '🇬🇧' },
  { key: 'ar', label: 'العربية', flag: '🇱🇧' },
  { key: 'fr', label: 'Français', flag: '🇫🇷' },
];

export default function ProfileLanguageSwitcher() {
  const { lang, changeLang } = useLang();

  return (
    <div className="flex flex-col gap-2">
      {LANGS.map(({ key, label, flag }) => (
        <button
          key={key}
          onClick={() => changeLang(key)}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
            lang === key
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-foreground border-border hover:border-primary/50'
          }`}
        >
          <span className="text-lg">{flag}</span>
          <span>{label}</span>
          {lang === key && <span className="ml-auto text-xs opacity-70">✓</span>}
        </button>
      ))}
    </div>
  );
}
