/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Activity, Info } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { TRACKS } from './constants';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const updateHighScore = (newScore: number) => {
    if (newScore > highScore) setHighScore(newScore);
  };

  return (
    <div className="w-full h-screen bg-[#050505] text-white font-sans flex flex-col overflow-hidden relative">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none grid-bg" />

      {/* Header */}
      <header className="h-20 border-b border-white/10 flex items-center justify-between px-10 relative z-10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-neon-cyan shadow-[0_0_15px_rgba(34,211,238,0.5)] flex items-center justify-center">
            <div className="w-4 h-4 bg-neon-cyan rounded-sm animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter uppercase italic">Synth <span className="text-neon-cyan">Snake</span></h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest leading-none">v1.0.4 // Neuro-Link Active</p>
          </div>
        </div>
        
        <div className="flex items-center gap-12">
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase tracking-widest">High Score</p>
            <p className="text-2xl font-mono text-neon-cyan">{highScore.toLocaleString().padStart(6, '0')}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Current Score</p>
            <p className="text-2xl font-mono text-neon-pink neon-text-pink">{score.toLocaleString().padStart(6, '0')}</p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex px-10 py-8 gap-8 relative z-10 overflow-hidden">
        {/* Side Panel */}
        <aside className="w-72 flex flex-col gap-6 shrink-0 h-full">
          {/* Playlist Panel */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10 flex flex-col overflow-hidden">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
               Neural Playlist
            </p>
            <div className="space-y-3 overflow-y-auto pr-1">
              {TRACKS.map((track, idx) => (
                <div 
                  key={track.id}
                  onClick={() => setCurrentTrackIndex(idx)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer border ${
                    currentTrackIndex === idx 
                    ? 'bg-neon-cyan/10 border-neon-cyan/30' 
                    : 'hover:bg-white/5 border-transparent'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${currentTrackIndex === idx ? 'bg-neon-cyan animate-pulse' : 'bg-white/20'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${currentTrackIndex === idx ? 'text-neon-cyan' : 'text-white'}`}>{track.title}</p>
                    <p className="text-[10px] text-white/40 truncate">{track.artist}</p>
                  </div>
                  <span className="text-[10px] font-mono text-white/20">0:00</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Panel */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10 flex flex-col h-full overflow-hidden">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity size={10} /> System Stats
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <span className="text-[10px] text-white/60">Game Status</span>
                <span className="font-mono text-[11px] text-neon-cyan">ACTIVE_SYNC</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <span className="text-[10px] text-white/60">Memory Usage</span>
                <span className="font-mono text-[11px]">8.2 GB</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <span className="text-[10px] text-white/60">District</span>
                <span className="font-mono text-[11px]">09_NEON</span>
              </div>
            </div>
            
            <div className="mt-auto pt-4 flex items-center gap-2 text-white/20">
               <Info size={12} />
               <p className="text-[9px] uppercase tracking-wide">Press SPACE to toggle pause</p>
            </div>
          </div>
        </aside>

        {/* Game Area */}
        <section className="flex-1 bg-black rounded-2xl border-4 border-white/10 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
           <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <SnakeGame 
                onScoreChange={(s) => {
                  setScore(s);
                  updateHighScore(s);
                }} 
              />
           </div>
        </section>
      </main>

      {/* Footer Player */}
      <footer className="h-24 border-t border-white/10 flex items-center px-10 bg-black/40 backdrop-blur-xl relative z-10">
        <MusicPlayer 
          currentIndex={currentTrackIndex} 
          onIndexChange={setCurrentTrackIndex} 
        />
      </footer>
    </div>
  );
}
