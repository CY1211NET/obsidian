import React from 'react';
import { motion } from 'motion/react';
import { siteConfig } from '../siteConfig';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const About = () => {
  useDocumentTitle("About");
  const about = siteConfig.about;
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
          <h1 className="text-5xl font-bold tracking-tighter leading-tight">{about.title}</h1>
          <p className="text-lg text-neutral-950 dark:text-neutral-400 font-medium leading-relaxed">
            {about.description}
          </p>
        </div>
        <div className="aspect-square rounded-3xl bg-neutral-100 dark:bg-neutral-900 overflow-hidden relative group border-2 border-neutral-200 dark:border-neutral-800">
          <img 
            src={about.profileImage} 
            alt="Profile" 
            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-3xl" />
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-12 py-16 border-y-2 border-neutral-200 dark:border-neutral-800">
        {about.sections.map((sec, idx) => (
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
        <h2 className="text-2xl font-bold tracking-tight">{about.contact.title}</h2>
        <p className="text-neutral-950 dark:text-neutral-400 font-bold">
          {about.contact.description}
        </p>
        <a href={`mailto:${about.contact.email}`} className="inline-block text-xl font-bold border-b-2 border-neutral-900 dark:border-neutral-100 pb-1 hover:opacity-50 transition-opacity">
          {about.contact.email}
        </a>
      </section>
    </motion.div>
  );
};
