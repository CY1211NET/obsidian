import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, ArrowLeft, Github, Twitter, Mail, ExternalLink, BookOpen, Code, Trophy, ChevronDown, ChevronUp, ChevronRight, ChevronLeft, List, Tag, Folder, User, Calendar, RefreshCw, Search, X, CloudLightning, Music, Copy, Check } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { posts, Post, timeline, TimelineEntry } from './data';
import { cn } from './lib/utils';
import { parseMarkdown } from './lib/markdown';

// --- Context ---

const SearchContext = React.createContext<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}>({
  searchQuery: '',
  setSearchQuery: () => {},
});

const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const value = React.useMemo(() => ({ 
    searchQuery, 
    setSearchQuery 
  }), [searchQuery]);

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

const useSearch = () => React.useContext(SearchContext);

// --- Utilities ---

const getSearchSnippet = (content: any, query: string) => {
  if (!query || typeof content !== 'string') return null;
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerContent.indexOf(lowerQuery);
  
  if (index === -1) return null;

  // Find start and end of the snippet (roughly 150 characters around the match)
  const start = Math.max(0, index - 70);
  const end = Math.min(content.length, index + 80);
  
  let snippet = content.substring(start, end);
  
  // Clean up snippet (remove leading/trailing partial words if possible)
  if (start > 0) snippet = '...' + snippet;
  if (end < content.length) snippet = snippet + '...';
  
  return snippet;
};

// --- Components ---

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // A beautiful, chill lofi stream URL (or fallback)
    audioRef.current = new Audio('https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={togglePlay}
      className={cn(
        "p-2 rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center relative overflow-hidden group",
        isPlaying ? "bg-neutral-100 dark:bg-neutral-800 shadow-inner" : "hover:bg-neutral-100 dark:hover:bg-neutral-900"
      )}
      aria-label="Toggle music"
    >
      <Music size={18} className={cn(
        "transition-all duration-700",
        isPlaying ? "text-neutral-900 dark:text-neutral-100 scale-90" : "text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100"
      )} />
      {isPlaying && (
         <div className="absolute inset-0 flex items-center justify-center gap-[2px] pointer-events-none opacity-50 dark:opacity-80 mix-blend-difference text-white">
            <motion.div animate={{ height: ["4px", "14px", "4px"] }} transition={{ repeat: Infinity, duration: 1.0 }} className="w-0.5 bg-current rounded-full" />
            <motion.div animate={{ height: ["4px", "18px", "4px"] }} transition={{ repeat: Infinity, duration: 1.0, delay: 0.2 }} className="w-0.5 bg-current rounded-full" />
            <motion.div animate={{ height: ["4px", "10px", "4px"] }} transition={{ repeat: Infinity, duration: 1.0, delay: 0.4 }} className="w-0.5 bg-current rounded-full" />
         </div>
      )}
    </button>
  );
};

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-300 active:scale-95"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-neutral-600" />}
    </button>
  );
};

