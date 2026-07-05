/**
 * Pointer.tsx — Premium Commercial Edition v2
 *
 * Larger metallic pointer with:
 * • Richer chrome gradient body
 * • Stronger neon blue glow
 * • Better proportions (wider base, longer tip)
 * • Chrome cap with bright highlight
 * • Pulsing blue gem at tip
 */

import React from 'react';
import { motion } from 'framer-motion';

interface PointerProps {
  wheelRadius: number;
  isLanded?: boolean;
}

const Pointer: React.FC<PointerProps> = ({ wheelRadius: _wr, isLanded = false }) => {
  const W = 100;  // pointer SVG width
  const H = 130;  // pointer SVG height

  const pointerAnimation = isLanded
    ? { x: [0, -20, 10, -5, 0], rotate: [0, 12, -8, 3, 0] }
    : { x: [0, -5, 0], rotate: 0 };

  const pointerTransition = isLanded
    ? { type: 'spring' as const, stiffness: 420, damping: 14 }
    : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' as const };

  return (
    <div
      className="relative z-20 flex items-center justify-center pointer-events-none select-none"
      style={{ width: W, height: H * 1.2, marginRight: -42 }}
    >
      {/* Pulsing glow aura */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background: isLanded
            ? 'radial-gradient(circle, rgba(0,240,255,0.95) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(20,110,210,0.80) 0%, transparent 65%)',
          scale: 2.8,
        }}
        animate={{ opacity: isLanded ? [0.6, 1.0, 0.6] : [0.35, 0.75, 0.35] }}
        transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Pointer SVG body */}
      <motion.svg
        width={W}
        height={H}
        viewBox="0 0 52 68"
        fill="none"
        animate={pointerAnimation}
        transition={pointerTransition}
        style={{
          filter: `
            drop-shadow(0 0 18px rgba(0,200,255,0.90))
            drop-shadow(0 0  7px rgba(0, 80,210,0.80))
            drop-shadow(0 10px 28px rgba(0,20,80,0.70))
          `,
        }}
      >
        <defs>
          {/* Main chrome body gradient (left-to-right metallic) */}
          <linearGradient id="pBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#FFFFFF"  />
            <stop offset="20%"  stopColor="#E3F2FD"  />
            <stop offset="50%"  stopColor="#90CAF9"  />
            <stop offset="78%"  stopColor="#1565C0"  />
            <stop offset="100%" stopColor="#0D3B86"  />
          </linearGradient>

          {/* Top-to-bottom sheen */}
          <linearGradient id="pShineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.82" />
            <stop offset="35%"  stopColor="#FFFFFF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.30" />
          </linearGradient>

          {/* Chrome cap gradient */}
          <linearGradient id="pCapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#ECEFF1" />
            <stop offset="40%"  stopColor="#78909C" />
            <stop offset="100%" stopColor="#263238" />
          </linearGradient>

          {/* Neon glow filter */}
          <filter id="pNeonGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#1976D2" floodOpacity="0.95" />
          </filter>
        </defs>

        {/* White neon outline */}
        <polygon
          points="2,34 48,5 48,63"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4"
          filter="url(#pNeonGlow)"
        />

        {/* Deep blue border */}
        <polygon
          points="2,34 48,5 48,63"
          fill="none"
          stroke="#003399"
          strokeWidth="2.5"
        />

        {/* Chrome body fill */}
        <polygon points="3,34 47,6 47,62" fill="url(#pBodyGrad)" />

        {/* Sheen overlay */}
        <polygon points="3,34 47,6 47,62" fill="url(#pShineGrad)" />

        {/* Right-edge chrome cap — thicker */}
        <rect x="44" y="4" width="6" height="60" rx="3" fill="url(#pCapGrad)" stroke="#FFFFFF" strokeWidth="0.8" />

        {/* Chrome cap highlight */}
        <rect x="44.5" y="4.5" width="1.5" height="28" rx="0.75" fill="rgba(255,255,255,0.55)" />

        {/* Red Délice accent dot on cap */}
        <circle cx="47" cy="34" r="3.5" fill="#E53935" />

        {/* Neon blue gem at the tip */}
        <circle
          cx="5" cy="34" r="5.5"
          fill="#00BFFF"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          style={{ filter: 'drop-shadow(0 0 7px rgba(0,200,255,0.95))' }}
        />
        {/* Gem highlight */}
        <circle cx="3.5" cy="32" r="1.8" fill="rgba(255,255,255,0.70)" />
      </motion.svg>
    </div>
  );
};

export default Pointer;
