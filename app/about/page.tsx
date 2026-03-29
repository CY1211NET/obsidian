'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/lib/config';
import { useLanguage } from '@/context/LanguageContext';
import NeonButton from '@/components/ui/NeonButton';
import { ExternalLink, User, Share2, Users, X } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
    const { t } = useLanguage();
    const [selectedQr, setSelectedQr] = useState<string | null>(null);

    return (
        <div className="min-h-screen pb-20 pt-10">
            <div className="max-w-4xl mx-auto px-4">

                {/* Profile Section */}
                <section className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <User className="w-6 h-6 text-neon-cyan" />
                        <h2 className="text-2xl font-mono font-bold text-white">{t('about.title')}</h2>
                        <div className="h-px flex-grow bg-white/10" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {/* Avatar / Visual */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-square rounded-lg overflow-hidden border border-neon-cyan/30 group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 z-10 group-hover:opacity-0 transition-opacity duration-500" />

                            <Image
                                src={siteConfig.author.avatar}
                                alt={siteConfig.author.name}
                                fill
                                className="object-cover"
                            />

                            {/* Tech overlay */}
                            <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
                                <span className="text-[10px] font-mono text-neon-cyan">ID: {siteConfig.author.name}</span>
                                <span className="text-[10px] font-mono text-gray-400">LOC: {siteConfig.author.location}</span>
                            </div>
                        </motion.div>

                        {/* Bio */}
                        <div className="md:col-span-2">
                            <div className="glass-panel p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                        <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                    </div>
                                </div>

                                <h3 className="text-neon-purple font-mono text-sm mb-4">{t('about.bio')}</h3>
                                <p className="text-gray-300 leading-relaxed mb-6">
                                    {t('language') === '语言' ? (siteConfig.author.bio_zh || siteConfig.author.bio) : siteConfig.author.bio}
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    {siteConfig.socials.map((social) => {
                                        // @ts-ignore - qrCode might not exist on all items
                                        const hasQr = social.qrCode;
                                        // @ts-ignore - tooltip might not exist on all items
                                        const tooltip = social.tooltip;

                                        const tooltipEl = tooltip ? (
                                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded bg-black/90 border border-neon-cyan/30 text-neon-cyan text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 shadow-lg">
                                                {tooltip}
                                            </span>
                                        ) : null;

                                        if (hasQr) {
                                            return (
                                                <div key={social.name} className="relative group">
                                                    {tooltipEl}
                                                    <button
                                                        // @ts-ignore
                                                        onClick={() => setSelectedQr(social.qrCode)}
                                                        className="flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-neon-cyan transition-colors border border-white/10 px-3 py-1.5 rounded hover:border-neon-cyan/50"
                                                    >
                                                        <social.icon className="w-4 h-4" />
                                                        {social.name}
                                                    </button>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={social.name} className="relative group">
                                                {tooltipEl}
                                                <a
                                                    href={social.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-neon-cyan transition-colors border border-white/10 px-3 py-1.5 rounded hover:border-neon-cyan/50"
                                                >
                                                    <social.icon className="w-4 h-4" />
                                                    {social.name}
                                                </a>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Friends Section */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <Users className="w-6 h-6 text-neon-purple" />
                        <h2 className="text-2xl font-mono font-bold text-white">{t('about.friends')}</h2>
                        <div className="h-px flex-grow bg-white/10" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {siteConfig.friends.map((friend, index) => (
                            <motion.a
                                key={friend.name}
                                href={friend.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-panel p-6 group hover:border-neon-purple/50 transition-colors relative overflow-hidden"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative">
                                        <Image src={friend.avatar} alt={friend.name} fill className="object-cover" />
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-neon-purple transition-colors" />
                                </div>

                                <h3 className="font-bold text-white mb-1 group-hover:text-neon-purple transition-colors">{friend.name}</h3>
                                <p className="text-sm text-gray-400 line-clamp-2">{friend.description}</p>

                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-purple scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                            </motion.a>
                        ))}
                    </div>
                </section>

            </div>

            {/* QR Code Modal */}
            <AnimatePresence>
                {selectedQr && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedQr(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-white p-2 rounded-lg max-w-sm w-full aspect-square"
                        >
                            <button
                                onClick={() => setSelectedQr(null)}
                                className="absolute -top-12 right-0 text-white hover:text-neon-cyan transition-colors"
                            >
                                <X className="w-8 h-8" />
                            </button>
                            <div className="relative w-full h-full">
                                <Image
                                    src={selectedQr}
                                    alt="QR Code"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
