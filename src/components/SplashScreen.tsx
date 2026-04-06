import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    // Phase 1: enter (600ms) -> Phase 2: hold (1200ms) -> Phase 3: exit
    const holdTimer = setTimeout(() => setPhase('hold'), 600);
    const outTimer = setTimeout(() => setPhase('out'), 1800);
    const doneTimer = setTimeout(() => onFinish(), 2600);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(outTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {phase !== 'out' ? (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-black select-none"
        >
          {/* Animated background lines */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-px w-full bg-neutral-100 dark:bg-neutral-900"
                style={{ top: `${15 + i * 17}%` }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: i * 0.08, duration: 0.8, ease: 'easeOut' }}
              />
            ))}
          </div>

          {/* Logo mark */}
          <motion.div
            className="mb-10 relative"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 dark:bg-white flex items-center justify-center shadow-2xl">
              <span className="text-white dark:text-black text-2xl font-black tracking-tighter">C</span>
            </div>
            {/* Subtle glow */}
            <div className="absolute -inset-4 rounded-3xl bg-neutral-900/5 dark:bg-white/5 blur-2xl -z-10" />
          </motion.div>

          {/* Site name */}
          <motion.h1
            className="text-4xl md:text-5xl font-black tracking-tighter text-neutral-900 dark:text-neutral-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Crain<span className="text-neutral-300 dark:text-neutral-700">'s</span> World
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="mt-3 text-sm text-neutral-400 dark:text-neutral-600 tracking-[0.25em] uppercase font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            用心记录 · 有迹可循
          </motion.p>

          {/* Loading bar */}
          <motion.div
            className="mt-14 w-32 h-[2px] bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <motion.div
              className="h-full bg-neutral-900 dark:bg-neutral-100 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.55, duration: 1.1, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
