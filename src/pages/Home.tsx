import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronDown, ChevronRight, BookOpen, X } from 'lucide-react';
import { posts } from '../data';
import { siteConfig } from '../siteConfig';
import { useSearch } from '../contexts/SearchContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';
import { ImageLightbox } from '../App';

export const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const { searchQuery, setSearchQuery } = useSearch();
  const { language } = useLanguage();
  const homeLang = siteConfig.home[language as 'zh' | 'en'] || siteConfig.home.zh;
  const ui = siteConfig.ui[language as 'zh' | 'en'] || siteConfig.ui.zh;
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [sectionsCollapsed, setSectionsCollapsed] = useState({
    timeline: false,
    categories: false,
    tags: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useDocumentTitle("");

  const categories = Array.from(new Set(posts.map(p => p.category)));
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags)));
  const years = Array.from(new Set(posts.map(p => new Date(p.date).getFullYear().toString()))).sort((a, b) => b.localeCompare(a));

  const categoryCounts = posts.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tagCounts = posts.reduce((acc, item) => {
    item.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const yearCounts = posts.reduce((acc, item) => {
    const year = new Date(item.date).getFullYear().toString();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const postsToShow = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const handleYearSelect = (year: string | null) => {
    setSelectedYear(year);
    setSelectedMonth(null);
    setCurrentPage(1);
  };

  const handleCategorySelect = (cat: string | null) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const images = siteConfig.home.profileImages;

  React.useEffect(() => {
    if (images.length <= 1 || lightboxSrc) return; // Pause auto-play when lightbox is open
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [images.length, lightboxSrc]);

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-16"
    >
      {/* Header / Introduction with Carousel */}
      <section className="p-10 md:p-16 rounded-[3rem] border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/10 transition-all duration-700 shadow-sm flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9]">
            {homeLang.title}
          </h1>
          <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.4em]">
            {homeLang.subtitle.toUpperCase()}
          </p>
        </div>
        <div className="w-48 h-48 rounded-[2rem] overflow-hidden border-2 border-neutral-100 dark:border-neutral-800 shrink-0 relative group cursor-zoom-in">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt={`Profile ${currentImageIndex + 1}`}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover grayscale brightness-110 hover:grayscale-0 transition-all duration-500"
              onClick={() => setLightboxSrc(images[currentImageIndex])}
              onError={(e) => {
                e.currentTarget.src = `https://picsum.photos/seed/avatar-${currentImageIndex}/400/400`;
              }}
            />
          </AnimatePresence>
          
          {/* Carousel Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    idx === currentImageIndex 
                      ? "bg-white w-4" 
                      : "bg-white/40 hover:bg-white/60"
                  )}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {lightboxSrc && (
          <ImageLightbox 
            src={images[currentImageIndex]} 
            alt={`Profile ${currentImageIndex + 1}`} 
            onClose={() => setLightboxSrc(null)} 
            onPrev={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
            onNext={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
          />
        )}
      </AnimatePresence>

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
                                {year} <span className="opacity-50 ml-1">({yearCounts[year]})</span>
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
                                  {month} {monthNames[month]}
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
                            onClick={() => handleCategorySelect(null)}
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
                              onClick={() => handleCategorySelect(cat)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-[11px] font-medium transition-all border-2",
                                selectedCategory === cat
                                  ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white" 
                                  : "bg-transparent text-neutral-600 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                              )}
                            >
                              {cat} <span className="opacity-50 ml-1">({categoryCounts[cat]})</span>
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
                              {tag} <span className="opacity-50 ml-1">({tagCounts[tag]})</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Clear Filters */}
                  {(selectedCategory || selectedTags.length > 0 || selectedYear || selectedMonth) && (
                    <button 
                      onClick={() => { 
                        setSelectedCategory(null); 
                        setSelectedTags([]); 
                        setSelectedYear(null); 
                        setSelectedMonth(null); 
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
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
          {postsToShow.length > 0 ? (
            <>
            {postsToShow.map((post) => (
                <article key={post.id} className="group relative p-8 md:p-10 rounded-[2.5rem] border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/10 hover:border-neutral-900 dark:hover:border-white transition-all duration-700 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_25px_60px_rgba(255,255,255,0.02)]">
                  <div className="space-y-4">
                    <Link to={`/post/${post.id}`} className="block space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.2em] border-2 border-neutral-200/50 dark:border-neutral-700/50">
                          {post.category}
                        </div>
                        <span className="text-[10px] font-bold text-neutral-300 dark:text-neutral-700 uppercase tracking-widest">{post.date}</span>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                          <BookOpen size={10} />
                          {post.readingTime} min read
                        </div>
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
              ))}
              
              {totalPages > 1 && (
                <div className="pt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 md:p-3 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="flex gap-1 items-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page, index, array) => {
                      if (
                        totalPages > 5 &&
                        page !== 1 &&
                        page !== totalPages &&
                        Math.abs(page - currentPage) > 1
                      ) {
                        // Show ellipsis only if it's the first hidden page in a sequence
                        if (
                          (page === currentPage - 2 && page > 2) ||
                          (page === currentPage + 2 && page < totalPages - 1)
                        ) {
                          return <span key={`ellipsis-${page}`} className="px-1 text-neutral-400">...</span>;
                        }
                        return null;
                      }
                      
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            "w-8 h-8 md:w-10 md:h-10 rounded-full text-xs font-bold transition-all flex items-center justify-center",
                            currentPage === page
                              ? "bg-neutral-900 text-white dark:bg-white dark:text-black shadow-lg scale-110"
                              : "bg-transparent text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          )}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 md:p-3 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center space-y-4">
              <p className="text-neutral-400 italic">No articles match your selection.</p>
              <button 
                onClick={() => { setSelectedCategory(null); setSelectedTags([]); setSelectedYear(null); setSelectedMonth(null); setSearchQuery(''); setCurrentPage(1); }}
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
