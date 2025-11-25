'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Terminal, Search, Globe } from 'lucide-react';
import SearchModal from '@/components/ui/SearchModal';
import { useLanguage } from '@/context/LanguageContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'zh' : 'en');
    };

    // Keyboard shortcut to open search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left Side: Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative w-8 h-8">
                                <Image
                                    src="/imgs/favicon.ico"
                                    alt="World of Crain Logo"
                                    fill
                                    className="object-contain group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-neon-cyan/20 blur-md rounded-full group-hover:bg-neon-purple/20 transition-colors duration-300 -z-10" />
                            </div>
                            <span className="font-mono font-bold text-lg tracking-wider text-white group-hover:text-neon-cyan transition-colors duration-300">
                                World of Crain
                            </span>
                        </Link>

                        {/* Right Side: Links + Controls + Search */}
                        <div className="flex items-center gap-8">
                            {/* Navigation Links */}
                            <div className="hidden md:flex items-center gap-8">
                                <Link
                                    href="/"
                                    className="font-mono text-sm text-gray-300 hover:text-neon-cyan transition-colors relative group"
                                >
                                    <span className="relative z-10">{t('home')}</span>
                                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-neon-cyan group-hover:w-full transition-all duration-300" />
                                </Link>
                                <Link
                                    href="/timeline"
                                    className="font-mono text-sm text-gray-300 hover:text-neon-cyan transition-colors relative group"
                                >
                                    <span className="relative z-10">{t('timeline')}</span>
                                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-neon-cyan group-hover:w-full transition-all duration-300" />
                                </Link>
                                <Link
                                    href="/about"
                                    className="font-mono text-sm text-gray-300 hover:text-neon-purple transition-colors relative group"
                                >
                                    <span className="relative z-10">{t('about')}</span>
                                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-neon-purple group-hover:w-full transition-all duration-300" />
                                </Link>
                            </div>

                            {/* Controls & Search */}
                            <div className="flex items-center gap-4">
                                {/* Language Switcher */}
                                <button
                                    onClick={toggleLanguage}
                                    className="flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-neon-cyan transition-colors"
                                >
                                    <Globe className="w-4 h-4" />
                                    <span className="hidden sm:inline">{language === 'en' ? 'EN' : '中文'}</span>
                                </button>

                                {/* Theme Toggle */}
                                <ThemeToggle />

                                {/* Search Trigger (Far Right) */}
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-neon-cyan/50 transition-all group ml-2"
                                >
                                    <Search className="w-4 h-4 text-gray-400 group-hover:text-neon-cyan" />
                                    <span className="text-xs font-mono text-gray-500 group-hover:text-gray-300 hidden sm:inline">
                                        Search...
                                    </span>
                                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-gray-500 bg-black/50 rounded border border-gray-800 group-hover:border-gray-600 group-hover:text-gray-400 transition-colors">
                                        Ctrl K
                                    </kbd>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
