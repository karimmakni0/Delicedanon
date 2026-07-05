/**
 * Pointer.tsx — Premium Casino-Style Triangular Pointer
 *
 * Design features:
 * - Thick, substantial 3D triangular pointer pointing left (towards the wheel).
 * - Rich glossy blue body with split 3D lighting (light blue upper, dark navy lower).
 * - Thick metallic chrome/silver outer border.
 * - Solid heavy chrome mounting hub (base plate + bolt head) at the right end.
 * - Dynamic snap/jiggle pivoting around the hub center (96, 25).
 */

import React from 'react';
import { motion } from 'framer-motion';

interface PointerProps {
  wheelRadius: number;
  isLanded?: boolean;
}

const Pointer: React.FC<PointerProps> = ({ isLanded = false }) => {
  // Classic snap rotation when hitting pegs: lifts up slightly and snaps back
  const pointerAnimation = isLanded
    ? { rotate: [0, -14, 9, -3, 0] }
    : { rotate: 0 };

  const pointerTransition = isLanded
    ? { type: 'spring' as const, stiffness: 420, damping: 10 }
    : { duration: 0.15 };

  return (
    <div className="w-full h-full relative z-20 flex items-center justify-start pointer-events-none select-none">
      {/* Intense backing glow for high presence */}
      <motion.div
        className="absolute w-full h-full rounded-full blur-xl pointer-events-none"
        style={{
          background: isLanded
            ? 'radial-gradient(circle, rgba(0,191,255,0.90) 0%, rgba(0,80,255,0.25) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0,102,255,0.55) 0%, rgba(0,35,160,0.12) 60%, transparent 80%)',
          right: '-10%',
          top: '0%',
        }}
        animate={{ opacity: isLanded ? [0.75, 1.0, 0.75] : [0.4, 0.65, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 120 50"
        fill="none"
        animate={pointerAnimation}
        transition={pointerTransition}
        style={{
          transformOrigin: '96px 25px',
          filter: `
            drop-shadow(0 0 15px rgba(0,160,255,0.85))
            drop-shadow(0 4px 12px rgba(0,8,42,0.65))
          `,
        }}
      >
        <defs>
          {/* Metallic Silver Border Gradient */}
          <linearGradient id="silverChromeBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#CFD8DC" />
            <stop offset="50%" stopColor="#78909C" />
            <stop offset="75%" stopColor="#ECEFF1" />
            <stop offset="100%" stopColor="#37474F" />
          </linearGradient>

          {/* Heavy Chrome Hub Plate Gradient */}
          <linearGradient id="chromeHub" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ECEFF1" />
            <stop offset="45%" stopColor="#90A4AE" />
            <stop offset="100%" stopColor="#263238" />
          </linearGradient>

          {/* Bolt Head Chrome Gradient */}
          <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#B0BEC5" />
            <stop offset="100%" stopColor="#37474F" />
          </linearGradient>

          {/* Glossy Upper Blue Body Bevel */}
          <linearGradient id="glossyBlueUpper" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="35%" stopColor="#00A2FF" />
            <stop offset="100%" stopColor="#0052FF" />
          </linearGradient>

          {/* Deeper Lower Blue Body Bevel */}
          <linearGradient id="glossyBlueLower" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#004CFF" />
            <stop offset="50%" stopColor="#002DCC" />
            <stop offset="100%" stopColor="#0A1880" />
          </linearGradient>

          {/* Sheen Highlight along the top edge */}
          <linearGradient id="sheenHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* ── Outer Metallic Border (Triangular shape) ── */}
        <polygon
          points="6,25 90,8 90,42"
          fill="none"
          stroke="url(#silverChromeBorder)"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />

        {/* ── Inner Blue Body bevels ── */}
        {/* Upper half bevel */}
        <path d="M 8 25 L 88 10 L 88 25 Z" fill="url(#glossyBlueUpper)" />

        {/* Lower half bevel */}
        <path d="M 8 25 L 88 25 L 88 40 Z" fill="url(#glossyBlueLower)" />

        {/* Gloss sheen overlay on top half edge */}
        <path d="M 8 25 L 88 10" stroke="url(#sheenHighlight)" strokeWidth="1.8" strokeLinecap="round" />

        {/* Ridge Separator Line */}
        <line x1="8" y1="25" x2="88" y2="25" stroke="#001850" strokeWidth="1.0" opacity="0.4" />

        {/* ── Heavy Chrome Pivot Hub ── */}
        {/* Base plate shadow gap */}
        <circle cx="96" cy="25" r="21" fill="#060C14" opacity="0.6" />

        {/* Base plate */}
        <circle cx="96" cy="25" r="19" fill="url(#chromeHub)" stroke="#FFFFFF" strokeWidth="0.8" />
        <circle cx="96" cy="25" r="16" fill="none" stroke="#FFFFFF" strokeWidth="1.0" opacity="0.4" />

        {/* Center attachment bolt head */}
        <circle cx="96" cy="25" r="10" fill="url(#boltGrad)" stroke="#263238" strokeWidth="0.8" />
        {/* Inner socket/recess */}
        <circle cx="96" cy="25" r="5" fill="#1A2226" />
        {/* White pinhead dot */}
        <circle cx="95" cy="24" r="1.5" fill="#FFFFFF" opacity="0.8" />
      </motion.svg>
    </div>
  );
};

export default Pointer;
