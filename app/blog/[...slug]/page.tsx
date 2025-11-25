import { getSortedPostsData, getPostData } from "@/lib/posts";
import { notFound } from "next/navigation";
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/atom-one-dark.css'; // Import highlight.js style
import TableOfContents from "@/components/blog/TableOfContents";
import CodeBlock from "@/components/blog/CodeBlock";
import CollapsibleTable from "@/components/blog/CollapsibleTable";
import Comments from "@/components/blog/Comments";

interface PageProps {
    params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
    const posts = getSortedPostsData();
    return posts.map((post) => ({
        slug: post.slug.split('/'),
    }));
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const slugStr = slug.map(s => decodeURIComponent(s)).join('/');
    const post = getPostData(slugStr);

    if (!post) {
        notFound();
    }

    // Extract headings for TOC with deduplication
    const headings = (() => {
        const slugCounts: Record<string, number> = {};
        return post.content.match(/^#{2,3}\s.+/gm)?.map((heading) => {
            const level = heading.match(/^#+/)?.[0].length || 2;
            const text = heading.replace(/^#+\s/, '');
            let id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '');

            if (slugCounts[id]) {
                slugCounts[id]++;
                id = `${id}-${slugCounts[id] - 1}`;
            } else {
                slugCounts[id] = 1;
            }

            return { id, text, level };
        }) || [];
    })();

    return (
        <article className="min-h-screen pb-20 pt-10">
            <div className="max-w-7xl mx-auto px-4">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-neon-cyan transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-sm">RETURN_TO_GRID</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">
                    {/* Main Content */}
                    <div className="min-w-0">
                        {/* Header */}
                        <header className="mb-12 border-b border-white/10 pb-12 relative">
                            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm font-mono">
                                <span className="flex items-center gap-2 text-neon-purple bg-neon-purple/10 px-3 py-1 rounded border border-neon-purple/20">
                                    <Tag className="w-3 h-3" />
                                    {post.category}
                                </span>
                                <span className="flex items-center gap-2 text-gray-400">
                                    <Calendar className="w-3 h-3" />
                                    {post.date}
                                </span>
                                <span className="flex items-center gap-2 text-gray-400">
                                    <Clock className="w-3 h-3" />
                                    {post.readTime || '5 MIN READ'}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight glow-text-cyan">
                                {post.title}
                            </h1>

                            <div className="absolute -bottom-[1px] left-0 w-20 h-[1px] bg-neon-cyan box-shadow-glow" />
                        </header>

                        {/* Content */}
                        <div className="content-frame mb-20">
                            <div className="prose dark:prose-invert prose-lg max-w-none prose-headings:font-mono prose-headings:text-neon-cyan prose-a:text-neon-purple hover:prose-a:text-neon-cyan prose-code:text-neon-cyan prose-pre:bg-transparent prose-pre:border-none prose-pre:p-0">
                                <ReactMarkdown
                                    rehypePlugins={[rehypeHighlight, rehypeSlug]}
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        pre: ({ node, ...props }) => <CodeBlock {...props} />,
                                        table: ({ node, ...props }) => <CollapsibleTable {...props} />
                                    }}
                                >
                                    {post.content}
                                </ReactMarkdown>
                            </div>
                        </div>

                        {/* Footer Decoration */}
                        <div className="mt-20 pt-10 border-t border-white/10 flex justify-between items-center text-xs font-mono text-gray-600">
                            <span>END_OF_FILE</span>
                            <span>SLUG: {post.slug}</span>
                        </div>

                        {/* Comments Section */}
                        <Comments path={`/blog/${slugStr}`} />
                    </div>

                    {/* Sidebar (TOC) */}
                    <aside className="hidden lg:block">
                        <TableOfContents headings={headings} />
                    </aside>
                </div>
            </div>
        </article>
    );
}
