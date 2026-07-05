/**
 * Pointer.tsx — Premium 3D Metallic Pointer
 *
 * Design features:
 * - 3D metallic bevel dial pointer pointing to the wheel center (left).
 * - Split lighting chrome needle (upper light, lower dark) for realistic 3D bevel.
 * - Golden chrome pivot base with radial neon blue glass gem.
 * - Dynamic pointer jiggle pivoting perfectly around the base center (75, 40).
 * - Responsive sizing (scales to fit its parent container).
 */

import React from 'react';
import { motion } from 'framer-motion';

interface PointerProps {
  wheelRadius: number;
  isLanded?: boolean;
}

const Pointer: React.FC<PointerProps> = ({ isLanded = false }) => {
  // Pivot jiggle rotation: rotates slightly up/down and back when peg hits/lands
  const pointerAnimation = isLanded
    ? { rotate: [0, -15, 10, -4, 0] }
    : { rotate: 0 };

  const pointerTransition = isLanded
    ? { type: 'spring' as const, stiffness: 380, damping: 12 }
    : { duration: 0.15 };

  return (
    <div className="w-full h-full relative z-20 flex items-center justify-center pointer-events-none select-none">
      {/* Pulsing neon backing glow */}
      <motion.div
        className="absolute w-2/3 h-2/3 rounded-full blur-xl pointer-events-none"
        style={{
          background: isLanded
            ? 'radial-gradient(circle, rgba(0,229,255,0.90) 0%, rgba(0,102,255,0.30) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0,102,255,0.60) 0%, rgba(0,40,150,0.15) 60%, transparent 80%)',
          right: '5%',
          top: '15%',
        }}
        animate={{ opacity: isLanded ? [0.7, 1.0, 0.7] : [0.4, 0.7, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 100 80"
        fill="none"
        animate={pointerAnimation}
        transition={pointerTransition}
        style={{
          transformOrigin: '75px 40px',
          filter: `
            drop-shadow(0 0 14px rgba(0,180,255,0.80))
            drop-shadow(0 4px 10px rgba(0,8,40,0.60))
          `,
        }}
      >
        <defs>
          {/* Chrome needle top-half bevel (light) */}
          <linearGradient id="needleLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#ECEFF1" />
            <stop offset="100%" stopColor="#B0BEC5" />
          </linearGradient>

          {/* Chrome needle bottom-half bevel (dark shadow) */}
          <linearGradient id="needleDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#90A4AE" />
            <stop offset="60%" stopColor="#455A64" />
            <stop offset="100%" stopColor="#263238" />
          </linearGradient>

          {/* Golden base ring gradient */}
          <linearGradient id="goldBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFDE7" />
            <stop offset="30%" stopColor="#FFE082" />
            <stop offset="70%" stopColor="#FFB300" />
            <stop offset="100%" stopColor="#E65100" />
          </linearGradient>

          {/* Blue glass gem radial fill */}
          <radialGradient id="blueGlassGem" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#E0F7FA" />
            <stop offset="35%" stopColor="#00E5FF" />
            <stop offset="75%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#0A1966" />
          </radialGradient>

          {/* Bevel highlight stroke */}
          <linearGradient id="sheenStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="80%" stopColor="#FFFFFF" stopOpacity="0.2" />
          </linearGradient>

          {/* Base outer ring glow overlay */}
          <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00E5FF" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* ── Needle Body (Left-pointing Arrow) ── */}
        {/* Upper face: Light bevel */}
        <path d="M 15 40 L 70 24 L 70 40 Z" fill="url(#needleLight)" />

        {/* Lower face: Dark bevel */}
        <path d="M 15 40 L 70 40 L 70 56 Z" fill="url(#needleDark)" />

        {/* Highlight edge line along the upper rim */}
        <path d="M 15 40 L 70 24" stroke="url(#sheenStroke)" strokeWidth="1.5" strokeLinecap="round" />

        {/* Dark separator line along the bottom rim */}
        <path d="M 15 40 L 70 56" stroke="#1C2D37" strokeWidth="1.2" opacity="0.6" />

        {/* Ridge shadow separator (centerline of 3D needle) */}
        <line x1="15" y1="40" x2="70" y2="40" stroke="#37474F" strokeWidth="1.2" opacity="0.5" />

        {/* ── Golden Chrome Pivot Base ── */}
        {/* Shadow gap ring */}
        <circle cx="75" cy="40" r="23" fill="#0E1929" opacity="0.8" />

        {/* Golden outer rim */}
        <circle cx="75" cy="40" r="21" fill="url(#goldBase)" stroke="#FFFFFF" strokeWidth="0.8" />

        {/* Golden rim highlight ring */}
        <circle cx="75" cy="40" r="18" fill="none" stroke="#FFF9C4" strokeWidth="1.2" opacity="0.5" />

        {/* Inner dark groove */}
        <circle cx="75" cy="40" r="14" fill="#0D2040" />

        {/* Neon blue center gem/glass cap */}
        <circle
          cx="75"
          cy="40"
          r="11"
          fill="url(#blueGlassGem)"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          style={{ filter: 'drop-shadow(0 0 5px rgba(0,229,255,0.85))' }}
        />

        {/* Gem crescent gloss reflection */}
        <path
          d="M 66 36 A 9 9 0 0 1 84 36 Z"
          fill="#FFFFFF"
          opacity="0.65"
        />

        {/* Tiny pinhead center dot */}
        <circle cx="75" cy="40" r="2.2" fill="#FFFFFF" opacity="0.85" />
      </motion.svg>
    </div>
  );
};

export default Pointer;
