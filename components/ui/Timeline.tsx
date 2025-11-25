'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Tag, Edit3, GitBranch, Filter, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimelinePost {
    slug: string;
    title: string;
    date: string;
    updatedAt?: string;
    category: string;
    tags: string[];
    excerpt?: string;
    content: string;
}

interface TimelineProps {
    posts: TimelinePost[];
    tags: string[];
}

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Timeline({ posts, tags }: TimelineProps) {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = new Set(posts.map(post => post.category));
        return Array.from(cats).sort();
    }, [posts]);

    // Helper function to get highlighted snippet
    const getHighlightSnippet = (content: string, query: string) => {
        if (!query) return null;
        const lowerContent = content.toLowerCase();
        const lowerQuery = query.toLowerCase();
        const index = lowerContent.indexOf(lowerQuery);

        if (index === -1) return null;

        const start = Math.max(0, index - 60);
        const end = Math.min(content.length, index + query.length + 60);
        let snippet = content.slice(start, end);

        if (start > 0) snippet = '...' + snippet;
        if (end < content.length) snippet = snippet + '...';

        // Highlight the query
        const parts = snippet.split(new RegExp(`(${query})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === lowerQuery ? (
                        <span key={i} className="text-neon-cyan bg-neon-cyan/10 font-bold px-1 rounded">
                            {part}
                        </span>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    };

    // Filter posts based on selected tag, category, and search query
    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
            const matchesCategory = selectedCategory ? post.category === selectedCategory : true;

            const query = searchQuery.toLowerCase();
            const matchesSearch = searchQuery ? (
                post.title.toLowerCase().includes(query) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
                post.tags.some(tag => tag.toLowerCase().includes(query)) ||
                post.category.toLowerCase().includes(query) ||
                post.content.toLowerCase().includes(query)
            ) : true;

            return matchesTag && matchesCategory && matchesSearch;
        });
    }, [posts, selectedTag, selectedCategory, searchQuery]);

    // Group posts by year and month
    const timeline = useMemo(() => {
        const grouped: { [year: string]: { [month: string]: TimelinePost[] } } = {};

        filteredPosts.forEach((post) => {
            const date = new Date(post.date);
            const year = date.getFullYear().toString();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');

            if (!grouped[year]) {
                grouped[year] = {};
            }
            if (!grouped[year][month]) {
                grouped[year][month] = [];
            }
            grouped[year][month].push(post);
        });
        return grouped;
    }, [filteredPosts]);

    // Auto-expand all years when filter changes or initial load
    useEffect(() => {
        setExpandedYears(new Set(Object.keys(timeline)));
    }, [timeline]);

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
                <p className="text-gray-400 font-mono text-sm mb-8">
                    &gt; Chronological archive of all posts
                </p>

                {/* Filters Container */}
                <div className="flex flex-col gap-6 max-w-2xl mx-auto">

                    {/* Search Input */}
                    <div className="relative w-full max-w-md mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="SEARCH_ARCHIVES..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-black/50 border border-gray-700 rounded-full text-sm font-mono text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors placeholder-gray-600"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-2">
                        <div className="flex items-center gap-2 text-neon-purple font-mono text-sm mr-2">
                            <Filter className="w-4 h-4" />
                            <span>CATEGORY:</span>
                        </div>

                        {selectedCategory && (
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="flex items-center gap-1 px-3 py-1 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/50 hover:bg-neon-purple/30 transition-colors text-xs font-mono"
                            >
                                <X className="w-3 h-3" />
                                CLEAR
                            </button>
                        )}

                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                                className={`px-3 py-1 rounded-full border text-xs font-mono transition-all duration-300 ${selectedCategory === category
                                    ? 'bg-neon-purple/20 text-neon-purple border-neon-purple shadow-[0_0_10px_rgba(188,19,254,0.3)]'
                                    : 'bg-transparent text-gray-500 border-gray-700 hover:border-neon-purple/50 hover:text-neon-purple'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Tag Filter */}
                    <div className="flex flex-wrap justify-center gap-2">
                        <div className="flex items-center gap-2 text-neon-cyan font-mono text-sm mr-2">
                            <Tag className="w-4 h-4" />
                            <span>TAGS:</span>
                        </div>

                        {selectedTag && (
                            <button
                                onClick={() => setSelectedTag(null)}
                                className="flex items-center gap-1 px-3 py-1 rounded-full bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 hover:bg-neon-cyan/30 transition-colors text-xs font-mono"
                            >
                                <X className="w-3 h-3" />
                                CLEAR
                            </button>
                        )}

                        {tags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                className={`px-3 py-1 rounded-full border text-xs font-mono transition-all duration-300 ${selectedTag === tag
                                    ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                                    : 'bg-transparent text-gray-500 border-gray-700 hover:border-neon-cyan/50 hover:text-neon-cyan'
                                    }`}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-neon-cyan via-neon-purple to-transparent" />

                <AnimatePresence mode="wait">
                    {Object.keys(timeline).length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-20 ml-8"
                        >
                            <p className="text-gray-500 font-mono">NO_DATA_FOUND_IN_ARCHIVES</p>
                        </motion.div>
                    ) : (
                        Object.keys(timeline).sort((a, b) => parseInt(b) - parseInt(a)).map((year) => (
                            <motion.div
                                key={year}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mb-12 relative"
                            >
                                {/* Year Header */}
                                <button
                                    onClick={() => toggleYear(year)}
                                    className="flex items-center gap-4 mb-6 group cursor-pointer w-full"
                                >
                                    <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.5)] shrink-0">
                                        <span className="text-2xl font-bold text-black font-mono">{year}</span>
                                    </div>
                                    <div className="flex-1 h-[2px] bg-gradient-to-r from-neon-cyan/50 to-transparent" />
                                    <GitBranch className={`w-5 h-5 text-neon-cyan transition-transform ${expandedYears.has(year) ? 'rotate-0' : 'rotate-180'}`} />
                                </button>

                                {/* Months */}
                                <AnimatePresence>
                                    {expandedYears.has(year) && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="ml-8 space-y-8 overflow-hidden"
                                        >
                                            {Object.keys(timeline[year]).sort((a, b) => parseInt(b) - parseInt(a)).map((month) => (
                                                <div key={`${year}-${month}`} className="relative pt-4">
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

                                                                        {/* Search Snippet */}
                                                                        {searchQuery && (
                                                                            <div className="text-sm text-gray-400 mb-3 font-mono bg-black/30 p-2 rounded border border-gray-800">
                                                                                {getHighlightSnippet(post.content, searchQuery) || getHighlightSnippet(post.title, searchQuery) || post.excerpt}
                                                                            </div>
                                                                        )}

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
                                                                                        className={`px-2 py-1 text-xs font-mono border rounded ${selectedTag === tag
                                                                                            ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan'
                                                                                            : 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20'
                                                                                            }`}
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
                                </AnimatePresence>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
