'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, Calendar, Tag } from 'lucide-react';

interface SearchPost {
    slug: string;
    title: string;
    date: string;
    category: string;
    tags: string[];
    excerpt?: string;
    content: string;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [posts, setPosts] = useState<SearchPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    useEffect(() => {
        if (isOpen && !hasFetched) {
            setIsLoading(true);
            const basePath = process.env.NODE_ENV === 'production' ? '/obsidian' : '';
            fetch(`${basePath}/search.json`)
                .then(res => res.json())
                .then(data => {
                    setPosts(data);
                    setHasFetched(true);
                })
                .catch(err => console.error('Failed to fetch posts:', err))
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, hasFetched]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            const input = document.getElementById('global-search-input');
            if (input) input.focus();
        }
    }, [isOpen]);

    // Helper function to get highlighted snippet (reused logic)
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

    const filteredResults = useMemo(() => {
        if (!query) return [];
        const lowerQuery = query.toLowerCase();
        return posts.filter(post =>
            post.title.toLowerCase().includes(lowerQuery) ||
            post.content.toLowerCase().includes(lowerQuery) ||
            post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
            post.category.toLowerCase().includes(lowerQuery)
        ).slice(0, 10); // Limit results for performance
    }, [posts, query]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="fixed left-1/2 top-[10%] -translate-x-1/2 w-full max-w-2xl bg-[#0a0a0a] border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh]"
                    >
                        {/* Header / Input */}
                        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
                            <Search className="w-5 h-5 text-gray-500" />
                            <input
                                id="global-search-input"
                                type="text"
                                placeholder="Search posts, tags, content..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1 bg-transparent text-white placeholder-gray-600 focus:outline-none font-mono text-lg"
                            />
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-gray-800 rounded transition-colors text-gray-500 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Results */}
                        <div className="overflow-y-auto p-2">
                            {isLoading ? (
                                <div className="flex justify-center py-8 text-neon-cyan">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                </div>
                            ) : query === '' ? (
                                <div className="text-center py-12 text-gray-500 font-mono text-sm">
                                    Type to start searching...
                                </div>
                            ) : filteredResults.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 font-mono text-sm">
                                    No results found for "{query}"
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredResults.map((post) => (
                                        <Link
                                            key={post.slug}
                                            href={`/blog/${post.slug}`}
                                            onClick={onClose}
                                            className="block p-4 rounded-lg hover:bg-white/5 border border-transparent hover:border-neon-cyan/30 transition-all group"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-white font-mono font-bold group-hover:text-neon-cyan transition-colors">
                                                    {post.title}
                                                </h3>
                                                <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {post.date}
                                                </span>
                                            </div>

                                            {/* Snippet */}
                                            <div className="text-sm text-gray-400 font-mono line-clamp-2 mb-2">
                                                {getHighlightSnippet(post.content, query) || getHighlightSnippet(post.title, query) || post.excerpt}
                                            </div>

                                            <div className="flex gap-2">
                                                <span className="text-xs px-2 py-0.5 rounded bg-neon-purple/10 text-neon-purple border border-neon-purple/20 font-mono">
                                                    {post.category}
                                                </span>
                                                {post.tags.slice(0, 3).map(tag => (
                                                    <span key={tag} className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 font-mono flex items-center gap-1">
                                                        <Tag className="w-3 h-3" />
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-gray-800 bg-black/20 text-xs text-gray-500 font-mono flex justify-between items-center">
                            <span>
                                <kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">↑↓</kbd> to navigate
                            </span>
                            <span>
                                <kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">ESC</kbd> to close
                            </span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
