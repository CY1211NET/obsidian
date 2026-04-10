import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Maximize2, X, Plus, Minus, RefreshCcw } from 'lucide-react';

interface MermaidProps {
  chart: string;
}

// Initialize mermaid with default config
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'inherit',
});

export const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current) return;

      try {
        const isDark = document.documentElement.classList.contains('dark');
        
        // Use a unique ID for each chart rendering to avoid collisions
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        
        // Configure mermaid based on theme
        mermaid.initialize({
          theme: isDark ? 'dark' : 'default',
          themeVariables: isDark ? {
            primaryColor: '#262626',
            primaryTextColor: '#f5f5f5',
            primaryBorderColor: '#404040',
            lineColor: '#737373',
            secondaryColor: '#171717',
            tertiaryColor: '#171717',
          } : {
            primaryColor: '#f5f5f5',
          }
        });

        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error('Mermaid rendering failed:', err);
        setError('Failed to render diagram. Please check your syntax.');
      }
    };

    renderChart();

    // Re-render when theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          renderChart();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, [chart]);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
    if (!isZoomed) setScale(4); // Default zoom at 400%
    else setScale(1);
  };

  const adjustScale = (delta: number) => {
    setScale(prev => Math.min(Math.max(0.5, prev + delta), 8)); // Allow up to 800%
  };

  const resetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(4);
  };

  // Wheel zoom support
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!isZoomed) return;
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    adjustScale(delta);
  }, [isZoomed]);

  // Close zoomed view on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsZoomed(false);
    };
    if (isZoomed) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isZoomed]);

  if (error) {
    return (
      <div className="p-6 my-4 rounded-3xl bg-red-50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/20 text-red-500 text-xs font-mono">
        <p className="font-bold mb-2 uppercase tracking-widest">Mermaid Syntax Error</p>
        <p>{error}</p>
        <pre className="mt-4 p-4 bg-white/50 dark:bg-black/50 rounded-xl overflow-x-auto">
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <>
      <div className="relative group my-8">
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl bg-neutral-900/80 dark:bg-neutral-100/10 backdrop-blur-md text-white dark:text-neutral-300 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-white/10"
            title="Copy source"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span className="text-[10px] font-bold uppercase tracking-widest">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          
          <button
            onClick={toggleZoom}
            className="p-2.5 rounded-xl bg-neutral-900/80 dark:bg-neutral-100/10 backdrop-blur-md text-white dark:text-neutral-300 hover:scale-105 active:scale-95 transition-all border border-white/10"
            title="FullScreen"
          >
            <Maximize2 size={14} />
          </button>
        </div>

        {/* Chart Container */}
        <div 
          ref={containerRef} 
          onClick={toggleZoom}
          className="mermaid-container cursor-zoom-in flex justify-center w-full overflow-x-auto p-8 md:p-12 bg-neutral-50/50 dark:bg-white/5 rounded-[3rem] border-2 border-neutral-100 dark:border-neutral-800 transition-colors hover:border-neutral-200 dark:hover:border-neutral-700"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>

      {/* Zoomed Lightbox */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onWheel={handleWheel}
            className="fixed inset-0 z-[1000] bg-white/95 dark:bg-black/95 backdrop-blur-xl p-8 flex items-center justify-center overflow-hidden select-none"
          >
            {/* Background click to close */}
            <div className="absolute inset-0" onClick={toggleZoom} />

            {/* Controls Top Right */}
            <div className="absolute top-10 right-10 flex gap-4 z-[1010]">
               <button
                onClick={handleCopy}
                className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors border border-neutral-200 dark:border-neutral-700 flex items-center gap-3 shadow-xl"
              >
                {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                <span className="text-xs font-bold uppercase tracking-widest">{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
              <button 
                onClick={toggleZoom}
                className="p-4 rounded-2xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-80 transition-opacity shadow-2xl flex items-center justify-center"
              >
                <X size={24} />
              </button>
            </div>

            {/* Zoom Controls Bottom Center */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-2xl rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 z-[1010] shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button 
                    onClick={(e) => { e.stopPropagation(); adjustScale(-0.2); }}
                    className="p-3 rounded-2xl hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400"
                >
                    <Minus size={18} />
                </button>
                <div className="px-4 text-xs font-bold tabular-nums text-neutral-950 dark:text-neutral-100 tracking-tighter">
                    {Math.round(scale * 100)}%
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); adjustScale(0.2); }}
                    className="p-3 rounded-2xl hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400"
                >
                    <Plus size={18} />
                </button>
                <div className="w-[1px] h-6 bg-neutral-200 dark:bg-neutral-800 mx-1" />
                <button 
                    onClick={resetZoom}
                    className="p-3 rounded-2xl hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400"
                    title="Reset Zoom"
                >
                    <RefreshCcw size={18} />
                </button>
            </div>

            {/* Draggable Diagram */}
            <motion.div
              drag
              dragConstraints={{ left: -3000, right: 3000, top: -3000, bottom: 3000 }}
              dragElastic={0}
              dragMomentum={false}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: scale, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300, scale: { duration: 0.2 } }}
              className="relative z-[1001] cursor-grab active:cursor-grabbing p-40 whitespace-nowrap"
              dangerouslySetInnerHTML={{ __html: svg }}
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-1 text-[9px] font-bold uppercase tracking-[0.3em] text-neutral-300 dark:text-neutral-700 pointer-events-none">
              Wheel to Zoom • Drag to Pan • ESC to Close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
