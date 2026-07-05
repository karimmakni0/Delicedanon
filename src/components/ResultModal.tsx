/**
 * ResultModal.tsx — Premium Winner Presentation v3
 *
 * Changes from v2:
 * • Confetti ONLY for 'glaciere' and 'chasselane' (premium prizes)
 * • Danup: warm congratulatory message, no confetti, lighter celebration
 * • isGameOver prop: shows "Jeu terminé" when 54 spins exhausted
 * • "Rejouer" button hidden when game is over
 */

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X, Trophy, Star, Sparkles, Gift } from 'lucide-react';
import type { SegmentConfig } from '../config/wheelConfig';

interface ResultModalProps {
  winner:     SegmentConfig | null;
  isOpen:     boolean;
  onClose:    () => void;
  isGameOver?: boolean;
}

// Délice brand colours for confetti
const BRAND_CONFETTI = ['#00338D', '#1565C0', '#43A047', '#FFFFFF', '#E53935', '#FF8F00'];

// Prize IDs that earn full confetti celebration
const PREMIUM_PRIZES = new Set(['glaciere', 'chasselane']);

const ResultModal: React.FC<ResultModalProps> = ({
  winner,
  isOpen,
  onClose,
  isGameOver = false,
}) => {
  const fired = useRef(false);

  useEffect(() => {
    if (isOpen && winner && !fired.current) {
      fired.current = true;

      // Only launch confetti for premium prizes
      if (PREMIUM_PRIZES.has(winner.id)) {
        // Burst 1: high-energy center explosion
        confetti({
          particleCount:  240,
          spread:         95,
          startVelocity: 65,
          origin:         { x: 0.5, y: 0.60 },
          colors:         [...BRAND_CONFETTI, winner.colorLight],
          ticks:          380,
          shapes:         ['circle', 'square'],
        });

        // Burst 2 & 3: side fountains
        setTimeout(() => {
          confetti({
            particleCount: 130,
            angle:         55,
            spread:        70,
            origin:        { x: 0, y: 0.6 },
            colors:        BRAND_CONFETTI,
          });
          confetti({
            particleCount: 130,
            angle:         125,
            spread:        70,
            origin:        { x: 1, y: 0.6 },
            colors:        BRAND_CONFETTI,
          });
        }, 220);

        // Burst 4: small top shower
        setTimeout(() => {
          confetti({
            particleCount: 80,
            spread:        60,
            startVelocity: 30,
            origin:        { x: 0.5, y: 0.10 },
            colors:        BRAND_CONFETTI,
          });
        }, 500);
      }
    }

    if (!isOpen) {
      fired.current = false;
    }
  }, [isOpen, winner]);

  if (!winner) return null;

  const isPremium   = PREMIUM_PRIZES.has(winner.id);
  const isDanup     = winner.id === 'danup';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.30 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{
              background:     'rgba(0,10,35,0.75)',
              backdropFilter: 'blur(18px) saturate(1.1)',
            }}
          />

          {/* Card */}
          <motion.div
            className="relative z-10 w-full max-w-sm"
            initial={{ scale: 0.72, y: 55, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.82, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 22, delay: 0.04 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Coloured glow halo behind card */}
            <div
              className="absolute -inset-10 rounded-[36px] blur-3xl pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${winner.colorLight}55 0%, transparent 70%)`,
                opacity:    isPremium ? 0.65 : 0.35,
              }}
            />

            {/* Bevel border wrapper */}
            <div
              className="relative rounded-3xl overflow-hidden p-[2px]"
              style={{
                background: isPremium
                  ? `linear-gradient(135deg, ${winner.colorLight} 0%, rgba(255,255,255,0.5) 50%, #43A047 100%)`
                  : `linear-gradient(135deg, ${winner.colorLight} 0%, rgba(255,255,255,0.3) 100%)`,
              }}
            >
              {/* Glass card body */}
              <div
                className="relative rounded-[22px] overflow-hidden"
                style={{
                  background: 'linear-gradient(165deg, rgba(255,255,255,0.97) 0%, rgba(240,246,255,0.99) 100%)',
                  boxShadow:  '0 25px 50px -12px rgba(0,20,80,0.28)',
                }}
              >
                {/* Top ribbon */}
                <div
                  className="h-[6px] w-full"
                  style={{
                    background: `linear-gradient(90deg, ${winner.color} 0%, ${winner.colorLight} 50%, ${winner.color} 100%)`,
                  }}
                />

                <div className="px-7 py-7 text-center modal-content-body">

                  {/* Header badge */}
                  <motion.div
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-5 text-[11px] font-black tracking-widest uppercase shadow-sm border modal-badge"
                    style={{
                      background:  isPremium ? 'rgba(0,51,141,0.07)' : 'rgba(0,51,141,0.04)',
                      borderColor: 'rgba(0,51,141,0.12)',
                      color:       '#00338D',
                    }}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22 }}
                  >
                    {isPremium
                      ? <><Trophy size={13} /> <span>Gros lot Délice</span> <Sparkles size={12} className="text-[#43A047]" /></>
                      : <><Gift size={13} />   <span>Promo Délice</span></>
                    }
                  </motion.div>

                  {/* Product image */}
                  <motion.div
                    className="mb-5 flex justify-center items-center h-32 relative modal-image-container"
                    initial={{ scale: 0, rotate: isPremium ? -20 : -8 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.32 }}
                  >
                    {/* Ring glow */}
                    <div
                      className="absolute w-24 h-24 rounded-full blur-xl modal-glow-ring"
                      style={{
                        backgroundColor: winner.colorLight,
                        opacity:         isPremium ? 0.30 : 0.15,
                      }}
                    />

                    {winner.image ? (
                      <img
                        src={winner.image}
                        alt={winner.name}
                        className="h-32 max-w-[145px] object-contain relative z-10 modal-prize-image"
                        style={{
                          filter:       'drop-shadow(0 10px 22px rgba(0,0,0,0.22))',
                          mixBlendMode: 'multiply',
                        }}
                      />
                    ) : (
                      <span className="text-7xl relative z-10">{winner.emoji}</span>
                    )}
                  </motion.div>

                  {/* Congratulation line */}
                  <motion.p
                    className="text-xs font-black uppercase tracking-[0.22em] mb-1 modal-congrats"
                    style={{ color: isPremium ? '#43A047' : '#1565C0' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.42 }}
                  >
                    {isPremium
                      ? '✦ Félicitations ! Vous gagnez ✦'
                      : '🎉 Vous avez gagné !'}
                  </motion.p>

                  {/* Product name */}
                  <motion.h2
                    className="font-extrabold mb-1 tracking-tight modal-title"
                    style={{
                      fontSize:   isPremium ? '2.25rem' : '1.9rem',
                      color:      winner.color,
                      textShadow: '0 2px 4px rgba(0,39,107,0.10)',
                    }}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.48 }}
                  >
                    {winner.name}
                  </motion.h2>

                  {/* Tagline */}
                  <motion.p
                    className="text-sm italic font-medium mb-5 px-2 modal-tagline"
                    style={{ color: '#546E7A' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.56 }}
                  >
                    "{winner.tagline}"
                  </motion.p>

                  {/* Stars — 5 for premium, 3 for Danup */}
                  <motion.div
                    className="flex justify-center gap-1 mb-7 modal-stars"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.62 }}
                  >
                    {[...Array(isPremium ? 5 : 3)].map((_, i) => (
                      <Star
                        key={i}
                        size={isPremium ? 15 : 13}
                        fill={isPremium ? '#43A047' : '#1565C0'}
                        className={isPremium ? 'text-[#43A047]' : 'text-[#1565C0]'}
                      />
                    ))}
                  </motion.div>

                  {/* CTA buttons */}
                  <motion.div
                    className="flex gap-3 modal-cta"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.68 }}
                  >
                    {/* Only show "Rejouer" if game is not over */}
                    {!isGameOver && (
                      <button
                        onClick={onClose}
                        className="flex-1 py-4 rounded-2xl font-black text-sm tracking-widest uppercase text-white shadow-lg transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                        style={{
                          background: isDanup
                            ? 'linear-gradient(135deg, #1565C0 0%, #00338D 100%)'
                            : `linear-gradient(135deg, ${winner.color} 0%, ${winner.colorLight} 100%)`,
                          boxShadow: '0 6px 20px rgba(0,51,141,0.28)',
                          border:    '1.5px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        🎰 Rejouer
                      </button>
                    )}

                    {/* Game over: show only a close button */}
                    {isGameOver && (
                      <div
                        className="flex-1 py-4 rounded-2xl font-black text-sm tracking-widest uppercase text-center"
                        style={{
                          background: 'linear-gradient(135deg, #37474F, #263238)',
                          color:      'rgba(255,255,255,0.7)',
                        }}
                      >
                        🏁 Jeu terminé
                      </div>
                    )}

                    <button
                      onClick={onClose}
                      className="px-5 py-4 rounded-2xl font-black text-sm border-2 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                      style={{
                        borderColor: 'rgba(0,51,141,0.18)',
                        color:       '#00338D',
                        background:  'rgba(21,101,192,0.04)',
                      }}
                    >
                      <X size={18} />
                    </button>
                  </motion.div>
                </div>

                {/* Bottom accent bar */}
                <div
                  className="h-1.5 w-full"
                  style={{
                    background: isPremium
                      ? 'linear-gradient(90deg, #43A047 0%, #1B5E20 50%, #43A047 100%)'
                      : `linear-gradient(90deg, ${winner.color} 0%, ${winner.colorLight} 100%)`,
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultModal;
