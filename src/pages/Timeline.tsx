import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronLeft, X, BookOpen, Code, Trophy, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useSearch } from '../contexts/SearchContext';
import { posts, timeline } from '../data';
import { cn } from '../lib/utils';

export const Timeline = () => {
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

  useDocumentTitle("Timeline");

  // Combine posts and timeline entries
  const combinedItems = useMemo(() => [
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

  const filteredTimeline = useMemo(() => {
    return combinedItems.filter(item => {
      const itemDate = new Date(item.date);
      const categoryMatch = !selectedCategory || item.category === selectedCategory;
      const tagsMatch = selectedTags.length === 0 || selectedTags.every(tag => item.tags.includes(tag));
      const yearMatch = !selectedYear || itemDate.getFullYear().toString() === selectedYear;
      const monthMatch = !selectedMonth || (itemDate.getMonth() + 1).toString().padStart(2, '0') === selectedMonth;
      
      return categoryMatch && tagsMatch && yearMatch && monthMatch;
    });
  }, [combinedItems, selectedCategory, selectedTags, selectedYear, selectedMonth]);

  const handleYearSelect = (year: string | null) => {
    setSelectedYear(year);
    setSelectedMonth(null);
  };

  const handleCategorySelect = (cat: string | null) => {
    setSelectedCategory(cat);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Group items by year and month
  const groupedTimeline = useMemo(() => {
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

  const sortedYears = useMemo(() => {
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