const Navigation = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const [showResults, setShowResults] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lowerQuery = searchQuery.toLowerCase();
    
    const matchedPosts = posts.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.tags.some(t => t.toLowerCase().includes(lowerQuery)) ||
      p.content.toLowerCase().includes(lowerQuery)
    ).map(p => ({
      id: p.id,
      title: p.title,
      date: p.date,
      category: p.category,
      tags: p.tags,
      type: 'post' as const,
      snippet: getSearchSnippet(p.content, searchQuery)
    }));

    const matchedTimeline = timeline.filter(t => 
      t.title.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.category.toLowerCase().includes(lowerQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    ).map(t => ({
      id: t.id,
      title: t.title,
      date: t.date,
      category: t.category,
      tags: t.tags,
      type: 'timeline' as const,
      snippet: getSearchSnippet(t.description, searchQuery)
    }));

    return [...matchedPosts, ...matchedTimeline].slice(0, 6);
  }, [searchQuery]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/timeline', label: 'Timeline' },
    { path: '/about', label: 'About' }
  ];

  return (
    <nav className="flex items-center gap-4 md:gap-8">
      {/* Pill Navigation */}
      <div className="hidden md:flex items-center p-1 bg-neutral-100 dark:bg-neutral-900 rounded-full border-2 border-neutral-200 dark:border-neutral-800 relative">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "relative px-5 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors z-10",
                isActive ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-full shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-20">{link.label}</span>
            </Link>
          );
        })}
      </div>
      
      <div className="relative flex items-center group" ref={dropdownRef}>
        <Search className="absolute left-3 text-neutral-400 group-focus-within:text-neutral-900 dark:group-focus-within:text-neutral-100 transition-colors pointer-events-none" size={14} />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          className="w-32 sm:w-48 bg-neutral-100 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-full pl-9 pr-8 py-1.5 text-xs outline-none focus:border-neutral-900 dark:focus:border-neutral-100 text-neutral-900 dark:text-neutral-100 transition-all"
        />
        {searchQuery && (
          <button 
            onClick={() => {
              setSearchQuery('');
              setShowResults(false);
            }}
            className="absolute right-2 p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <X size={12} />
          </button>
        )}

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showResults && searchQuery.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-0 mt-4 w-72 sm:w-96 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-800 overflow-hidden z-[100]"
            >
              <div className="p-2">
                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((result) => (
                        <Link
                          key={`${result.type}-${result.id}`}
                          to={result.type === 'post' ? `/post/${result.id}` : '/timeline'}
                          onClick={() => {
                            setShowResults(false);
                            setSearchQuery('');
                          }}
                          className="block p-4 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors group/item border-2 border-transparent hover:border-neutral-200 dark:hover:border-neutral-800"
                        >
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate group-hover/item:text-neutral-500 transition-colors">
                            {result.title}
                          </h4>
                          <time className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest shrink-0">
                            {result.date}
                          </time>
                        </div>
                        
                        {result.snippet && (
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 italic leading-relaxed mb-3">
                            {result.snippet.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) => 
                              part.toLowerCase() === searchQuery.toLowerCase() 
                                ? <mark key={i} className="bg-yellow-100 dark:bg-yellow-900/30 text-neutral-900 dark:text-neutral-100 px-0.5 rounded">{part}</mark>
                                : part
                            )}
                          </p>
                        )}

                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest px-1.5 py-0.5 rounded bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800">
                            {result.category}
                          </span>
                          <div className="flex gap-2">
                            {result.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[9px] font-bold text-neutral-300 dark:text-neutral-700 uppercase tracking-widest">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                    <div className="p-2 pt-1 border-t border-neutral-100 dark:border-neutral-900">
                      <p className="text-[9px] text-center text-neutral-400 uppercase tracking-widest font-bold">
                        Press ESC to close
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-xs text-neutral-400 italic">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-1">
        <MusicPlayer />
        <ThemeToggle />
      </div>
    </nav>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
        <div className="bg-white/70 dark:bg-black/70 backdrop-blur-xl rounded-full px-6 h-16 flex justify-between items-center shadow-2xl shadow-black/5 dark:shadow-white/5 border-2 border-neutral-200/50 dark:border-neutral-800/50">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 group-hover:border-neutral-400 dark:group-hover:border-neutral-600 transition-all duration-500 overflow-hidden">
              <CloudLightning size={18} className="text-neutral-700 dark:text-neutral-300 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-neutral-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-lg font-bold tracking-tighter hover:opacity-70 transition-opacity shrink-0">
              Crain of world<span className="text-neutral-400">.</span>
            </span>
          </Link>
          <Navigation />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-32">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-neutral-100 dark:border-neutral-900">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-sm font-medium tracking-tight">Minimalist Learning Blog</p>
            <p className="text-xs text-neutral-400">Crafted with intention and focus.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"><Github size={20} /></a>
            <a href="#" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"><Mail size={20} /></a>
          </div>
        </div>
        <div className="mt-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-300 dark:text-neutral-800 font-bold">
            © 2024 ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>
    </div>
  );
};

// --- TOC Logic ---

interface TocItem {
  id: string;
  text: string;
  level: number;
  children: TocItem[];
}

// Recursively extract plain text from React children (handles <strong>, <em>, etc.)
const extractText = (node: any): string => {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node.props && node.props.children) return extractText(node.props.children);
  return '';
};

const parseToc = (content: any): TocItem[] => {
  if (typeof content !== 'string') {
    return [];
  }
  const lines = content.split(/\r?\n/);
  const toc: TocItem[] = [];
  const stack: TocItem[] = [];
  let inCodeBlock = false;

  lines.forEach((line) => {
    // Skip headings inside code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return;
    }
    if (inCodeBlock) return;

    const match = line.trim().match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const rawText = match[2].trim();
      // Strip inline markdown: bold, italic, code, links, images, strikethrough
      const text = rawText
        .replace(/!\[.*?\]\(.*?\)/g, '')     // images
        .replace(/\[([^\]]*)\]\(.*?\)/g, '$1') // links
        .replace(/\*\*(.+?)\*\*/g, '$1')     // bold
        .replace(/__(.+?)__/g, '$1')          // bold alt
        .replace(/\*(.+?)\*/g, '$1')          // italic
        .replace(/_(.+?)_/g, '$1')            // italic alt
        .replace(/~~(.+?)~~/g, '$1')          // strikethrough
        .replace(/`(.+?)`/g, '$1')            // inline code
        .trim();
      const id = text.toLowerCase().replace(/\s+/g, '-');
      
      const item: TocItem = { id, text, level, children: [] };

      if (level === 1) {
        toc.push(item);
        stack[0] = item;
        stack.length = 1;
      } else {
        // Find the closest parent
        let parentIndex = level - 2;
        while (parentIndex >= 0 && !stack[parentIndex]) {
          parentIndex--;
        }
        
        if (parentIndex >= 0) {
          stack[parentIndex].children.push(item);
          stack[level - 1] = item;
          stack.length = level;
        } else {
          toc.push(item);
          stack[level - 1] = item;
          stack.length = level;
        }
      }
    }
  });
  return toc;
};

