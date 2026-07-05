/**
 * SpinWheel.tsx — Premium Commercial Edition v2
 *
 * Refinements:
 * - Larger bare transparent logo, no container
 * - Tighter vertical spacing (gap reduced)
 * - Richer spin button gradient + stronger glow
 * - Premium chrome stand with thicker legs and wider base
 * - Stronger wheel bloom backdrop
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WheelCanvas from './WheelCanvas';
import Pointer from './Pointer';
import ResultModal from './ResultModal';
import { useSpinLogic } from '../hooks/useSpinLogic';
import { TOTAL_SPINS } from '../hooks/usePrizePool';

const getRadius = () => {
  if (typeof window === 'undefined') return 340;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  
  if (vw < 768) {
    // Mobile layout: wheel takes a larger portion of screen width
    const targetW = Math.min(vw * 0.78, vh * 0.45);
    return Math.max(130, Math.round(targetW / 2 - 26));
  } else {
    // Desktop layout
    const byH = Math.round(vh * 0.34);
    const byW = Math.round(vw * 0.38);
    return Math.min(Math.min(byH, byW), 350);
  }
};

interface SpinWheelProps {
  onLogout: () => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ onLogout }) => {
  const [{ isSpinning, currentRotation, winner, showResult, isGameOver, spinsLeft, spinDuration }, { spin, closeResult, reset }] =
    useSpinLogic();

  const [radius,       setRadius]       = useState(getRadius);
  const [isLanded,     setIsLanded]     = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const spinAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef  = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handle = () => setRadius(getRadius());
    window.addEventListener('resize', handle);
    spinAudioRef.current = new Audio('/sounds/spin.mp3');
    winAudioRef.current  = new Audio('/sounds/win.mp3');
    if (spinAudioRef.current) spinAudioRef.current.volume = 0.4;
    if (winAudioRef.current)  winAudioRef.current.volume  = 0.55;
    return () => window.removeEventListener('resize', handle);
  }, []);

  useEffect(() => {
    if (isSpinning) {
      setIsLanded(false);
      spinAudioRef.current?.play().catch(() => {});
    }
  }, [isSpinning]);

  useEffect(() => {
    if (showResult && winner) {
      setIsLanded(true);
      spinAudioRef.current?.pause();
      winAudioRef.current?.play().catch(() => {});
      const t = setTimeout(() => setIsLanded(false), 800);
      return () => clearTimeout(t);
    }
  }, [showResult, winner]);

  const wheelDiameter = (radius + 26) * 2;

  const wheelWrapperAnimation = isLanded
    ? { x: [0, -6, 6, -3, 3, 0], y: [0, 2, -2, 1, 0], scale: [1, 0.98, 1.01, 1] }
    : isSpinning
    ? { y: 0, scale: 1.0 }
    : { y: [0, -7, 0], rotate: [0, 0.3, -0.3, 0] };

  const wheelWrapperTransition = isLanded
    ? { duration: 0.5, ease: 'easeOut' as const }
    : isSpinning
    ? { duration: 0.3 }
    : {
        y:      { duration: 4.5, repeat: Infinity, ease: 'easeInOut' as const },
        rotate: { duration: 6,   repeat: Infinity, ease: 'easeInOut' as const },
      };

  /* ── Chrome stand dimensions ── */
  const standW  = wheelDiameter + 90;
  const standH  = wheelDiameter + 60;
  const sCx     = standW / 2;
  const sCy     = wheelDiameter / 2 + 10;

  return (
    <>
      <div className="flex flex-col items-center gap-4 w-full md:gap-6 spinwheel-container">

        {/* ── Header: logo + slogan ── */}
        <motion.div
          className="flex flex-col items-center text-center select-none w-full"
          style={{ marginBottom: 4 }}
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          {/* Soft radial glow behind logo */}
          <div className="relative flex items-center justify-center w-full">
            <div
              className="absolute pointer-events-none"
              style={{
                width:      '100%',
                maxWidth:   '420px',
                height:     '220px',
                background: 'radial-gradient(ellipse, rgba(80,160,255,0.28) 0%, rgba(0,80,220,0.10) 55%, transparent 75%)',
                filter:     'blur(28px)',
                top:        '50%',
                left:       '50%',
                transform:  'translate(-50%, -50%)',
              }}
            />

            {/* Logo — large, prominent, no blend mode */}
            <motion.img
              src="/logo.png"
              alt="Délice"
              className="logo-float relative z-10"
              style={{
                width:     'clamp(220px, 45vw, 680px)',
                height:    'auto',
                objectFit: 'contain',
                display:   'block',
                filter: [
                  'drop-shadow(0 0 22px rgba(60,140,255,0.70))',
                  'drop-shadow(0 0 10px rgba(20, 80,230,0.50))',
                  'drop-shadow(0 5px 14px rgba(0,  0,  0, 0.35))',
                ].join(' '),
              }}
            />
          </div>

          {/* Slogan */}
          <p
            className="text-white font-black uppercase"
            style={{
              fontSize:      'clamp(10px, 1.3vw, 15px)',
              letterSpacing: '0.42em',
              marginTop:     12,
              textShadow:    '0 0 18px rgba(0,160,255,0.45), 0 2px 4px rgba(0,0,0,0.40)',
            }}
          >
            TOURNEZ&nbsp;LA&nbsp;ROUE&nbsp;ET&nbsp;GAGNEZ&nbsp;!
          </p>
          {/* ── Wheel stage ── */}
        <motion.div
          className="relative flex items-center justify-center w-full wheel-stage"
          style={{
            maxWidth: standW,
            aspectRatio: `${standW} / ${standH}`,
          }}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.82, ease: 'easeOut', delay: 0.12 }}
        >
          {/* Bloom radial spotlight */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width:      '110%',
              height:     '110%',
              top:        '50%',
              left:       '50%',
              transform:  'translate(-50%,-50%)',
              background: 'radial-gradient(circle, rgba(0,130,220,0.38) 0%, rgba(0,60,160,0.12) 50%, transparent 72%)',
              filter:     'blur(30px)',
            }}
          />

          {/* Premium Metallic Chrome Stand */}
          <svg
            viewBox={`0 0 ${standW} ${standH}`}
            className="absolute pointer-events-none w-full h-full"
            style={{ zIndex: 0, top: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="chromeStand" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#FFFFFF"  />
                <stop offset="12%"  stopColor="#F0F4F7"  />
                <stop offset="28%"  stopColor="#B8C9D5"  />
                <stop offset="45%"  stopColor="#546E7A"  />
                <stop offset="62%"  stopColor="#90A4AE"  />
                <stop offset="78%"  stopColor="#CFD8DC"  />
                <stop offset="100%" stopColor="#263238"  />
              </linearGradient>
              <linearGradient id="standBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="#90A4AE"  />
                <stop offset="40%"  stopColor="#607D8B"  />
                <stop offset="100%" stopColor="#263238"  />
              </linearGradient>
              <filter id="standShadow">
                <feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#000820" floodOpacity="0.65" />
              </filter>
            </defs>

            {/* Left leg — thicker */}
            <path
              d={`M ${sCx - 46} ${sCy}
                  Q ${sCx - 96}  ${sCy + radius * 0.72}
                    ${sCx - 128} ${sCy + radius + 22}
                  L ${sCx - 90}  ${sCy + radius + 22}
                  Q ${sCx - 64}  ${sCy + radius * 0.72}
                    ${sCx - 24}  ${sCy} Z`}
              fill="url(#chromeStand)"
              filter="url(#standShadow)"
            />
            {/* Right leg — thicker */}
            <path
              d={`M ${sCx + 46} ${sCy}
                  Q ${sCx + 96}  ${sCy + radius * 0.72}
                    ${sCx + 128} ${sCy + radius + 22}
                  L ${sCx + 90}  ${sCy + radius + 22}
                  Q ${sCx + 64}  ${sCy + radius * 0.72}
                    ${sCx + 24}  ${sCy} Z`}
              fill="url(#chromeStand)"
              filter="url(#standShadow)"
            />

            {/* Wide base platform */}
            <path
              d={`M ${sCx - 150} ${sCy + radius + 22}
                  C ${sCx - 150} ${sCy + radius + 15},
                    ${sCx + 150} ${sCy + radius + 15},
                    ${sCx + 150} ${sCy + radius + 22}
                  L ${sCx + 132} ${sCy + radius + 40}
                  C ${sCx + 100} ${sCy + radius + 46},
                    ${sCx - 100} ${sCy + radius + 46},
                    ${sCx - 132} ${sCy + radius + 40} Z`}
              fill="url(#standBaseGrad)"
              filter="url(#standShadow)"
            />
            {/* Base top highlight */}
            <ellipse
              cx={sCx}
              cy={sCy + radius + 22}
              rx={148}
              ry={7}
              fill="rgba(255,255,255,0.22)"
            />
          </svg>

          {/* Wheel + Pointer wrapper */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full cursor-pointer z-10"
            animate={wheelWrapperAnimation}
            transition={wheelWrapperTransition}
            whileHover={isSpinning || isGameOver ? {} : { scale: 1.022 }}
            onClick={() => { if (!isSpinning && !isGameOver) spin(); }}
          >
            <div
              className="wheel-canvas-container"
              style={{
                position: 'absolute',
                top: `${(10 / standH) * 100}%`,
                left: 0,
                width: `${(wheelDiameter / standW) * 100}%`,
                height: `${(wheelDiameter / standH) * 100}%`,
              }}
            >
              <WheelCanvas rotation={currentRotation} isSpinning={isSpinning} radius={radius} spinDuration={spinDuration} />

              {/* ── Premium Luxury Golden Pointer overlapping the wheel border ── */}
              <div
                className="pointer-container"
                style={{
                  position:  'absolute',
                  left:      '96.5%', // slightly overlaps the wheel rim border by 8-12px for physical realism
                  top:       '50%',
                  transform: 'translateY(-50%)',
                  width:     'clamp(90px, 9vw, 120px)',
                  height:    'clamp(50px, 5vw, 70px)',
                  zIndex:    30,
                }}
              >
                <Pointer wheelRadius={radius} isLanded={isLanded} isSpinning={isSpinning} />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Premium Spin Button ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="mt-2 w-full flex justify-center spin-button-container"
        >
          {isGameOver ? (
            /* ── Game over state ── */
            <div
              className="relative flex items-center justify-center gap-3 rounded-full font-black uppercase text-white select-none"
              style={{
                padding:       'clamp(12px, 2.5vw, 18px) clamp(32px, 6vw, 56px)',
                fontSize:      'clamp(13px, 1.8vw, 18px)',
                letterSpacing: '0.18em',
                background:    'linear-gradient(135deg, #37474F, #263238)',
                border:        '2px solid rgba(255,255,255,0.12)',
                opacity:       0.85,
              }}
            >
              🏁 <span>Jeu terminé</span>
            </div>
          ) : (
            /* ── Normal spin button ── */
            <motion.button
              id="spin-btn"
              onClick={(e) => { e.stopPropagation(); spin(); }}
              disabled={isSpinning}
              className="relative flex items-center gap-3.5 rounded-full font-black uppercase text-white overflow-hidden select-none"
              style={{
                padding:      'clamp(12px, 2.5vw, 18px) clamp(32px, 6vw, 56px)',
                fontSize:     'clamp(13px, 1.8vw, 18px)',
                letterSpacing: '0.18em',
                background: isSpinning
                  ? 'linear-gradient(135deg, #37474F, #1C313A)'
                  : 'linear-gradient(135deg, #00D4FF 0%, #0066FF 45%, #003FCC 75%, #001A8C 100%)',
                border:  '2px solid rgba(255,255,255,0.28)',
                cursor:  isSpinning ? 'not-allowed' : 'pointer',
                opacity: isSpinning ? 0.70 : 1,
              }}
              animate={isSpinning ? { scale: 1 } : {
                scale: [1, 1.035, 1],
                boxShadow: [
                  '0 0 28px rgba(0,100,255,0.55), 0 10px 28px rgba(0,10,60,0.50)',
                  '0 0 60px rgba(0,220,255,0.90), 0 14px 36px rgba(0,10,60,0.55)',
                  '0 0 28px rgba(0,100,255,0.55), 0 10px 28px rgba(0,10,60,0.50)',
                ],
              }}
              transition={isSpinning ? { duration: 0.3 } : {
                scale:     { duration: 2.0, repeat: Infinity, ease: 'easeInOut' as const },
                boxShadow: { duration: 2.0, repeat: Infinity, ease: 'easeInOut' as const },
              }}
              whileHover={isSpinning ? {} : { scale: 1.07, boxShadow: '0 0 70px rgba(0,220,255,0.95), 0 16px 40px rgba(0,10,60,0.55)' }}
              whileTap={isSpinning   ? {} : { scale: 0.95 }}
            >
              {/* Shimmer sweep */}
              {!isSpinning && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(108deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)' }}
                  animate={{ x: ['-120%', '220%'] }}
                  transition={{ duration: 2.0, repeat: Infinity, repeatDelay: 2.0 }}
                />
              )}

              <motion.span
                style={{ fontSize: 'clamp(16px, 2.2vw, 22px)' }}
                animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
                transition={isSpinning ? { duration: 0.8, repeat: Infinity, ease: 'linear' as const } : {}}
              >
                ⚡
              </motion.span>

              <span>{isSpinning ? 'En cours...' : 'Tourner la roue !'}</span>
            </motion.button>
          )}
        </motion.div>

        {/* Status hint */}
        <motion.p
          className="text-white/40 font-bold tracking-widest uppercase select-none"
          style={{ fontSize: 'clamp(8px, 1.1vw, 11px)' }}
          animate={{ opacity: isSpinning ? [0.35, 0.85, 0.35] : 0.38 }}
          transition={isSpinning ? { duration: 1.2, repeat: Infinity } : {}}
        >
          {isGameOver
            ? '🏁 Jeu terminé — Merci de votre participation !'
            : isSpinning
            ? '🌿 La roue tourne...'
            : '✦ Cliquez sur la roue ou le bouton ✦'}
        </motion.p>
      </div>

      <ResultModal winner={winner} isOpen={showResult} onClose={closeResult} isGameOver={isGameOver} />

      {/* ── Settings gear ── */}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 45 }}>
        {/* Gear button */}
        <motion.button
          id="settings-btn"
          onClick={() => setShowSettings(v => !v)}
          whileHover={{ scale: 1.12, rotate: 45 }}
          whileTap={{   scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 320, damping: 20 }}
          style={{
            width:         42,
            height:        42,
            borderRadius:  '50%',
            background:    'rgba(0,30,90,0.70)',
            backdropFilter:'blur(12px)',
            border:        '1px solid rgba(80,160,255,0.30)',
            boxShadow:     '0 0 18px rgba(0,80,220,0.35)',
            display:       'flex',
            alignItems:    'center',
            justifyContent:'center',
            cursor:        'pointer',
            fontSize:      20,
            color:         'rgba(180,220,255,0.90)',
          }}
        >
          ⚙️
        </motion.button>

        {/* Dropdown panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              key="settings-panel"
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y:  0, scale: 1.00 }}
              exit={{    opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                position:      'absolute',
                top:           50,
                right:         0,
                minWidth:      220,
                background:    'linear-gradient(145deg, rgba(0,20,70,0.96) 0%, rgba(0,10,42,0.98) 100%)',
                border:        '1px solid rgba(80,160,255,0.25)',
                borderRadius:  16,
                padding:       '8px 0',
                boxShadow:     '0 0 40px rgba(0,60,200,0.35), 0 12px 40px rgba(0,0,0,0.65)',
                backdropFilter:'blur(20px)',
                overflow:      'hidden',
              }}
            >
              {/* ─ Joueurs counter ─ */}
              <div
                style={{
                  padding:      '10px 18px 8px',
                  borderBottom: '1px solid rgba(80,160,255,0.12)',
                  marginBottom: 4,
                }}
              >
                <p style={{
                  fontFamily:   'var(--font-main)',
                  fontSize:     11,
                  fontWeight:   600,
                  color:        'rgba(120,180,255,0.65)',
                  letterSpacing:'0.10em',
                  textTransform:'uppercase',
                  marginBottom: 4,
                }}>Compteur joueurs</p>
                <p style={{
                  fontFamily:   'var(--font-main)',
                  fontSize:     15,
                  fontWeight:   700,
                  color:        '#FFFFFF',
                  textShadow:   '0 0 10px rgba(80,160,255,0.60)',
                }}>
                  👥&nbsp; Joueurs&nbsp;:&nbsp;
                  <span style={{ color: '#7EC8FF' }}>{TOTAL_SPINS - spinsLeft}</span>
                  &nbsp;/&nbsp;{TOTAL_SPINS}
                </p>
              </div>

              {/* ─ Replay / Réinitialiser ─ */}
              <button
                onClick={() => { reset(); setShowSettings(false); }}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          10,
                  width:        '100%',
                  padding:      '11px 18px',
                  background:   'none',
                  border:       'none',
                  cursor:       'pointer',
                  fontFamily:   'var(--font-main)',
                  fontSize:     14,
                  fontWeight:   600,
                  color:        '#FFFFFF',
                  textAlign:    'left',
                  transition:   'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,80,200,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <span style={{ fontSize: 16 }}>🔄</span>
                Réinitialiser les cadeaux
              </button>

              {/* ─ Déconnecter ─ */}
              <button
                onClick={() => { setShowSettings(false); onLogout(); }}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          10,
                  width:        '100%',
                  padding:      '11px 18px',
                  background:   'none',
                  border:       'none',
                  borderTop:    '1px solid rgba(80,160,255,0.12)',
                  cursor:       'pointer',
                  fontFamily:   'var(--font-main)',
                  fontSize:     14,
                  fontWeight:   600,
                  color:        '#FF8080',
                  textAlign:    'left',
                  marginTop:    4,
                  transition:   'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,40,40,0.18)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <span style={{ fontSize: 16 }}>🚪</span>
                Déconnecter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Admin game-over modal ── */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            key="admin-gameover"
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backdropFilter: 'blur(14px) brightness(0.55)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              initial={{ scale: 0.82, opacity: 0, y: 32 }}
              animate={{ scale: 1,    opacity: 1, y: 0  }}
              exit={{    scale: 0.82, opacity: 0, y: 32 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              style={{
                background:   'linear-gradient(145deg, rgba(0,20,70,0.97) 0%, rgba(0,10,40,0.99) 100%)',
                border:       '1.5px solid rgba(80,160,255,0.35)',
                borderRadius: 24,
                padding:      '44px 48px 40px',
                maxWidth:     480,
                width:        '90vw',
                boxShadow:    '0 0 60px rgba(0,80,255,0.35), 0 24px 80px rgba(0,0,0,0.80)',
                textAlign:    'center',
              }}
            >
              {/* Icon */}
              <div style={{ fontSize: 52, marginBottom: 16 }}>🎁</div>

              {/* Title */}
              <h2 style={{
                fontFamily:    'var(--font-main)',
                fontSize:      24,
                fontWeight:    800,
                color:         '#FFFFFF',
                marginBottom:  12,
                lineHeight:    1.3,
              }}>
                Les cadeaux sont terminés
              </h2>

              {/* Message */}
              <p style={{
                fontFamily:   'var(--font-main)',
                fontSize:     15,
                color:        'rgba(180,210,255,0.85)',
                marginBottom: 32,
                lineHeight:   1.65,
              }}>
                Merci de mettre à jour les cadeaux pour permettre de nouveaux tirages.
              </p>

              {/* Reset button */}
              <button
                onClick={reset}
                style={{
                  display:         'inline-flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  gap:             10,
                  padding:         '14px 32px',
                  borderRadius:    9999,
                  border:          '1.5px solid rgba(80,160,255,0.50)',
                  background:      'linear-gradient(135deg, #0057CC 0%, #003D99 100%)',
                  color:           '#FFFFFF',
                  fontFamily:      'var(--font-main)',
                  fontSize:        15,
                  fontWeight:      700,
                  letterSpacing:   '0.04em',
                  cursor:          'pointer',
                  boxShadow:       '0 0 28px rgba(0,100,255,0.55), 0 4px 18px rgba(0,0,0,0.40)',
                  transition:      'transform 0.15s, box-shadow 0.15s',
                  width:           '100%',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform  = 'scale(1.04)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow  = '0 0 40px rgba(0,130,255,0.70), 0 6px 24px rgba(0,0,0,0.50)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform  = 'scale(1)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow  = '0 0 28px rgba(0,100,255,0.55), 0 4px 18px rgba(0,0,0,0.40)';
                }}
              >
                🔄&nbsp;&nbsp;Mettre à jour les cadeaux
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SpinWheel;
