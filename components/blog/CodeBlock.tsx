'use client';

import { useState, useRef, HTMLAttributes } from 'react';
import { Check, Copy, ChevronDown, ChevronRight, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeBlockProps extends HTMLAttributes<HTMLPreElement> {
    children?: React.ReactNode;
    node?: any;
}

export default function CodeBlock({ children, className, ...props }: CodeBlockProps) {
    const [isCopied, setIsCopied] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const preRef = useRef<HTMLPreElement>(null);

    // Extract language from className (e.g., "language-js")
    const language = className?.replace(/language-/, '') || 'text';

    const handleCopy = async () => {
        if (preRef.current) {
            const code = preRef.current.innerText;
            try {
                await navigator.clipboard.writeText(code);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    return (
        <div className="my-8 rounded-lg overflow-hidden border border-white/10 bg-[#1e1e1e] shadow-2xl">
            {/* Header Bar */}
            <div
                className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-white/5 cursor-pointer select-none group"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className="flex items-center gap-4">
                    {/* Mac Buttons */}
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>

                    {/* Language Label */}
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-400 group-hover:text-gray-200 transition-colors">
                        <Terminal className="w-3 h-3" />
                        <span className="uppercase">{language}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Copy Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCopy();
                        }}
                        className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Copy Code"
                    >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    {/* Collapse Icon */}
                    <div className="text-gray-500">
                        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                </div>
            </div>

            {/* Code Content */}
            <AnimatePresence initial={false}>
                {!isCollapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="relative">
                            <pre
                                ref={preRef}
                                className={`!m-0 !p-4 !bg-transparent overflow-x-auto ${className || ''}`}
                                {...props}
                            >
                                {children}
                            </pre>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
