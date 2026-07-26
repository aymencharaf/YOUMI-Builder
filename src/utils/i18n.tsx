import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, Language } from '../constants/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const getInitialLanguage = (): Language => {
  const saved = localStorage.getItem('youmi_language');
  if (saved === 'ar' || saved === 'en') {
    return saved;
  }
  
  // OS Language Detection on first launch
  const osLang = navigator.language || (navigator as any).userLanguage || '';
  if (osLang.toLowerCase().startsWith('ar')) {
    return 'ar';
  }
  return 'en'; // default to English
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('youmi_language', lang);
  };

  // Support RTL/LTR layouts automatically
  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const item = TRANSLATIONS[key];
    if (!item) {
      // Fallback to key itself if not found
      return key;
    }
    return item[language] || item['en'] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <React.Fragment>
      <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
        {children}
      </LanguageContext.Provider>
    </React.Fragment>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
