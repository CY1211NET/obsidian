'use client';

import { motion } from 'framer-motion';

interface NeonButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: 'cyan' | 'purple';
}

export default function NeonButton({ children, onClick, className = "", variant = 'cyan' }: NeonButtonProps) {
    const colorClass = variant === 'cyan' ? 'text-neon-cyan border-neon-cyan' : 'text-neon-purple border-neon-purple';
    const glowClass = variant === 'cyan' ? 'group-hover:shadow-[0_0_20px_rgba(0,243,255,0.5)]' : 'group-hover:shadow-[0_0_20px_rgba(188,19,254,0.5)]';
    const bgClass = variant === 'cyan' ? 'bg-neon-cyan' : 'bg-neon-purple';

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`relative px-6 py-3 font-mono font-bold uppercase tracking-wider border bg-transparent overflow-hidden group transition-all duration-300 ${colorClass} ${glowClass} ${className}`}
        >
            <span className="relative z-10">{children}</span>
            <div className={`absolute inset-0 ${bgClass} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            <div className={`absolute bottom-0 left-0 w-full h-[2px] ${bgClass} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
        </motion.button>
    );
}
