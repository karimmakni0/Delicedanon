/**
 * Pointer.tsx — Premium Long 3D Metallic Needle Pointer
 *
 * Design features:
 * - Long 3D metallic needle pointing from right to left (toward the wheel).
 * - Split lighting chrome needle (upper light, lower dark) for realistic 3D depth.
 * - Circular gold chrome pivot base at the right end.
 * - Snap/jiggle animation pivoting perfectly around the base center (105, 20).
 * - Responsive w-full h-full SVG styling.
 */

import React from 'react';
import { motion } from 'framer-motion';

interface PointerProps {
  wheelRadius: number;
  isLanded?: boolean;
}

const Pointer: React.FC<PointerProps> = ({ isLanded = false }) => {
  // Pivot jiggle: needle tips up/down slightly when hitting wheel pins
  const pointerAnimation = isLanded
    ? { rotate: [0, -12, 8, -3, 0] }
    : { rotate: 0 };

  const pointerTransition = isLanded
    ? { type: 'spring' as const, stiffness: 400, damping: 10 }
    : { duration: 0.15 };

  return (
    <div className="w-full h-full relative z-20 flex items-center justify-start pointer-events-none select-none">
      {/* Soft blue glow backing the base */}
      <motion.div
        className="absolute w-2/3 h-full rounded-full blur-lg pointer-events-none"
        style={{
          background: isLanded
            ? 'radial-gradient(circle, rgba(0,229,255,0.85) 0%, rgba(0,102,255,0.25) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0,102,255,0.50) 0%, rgba(0,40,150,0.10) 60%, transparent 80%)',
          right: '-10%',
          top: '0%',
        }}
        animate={{ opacity: isLanded ? [0.6, 0.9, 0.6] : [0.35, 0.6, 0.35] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 120 40"
        fill="none"
        animate={pointerAnimation}
        transition={pointerTransition}
        style={{
          transformOrigin: '105px 20px',
          filter: `
            drop-shadow(0 0 12px rgba(0,180,255,0.75))
            drop-shadow(0 3px 8px rgba(0,8,40,0.50))
          `,
        }}
      >
        <defs>
          {/* Chrome needle top-half bevel (light) */}
          <linearGradient id="needleLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#ECEFF1" />
            <stop offset="100%" stopColor="#CFD8DC" />
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
        </defs>

        {/* ── Needle Body (Left-pointing Long Arrow) ── */}
        {/* Upper face: Light bevel */}
        <path d="M 5 20 L 105 10 L 105 20 Z" fill="url(#needleLight)" />

        {/* Lower face: Dark bevel */}
        <path d="M 5 20 L 105 20 L 105 30 Z" fill="url(#needleDark)" />

        {/* Highlight edge line along the upper bevel rim */}
        <path d="M 5 20 L 105 10" stroke="url(#sheenStroke)" strokeWidth="1.2" strokeLinecap="round" />

        {/* Dark separator line along the bottom bevel rim */}
        <path d="M 5 20 L 105 30" stroke="#1C2D37" strokeWidth="1.0" opacity="0.5" />

        {/* Ridge shadow separator (centerline of 3D needle) */}
        <line x1="5" y1="20" x2="105" y2="20" stroke="#37474F" strokeWidth="1.0" opacity="0.4" />

        {/* ── Golden Chrome Pivot Base ── */}
        {/* Outer shadow ring */}
        <circle cx="105" cy="20" r="14" fill="#0E1929" opacity="0.6" />

        {/* Golden outer rim */}
        <circle cx="105" cy="20" r="12" fill="url(#goldBase)" stroke="#FFFFFF" strokeWidth="0.6" />

        {/* Inner dark groove */}
        <circle cx="105" cy="20" r="8" fill="#0D2040" />

        {/* Center blue gem */}
        <circle
          cx="105"
          cy="20"
          r="6.5"
          fill="url(#blueGlassGem)"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          style={{ filter: 'drop-shadow(0 0 3px rgba(0,229,255,0.85))' }}
        />

        {/* Gem reflection sheen */}
        <path
          d="M 100 18 A 5 5 0 0 1 110 18 Z"
          fill="#FFFFFF"
          opacity="0.6"
        />

        {/* Tiny center dot */}
        <circle cx="105" cy="20" r="1.5" fill="#FFFFFF" opacity="0.9" />
      </motion.svg>
    </div>
  );
};

export default Pointer;
