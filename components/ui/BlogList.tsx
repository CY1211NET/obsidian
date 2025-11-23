'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogCard from './BlogCard';
import { PostData } from '@/lib/posts';
import { Tag, Filter } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface BlogListProps {
    posts: PostData[];
    allTags: string[];
}

export default function BlogList({ posts, allTags }: BlogListProps) {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const { t } = useLanguage();

    const filteredPosts = selectedTag
        ? posts.filter((post) => post.tags.includes(selectedTag))
        : posts;

    return (
        <div>
            {/* Tag Filter */}
            <div className="mb-12">
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

            {/* Posts Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                            <BlogCard post={post} index={index} />
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
