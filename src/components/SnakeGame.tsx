/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw } from 'lucide-react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';

const getRandomPoint = (): Point => ({
  x: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
  y: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
});

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>(getRandomPoint());
  const [direction, setDirection] = useState<Direction>(Direction.RIGHT);
  const [nextDirection, setNextDirection] = useState<Direction>(Direction.RIGHT);
  const [currentScore, setCurrentScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastMoveTimeRef = useRef<number>(0);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomPoint());
    setDirection(Direction.RIGHT);
    setNextDirection(Direction.RIGHT);
    setCurrentScore(0);
    onScoreChange(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };
      const currentDir = nextDirection;
      setDirection(currentDir);

      switch (currentDir) {
        case Direction.UP: newHead.y -= 1; break;
        case Direction.DOWN: newHead.y += 1; break;
        case Direction.LEFT: newHead.x -= 1; break;
        case Direction.RIGHT: newHead.x += 1; break;
      }

      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setIsGameOver(true);
        return prevSnake;
      }

      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        const nextScore = currentScore + 10;
        setCurrentScore(nextScore);
        onScoreChange(nextScore);
        setFood(getRandomPoint());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, isGameOver, isPaused, nextDirection, currentScore, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== Direction.DOWN) setNextDirection(Direction.UP); break;
        case 'ArrowDown': if (direction !== Direction.UP) setNextDirection(Direction.DOWN); break;
        case 'ArrowLeft': if (direction !== Direction.RIGHT) setNextDirection(Direction.LEFT); break;
        case 'ArrowRight': if (direction !== Direction.LEFT) setNextDirection(Direction.RIGHT); break;
        case ' ': setIsPaused((p) => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const speed = Math.max(MIN_SPEED, INITIAL_SPEED - (currentScore / 10) * SPEED_INCREMENT);
    
    const runGame = (time: number) => {
      if (time - lastMoveTimeRef.current >= speed) {
        moveSnake();
        lastMoveTimeRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(runGame);
    };

    if (!isPaused && !isGameOver) {
      gameLoopRef.current = requestAnimationFrame(runGame);
    }

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, isGameOver, currentScore]);

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full">
      <div 
        className="relative bg-dark-bg/80 border border-white/5 overflow-hidden"
        style={{ 
          width: 'min(90vw, 540px)', 
          aspectRatio: '1/1',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid opacity-10 pointer-events-none" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}>
           {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
             <div key={i} className="border-[0.5px] border-white/20"></div>
           ))}
        </div>

        {/* Snake Rendering */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${segment.x}-${segment.y}-${i}`}
            className={`${i === 0 ? 'bg-neon-cyan z-10 shadow-[0_0_15px_rgba(34,211,238,0.8)]' : 'bg-neon-cyan/40'} rounded-sm`}
            layoutId={`snake-${i}`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
              margin: '1px',
            }}
          />
        ))}

        {/* Food Rendering */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="bg-neon-pink rounded-full z-10 shadow-[0_0_15px_rgba(236,72,153,0.8)]"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            margin: '15%',
          }}
        />

        {/* HUD Elements */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none z-10">
          <div className="bg-black/60 backdrop-blur-md px-4 py-2 border border-white/10 rounded-lg">
            <p className="text-[8px] text-white/40 uppercase tracking-widest mb-1">District</p>
            <p className="text-sm font-mono tracking-tighter">09_NEON_VOID</p>
          </div>
          <div className="bg-black/60 backdrop-blur-md px-4 py-2 border border-white/10 rounded-lg">
            <p className="text-[8px] text-white/40 uppercase tracking-widest mb-1">Game Status</p>
            <p className="text-sm font-mono text-neon-cyan animate-pulse">ACTIVE_SYNC</p>
          </div>
        </div>

        {/* Overlay Overlays */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark-bg/90 backdrop-blur-xl flex flex-col items-center justify-center z-20"
            >
              {isGameOver ? (
                <div className="text-center space-y-6">
                  <h2 className="text-5xl font-black text-rose-600 uppercase italic tracking-tighter leading-none">Connection<br />Lost</h2>
                  <p className="text-xs text-white/40 uppercase tracking-[0.3em]">Final Score: {currentScore}</p>
                  <button 
                    onClick={resetGame}
                    className="group relative flex items-center gap-3 bg-white text-black px-8 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95"
                  >
                    <div className="absolute -inset-1 bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                    <RotateCcw size={18} /> Reconnect
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-black text-neon-cyan uppercase italic tracking-tighter">Sync Paused</h2>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="group relative flex items-center gap-3 bg-neon-cyan text-black px-8 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                  >
                    <Play size={18} fill="black" /> Resume Sync
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
