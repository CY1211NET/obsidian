'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { PostData } from '@/lib/posts';

export default function BlogCard({ post, index }: { post: PostData; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative h-full"
        >
            <Link href={`/blog/${post.slug}`} className="block h-full">
                <div className="relative h-full p-6 glass-panel overflow-hidden transition-all duration-300 group-hover:border-neon-cyan/50 group-hover:shadow-[0_0_30px_rgba(0,243,255,0.1)]">

                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-cyan opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-cyan opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neon-cyan opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neon-cyan opacity-50 group-hover:opacity-100 transition-opacity" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <span className="flex items-center gap-2 text-xs font-mono text-neon-purple border border-neon-purple/30 px-2 py-1 rounded bg-neon-purple/5">
                                <Tag className="w-3 h-3" />
                                {post.category}
                            </span>
                            <span className="text-xs font-mono text-gray-500">{post.updatedAt || post.date}</span>
                        </div>

                        <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-neon-cyan transition-colors line-clamp-2">
                            {post.title}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">
                            {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                            <span className="flex items-center gap-2 text-xs font-mono text-gray-500">
                                <Clock className="w-3 h-3" />
                                {post.readTime || '5 MIN READ'}
                            </span>
                            <span className="flex items-center gap-2 text-sm font-mono text-neon-cyan group-hover:translate-x-1 transition-transform">
                                READ_LOG
                                <ArrowRight className="w-4 h-4" />
                            </span>
                        </div>
                    </div>

                    {/* Hover Background Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
            </Link>
        </motion.div>
    );
}
