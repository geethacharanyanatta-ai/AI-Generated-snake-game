/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { TRACKS } from '../constants';

interface MusicPlayerProps {
  currentIndex: number;
  onIndexChange: (idx: number) => void;
}

export default function MusicPlayer({ currentIndex, onIndexChange }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const currentTrack = TRACKS[currentIndex];

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleSkip(1);
            return 0;
          }
          return prev + (100 / currentTrack.duration);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  // Reset progress when track changes
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  const handleSkip = (dir: number) => {
    let next = currentIndex + dir;
    if (next < 0) next = TRACKS.length - 1;
    if (next >= TRACKS.length) next = 0;
    onIndexChange(next);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex items-center h-full">
      {/* Current Track Info */}
      <div className="w-72 flex items-center gap-4 shrink-0 overflow-hidden">
        <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className={`w-full h-full object-cover opacity-50 ${isPlaying ? 'animate-pulse scale-110' : ''}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-neon-cyan/20 to-neon-pink/20 mix-blend-overlay" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold truncate leading-tight">{currentTrack.title}</p>
          <p className="text-[10px] text-white/40 uppercase tracking-widest truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex-1 flex flex-col items-center gap-2 px-10">
        <div className="flex items-center gap-10">
          <button 
            onClick={() => handleSkip(-1)}
            className="text-white/60 hover:text-white transition-colors p-1"
          >
            <SkipBack size={20} fill="white" />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
          >
            {isPlaying ? <Pause size={22} fill="black" /> : <Play size={22} fill="black" className="ml-1" />}
          </button>

          <button 
            onClick={() => handleSkip(1)}
            className="text-white/60 hover:text-white transition-colors p-1"
          >
            <SkipForward size={20} fill="white" />
          </button>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full max-w-xl flex items-center gap-3">
          <span className="text-[10px] font-mono text-white/40 w-10 text-right">
            {formatTime((progress / 100) * currentTrack.duration)}
          </span>
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group">
            <motion.div 
              className="h-full bg-neon-cyan relative"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'linear' }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_10px_white]" />
            </motion.div>
          </div>
          <span className="text-[10px] font-mono text-white/40 w-10">
            {formatTime(currentTrack.duration)}
          </span>
        </div>
      </div>

      {/* Volume / Additional Controls */}
      <div className="w-72 flex justify-end items-center gap-4 shrink-0">
        <Volume2 size={16} className="text-white/40" />
        <div className="w-24 h-1 bg-white/10 rounded-full relative group cursor-pointer">
          <div className="absolute inset-0 bg-white/40 rounded-full w-[70%] group-hover:bg-neon-cyan transition-colors" />
        </div>
      </div>
    </div>
  );
}
