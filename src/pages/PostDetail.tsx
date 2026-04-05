import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Calendar, BookOpen, User, Folder, Tag, Twitter, Github } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

import { posts } from '../data';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { parseMarkdown } from '../lib/markdown';

// We import these shared components from App.tsx since we are doing an iterative split
import { CodeBlock, ImageLightbox, GiscusComments, TableOfContents, extractText } from '../App';

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const post = posts.find((p) => p.id === id);
  const { pathname } = useLocation();

  useDocumentTitle(post?.title || "Article");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4 tracking-tighter">Post not found</h2>
        <Link to="/" className="text-neutral-500 hover:underline">Return home</Link>
      </div>
    );
  }

  // Use the parser to extract metadata and content
  const { metadata, content } = parseMarkdown(post.content);
  
  // Merge metadata from frontmatter with static data (frontmatter takes precedence)
  const displayTitle = metadata?.title || post.title;
  const displayDate = metadata?.date || post.date;
  const displayUpdated = metadata?.updated || post.updated;
  const displayCategory = metadata?.category || post.category;
  const displayTags = metadata?.tags || post.tags;
  const displayAuthor = metadata?.author || post.author;

  // Calculate Prev/Next posts
  const currentIndex = posts.findIndex(p => p.id === post.id);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
    <motion.article
      key="post"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col xl:flex-row gap-12 items-start w-full"
    >
      <div className="flex-1 min-w-0 space-y-16 bg-white dark:bg-neutral-900/10 p-10 md:p-16 rounded-[4rem] border-2 border-neutral-200 dark:border-neutral-800 shadow-sm dark:shadow-none">
        <header className="space-y-12">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
          <ArrowLeft size={14} /> Back to articles
        </Link>
        
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y-2 border-neutral-100 dark:border-neutral-900">
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-300 dark:text-neutral-700 uppercase tracking-widest">
                <Calendar size={10} /> Published
              </span>
              <p className="text-sm font-medium">{displayDate}</p>
            </div>
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-300 dark:text-neutral-700 uppercase tracking-widest">
                <BookOpen size={10} /> Reading Time
              </span>
              <p className="text-sm font-medium">{post.readingTime} min</p>
            </div>
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-300 dark:text-neutral-700 uppercase tracking-widest">
                <User size={10} /> Author
              </span>
              <p className="text-sm font-medium">{displayAuthor || 'Crain'}</p>
            </div>
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-300 dark:text-neutral-700 uppercase tracking-widest">
                <Folder size={10} /> Category
              </span>
              <p className="text-sm font-medium">{displayCategory}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9]">
              {displayTitle}
            </h1>
            <div className="flex flex-wrap gap-2">
              {displayTags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white dark:bg-neutral-950 text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-2 border-neutral-200 dark:border-neutral-800 shadow-sm">
                  <Tag size={10} className="text-neutral-300 dark:text-neutral-700" /> {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="markdown-body">
        <Markdown
          components={{
            h1: ({ children, ...props }) => {
              const id = extractText(children).toLowerCase().replace(/\s+/g, '-');
              return <h1 id={id} {...props}>{children}</h1>;
            },
            h2: ({ children, ...props }) => {
              const id = extractText(children).toLowerCase().replace(/\s+/g, '-');
              return <h2 id={id} {...props}>{children}</h2>;
            },
            h3: ({ children, ...props }) => {
              const id = extractText(children).toLowerCase().replace(/\s+/g, '-');
              return <h3 id={id} {...props}>{children}</h3>;
            },
            h4: ({ children, ...props }) => {
              const id = extractText(children).toLowerCase().replace(/\s+/g, '-');
              return <h4 id={id} {...props}>{children}</h4>;
            },
            h5: ({ children, ...props }) => {
              const id = extractText(children).toLowerCase().replace(/\s+/g, '-');
              return <h5 id={id} {...props}>{children}</h5>;
            },
            h6: ({ children, ...props }) => {
              const id = extractText(children).toLowerCase().replace(/\s+/g, '-');
              return <h6 id={id} {...props}>{children}</h6>;
            },
            img: ({ src, alt, ...props }) => (
              <div className="my-8 rounded-3xl overflow-hidden group cursor-zoom-in">
                <img 
                  src={src} 
                  alt={alt} 
                  {...props} 
                  onClick={() => setActiveImage({ src: src || '', alt: alt || '' })}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
            ),
            code({node, inline, className, children, ...props}: any) {
              const match = /language-(\w+)/.exec(className || '');
              const codeString = String(children).replace(/\n$/, '');
              return !inline && match ? (
                <CodeBlock code={codeString} language={match[1]} props={props} />
              ) : (
                <code {...props} className={className}>
                  {children}
                </code>
              )
            }
          }}
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {content}
        </Markdown>
      </div>

      {/* Article Footer: License, Nav, Comments */}
      <footer className="mt-24 space-y-12">
        <div className="p-8 md:p-10 rounded-[2.5rem] bg-neutral-50 dark:bg-neutral-900/40 border-2 border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="space-y-2 text-center md:text-left">
              <h4 className="text-sm font-bold tracking-tight">Copyright & License</h4>
              <p className="text-[11px] text-neutral-400 font-medium leading-relaxed max-w-md">
                This work is licensed under a <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" className="underline decoration-neutral-300">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>. 
                Feel free to share or adapt with proper attribution.
              </p>
           </div>
           <div className="flex gap-4">
              <button className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border-2 border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors shadow-sm">
                <Twitter size={18} />
              </button>
              <button className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border-2 border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors shadow-sm">
                <Github size={18} />
              </button>
           </div>
        </div>

        {/* Prev/Next Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prevPost ? (
            <Link to={`/post/${prevPost.id}`} className="group p-8 rounded-[2.5rem] border-2 border-neutral-100 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-100 transition-all duration-500">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-4 block">PREVIOUS ARTICLE</span>
              <h5 className="text-lg font-bold tracking-tight group-hover:translate-x-2 transition-transform duration-500">{prevPost.title}</h5>
            </Link>
          ) : <div />}
          
          {nextPost ? (
            <Link to={`/post/${nextPost.id}`} className="group p-8 rounded-[2.5rem] border-2 border-neutral-100 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-100 transition-all duration-500 text-right">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-4 block">NEXT ARTICLE</span>
              <h5 className="text-lg font-bold tracking-tight group-hover:-translate-x-2 transition-transform duration-500">{nextPost.title}</h5>
            </Link>
          ) : <div />}
        </div>

        <GiscusComments />
      </footer>
      </div>
      
      <TableOfContents content={content} />
    </motion.article>

    <AnimatePresence>
      {activeImage && (
        <ImageLightbox 
          src={activeImage.src} 
          alt={activeImage.alt} 
          onClose={() => setActiveImage(null)} 
        />
      )}
    </AnimatePresence>
    </>
  );
};
