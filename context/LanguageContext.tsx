'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

type Translations = {
    [key in Language]: { [key: string]: string };
};

const translations: Translations = {
    en: {
        home: 'Home',
        about: 'About',
        timeline: 'Timeline',
        language: 'Language',
    },
    zh: {
        home: '首页',
        about: '关于',
        timeline: '时间线',
        language: '语言',
    },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    // Optional: Persist language preference
    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang) {
            setLanguage(savedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key: string) => {
        return translations[language][key as keyof typeof translations['en']] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
