import React from 'react';
import { motion } from 'motion/react';
import { siteConfig } from '../siteConfig';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useLanguage } from '../contexts/LanguageContext';

export const About = () => {
  useDocumentTitle("About");
  const { language } = useLanguage();
  const aboutLang = siteConfig.about[language as 'zh' | 'en'] || siteConfig.about.zh;
  const currentImage = siteConfig.about.profileImage;
  
  return (
    <motion.div
      key="about"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-16"
    >
      <section className="p-10 md:p-12 rounded-[3.5rem] border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/10 grid md:grid-cols-2 gap-12 items-center shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-[0_20px_50px_rgba(255,255,255,0.01)]">
        <div className="space-y-6">
          <h1 className="text-5xl font-bold tracking-tighter leading-tight">{aboutLang.title}</h1>
          <p className="text-lg text-neutral-950 dark:text-neutral-400 font-medium leading-relaxed">
            {aboutLang.description}
          </p>
        </div>
        <div className="aspect-square rounded-3xl bg-neutral-100 dark:bg-neutral-900 overflow-hidden relative group border-2 border-neutral-200 dark:border-neutral-800">
          <img 
            src={currentImage} 
            alt="Profile" 
            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-3xl" />
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-12 py-16 border-y-2 border-neutral-200 dark:border-neutral-800">
        {aboutLang.sections.map((sec, idx) => (
          <div key={idx} className="space-y-4">
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.3em]">{sec.label}</span>
            <p className="text-sm text-neutral-950 dark:text-neutral-400 font-bold leading-relaxed">{sec.content}</p>
          </div>
        ))}
      </section>

      <section className="p-10 md:p-12 rounded-[4rem] border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/10 space-y-10">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Friends & Links</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Collaborators and inspirations.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.friends.map((friend) => (
            <a 
              key={friend.name} 
              href={friend.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group p-6 rounded-3xl border-2 border-neutral-100 dark:border-neutral-900 hover:border-neutral-900 dark:hover:border-white transition-all duration-500 bg-neutral-50/50 dark:bg-neutral-950/20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-neutral-100 dark:border-neutral-800">
                  <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" onError={(e) => e.currentTarget.src = `https://ui-avatars.com/api/?name=${friend.name}`} />
                </div>
                <h3 className="font-bold tracking-tight">{friend.name}</h3>
              </div>
              <p className="text-[11px] text-neutral-950 dark:text-neutral-400 leading-relaxed font-bold">
                {friend.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="p-10 md:p-12 rounded-[4rem] border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/10 space-y-8">
        <h2 className="text-2xl font-bold tracking-tight">{aboutLang.contact.title}</h2>
        <p className="text-neutral-950 dark:text-neutral-400 font-bold max-w-2xl leading-relaxed">
          {aboutLang.contact.description}
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-2">
            {siteConfig.socials.map((social) => (
                <a 
                  key={social.name} 
                  href={social.url || '#'} 
                  className="group flex items-center p-4 bg-neutral-100 dark:bg-neutral-800/80 rounded-[1.5rem] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-500 hover:shadow-lg hover:-translate-y-1" 
                  target={social.url.startsWith('http') ? '_blank' : undefined}
                  rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <social.icon size={22} className="shrink-0 relative z-10" />
                  <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[250px] group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] whitespace-nowrap group-hover:ml-3 font-bold text-sm">
                    {social.tooltip || social.name}
                  </span>
                </a>
            ))}
        </div>
      </section>
    </motion.div>
  );
};
