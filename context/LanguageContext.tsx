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
        'about.title': 'PROFILE_LOG',
        'about.bio': 'BIO_DATA',
        'about.friends': "Friend's Portal",
        'hero.welcome': 'WELCOME TO THE',
        'hero.void': 'VOID',
        'hero.description': 'Exploring the boundaries of technology, design, and the digital consciousness. A collection of thoughts from the edge of the network.',
        'hero.init': 'Initialize Sequence',
        'hero.access': 'Access Archives',
    },
    zh: {
        home: '首页',
        about: '关于',
        timeline: '时间线',
        language: '语言',
        'about.title': '个人档案',
        'about.bio': '生物数据',
        'about.friends': "朋友的传送门",
        'hero.welcome': '欢迎来到',
        'hero.void': '虚空',
        'hero.description': '探索技术、设计和数字意识的边界。来自网络边缘的思想集合。',
        'hero.init': '初始化序列',
        'hero.access': '访问归档',
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
