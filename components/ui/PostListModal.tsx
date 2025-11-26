'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag } from 'lucide-react';

interface Post {
    slug: string;
    title: string;
    date: string;
    category: string;
    tags: string[];
    excerpt?: string;
}

interface PostListModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    posts: Post[];
}

export default function PostListModal({ isOpen, onClose, title, posts }: PostListModalProps) {
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
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[80vh] bg-[#0a0a0a] border border-neon-cyan/30 rounded-xl shadow-[0_0_30px_rgba(0,243,255,0.1)] z-50 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-black/40">
                            <h2 className="text-xl font-mono font-bold text-neon-cyan flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                                {title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-gray-800 rounded transition-colors text-gray-500 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {posts.length === 0 ? (
                                <p className="text-gray-500 font-mono text-center py-8">No posts found.</p>
                            ) : (
                                posts.map((post) => (
                                    <Link
                                        key={post.slug}
                                        href={`/blog/${post.slug}`}
                                        onClick={onClose}
                                        className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-neon-cyan/30 transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-white font-mono font-bold group-hover:text-neon-cyan transition-colors">
                                                {post.title}
                                            </h3>
                                            <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {post.date}
                                            </span>
                                        </div>

                                        {post.excerpt && (
                                            <p className="text-sm text-gray-400 font-mono line-clamp-2 mb-3">
                                                {post.excerpt}
                                            </p>
                                        )}

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
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
