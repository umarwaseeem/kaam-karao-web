import { createContext, useContext, useEffect, useState } from 'react';
import { storage, KEYS } from '../lib/storage.js';
import { translations } from '../i18n/translations.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => storage.get(KEYS.LANGUAGE) ?? 'en');

  useEffect(() => {
    const html = document.documentElement;
    if (lang === 'ur') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ur');
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', lang === 'ur-RO' ? 'ur' : 'en');
    }
  }, [lang]);

  const setLanguage = (code) => {
    storage.set(KEYS.LANGUAGE, code);
    setLangState(code);
  };

  const t = (key, fallback) => {
    const dict = translations[lang] ?? translations['en'];
    return dict?.[key] ?? translations['en']?.[key] ?? fallback ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
