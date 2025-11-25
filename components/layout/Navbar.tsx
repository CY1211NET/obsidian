'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Terminal, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function Navbar() {
    const { language, setLanguage, t } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'zh' : 'en');
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 h-16 glass-panel border-b border-neon-cyan/20"
        >
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative">
                        <Terminal className="w-6 h-6 text-neon-cyan group-hover:text-neon-purple transition-colors duration-300" />
                        <div className="absolute inset-0 bg-neon-cyan/20 blur-md rounded-full group-hover:bg-neon-purple/20 transition-colors duration-300" />
                    </div>
                    <span className="font-mono font-bold text-lg tracking-wider text-white group-hover:text-neon-cyan transition-colors duration-300">
                        NEXUS_LOG
                    </span>
                </Link>

                <div className="flex items-center gap-8">
                    <Link href="/" className="text-gray-300 hover:text-neon-cyan transition-colors font-mono text-sm">
                        {t('home')}
                    </Link>
                    <Link href="/about" className="text-gray-300 hover:text-neon-cyan transition-colors font-mono text-sm">
                        {t('about')}
                    </Link>
                    <Link href="/timeline" className="text-gray-300 hover:text-neon-cyan transition-colors font-mono text-sm">
                        {t('timeline')}
                    </Link>

                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-neon-cyan transition-colors"
                    >
                        <Globe className="w-4 h-4" />
                        <span>{language === 'en' ? 'EN' : '中文'}</span>
                    </button>
                    <ThemeToggle />
                </div>
            </div>
        </motion.nav>
    );
}
