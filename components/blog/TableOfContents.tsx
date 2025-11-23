'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, List, Maximize2, Minimize2 } from 'lucide-react';

interface TableOfContentsProps {
    headings: { id: string; text: string; level: number }[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');
    const [expandAll, setExpandAll] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '0px 0px -80% 0px' }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    // Helper to determine if a heading should be visible
    const isVisible = (index: number) => {
        if (expandAll) return true;

        const current = headings[index];
        if (current.level === 2) return true; // Always show H2

        // For H3, show if it's active or if its parent H2 is active/contains active
        // Find parent H2
        let parentH2Id = '';
        for (let i = index - 1; i >= 0; i--) {
            if (headings[i].level === 2) {
                parentH2Id = headings[i].id;
                break;
            }
        }

        // Find currently active H2 (or H2 parent of active H3)
        let activeParentH2Id = '';
        const activeIndex = headings.findIndex(h => h.id === activeId);
        if (activeIndex !== -1) {
            if (headings[activeIndex].level === 2) {
                activeParentH2Id = headings[activeIndex].id;
            } else {
                for (let i = activeIndex - 1; i >= 0; i--) {
                    if (headings[i].level === 2) {
                        activeParentH2Id = headings[i].id;
                        break;
                    }
                }
            }
        }

        return parentH2Id === activeParentH2Id;
    };

    return (
        <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto hidden lg:flex flex-col w-72 p-5 glass-panel border-l-2 border-neon-cyan/20 bg-black/40 backdrop-blur-md rounded-r-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-neon-cyan">
                    <List className="w-4 h-4" />
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider">
                        Index_Log
                    </h3>
                </div>
                <button
                    onClick={() => setExpandAll(!expandAll)}
                    className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    title={expandAll ? "Collapse All" : "Expand All"}
                >
                    {expandAll ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
            </div>

            <ul className="space-y-1 relative">
                {/* Vertical Guide Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-white/10 z-0" />

                <AnimatePresence initial={false}>
                    {headings.map((heading, index) => {
                        const visible = isVisible(index);
                        if (!visible) return null;

                        return (
                            <motion.li
                                key={heading.id}
                                initial={{ opacity: 0, height: 0, x: -10 }}
                                animate={{ opacity: 1, height: 'auto', x: 0 }}
                                exit={{ opacity: 0, height: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="relative z-10"
                            >
                                {/* Tree Connector for H3 */}
                                {heading.level === 3 && (
                                    <div className="absolute left-[11px] top-1/2 w-4 h-[1px] bg-white/10 -translate-y-1/2 z-[-1]" />
                                )}

                                <a
                                    href={`#${heading.id}`}
                                    className={`group flex items-center gap-3 py-1.5 pr-2 text-xs font-mono transition-all duration-300 border-l-2 ml-[${heading.level === 3 ? '24px' : '0'}] ${activeId === heading.id
                                            ? 'border-neon-purple text-white bg-neon-purple/5 pl-3'
                                            : 'border-transparent text-gray-500 hover:text-gray-300 hover:pl-1'
                                        }`}
                                    style={{ marginLeft: heading.level === 3 ? '1.5rem' : '0' }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById(heading.id)?.scrollIntoView({
                                            behavior: 'smooth',
                                        });
                                        setActiveId(heading.id);
                                    }}
                                >
                                    {/* Level Indicator */}
                                    <span className={`w-1.5 h-1.5 rounded-full transition-colors shrink-0 ${activeId === heading.id
                                            ? 'bg-neon-purple shadow-[0_0_8px_var(--neon-purple)]'
                                            : heading.level === 2 ? 'bg-gray-600' : 'bg-gray-700'
                                        }`} />

                                    <span className={`truncate ${heading.level === 2 ? 'font-bold' : 'font-normal opacity-80'
                                        }`}>
                                        {heading.text}
                                    </span>
                                </a>
                            </motion.li>
                        );
                    })}
                </AnimatePresence>
            </ul>
        </nav>
    );
}
