'use client';

import { motion } from 'framer-motion';
import GlitchText from './GlitchText';
import NeonButton from './NeonButton';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero() {
    const { t } = useLanguage();

    return (
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-cyan/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 text-center max-w-4xl px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-neon-cyan font-mono text-sm tracking-[0.5em] mb-4">SYSTEM_ONLINE</h2>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        <GlitchText text={t('hero.welcome')} /> <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple glow-text-cyan">
                            {t('hero.void')}
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        {t('hero.description')}
                    </p>


                </motion.div>
            </div>

            {/* Decorative Lines */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
            <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-neon-purple/20 to-transparent" />
            <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-neon-cyan/20 to-transparent" />
        </section>
    );
}
