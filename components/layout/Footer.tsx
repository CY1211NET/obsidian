'use client';

import { motion } from 'framer-motion';
import { Github, Twitter, Activity } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-neon-cyan/10 bg-black/80 backdrop-blur-sm mt-20">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

                    {/* Brand / Copyright */}
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-mono font-bold text-neon-cyan mb-2">NEXUS_LOG</h3>
                        <p className="text-xs text-gray-500 font-mono">
                            © 2025 SYSTEM_CORE. ALL RIGHTS RESERVED.
                        </p>
                    </div>

                    {/* System Status */}
                    <div className="flex justify-center">
                        <div className="flex items-center gap-3 px-4 py-2 border border-neon-cyan/20 rounded-full bg-neon-cyan/5">
                            <Activity className="w-4 h-4 text-neon-cyan animate-pulse" />
                            <span className="text-xs font-mono text-neon-cyan">SYSTEM STATUS: ONLINE</span>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center md:justify-end gap-6">
                        <SocialLink href="#" icon={<Github className="w-5 h-5" />} label="GITHUB" />
                        <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} label="TWITTER" />
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <motion.a
            href={href}
            whileHover={{ scale: 1.1, color: '#00f3ff' }}
            className="text-gray-500 transition-colors duration-300"
            aria-label={label}
        >
            {icon}
        </motion.a>
    );
}
