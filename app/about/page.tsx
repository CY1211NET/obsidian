'use client';

import { motion } from 'framer-motion';
import { siteConfig } from '@/lib/config';
import { useLanguage } from '@/context/LanguageContext';
import NeonButton from '@/components/ui/NeonButton';
import { ExternalLink, User, Share2, Users } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
    const { t } = useLanguage();

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
                            {/* Placeholder for avatar if no image provided */}
                            <div className="w-full h-full bg-black flex items-center justify-center">
                                <User className="w-24 h-24 text-gray-700" />
                            </div>
                            {/* <Image src={siteConfig.author.avatar} alt={siteConfig.author.name} fill className="object-cover" /> */}

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
                                    {siteConfig.author.bio}
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    {siteConfig.socials.map((social) => (
                                        <a
                                            key={social.name}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-neon-cyan transition-colors border border-white/10 px-3 py-1.5 rounded hover:border-neon-cyan/50"
                                        >
                                            <social.icon className="w-4 h-4" />
                                            {social.name}
                                        </a>
                                    ))}
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
                                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                        {/* <Image src={friend.avatar} alt={friend.name} width={48} height={48} /> */}
                                        <User className="w-6 h-6 text-gray-600" />
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
        </div>
    );
}