const flattenToc = (items: TocItem[]): string[] => {
  const ids: string[] = [];
  items.forEach(item => {
    ids.push(item.id);
    if (item.children.length > 0) ids.push(...flattenToc(item.children));
  });
  return ids;
};

const useActiveHeading = (headingIds: string[]) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headingIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible heading
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the one closest to the top
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    headingIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headingIds]);

  return activeId;
};

const TocNode = ({ item, depth = 0, activeId }: { item: TocItem; depth?: number; activeId?: string }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = item.children.length > 0;
  const isActive = activeId === item.id;

  return (
    <div className="space-y-1">
      <div className="flex items-center group">
        {hasChildren && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 -ml-6 mr-1 text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
        <a 
          href={`#${item.id}`}
          className={cn(
            "text-sm transition-all block py-1.5 rounded-lg px-2 -mx-2",
            isActive
              ? "font-bold text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800"
              : depth === 0
                ? "font-bold text-neutral-600 dark:text-neutral-400"
                : "text-neutral-500 dark:text-neutral-500 font-medium hover:text-neutral-900 dark:hover:text-neutral-100"
          )}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {item.text}
        </a>
      </div>
      {hasChildren && isExpanded && (
        <div className={cn("pl-4 ml-1 border-l-2 transition-colors", isActive ? "border-neutral-900 dark:border-neutral-100" : "border-neutral-100 dark:border-neutral-900")}>
          {item.children.map((child) => (
            <TocNode key={child.id} item={child} depth={depth + 1} activeId={activeId} />
          ))}
        </div>
      )}
    </div>
  );
};

const CodeBlock = ({ code, language, props }: { code: string; language: string; props?: any }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-lg bg-neutral-700/50 hover:bg-neutral-600/80 text-neutral-300 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10 flex items-center gap-1.5"
        aria-label="Copy code"
      >
        {copied ? (
          <>
            <Check size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Copied!</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Copy</span>
          </>
        )}
      </button>
      <div className="absolute top-3 left-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500 z-10 pointer-events-none">
        {language}
      </div>
      <SyntaxHighlighter
        {...props}
        children={code}
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        className="rounded-xl text-sm !pt-10"
        showLineNumbers={true}
        lineNumberStyle={{ color: '#555', fontSize: '0.75rem', paddingRight: '1rem' }}
      />
    </div>
  );
};

