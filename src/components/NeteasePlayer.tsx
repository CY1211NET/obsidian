import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, ChevronUp, ChevronDown, Repeat, Repeat1, Shuffle, List } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Song {
  title: string;
  author: string;
  url: string;
  pic: string;
  lrc: string;
}

interface Playlist {
  id: string;
  name: string;
}

export const NeteasePlayer = ({ playlists, defaultPlaylistId }: { playlists: Playlist[], defaultPlaylistId: string }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(defaultPlaylistId);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // UI states
  const [isHovered, setIsHovered] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  
  const [playMode, setPlayMode] = useState<'list-loop' | 'single-loop' | 'shuffle'>('list-loop');

  const [lyrics, setLyrics] = useState<{time: number, text: string}[]>([]);
  const [currentLrcIndex, setCurrentLrcIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch playlist data
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://api.i-meto.com/meting/api?server=netease&type=playlist&id=${selectedPlaylistId}`);
        const data = await res.json();
        if (data && data.length > 0) {
            setSongs(data);
            setCurrentIndex(0);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch playlist", err);
        setLoading(false);
      }
    };
    if (selectedPlaylistId) fetchMusic();
  }, [selectedPlaylistId]);

  const currentSong = songs[currentIndex];

  useEffect(() => {
    if (!currentSong) return;
    const fetchLrc = async () => {
      if (!currentSong.lrc) {
          setLyrics([]);
          return;
      }
      try {
        const res = await fetch(currentSong.lrc);
        const text = await res.text();
        const lines = text.split('\n');
        const parsed: { time: number, text: string }[] = [];
        
        lines.forEach(line => {
          const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
          if (match) {
            const mins = parseInt(match[1], 10);
            const secs = parseInt(match[2], 10);
            const msStr = match[3];
            const ms = parseInt(msStr, 10) * (msStr.length === 2 ? 10 : 1);
            const time = mins * 60 + secs + ms / 1000;
            const content = match[4].trim();
            if (content) {
               parsed.push({ time, text: content });
            }
          }
        });
        setLyrics(parsed);
      } catch (err) {
        setLyrics([]);
      }
    };
    
    fetchLrc();
  }, [currentSong]);

  useEffect(() => {
     if (audioRef.current) {
        if (isPlaying) {
             audioRef.current.play().catch(e => {
                console.error("Play failed... possibly due to browser interaction policy", e);
                setIsPlaying(false);
             });
        } else {
             audioRef.current.pause();
        }
     }
  }, [isPlaying, currentIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const cyclePlayMode = () => {
      if (playMode === 'list-loop') setPlayMode('shuffle');
      else if (playMode === 'shuffle') setPlayMode('single-loop');
      else setPlayMode('list-loop');
  };

  const getNextIndex = (manual = false) => {
      if (playMode === 'single-loop' && !manual) return currentIndex;
      if (playMode === 'shuffle') return Math.floor(Math.random() * songs.length);
      return (currentIndex + 1) % songs.length;
  };

  const nextSong = (manual = true) => {
     setCurrentIndex(getNextIndex(manual));
     setIsPlaying(true);
  };
  
  const prevSong = () => {
     if (playMode === 'shuffle') {
         setCurrentIndex(Math.floor(Math.random() * songs.length));
     } else {
         setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
     }
     setIsPlaying(true);
  };
  
  const handleTimeUpdate = () => {
     if (audioRef.current) {
        const time = audioRef.current.currentTime;
        setCurrentTime(time);
        
        let activeIndex = 0;
        for (let i = 0; i < lyrics.length; i++) {
           if (time >= lyrics[i].time - 0.5) {
              activeIndex = i;
           } else {
              break;
           }
        }
        setCurrentLrcIndex(activeIndex);
     }
  };

  const handleEnded = () => {
      nextSong(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = parseFloat(e.target.value);
      setCurrentTime(time);
      if (audioRef.current) {
          audioRef.current.currentTime = time;
      }
  };

  const handleMouseEnter = () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      setIsHovered(true);
  };

  const handleMouseLeave = () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      // Give a slight delay before receding to prevent accidental slips
      hoverTimeoutRef.current = setTimeout(() => {
          setIsHovered(false);
          setShowLyrics(false);
          setShowPlaylists(false);
      }, 300);
  };

  if (loading || songs.length === 0) {
      return null;
  }

  // Determine width based on Hover
  // "left-1/2 -translate-x-1/2" keeps it centered. But if we want it to expand from left to right, we could anchor it "left-10" or similar?
  // User asked "从左到右滑出". Let's anchor it so the CD stays fixed on the left and expands rightwards.
  // Instead of fixed center, we position the player at a fixed spot (e.g. bottom-6 left-6, or bottom-6 right-6 ?)
  // The user didn't specify where, typically if they want left-to-right expansion, it might be on the left side.
  // To keep it centered but expand from left to right: we can't easily without layout animation.
  // Wait, if we use `fixed bottom-6 left-6 md:left-12`, the CD is anchored there and width simply grows! This natively expands left-to-right.

  return (
    <div 
       className="fixed bottom-6 left-6 md:left-12 z-[100]"
       onMouseEnter={handleMouseEnter}
       onMouseLeave={handleMouseLeave}
    >
       <audio
          ref={audioRef}
          src={currentSong.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={handleEnded}
       />
       
       <motion.div 
         className={cn(
             "transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] relative h-14",
             isHovered ? "w-[90vw] sm:w-[450px] md:w-[500px]" : "w-14"
         )}
         initial={{ y: 50, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ type: "spring", bounce: 0.3 }}
       >
         {/* Floating Panels: Above the player */}
         <AnimatePresence>
            {isHovered && showPlaylists && (
                 <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.2 }}
                    className="absolute bottom-full left-0 w-full mb-4 bg-white/70 dark:bg-black/70 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden z-20"
                 >
                     <div className="p-4 max-h-64 overflow-y-auto hide-scrollbar flex flex-col gap-2">
                         {playlists.length > 1 && (
                            <div className="mb-2 px-1">
                                <select 
                                   value={selectedPlaylistId} 
                                   onChange={(e) => setSelectedPlaylistId(e.target.value)}
                                   className="w-full bg-black/5 dark:bg-white/5 border border-transparent hover:border-black/10 dark:hover:border-white/10 rounded-lg p-2 text-xs font-bold font-sans text-neutral-900 dark:text-neutral-100 outline-none cursor-pointer transition-colors"
                                >
                                   {playlists.map(p => (
                                       <option 
                                          key={p.id} 
                                          value={p.id}
                                          className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                                       >
                                           {p.name}
                                       </option>
                                   ))}
                                </select>
                            </div>
                         )}
                         <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-2 flex justify-between">
                            <span>Song List</span>
                            <span>{songs.length} Tracks</span>
                         </p>
                         <div className="flex flex-col gap-1 mt-1">
                             {songs.map((song, idx) => (
                                 <button
                                    key={`${song.url}-${idx}`}
                                    onClick={() => {
                                       setCurrentIndex(idx);
                                       setIsPlaying(true);
                                    }}
                                    className={cn(
                                        "text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors w-full flex items-center justify-between group",
                                        currentIndex === idx 
                                           ? "bg-neutral-900 text-white dark:bg-white dark:text-black" 
                                           : "hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300"
                                    )}
                                 >
                                     <span className="truncate flex-1 min-w-0 pr-2">{idx + 1}. {song.title}</span>
                                     <span className={cn("text-[10px] shrink-0", currentIndex === idx ? "opacity-70" : "opacity-0 group-hover:opacity-60")}>
                                         {song.author}
                                     </span>
                                 </button>
                             ))}
                         </div>
                     </div>
                 </motion.div>
            )}

            {isHovered && showLyrics && !showPlaylists && (
                <motion.div
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   exit={{ y: 20, opacity: 0 }}
                   transition={{ type: "spring", bounce: 0.2 }}
                   className="absolute bottom-full left-0 w-full mb-4 bg-white/70 dark:bg-black/70 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl px-6 pb-6 pt-4 z-20"
                >
                    {/* Progress Bar */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-[9px] font-bold tracking-widest text-neutral-500">{formatTime(currentTime)}</span>
                        <div className="relative flex-1 h-3 group flex items-center">
                            <input 
                                type="range" 
                                min={0} 
                                max={duration || 100} 
                                value={currentTime}
                                onChange={handleSeek}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="w-full h-[3px] bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-300"
                                    style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                                />
                            </div>
                        </div>
                        <span className="text-[9px] font-bold tracking-widest text-neutral-500">{formatTime(duration)}</span>
                    </div>

                    {/* Lyrics Display */}
                    <div className="h-28 relative overflow-hidden flex flex-col items-center justify-center mask-image-vertical">
                        {lyrics.length > 0 ? (
                           <motion.div
                              className="absolute w-full space-y-3 transition-transform duration-500 ease-out text-center"
                              animate={{ y: `-${currentLrcIndex * 32}px`, top: '50%', marginTop: '-16px' }}
                           >
                              {lyrics.map((lrc, idx) => (
                                 <p 
                                   key={idx} 
                                   className={cn(
                                       "h-[20px] transition-all duration-500 transform text-sm font-bold tracking-tight px-4 truncate",
                                       idx === currentLrcIndex 
                                         ? "text-neutral-900 dark:text-white scale-110" 
                                         : "text-neutral-400/50 dark:text-white/30 scale-90 blur-[1px]"
                                   )}
                                 >
                                    {lrc.text}
                                 </p>
                              ))}
                           </motion.div>
                        ) : (
                            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Pure Music</p>
                        )}
                    </div>
                </motion.div>
            )}
         </AnimatePresence>

         {/* The Player Bar (always fixed as a pill) */}
         <div className="w-full h-full bg-white/70 dark:bg-black/70 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-lg rounded-full flex flex-none items-center relative z-10">
             <div className={cn("relative shrink-0 rounded-full overflow-hidden transition-all duration-500 my-auto ml-[6px]", isHovered ? "w-11 h-11" : "w-11 h-11")}>
                 <img 
                    src={currentSong.pic} 
                    alt={currentSong.title} 
                    className={cn(
                        "w-full h-full object-cover transition-all duration-1000",
                        isPlaying ? "animate-[spin_10s_linear_infinite]" : ""
                    )} 
                 />
                 <div className="absolute inset-0 bg-black/10 dark:bg-black/30 rounded-full"></div>
                 <div className="absolute inset-[35%] bg-white/80 dark:bg-black/80 rounded-full shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"></div>
             </div>
             
             <div className={cn("flex-1 min-w-0 flex items-center justify-between transition-all duration-500 ml-3", isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none")}>
                 {/* Track info (Click to open lyrics) */}
                 <div 
                    className="flex-1 min-w-0 flex flex-col justify-center cursor-pointer group py-1"
                    onClick={() => {
                        setShowLyrics(!showLyrics);
                        setShowPlaylists(false);
                    }}
                 >
                     <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-black dark:group-hover:text-white transition-colors">{currentSong.title}</p>
                     <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 dark:text-neutral-400 truncate">{currentSong.author}</p>
                 </div>

                 {/* Controls */}
                 <div className="flex items-center gap-1 pr-3">
                     <button title="Play Mode" onClick={cyclePlayMode} className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                         {playMode === 'list-loop' && <Repeat size={14} />}
                         {playMode === 'single-loop' && <Repeat1 size={14} />}
                         {playMode === 'shuffle' && <Shuffle size={14} />}
                     </button>
                     
                     <button onClick={prevSong} className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                         <SkipBack size={14} fill="currentColor" />
                     </button>
                     <button 
                        onClick={togglePlay} 
                        className="p-2 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-md mx-0.5"
                     >
                         {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                     </button>
                     <button onClick={() => nextSong(true)} className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                         <SkipForward size={14} fill="currentColor" />
                     </button>

                     {/* Divider */}
                     <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-800 mx-1"></div>

                     <button 
                        title="Song List" 
                        onClick={() => {
                            setShowPlaylists(!showPlaylists);
                            setShowLyrics(false);
                        }} 
                        className={cn(
                           "p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors rounded-full",
                           showPlaylists ? "bg-neutral-100/50 dark:bg-neutral-800/50" : ""
                        )}
                     >
                         <List size={14} />
                     </button>
                 </div>
             </div>
         </div>
       </motion.div>
    </div>
  )
}

// Utility to nicely format time
function formatTime(time: number) {
    if (isNaN(time)) return "00:00";
    const m = Math.floor(time / 60).toString().padStart(2, '0');
    const s = Math.floor(time % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}
