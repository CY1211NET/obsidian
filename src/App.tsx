import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, ArrowLeft, Github, Twitter, Mail, Rss, ExternalLink, BookOpen, Code, Trophy, ChevronDown, ChevronUp, ChevronRight, ChevronLeft, List, Tag, Folder, User, Calendar, RefreshCw, Search, X, CloudLightning, Music, Copy, Check, Menu } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { posts, Post, timeline, TimelineEntry } from './data';
import { siteConfig } from './siteConfig';
import { cn } from './lib/utils';
import { SearchProvider, useSearch } from './contexts/SearchContext';
import { useDocumentTitle } from './hooks/useDocumentTitle';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Timeline } from './pages/Timeline';
import { PostDetail } from './pages/PostDetail';
import { NeteasePlayer } from './components/NeteasePlayer';
import { SplashScreen } from './components/SplashScreen';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// --- Hooks ---



const useReadingProgress = () => {
  const [completion, setCompletion] = useState(0);
  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setCompletion(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      }
    };
    window.addEventListener('scroll', updateScrollCompletion);
    return () => window.removeEventListener('scroll', updateScrollCompletion);
  }, []);
  return completion;
};

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

const ReadingProgressBar = () => {
  const completion = useReadingProgress();
  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[100] bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
      <motion.div
        className="h-full bg-neutral-900 dark:bg-neutral-100"
        style={{ width: `${completion}%` }}
        initial={{ width: 0 }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
};

// Old MusicPlayer was removed to give way to NeteasePlayer

const theme = {
  colors: {
    primary: 'neutral-900',
    secondary: 'neutral-500',
    accent: 'neutral-100',
    border: 'neutral-200'
  }
};

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-10 right-10 p-4 rounded-2xl bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-2xl z-[90] text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          <ChevronUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
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

const LangToggle = () => {
  const { language, toggleLanguage } = useLanguage();
  return (
    <button
      onClick={toggleLanguage}
      className="px-2 py-1 mx-1 text-xs font-bold rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-300 text-neutral-600 dark:text-neutral-400"
      aria-label="Toggle language"
    >
      {language === 'zh' ? '中' : 'En'}
    </button>
  );
};

const Navigation = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const { language } = useLanguage();
  const ui = siteConfig.ui[language as 'zh' | 'en'] || siteConfig.ui.zh;
  const [showResults, setShowResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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
    { path: '/', label: ui.nav.home },
    { path: '/timeline', label: ui.nav.timeline },
    { path: '/about', label: ui.nav.about }
  ];

  return (
    <nav className="flex items-center gap-4">
      {/* Search Input - Desktop focus */}
      <div className="relative flex items-center group" ref={dropdownRef}>
        <Search className="absolute left-3 text-neutral-400 group-focus-within:text-neutral-900 dark:group-focus-within:text-neutral-100 transition-colors pointer-events-none" size={14} />
        <input
          type="text"
          placeholder={ui.search}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          className="w-24 sm:w-48 bg-neutral-100 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-full pl-9 pr-8 py-1.5 text-xs outline-none focus:border-neutral-900 dark:focus:border-neutral-100 text-neutral-900 dark:text-neutral-100 transition-all focus:w-48 md:focus:w-56"
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

        <AnimatePresence>
          {showResults && searchQuery.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-0 mt-4 w-72 sm:w-96 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-neutral-200 dark:border-neutral-800 overflow-hidden z-[100]"
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
                            {result.title.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) => 
                              part.toLowerCase() === searchQuery.toLowerCase() 
                                ? <mark key={i} className="bg-yellow-100 dark:bg-yellow-900/30 text-neutral-900 dark:text-neutral-100 px-0.5 rounded">{part}</mark>
                                : part
                            )}
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
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-neutral-400 italic">No results found</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pill Navigation - Desktop View */}
      <div className="hidden lg:flex items-center p-1 bg-neutral-100 dark:bg-neutral-900 rounded-full border-2 border-neutral-200 dark:border-neutral-800 relative">
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

      <div className="flex items-center gap-1">
        <LangToggle />
        <ThemeToggle />
        
        {/* Hamburger Menu - Mobile View */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-300 active:scale-95 text-neutral-600 dark:text-neutral-400"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-72 bg-white dark:bg-neutral-950 shadow-2xl z-[201] p-10 flex flex-col gap-12"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold tracking-[0.3em] text-neutral-300 uppercase">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "text-3xl font-bold tracking-tighter transition-all",
                      location.pathname === link.path ? "text-neutral-900 dark:text-neutral-100 scale-105 origin-left" : "text-neutral-400 hover:text-neutral-600"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-auto pt-10 border-t border-neutral-100 dark:border-neutral-900 space-y-2">
                <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">Connect</p>
                <div className="flex gap-4">
                  <a href="#" className="p-2 -ml-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"><Twitter size={18} /></a>
                  <a href="#" className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"><Github size={18} /></a>
                  <a href="#" className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"><Mail size={18} /></a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();
  const ui = siteConfig.ui[language as 'zh' | 'en'] || siteConfig.ui.zh;
  return (
    <div className="min-h-screen selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      <ReadingProgressBar />
      <BackToTop />
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
        <div className="bg-white/70 dark:bg-black/70 backdrop-blur-xl rounded-full px-6 h-16 flex justify-between items-center shadow-2xl shadow-black/5 dark:shadow-white/5 border-2 border-neutral-200/50 dark:border-neutral-800/50">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 group-hover:border-neutral-400 dark:group-hover:border-neutral-600 transition-all duration-500 overflow-hidden">
              <CloudLightning size={18} className="text-neutral-700 dark:text-neutral-300 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-neutral-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-lg font-bold tracking-tighter hover:opacity-70 transition-opacity shrink-0">
              Crain's world<span className="text-neutral-400">.</span>
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
            <p className="text-sm font-medium tracking-tight">{ui.footer?.tagline}</p>
            <p className="text-xs text-neutral-400">{ui.footer?.desc}</p>
          </div>
          
          {/* Blog Statistics */}
          <div className="flex gap-12 text-center">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-neutral-300 dark:text-neutral-700 uppercase tracking-widest">{ui.footer?.articles}</p>
              <p className="text-lg font-bold tabular-nums">{posts.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-neutral-300 dark:text-neutral-700 uppercase tracking-widest">{ui.footer?.totalWords}</p>
              <p className="text-lg font-bold tabular-nums">
                {posts.reduce((sum, p) => sum + (p.content || "").replace(/---[\s\S]*?---/, "").replace(/[#*`\n\r]/g, "").trim().length, 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            {siteConfig.socials.map((social) => (
              <a 
                key={social.name} 
                href={social.url || '#'} 
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors" 
                title={social.tooltip}
                target={social.url.startsWith('http') ? '_blank' : undefined}
                rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>
        <div className="mt-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-300 dark:text-neutral-800 font-bold">
            © {new Date().getFullYear()} {siteConfig.author.name.toUpperCase()}. ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>

      {siteConfig.music?.playlists && siteConfig.music.playlists.length > 0 && (
        <NeteasePlayer 
           playlists={siteConfig.music.playlists} 
           defaultPlaylistId={siteConfig.music.defaultPlaylistId || siteConfig.music.playlists[0].id} 
        />
      )}
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
export const extractText = (node: any): string => {
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

export const CodeBlock = ({ code, language, props }: { code: string; language?: string; props?: any }) => {
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

export const ImageLightbox = ({ src, alt, onClose, onPrev, onNext }: { src: string; alt: string; onClose: () => void; onPrev?: () => void; onNext?: () => void }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-6 md:p-12"
    >
      <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />
      
      <AnimatePresence mode="wait">
        <motion.img
          key={src}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl relative z-10"
        />
      </AnimatePresence>

      <button 
        onClick={onClose} 
        className="absolute top-10 right-10 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-[210] group"
        aria-label="Close"
      >
        <X size={28} className="group-hover:scale-110 transition-transform" />
      </button>

      {onPrev && (
        <button 
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-6 md:left-12 p-5 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-[210] group"
          aria-label="Previous"
        >
          <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
        </button>
      )}

      {onNext && (
        <button 
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-6 md:right-12 p-5 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-[210] group"
          aria-label="Next"
        >
          <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </motion.div>
  );
};

export const GiscusComments = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <section className="mt-24 pt-12 border-t-2 border-neutral-100 dark:border-neutral-900">
      <div className="mb-12 space-y-2 text-center md:text-left">
        <h3 className="text-2xl font-bold tracking-tight">Conversations</h3>
        <p className="text-sm text-neutral-400">Join the discussion below.</p>
      </div>
      <div id="giscus-container">
        {/* Placeholder for Giscus in a real environment. Since we can't easily run side-effect scripts here, we represent it. */}
        <div className="p-12 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border-2 border-dashed border-neutral-200 dark:border-neutral-800 text-center">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Giscus Comments Section</p>
        </div>
      </div>
    </section>
  );
};

export const TableOfContents = ({ content }: { content: string }) => {
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

// --- Main App ---

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <LanguageProvider>
      <SearchProvider>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
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
    </LanguageProvider>
  );
}
