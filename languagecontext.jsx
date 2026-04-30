import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, RTL_LANGUAGES } from './i18n';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('khedme_lang') || 'en');

  const t = translations[lang] || translations.en;
  const isRTL = RTL_LANGUAGES.includes(lang);

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('khedme_lang', l);
  };

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  return (
    <LanguageContext.Provider value={{ lang, t, isRTL, changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