const TableOfContents = ({ content }: { content: string }) => {
  const toc = parseToc(content);
  const [isOpen, setIsOpen] = useState(false);
  const headingIds = React.useMemo(() => flattenToc(toc), [toc]);
  const activeId = useActiveHeading(headingIds);

  if (toc.length === 0) return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden xl:block w-72 shrink-0 sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto p-6 bg-white/70 dark:bg-black/70 backdrop-blur-2xl rounded-3xl shadow-xl border-2 border-neutral-200 dark:border-neutral-800 z-40 hide-scrollbar">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[10px] font-extrabold text-neutral-900 dark:text-neutral-100 uppercase tracking-[0.3em]">
            <List size={12} /> CONTENTS
          </div>
          <div className="space-y-2">
            {toc.map((item) => (
              <TocNode key={item.id} item={item} activeId={activeId} />
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Floating Button */}
      <div className="xl:hidden fixed top-24 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-xl flex items-center justify-center shadow-xl border-2 border-neutral-200 dark:border-neutral-800 active:scale-95 transition-transform text-neutral-900 dark:text-neutral-100"
        >
          <List size={20} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="absolute top-14 right-0 w-72 max-h-[60vh] overflow-y-auto bg-white/90 dark:bg-black/90 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border-2 border-neutral-200 dark:border-neutral-800"
            >
              <div className="space-y-4">
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em]">CONTENTS</div>
                <div className="space-y-2">
                  {toc.map((item) => (
                    <TocNode key={item.id} item={item} activeId={activeId} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// --- Pages ---

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const { searchQuery, setSearchQuery } = useSearch();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [sectionsCollapsed, setSectionsCollapsed] = useState({
    timeline: false,
    categories: false,
    tags: false
  });

  const categories = Array.from(new Set(posts.map(p => p.category)));
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags)));
  const years = Array.from(new Set(posts.map(p => new Date(p.date).getFullYear().toString()))).sort((a, b) => b.localeCompare(a));

  const availableMonths = selectedYear 
    ? Array.from(new Set(posts
        .filter(p => new Date(p.date).getFullYear().toString() === selectedYear)
        .map(p => (new Date(p.date).getMonth() + 1).toString().padStart(2, '0'))
      )).sort((a, b) => a.localeCompare(b))
    : [];

  const monthNames: { [key: string]: string } = {
    '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun',
    '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
  };

  const filteredPosts = posts.filter(post => {
    const postDate = new Date(post.date);
    const categoryMatch = !selectedCategory || post.category === selectedCategory;
    const tagsMatch = selectedTags.length === 0 || selectedTags.every(tag => post.tags.includes(tag));
    const yearMatch = !selectedYear || postDate.getFullYear().toString() === selectedYear;
    const monthMatch = !selectedMonth || (postDate.getMonth() + 1).toString().padStart(2, '0') === selectedMonth;
    
    return categoryMatch && tagsMatch && yearMatch && monthMatch && !post.draft;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleYearSelect = (year: string | null) => {
    setSelectedYear(year);
    setSelectedMonth(null);
  };

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-16"
    >
      {/* Header / Introduction */}
      <section className="p-10 md:p-16 rounded-[3rem] border-2 border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/30 dark:bg-neutral-900/10 transition-all duration-700 shadow-sm">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] max-w-4xl">
          Thoughts on design, code, and learning.
        </h1>
      </section>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Sticky Sidebar Filter */}
        <aside className={cn(
          "w-full lg:sticky lg:top-32 transition-all duration-500 ease-in-out",
          isSidebarExpanded ? "lg:w-72" : "lg:w-20"
        )}>
          <div className="p-6 md:p-8 rounded-[2.5rem] border-2 border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/30 dark:bg-neutral-900/10 backdrop-blur-sm shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div className={cn("space-y-1 transition-opacity duration-300", !isSidebarExpanded && "lg:hidden")}>
                <h2 className="text-xl font-bold tracking-tight">Explore</h2>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Discover thoughts</p>
              </div>
              <button 
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <motion.div animate={{ rotate: isSidebarExpanded ? 0 : 180 }}>
                  <ChevronLeft size={18} className={cn(!isSidebarExpanded && "rotate-180")} />
                </motion.div>
              </button>
            </div>

            <AnimatePresence>
              {isSidebarExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="space-y-8 overflow-hidden"
                >
                  {/* Year & Month */}
                  <div className="space-y-4">
                    <button 
                      onClick={() => setSectionsCollapsed(prev => ({ ...prev, timeline: !prev.timeline }))}
                      className="w-full flex items-center justify-between group/label"
                    >
                      <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.3em] group-hover/label:text-neutral-900 dark:group-hover/label:text-neutral-100 transition-colors">TIMELINE</div>
                      <ChevronDown size={12} className={cn("text-neutral-300 dark:text-neutral-700 transition-transform duration-300", sectionsCollapsed.timeline && "-rotate-90")} />
                    </button>
                    <AnimatePresence>
                      {!sectionsCollapsed.timeline && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleYearSelect(null)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-[11px] font-medium transition-all border-2",
                                !selectedYear 
                                  ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white" 
                                  : "bg-transparent text-neutral-600 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                              )}
                            >
                              Any
                            </button>
                            {years.map(year => (
                              <button
                                key={year}
                                onClick={() => handleYearSelect(year)}
                                className={cn(
                                  "px-3 py-1.5 rounded-full text-[11px] font-medium transition-all border-2",
                                  selectedYear === year
                                    ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white" 
                                    : "bg-transparent text-neutral-600 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                                )}
                              >
                                {year}
                              </button>
                            ))}
                          </div>

                          {selectedYear && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex flex-wrap gap-2 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/50"
                            >
                              <button
                                onClick={() => setSelectedMonth(null)}
                                className={cn(
                                  "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border-2",
                                  !selectedMonth 
                                    ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white" 
                                    : "bg-transparent text-neutral-500 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                                )}
                              >
                                All
                              </button>
                              {availableMonths.map(month => (
                                <button
                                  key={month}
                                  onClick={() => setSelectedMonth(month)}
                                  className={cn(
                                    "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border-2",
                                    selectedMonth === month
                                      ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white" 
                                      : "bg-transparent text-neutral-500 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                                  )}
                                >
                                  {monthNames[month]}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Categories */}
                  <div className="space-y-4">
                    <button 
                      onClick={() => setSectionsCollapsed(prev => ({ ...prev, categories: !prev.categories }))}
                      className="w-full flex items-center justify-between group/label"
                    >
                      <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.3em] group-hover/label:text-neutral-900 dark:group-hover/label:text-neutral-100 transition-colors">CATEGORIES</div>
                      <ChevronDown size={12} className={cn("text-neutral-300 dark:text-neutral-700 transition-transform duration-300", sectionsCollapsed.categories && "-rotate-90")} />
                    </button>
                    <AnimatePresence>
                      {!sectionsCollapsed.categories && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex flex-wrap gap-2 overflow-hidden"
                        >
                          <button
                            onClick={() => setSelectedCategory(null)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-[11px] font-medium transition-all border-2",
                              !selectedCategory 
                                ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white" 
                                : "bg-transparent text-neutral-600 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                            )}
                          >
                            All
                          </button>
                          {categories.map(cat => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-[11px] font-medium transition-all border-2",
                                selectedCategory === cat
                                  ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white" 
                                  : "bg-transparent text-neutral-600 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                              )}
                            >
                              {cat}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Tags */}
                  <div className="space-y-4">
                    <button 
                      onClick={() => setSectionsCollapsed(prev => ({ ...prev, tags: !prev.tags }))}
                      className="w-full flex items-center justify-between group/label"
                    >
                      <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.3em] group-hover/label:text-neutral-900 dark:group-hover/label:text-neutral-100 transition-colors">TAGS</div>
                      <ChevronDown size={12} className={cn("text-neutral-300 dark:text-neutral-700 transition-transform duration-300", sectionsCollapsed.tags && "-rotate-90")} />
                    </button>
                    <AnimatePresence>
                      {!sectionsCollapsed.tags && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex flex-wrap gap-2 overflow-hidden"
                        >
                          {allTags.map(tag => (
                            <button
                              key={tag}
                              onClick={() => toggleTag(tag)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-[11px] font-medium transition-all border-2",
                                selectedTags.includes(tag)
                                  ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white" 
                                  : "bg-white dark:bg-neutral-950 text-neutral-600 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
                              )}
                            >
                              {tag}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Clear Filters */}
                  {(selectedCategory || selectedTags.length > 0 || selectedYear || selectedMonth) && (
                    <button 
                      onClick={() => { setSelectedCategory(null); setSelectedTags([]); setSelectedYear(null); setSelectedMonth(null); setSearchQuery(''); }}
                      className="w-full py-2 text-[10px] font-bold uppercase tracking-widest border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-900 dark:hover:border-neutral-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <X size={12} />
                      Clear All
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 space-y-12">
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-300 dark:text-neutral-700">
              {filteredPosts.length} ARTICLES FOUND
            </span>
            <div className="h-px flex-1 bg-neutral-100 dark:bg-neutral-900" />
          </div>
          
          <div className="space-y-12">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <article key={post.id} className="group relative p-6 md:p-8 rounded-[2rem] border-2 border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/30 dark:bg-neutral-900/10 hover:border-neutral-900 dark:hover:border-white transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_50px_rgba(255,255,255,0.02)]">
                <div className="space-y-4">
                  <Link to={`/post/${post.id}`} className="block space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.2em] border-2 border-neutral-200/50 dark:border-neutral-700/50">
                        {post.category}
                      </div>
                      <span className="text-[10px] font-bold text-neutral-300 dark:text-neutral-700 uppercase tracking-widest">{post.date}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {post.tags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          toggleTag(tag);
                        }}
                        className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all duration-500 border-2 shadow-sm",
                          selectedTags.includes(tag)
                            ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white"
                            : "bg-white text-neutral-400 border-neutral-100 dark:bg-neutral-950 dark:text-neutral-600 dark:border-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100"
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <Link to={`/post/${post.id}`} className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors pt-4 border-t-2 border-neutral-100 dark:border-neutral-900 w-full">
                    VIEW FULL ARTICLE <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="py-20 text-center space-y-4">
              <p className="text-neutral-400 italic">No articles match your selection.</p>
              <button 
                onClick={() => { setSelectedCategory(null); setSelectedTags([]); setSelectedYear(null); setSelectedMonth(null); setSearchQuery(''); }}
                className="text-sm font-bold border-b border-neutral-900 dark:border-neutral-100"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </motion.div>
  );
};

const Timeline = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const { searchQuery, setSearchQuery } = useSearch();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [sectionsCollapsed, setSectionsCollapsed] = useState({
    categories: false,
    timeline: false,
    tags: false
  });
  
  const [expandedYears, setExpandedYears] = useState<string[]>([]);
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);

  // Combine posts and timeline entries
  const combinedItems = React.useMemo(() => [
    ...posts.map(p => ({
      id: p.id,
      date: p.date,
      title: p.title,
      description: p.excerpt,
      type: 'article' as const,
      category: p.category,
      tags: p.tags,
      isPost: true
    })),
    ...timeline.map(t => ({
      ...t,
      isPost: false
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), []);

  const categories = Array.from(new Set(combinedItems.map(item => item.category)));
  const allTags = Array.from(new Set(combinedItems.flatMap(item => item.tags)));
  const years = Array.from(new Set(combinedItems.map(item => new Date(item.date).getFullYear().toString()))).sort((a, b) => b.localeCompare(a));

  const availableMonths = selectedYear 
    ? Array.from(new Set(combinedItems
        .filter(item => new Date(item.date).getFullYear().toString() === selectedYear)
        .map(item => (new Date(item.date).getMonth() + 1).toString().padStart(2, '0'))
      )).sort((a, b) => a.localeCompare(b))
    : [];

  const monthNames: { [key: string]: string } = {
    '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun',
    '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
  };

  const filteredTimeline = React.useMemo(() => {
    return combinedItems.filter(item => {
      const itemDate = new Date(item.date);
      const categoryMatch = !selectedCategory || item.category === selectedCategory;
      const tagsMatch = selectedTags.length === 0 || selectedTags.every(tag => item.tags.includes(tag));
      const yearMatch = !selectedYear || itemDate.getFullYear().toString() === selectedYear;
      const monthMatch = !selectedMonth || (itemDate.getMonth() + 1).toString().padStart(2, '0') === selectedMonth;
      
      return categoryMatch && tagsMatch && yearMatch && monthMatch;
    });
  }, [combinedItems, selectedCategory, selectedTags, selectedYear, selectedMonth]);

  // Group items by year and month
  const groupedTimeline = React.useMemo(() => {
    return filteredTimeline.reduce((acc, item) => {
      const date = new Date(item.date);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      
      if (!acc[year]) acc[year] = {};
      if (!acc[year][month]) acc[year][month] = [];
      acc[year][month].push(item);
      return acc;
    }, {} as Record<string, Record<string, any[]>>);
  }, [filteredTimeline]);

  const sortedYears = React.useMemo(() => {
    return Object.keys(groupedTimeline).sort((a, b) => b.localeCompare(a));
  }, [groupedTimeline]);

  // Initialize expanded years/months
  useEffect(() => {
    if (sortedYears.length > 0 && expandedYears.length === 0) {
      setExpandedYears([sortedYears[0]]);
      const latestMonth = Object.keys(groupedTimeline[sortedYears[0]]).sort((a, b) => b.localeCompare(a))[0];
      if (latestMonth) {
        setExpandedMonths([`${sortedYears[0]}-${latestMonth}`]);
      }
    }
  }, [sortedYears]);

  const toggleYear = (year: string) => {
    setExpandedYears(prev => prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]);
  };

  const toggleMonth = (yearMonth: string) => {
    setExpandedMonths(prev => prev.includes(yearMonth) ? prev.filter(ym => ym !== yearMonth) : [...prev, yearMonth]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleYearSelect = (year: string | null) => {
    setSelectedYear(year);
    setSelectedMonth(null);
  };

  return (
    <motion.div
      key="timeline"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Sticky Sidebar Filter */}
        <aside className={cn(
          "w-full lg:sticky lg:top-32 transition-all duration-500 ease-in-out",
          isSidebarExpanded ? "lg:w-72" : "lg:w-20"
        )}>
          <div className="p-6 md:p-8 rounded-[2.5rem] border-2 border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/30 dark:bg-neutral-900/10 backdrop-blur-sm shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div className={cn("space-y-1 transition-opacity duration-300", !isSidebarExpanded && "lg:hidden")}>
                <h2 className="text-xl font-bold tracking-tight">Filters</h2>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Refine path</p>
              </div>
              <button 
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <motion.div animate={{ rotate: isSidebarExpanded ? 0 : 180 }}>
                  <ChevronLeft size={18} className={cn(!isSidebarExpanded && "rotate-180")} />
                </motion.div>
              </button>
            </div>

            <AnimatePresence>
              {isSidebarExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="space-y-8 overflow-hidden"
                >
                  {/* Categories */}
                  <div className="space-y-4">
                    <button 
                      onClick={() => setSectionsCollapsed(prev => ({ ...prev, categories: !prev.categories }))}
                      className="w-full flex items-center justify-between group/label"
                    >
                      <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.3em] group-hover/label:text-neutral-900 dark:group-hover/label:text-neutral-100 transition-colors">CATEGORIES</div>
                      <ChevronDown size={12} className={cn("text-neutral-300 dark:text-neutral-700 transition-transform duration-300", sectionsCollapsed.categories && "-rotate-90")} />
                    </button>
                    <AnimatePresence>
                      {!sectionsCollapsed.categories && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex flex-wrap gap-2 overflow-hidden"
                        >
                          <button
                            onClick={() => setSelectedCategory(null)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-[11px] font-medium transition-all border-2",
                              !selectedCategory 
                                ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white" 
                                : "bg-transparent text-neutral-600 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                            )}
                          >
                            All
                          </button>
                          {categories.map(cat => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-[11px] font-medium transition-all border-2",
                                selectedCategory === cat
                                  ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white" 
                                  : "bg-transparent text-neutral-600 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                              )}
                            >
                              {cat}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Year & Month */}
                  <div className="space-y-4">
                    <button 
                      onClick={() => setSectionsCollapsed(prev => ({ ...prev, timeline: !prev.timeline }))}
                      className="w-full flex items-center justify-between group/label"
                    >
                      <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.3em] group-hover/label:text-neutral-900 dark:group-hover/label:text-neutral-100 transition-colors">TIMELINE</div>
                      <ChevronDown size={12} className={cn("text-neutral-300 dark:text-neutral-700 transition-transform duration-300", sectionsCollapsed.timeline && "-rotate-90")} />
                    </button>
                    <AnimatePresence>
                      {!sectionsCollapsed.timeline && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleYearSelect(null)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-[11px] font-medium transition-all border-2",
                                !selectedYear 
                                  ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white" 
                                  : "bg-transparent text-neutral-600 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                              )}
                            >
                              Any
                            </button>
                            {years.map(year => (
                              <button
                                key={year}
                                onClick={() => handleYearSelect(year)}
                                className={cn(
                                  "px-3 py-1.5 rounded-full text-[11px] font-medium transition-all border-2",
                                  selectedYear === year
                                    ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white" 
                                    : "bg-transparent text-neutral-600 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                                )}
                              >
                                {year}
                              </button>
                            ))}
                          </div>

                          {selectedYear && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex flex-wrap gap-2 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/50"
                            >
                              <button
                                onClick={() => setSelectedMonth(null)}
                                className={cn(
                                  "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border-2",
                                  !selectedMonth 
                                    ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white" 
                                    : "bg-transparent text-neutral-500 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                                )}
                              >
                                All
                              </button>
                              {availableMonths.map(month => (
                                <button
                                  key={month}
                                  onClick={() => setSelectedMonth(month)}
                                  className={cn(
                                    "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border-2",
                                    selectedMonth === month
                                      ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white" 
                                      : "bg-transparent text-neutral-500 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                                  )}
                                >
                                  {monthNames[month]}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Tags */}
                  <div className="space-y-4">
                    <button 
                      onClick={() => setSectionsCollapsed(prev => ({ ...prev, tags: !prev.tags }))}
                      className="w-full flex items-center justify-between group/label"
                    >
                      <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.3em] group-hover/label:text-neutral-900 dark:group-hover/label:text-neutral-100 transition-colors">TAGS</div>
                      <ChevronDown size={12} className={cn("text-neutral-300 dark:text-neutral-700 transition-transform duration-300", sectionsCollapsed.tags && "-rotate-90")} />
                    </button>
                    <AnimatePresence>
                      {!sectionsCollapsed.tags && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex flex-wrap gap-2 overflow-hidden"
                        >
                          {allTags.map(tag => (
                            <button
                              key={tag}
                              onClick={() => toggleTag(tag)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-[11px] font-medium transition-all border-2",
                                selectedTags.includes(tag)
                                  ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white" 
                                  : "bg-white dark:bg-neutral-950 text-neutral-600 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
                              )}
                            >
                              {tag}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Clear Filters */}
                  {(selectedCategory || selectedTags.length > 0 || selectedYear || selectedMonth) && (
                    <button 
                      onClick={() => { setSelectedCategory(null); setSelectedTags([]); setSelectedYear(null); setSelectedMonth(null); setSearchQuery(''); }}
                      className="w-full py-2 text-[10px] font-bold uppercase tracking-widest border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-900 dark:hover:border-neutral-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <X size={12} />
                      Clear All
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 space-y-16">
          <header className="p-10 md:p-12 rounded-[3rem] border-2 border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/30 dark:bg-neutral-900/10 transition-all duration-700 shadow-sm space-y-4">
            <h1 className="text-5xl font-bold tracking-tighter">Learning Path</h1>
            <p className="text-neutral-500 dark:text-neutral-400">A chronological log of my growth, milestones, and writings.</p>
          </header>

      {sortedYears.length > 0 ? (
        <div className="relative space-y-24 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 dark:before:via-neutral-800 before:to-transparent">
          {sortedYears.map((year) => (
            <div key={year} className="relative space-y-12">
              {/* Year Header */}
              <div className="relative flex items-center justify-center z-10">
                <button
                  onClick={() => toggleYear(year)}
                  className="px-8 py-2 rounded-full bg-white dark:bg-black border-2 border-neutral-900 dark:border-neutral-100 text-sm font-bold tracking-[0.3em] flex items-center gap-3 shadow-xl hover:scale-105 transition-all text-neutral-900 dark:text-neutral-100"
                >
                  {year}
                  <motion.div animate={{ rotate: expandedYears.includes(year) ? 0 : 180 }}>
                    <ChevronDown size={14} />
                  </motion.div>
                </button>
              </div>

              <AnimatePresence>
                {expandedYears.includes(year) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-16 overflow-hidden"
                  >
                    {Object.keys(groupedTimeline[year]).sort((a, b) => b.localeCompare(a)).map((month) => (
                      <div key={`${year}-${month}`} className="relative space-y-12">
                        {/* Month Header */}
                        <div className="relative flex items-center justify-center z-10">
                          <button
                            onClick={() => toggleMonth(`${year}-${month}`)}
                            className="px-6 py-1.5 rounded-full bg-white dark:bg-neutral-900 border-2 border-neutral-300 dark:border-neutral-800 text-[10px] font-bold tracking-[0.2em] flex items-center gap-2 hover:border-neutral-900 dark:hover:border-neutral-100 transition-all text-neutral-600 dark:text-neutral-400 shadow-sm"
                          >
                            {monthNames[month].toUpperCase()}
                            <motion.div animate={{ rotate: expandedMonths.includes(`${year}-${month}`) ? 0 : 180 }}>
                              <ChevronDown size={12} />
                            </motion.div>
                          </button>
                        </div>

                        <AnimatePresence>
                          {expandedMonths.includes(`${year}-${month}`) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-12 overflow-hidden"
                            >
                              {groupedTimeline[year][month].map((item) => (
                                <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                  {/* Dot */}
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 group-hover:border-neutral-900 dark:group-hover:border-neutral-100 transition-all duration-500 z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    {item.type === 'learning' && <BookOpen size={16} />}
                                    {item.type === 'project' && <Code size={16} />}
                                    {item.type === 'milestone' && <Trophy size={16} />}
                                    {item.type === 'article' && <List size={16} />}
                                  </div>
                                  {/* Content */}
                                  <div className="w-[calc(100%-4rem)] md:w-[45%] p-6 rounded-2xl border-2 border-neutral-100 dark:border-neutral-900 hover:border-neutral-200 dark:hover:border-neutral-800 transition-colors bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-1">
                                      <time className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">{item.date}</time>
                                      <span className="text-[10px] font-bold text-neutral-300 dark:text-neutral-700 uppercase tracking-widest">{item.category}</span>
                                    </div>
                                    {item.isPost ? (
                                      <Link to={`/post/${item.id}`} className="block group/title">
                                        <h3 className="text-xl font-bold tracking-tight mb-2 group-hover/title:text-neutral-500 transition-colors">{item.title}</h3>
                                      </Link>
                                    ) : (
                                      <>
                                        <h3 className="text-xl font-bold tracking-tight mb-2">{item.title}</h3>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">{item.description}</p>
                                      </>
                                    )}
                                    <div className="flex flex-wrap gap-2 pt-2">
                                      {item.tags.map(tag => (
                                        <button
                                          key={tag}
                                          onClick={() => {
                                            toggleTag(tag);
                                          }}
                                          className={cn(
                                            "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all duration-300 border-2 shadow-sm",
                                            selectedTags.includes(tag)
                                              ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white"
                                              : "bg-white text-neutral-500 border-neutral-200 dark:bg-neutral-950 dark:text-neutral-400 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                          )}
                                        >
                                          {tag}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4">
          <p className="text-neutral-400 italic">No entries match your selection.</p>
          <button 
            onClick={() => { setSelectedCategory(null); setSelectedTags([]); setSelectedYear(null); setSelectedMonth(null); setSearchQuery(''); }}
            className="text-sm font-bold border-b border-neutral-900 dark:border-neutral-100"
          >
            Clear filters
          </button>
        </div>
      )}
        </div>
      </div>
    </motion.div>
  );
};

const About = () => {
  return (
    <motion.div
      key="about"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-16"
    >
      <section className="p-10 md:p-12 rounded-[3rem] border-2 border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/10 grid md:grid-cols-2 gap-12 items-center shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-[0_20px_50px_rgba(255,255,255,0.01)]">
        <div className="space-y-6">
          <h1 className="text-5xl font-bold tracking-tighter leading-tight">I'm a builder, learner, and designer.</h1>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Currently focused on creating tools that make the web a more beautiful and accessible place. I believe in the power of simplicity and the importance of detail.
          </p>
        </div>
        <div className="aspect-square rounded-3xl bg-neutral-100 dark:bg-neutral-900 overflow-hidden relative group border-2 border-neutral-200 dark:border-neutral-800">
          <img 
            src="https://picsum.photos/seed/minimalist/800/800" 
            alt="Profile" 
            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-3xl" />
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-12 py-16 border-y-2 border-neutral-200 dark:border-neutral-800">
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.3em]">STACK</span>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">React, TypeScript, Tailwind CSS, Node.js, and a bit of Rust.</p>
        </div>
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.3em]">FOCUS</span>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">Design Systems, Performance, Accessibility, and User Experience.</p>
        </div>
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.3em]">LOCATION</span>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">Based in the digital ether, exploring new frontiers.</p>
        </div>
      </section>

      <section className="p-10 md:p-12 rounded-[3rem] border-2 border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/10 space-y-8">
        <h2 className="text-2xl font-bold tracking-tight">Get in touch</h2>
        <p className="text-neutral-500 dark:text-neutral-400">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
        </p>
        <a href="mailto:hello@example.com" className="inline-block text-xl font-bold border-b-2 border-neutral-900 dark:border-neutral-100 pb-1 hover:opacity-50 transition-opacity">
          hello@example.com
        </a>
      </section>
    </motion.div>
  );
};

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const post = posts.find((p) => p.id === id);
  const { pathname } = useLocation();

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

  return (
    <motion.article
      key="post"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col xl:flex-row gap-12 items-start w-full"
    >
      <div className="flex-1 min-w-0 space-y-16">
        <header className="space-y-12">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
          <ArrowLeft size={14} /> Back to posts
        </Link>
        
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y-2 border-neutral-100 dark:border-neutral-900">
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-300 dark:text-neutral-700 uppercase tracking-widest">
                <Calendar size={10} /> Published
              </span>
              <p className="text-sm font-medium">{displayDate}</p>
            </div>
            {displayUpdated && (
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-300 dark:text-neutral-700 uppercase tracking-widest">
                  <RefreshCw size={10} /> Updated
                </span>
                <p className="text-sm font-medium">{displayUpdated}</p>
              </div>
            )}
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-300 dark:text-neutral-700 uppercase tracking-widest">
                <User size={10} /> Author
              </span>
              <p className="text-sm font-medium">{displayAuthor}</p>
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
      </div>
      
      <TableOfContents content={content} />
    </motion.article>
  );
};

// --- Main App ---

export default function App() {
  return (
    <SearchProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/about" element={<About />} />
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </Layout>
      </Router>
    </SearchProvider>
  );
}
