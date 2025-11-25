'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogCard from './BlogCard';
import { PostData } from '@/lib/posts';
import { Tag, Filter, LayoutGrid, List, Calendar, Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

interface BlogListProps {
    posts: PostData[];
    allTags: string[];
}

export default function BlogList({ posts, allTags }: BlogListProps) {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { t } = useLanguage();

    const filteredPosts = selectedTag
        ? posts.filter((post) => post.tags.includes(selectedTag))
        : posts;

    return (
        <div>
            {/* Filter and View Toggle Header */}
            <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                {/* Tag Filter */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4 text-neon-cyan font-mono text-sm">
                        <Filter className="w-4 h-4" />
                        <span>FILTER_SYSTEM</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setSelectedTag(null)}
                            className={`px-4 py-2 rounded border font-mono text-xs transition-all duration-300 ${selectedTag === null
                                ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                                : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300'
                                }`}
                        >
                            ALL_LOGS
                        </button>
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                className={`px-4 py-2 rounded border font-mono text-xs transition-all duration-300 ${selectedTag === tag
                                    ? 'border-neon-purple bg-neon-purple/10 text-neon-purple shadow-[0_0_10px_rgba(188,19,254,0.3)]'
                                    : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-2 bg-glass-bg border border-glass-border rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded transition-all duration-300 ${viewMode === 'grid'
                            ? 'bg-neon-cyan/20 text-neon-cyan'
                            : 'text-gray-500 hover:text-gray-300'
                            }`}
                        title="Grid View"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded transition-all duration-300 ${viewMode === 'list'
                            ? 'bg-neon-cyan/20 text-neon-cyan'
                            : 'text-gray-500 hover:text-gray-300'
                            }`}
                        title="List View"
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Posts Grid/List */}
            <motion.div
                layout
                className={viewMode === 'grid'
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    : "space-y-6"
                }
            >
                <AnimatePresence mode='popLayout'>
                    {filteredPosts.map((post, index) => (
                        <motion.div
                            key={post.slug}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            {viewMode === 'grid' ? (
                                <BlogCard post={post} index={index} />
                            ) : (
                                /* List View Card */
                                <Link href={`/blog/${post.slug}`} className="block group">
                                    <div className="glass-panel p-6 border-l-4 border-l-transparent hover:border-l-neon-cyan transition-all duration-300 hover:translate-x-2 flex flex-col md:flex-row gap-6 items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 text-xs font-mono text-gray-500 mb-2">
                                                <span className="text-neon-purple">#{index < 9 ? `0${index + 1}` : index + 1}</span>
                                                <span>//</span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {post.date}
                                                </span>
                                                <span>//</span>
                                                <span className="flex items-center gap-1 text-neon-cyan">
                                                    <Tag className="w-3 h-3" />
                                                    {post.category}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-neon-cyan transition-colors font-mono">
                                                {post.title}
                                            </h3>

                                            <p className="text-gray-400 text-sm line-clamp-2 mb-4 font-sans">
                                                {post.excerpt}
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {post.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded border border-gray-700 text-gray-500 font-mono">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end justify-between gap-4 min-w-[120px]">
                                            <span className="flex items-center gap-1 text-xs font-mono text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                {post.readTime || '5 MIN'}
                                            </span>
                                            <span className="p-2 rounded-full border border-white/10 text-gray-400 group-hover:border-neon-cyan group-hover:text-neon-cyan transition-all">
                                                <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredPosts.length === 0 && (
                <div className="text-center py-20 text-gray-500 font-mono">
                    NO_DATA_FOUND
                </div>
            )}
        </div>
    );
}
