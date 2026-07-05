/**
 * Pointer.tsx — Luxury 3D Golden Prize Wheel Pointer
 *
 * Design features:
 * - Large 3D golden triangular pointer pointing left (towards the wheel).
 * - Deep 3D bevel split lighting:
 *   - Upper bevel: Polished bright gold chrome gradient.
 *   - Lower bevel: Rich dark burnished gold gradient.
 * - Heavy gold chrome mounting hub at the right end with a central hex bolt design.
 * - Multi-state dynamic animations:
 *   - Spinning: Rapid tick vibration mimicking pegs passing underneath.
 *   - Landed/Stopped: Heavy spring-loaded back-and-forth snap.
 *   - Idle: Soft vertical floating movement and pulsing golden backing glow.
 */

import React from 'react';
import { motion } from 'framer-motion';

interface PointerProps {
  wheelRadius: number;
  isLanded?: boolean;
  isSpinning?: boolean;
}

const Pointer: React.FC<PointerProps> = ({ isLanded = false, isSpinning = false }) => {
  // Determine rotation animation based on state
  let pointerAnimation: any = { rotate: 0, y: 0 };
  let pointerTransition: any = {};

  if (isSpinning) {
    // Rapid peg ticking vibration (shakes rapidly up and down)
    pointerAnimation = {
      rotate: [0, -10, 6, -9, 5, -8, 0],
    };
    pointerTransition = {
      duration: 0.16,
      repeat: Infinity,
      ease: 'linear',
    };
  } else if (isLanded) {
    // Heavy spring snap-back
    pointerAnimation = {
      rotate: [0, -18, 12, -4, 0],
    };
    pointerTransition = {
      type: 'spring' as const,
      stiffness: 420,
      damping: 9,
    };
  } else {
    // Idle state: gentle floating hover
    pointerAnimation = {
      y: [0, -2.5, 2.5, 0],
    };
    pointerTransition = {
      duration: 3.5,
      repeat: Infinity,
      ease: 'easeInOut',
    };
  }

  return (
    <div className="w-full h-full relative z-20 flex items-center justify-start pointer-events-none select-none">
      {/* Luxury Golden Glow Backing */}
      <motion.div
        className="absolute w-full h-full rounded-full blur-xl pointer-events-none"
        style={{
          background: isLanded
            ? 'radial-gradient(circle, rgba(255,215,0,0.85) 0%, rgba(218,165,32,0.25) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,193,7,0.55) 0%, rgba(184,134,11,0.12) 60%, transparent 80%)',
          right: '-10%',
          top: '0%',
        }}
        animate={{ opacity: isLanded ? [0.75, 1.0, 0.75] : [0.4, 0.65, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 120 70"
        fill="none"
        animate={pointerAnimation}
        transition={pointerTransition}
        style={{
          transformOrigin: '92px 35px',
          filter: `
            drop-shadow(0 0 18px rgba(255,193,7,0.85))
            drop-shadow(0 5px 14px rgba(0,0,0,0.70))
          `,
        }}
      >
        <defs>
          {/* Polished Gold Chrome (Upper Bevel) */}
          <linearGradient id="goldLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFDE7" />
            <stop offset="25%" stopColor="#FFF59D" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="85%" stopColor="#FFC107" />
            <stop offset="100%" stopColor="#FFA000" />
          </linearGradient>

          {/* Burnished Deep Gold (Lower Bevel) */}
          <linearGradient id="goldDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFC107" />
            <stop offset="45%" stopColor="#FFA000" />
            <stop offset="70%" stopColor="#B8860B" />
            <stop offset="100%" stopColor="#5D4037" />
          </linearGradient>

          {/* Golden Hub Plate Gradient */}
          <linearGradient id="goldHubGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFDE7" />
            <stop offset="20%" stopColor="#FFE082" />
            <stop offset="55%" stopColor="#FFB300" />
            <stop offset="85%" stopColor="#B8860B" />
            <stop offset="100%" stopColor="#3E2723" />
          </linearGradient>

          {/* Hex Bolt Gold Gradient */}
          <linearGradient id="goldBoltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="30%" stopColor="#FFE082" />
            <stop offset="70%" stopColor="#FFB300" />
            <stop offset="100%" stopColor="#5D4037" />
          </linearGradient>

          {/* White sheen light stripe */}
          <linearGradient id="goldSheen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.10" />
          </linearGradient>
        </defs>

        {/* ── Outer Gold Metallic Border ── */}
        <polygon
          points="5,35 85,12 85,58"
          fill="none"
          stroke="url(#goldLight)"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />

        {/* ── Inner Gold 3D Bevel Facets ── */}
        {/* Upper face: polished bright gold */}
        <path d="M 8 35 L 83 15 L 83 35 Z" fill="url(#goldLight)" />

        {/* Lower face: burnished gold */}
        <path d="M 8 35 L 83 35 L 83 55 Z" fill="url(#goldDark)" />

        {/* Gloss highlight line along top edge */}
        <path d="M 8 35 L 83 15" stroke="url(#goldSheen)" strokeWidth="2.0" strokeLinecap="round" />

        {/* Separator ridge shadow (center crease of triangle) */}
        <line x1="8" y1="35" x2="83" y2="35" stroke="#3E2723" strokeWidth="1.2" opacity="0.45" />

        {/* ── Heavy Gold Mounting Hub ── */}
        {/* Hub shadow overlay */}
        <circle cx="92" cy="35" r="26" fill="#0C0702" opacity="0.75" />

        {/* Golden outer plate */}
        <circle cx="92" cy="35" r="24" fill="url(#goldHubGrad)" stroke="#FFFFFF" strokeWidth="0.8" />
        <circle cx="92" cy="35" r="20" fill="none" stroke="#FFE082" strokeWidth="1.2" opacity="0.45" />

        {/* Center hex bolt head */}
        <polygon
          points="92,23 102,29 102,41 92,47 82,41 82,29"
          fill="url(#goldBoltGrad)"
          stroke="#4E342E"
          strokeWidth="1.0"
        />

        {/* Inner bolt socket pin */}
        <circle cx="92" cy="35" r="6" fill="#2E1C0C" />
        <circle cx="91" cy="34" r="1.8" fill="#FFFFFF" opacity="0.8" />
      </motion.svg>
    </div>
  );
};

export default Pointer;
