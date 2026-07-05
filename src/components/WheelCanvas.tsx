/**
 * WheelCanvas.tsx — Premium Commercial Edition v2
 *
 * Visual refinements in this version:
 * • Larger center badge (capR = radius * 0.30)
 * • Richer glossy gradients per segment (tri-stop radial)
 * • Stronger chrome metallic rim with bevel highlights
 * • Blue neon glow rim with double-layer diffuse
 * • Deeper ambient shadow below whole wheel
 * • Stronger center cap: chrome ring + glass fill + crescent sheen + logo clip
 * • Product images at 40% of radius, with drop shadow and float class
 * • Static top-half glass reflection overlay
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import wheelConfig from '../config/wheelConfig';

const toRad  = (d: number) => (d * Math.PI) / 180;
const polarToCart = (cx: number, cy: number, r: number, deg: number) => ({
  x: cx + r * Math.sin(toRad(deg)),
  y: cy - r * Math.cos(toRad(deg)),
});
const buildArcPath = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const s = polarToCart(cx, cy, r, a0);
  const e = polarToCart(cx, cy, r, a1);
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${e.x} ${e.y} Z`;
};

interface WheelCanvasProps {
  rotation: number;
  isSpinning: boolean;
  radius?: number;
  spinDuration?: number;
}

const WheelCanvas: React.FC<WheelCanvasProps> = ({ rotation, isSpinning, radius = 300, spinDuration }) => {
  const { segments, logoImage, spinDuration: defaultDuration } = wheelConfig;
  // Cap spin duration strictly between 4.0 and 6.0 seconds for suspense
  const effectiveDuration = Math.min(6000, Math.max(4000, spinDuration ?? defaultDuration));
  const n        = segments.length;
  const segAngle = 360 / n;

  const size = (radius + 26) * 2;
  const cx   = size / 2;
  const cy   = size / 2;

  // Center cap — larger and more prominent
  const capR = radius * 0.30;

  const segData = useMemo(() =>
    segments.map((seg, i) => {
      const start = i * segAngle;
      const end   = start + segAngle;
      const mid   = start + segAngle / 2;
      // Position product images at 61% radius (well centered in segment)
      const imgPos = polarToCart(cx, cy, radius * 0.61, mid);
      return { ...seg, start, end, mid, imgPos, path: buildArcPath(cx, cy, radius, start, end) };
    }), [segments, segAngle, radius, cx, cy]);

  const spinTransition = {
    type:     'tween' as const,
    duration: isSpinning ? effectiveDuration / 1000 : 0,
    // [0.25, 0.05, 0.12, 1.06]: slow start -> rapid acceleration -> progressive deceleration -> subtle bounce-back at the end
    ease:     (isSpinning ? [0.25, 0.05, 0.12, 1.06] : 'linear') as any,
  };

  // Product image base size: 45% of radius on desktop, ~58% of radius on mobile (~28% increase)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const productImgScale = isMobile ? 0.58 : 0.45;
  const productImgSize = radius * productImgScale;

  return (
    <div
      className="relative flex items-center justify-center select-none w-full h-full"
    >

      {/* ── Multi-layer ambient shadow below wheel ── */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: `
            0 0 80px rgba(0,100,255,0.40),
            0 0 160px rgba(0,60,180,0.18),
            0 40px 100px -20px rgba(0,10,50,0.95),
            0 20px 50px -10px rgba(0,0,0,0.70)
          `,
        }}
      />

      {/* ── Chrome Metallic Bevel Ring ── */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `linear-gradient(
            145deg,
            #FFFFFF 0%,
            #E8EEF3 10%,
            #B8C8D4 22%,
            #607D8B 38%,
            #90A4AE 52%,
            #ECEFF1 65%,
            #CFD8DC 78%,
            #546E7A 90%,
            #263238 100%
          )`,
          padding: '1.8%', // relative padding so it scales down on mobile
          boxShadow: `
            inset 0  5px 12px rgba(255,255,255,0.95),
            inset 0 -5px 12px rgba(0,0,0,0.50),
            inset 3px 0 8px rgba(255,255,255,0.30),
            0 0 50px rgba(0,180,255,0.25)
          `,
        }}
      >
        {/* Dark groove inner ring */}
        <div
          className="w-full h-full rounded-full"
          style={{
            background: 'linear-gradient(180deg, #001840 0%, #000b1e 100%)',
            padding: '1.2%',
          }}
        >
          <div className="w-full h-full rounded-full bg-black opacity-90" />
        </div>
      </div>

      {/* ── Rotating SVG Wheel ── */}
      <motion.svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'visible',
          filter: isSpinning
            ? 'blur(1.6px) drop-shadow(0 0 15px rgba(0, 180, 255, 0.45))'
            : 'none',
          transition: 'filter 0.3s ease',
        }}
        animate={{ rotate: rotation }}
        transition={spinTransition}
      >
        <defs>
          {/* Rich radial gradient per segment — 4-stop with highlight, mid, base, shadow */}
          {segData.map((seg, i) => (
            <radialGradient key={`rg-${i}`} id={`sg-${i}`} cx="32%" cy="20%" r="82%">
              <stop offset="0%"   stopColor={seg.colorLight} stopOpacity="1"    />
              <stop offset="30%"  stopColor={seg.colorLight} stopOpacity="0.85" />
              <stop offset="65%"  stopColor={seg.color}      stopOpacity="1"    />
              <stop offset="100%" stopColor={seg.color}      stopOpacity="0.80" />
            </radialGradient>
          ))}

          {/* Global gloss sheen over all segments */}
          <radialGradient id="segSheen" cx="50%" cy="4%" r="96%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.48)" />
            <stop offset="30%"  stopColor="rgba(255,255,255,0.10)" />
            <stop offset="70%"  stopColor="rgba(255,255,255,0.02)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.22)"       />
          </radialGradient>

          {/* Center cap radial fill */}
          <radialGradient id="capFill" cx="35%" cy="25%" r="75%">
            <stop offset="0%"   stopColor="#FFFFFF"  />
            <stop offset="50%"  stopColor="#EEF4FF"  />
            <stop offset="100%" stopColor="#BDD5FE"  />
          </radialGradient>

          {/* Chrome gradient used on rings and stand */}
          <linearGradient id="chromeBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#FFFFFF"  />
            <stop offset="20%"  stopColor="#E3ECF2"  />
            <stop offset="40%"  stopColor="#78909C"  />
            <stop offset="60%"  stopColor="#ECEFF1"  />
            <stop offset="80%"  stopColor="#B0BEC5"  />
            <stop offset="100%" stopColor="#263238"  />
          </linearGradient>

          {/* Glass crescent sheen gradient */}
          <linearGradient id="glassSheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="50%"  stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"    />
          </linearGradient>

          {/* Product image drop shadow */}
          <filter id="productShadow" x="-30%" y="-30%" width="165%" height="165%">
            <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#000000" floodOpacity="0.55" />
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000033" floodOpacity="0.30" />
          </filter>

          {/* Center cap glow filter */}
          <filter id="capGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Center cap inset shadow */}
          <filter id="capInsetShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000040" floodOpacity="0.65" />
          </filter>

          {/* CRITICAL: circular clip for logo — hides square PNG bg */}
          <clipPath id="circleLogoClip">
            <circle cx={cx} cy={cy} r={capR * 0.78} />
          </clipPath>

          {/* Top-half wheel glass reflection */}
          <linearGradient id="wheelGlassTop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.42" />
            <stop offset="22%"  stopColor="#FFFFFF" stopOpacity="0.10" />
            <stop offset="50%"  stopColor="#FFFFFF" stopOpacity="0"    />
          </linearGradient>
        </defs>

        {/* ── Segment fills with gloss ── */}
        {segData.map((seg, i) => (
          <g key={seg.id}>
            <path d={seg.path} fill={`url(#sg-${i})`} />
            <path d={seg.path} fill="url(#segSheen)" opacity="0.80" />
          </g>
        ))}

        {/* ── Separator lines ── */}
        {segData.map((seg) => {
          const p = polarToCart(cx, cy, radius, seg.start);
          return (
            <line
              key={`sep-${seg.id}`}
              x1={cx} y1={cy} x2={p.x} y2={p.y}
              stroke="#FFFFFF" strokeWidth="3.5" opacity="0.92"
            />
          );
        })}

        {/* ── Outer chrome stroke ── */}
        <circle cx={cx} cy={cy} r={radius}     fill="none" stroke="url(#chromeBorder)" strokeWidth="4"   />
        {/* Inner neon blue glow ring */}
        <circle cx={cx} cy={cy} r={radius - 3} fill="none" stroke="rgba(0,200,255,0.45)" strokeWidth="6" style={{ filter: 'blur(2px)' }} />
        {/* Thin bright highlight ring */}
        <circle cx={cx} cy={cy} r={radius - 7} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />

        {/* ── Separator edge gems ── */}
        {segData.map((seg) => {
          const p = polarToCart(cx, cy, radius - 4, seg.start);
          return (
            <circle
              key={`dot-${seg.id}`}
              cx={p.x} cy={p.y} r={6}
              fill="#43A047" stroke="#FFFFFF" strokeWidth="2"
              style={{ filter: 'drop-shadow(0 1px 5px rgba(0,180,0,0.6))' }}
            />
          );
        })}

        {/* ── Product images: foreignObject so mix-blend-mode works ── */}
        {segData.map((seg) => {
          if (!seg.image) return null;
          const imgSize = productImgSize * (seg.imageScale ?? 1);
          const offsetY = seg.imageOffsetY ?? 0;
          const rotOff  = seg.imageRotationOffset ?? 0;
          const x = seg.imgPos.x - imgSize / 2;
          const y = seg.imgPos.y - imgSize / 2 + offsetY;

          return (
            <motion.g
              key={`img-g-${seg.id}`}
              animate={{ rotate: -rotation + rotOff }}
              transition={spinTransition}
              style={{ transformOrigin: `${seg.imgPos.x}px ${seg.imgPos.y + offsetY}px` }}
            >
              <foreignObject x={x} y={y} width={imgSize} height={imgSize}>
                <img
                  src={seg.image}
                  alt={seg.name}
                  style={{
                    width:      '100%',
                    height:     '100%',
                    objectFit:  'contain',
                    mixBlendMode: 'multiply',
                    display:    'block',
                    filter:     isMobile
                      ? 'drop-shadow(0px 5px 9px rgba(0,0,0,0.65)) brightness(1.08) contrast(1.04) saturate(1.05)'
                      : 'drop-shadow(0px 4px 8px rgba(0,0,0,0.50))',
                  }}
                />
              </foreignObject>
            </motion.g>
          );
        })}

        {/* ── Center cap ── */}

        {/* Diffuse blue neon bloom */}
        <circle
          cx={cx} cy={cy} r={capR + 14}
          fill="none" stroke="rgba(0,180,255,0.30)" strokeWidth="14"
          style={{ filter: 'blur(8px)' }}
        />
        {/* Crisp neon ring */}
        <circle
          cx={cx} cy={cy} r={capR + 6}
          fill="none" stroke="rgba(0,220,255,0.70)" strokeWidth="4"
          style={{ filter: 'blur(1px)' }}
        />
        {/* Chrome bevel ring */}
        <circle
          cx={cx} cy={cy} r={capR + 3}
          fill="none" stroke="url(#chromeBorder)" strokeWidth="5.5"
          filter="url(#capInsetShadow)"
        />
        {/* Glossy white fill */}
        <circle cx={cx} cy={cy} r={capR} fill="url(#capFill)" />

        {/* Glass crescent — top-half reflection */}
        <path
          d={`M ${cx - capR + 5} ${cy} A ${capR - 5} ${capR - 5} 0 0 1 ${cx + capR - 5} ${cy} Z`}
          fill="url(#glassSheen)"
          opacity="0.75"
          pointerEvents="none"
        />

        {/* Inner chrome micro ring */}
        <circle
          cx={cx} cy={cy} r={capR - 3}
          fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1"
        />

        {/* ── Logo — foreignObject so mix-blend-mode works to remove bg ── */}
        <motion.g
          animate={{ rotate: -rotation }}
          transition={spinTransition}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          <foreignObject
            x={cx - capR * 1.05}
            y={cy - capR * 1.05}
            width={capR * 2.10}
            height={capR * 2.10}
            clipPath="url(#circleLogoClip)"
          >
            <img
              src={logoImage}
              alt="Délice"
              style={{
                width:        '100%',
                height:       '100%',
                objectFit:    'contain',
                mixBlendMode: 'multiply',
                display:      'block',
              }}
            />
          </foreignObject>
        </motion.g>
      </motion.svg>

      {/* ── Static glass top-half reflection (non-rotating) ── */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="staticGlassTop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"  stopColor="#FFFFFF" stopOpacity="0.38" />
            <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="52%" stopColor="#FFFFFF" stopOpacity="0"    />
          </linearGradient>
        </defs>
        {/* Top semicircle glass arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy} Z`}
          fill="url(#staticGlassTop)"
        />
      </svg>
    </div>
  );
};

export default WheelCanvas;
