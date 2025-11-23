'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Tag, Edit3, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimelinePost {
    slug: string;
    title: string;
    date: string;
    updatedAt?: string;
    category: string;
    tags: string[];
}

interface TimelineProps {
    timeline: { [year: string]: { [month: string]: TimelinePost[] } };
}

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Timeline({ timeline }: TimelineProps) {
    const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set(Object.keys(timeline)));

    const toggleYear = (year: string) => {
        const newExpanded = new Set(expandedYears);
        if (newExpanded.has(year)) {
            newExpanded.delete(year);
        } else {
            newExpanded.add(year);
        }
        setExpandedYears(newExpanded);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 glow-text-cyan font-mono">
                    TIMELINE_LOG
                </h1>
                <p className="text-gray-400 font-mono text-sm">
                    &gt; Chronological archive of all posts
                </p>
            </div>

            <div className="relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-neon-cyan via-neon-purple to-transparent" />

                {Object.keys(timeline).sort((a, b) => parseInt(b) - parseInt(a)).map((year, yearIndex) => (
                    <div key={year} className="mb-12 relative">
                        {/* Year Header */}
                        <button
                            onClick={() => toggleYear(year)}
                            className="flex items-center gap-4 mb-6 group cursor-pointer"
                        >
                            <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.5)]">
                                <span className="text-2xl font-bold text-black font-mono">{year}</span>
                            </div>
                            <div className="flex-1 h-[2px] bg-gradient-to-r from-neon-cyan/50 to-transparent" />
                            <GitBranch className={`w-5 h-5 text-neon-cyan transition-transform ${expandedYears.has(year) ? 'rotate-0' : 'rotate-180'}`} />
                        </button>

                        {/* Months */}
                        {expandedYears.has(year) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="ml-8 space-y-8"
                            >
                                {Object.keys(timeline[year]).sort((a, b) => parseInt(b) - parseInt(a)).map((month) => (
                                    <div key={`${year}-${month}`} className="relative">
                                        {/* Month Header */}
                                        <div className="flex items-center gap-3 mb-4 ml-8">
                                            <div className="w-3 h-3 rounded-full bg-neon-purple shadow-[0_0_10px_rgba(188,19,254,0.8)]" />
                                            <h3 className="text-lg font-mono font-bold text-neon-purple">
                                                {monthNames[parseInt(month) - 1]}
                                            </h3>
                                        </div>

                                        {/* Posts */}
                                        <div className="ml-8 space-y-4">
                                            {timeline[year][month].map((post, postIndex) => (
                                                <motion.div
                                                    key={post.slug}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: postIndex * 0.1 }}
                                                >
                                                    <Link
                                                        href={`/blog/${post.slug}`}
                                                        className="block group"
                                                    >
                                                        <div className="glass-panel p-5 border-l-4 border-neon-cyan/30 hover:border-neon-cyan transition-all duration-300 hover:translate-x-2">
                                                            {/* Post Title */}
                                                            <h4 className="text-lg font-mono font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors">
                                                                {post.title}
                                                            </h4>

                                                            {/* Metadata */}
                                                            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400 mb-3">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {post.date}
                                                                </span>
                                                                {post.updatedAt && post.updatedAt !== post.date && (
                                                                    <span className="flex items-center gap-1 text-neon-purple">
                                                                        <Edit3 className="w-3 h-3" />
                                                                        Updated: {post.updatedAt}
                                                                    </span>
                                                                )}
                                                                <span className="flex items-center gap-1 text-neon-purple">
                                                                    <Tag className="w-3 h-3" />
                                                                    {post.category}
                                                                </span>
                                                            </div>

                                                            {/* Tags */}
                                                            {post.tags.length > 0 && (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {post.tags.map((tag) => (
                                                                        <span
                                                                            key={tag}
                                                                            className="px-2 py-1 text-xs font-mono bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 rounded"
                                                                        >
                                                                            #{tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
