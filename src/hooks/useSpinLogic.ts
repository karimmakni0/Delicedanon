/**
 * useSpinLogic.ts — v4 Controlled Prize Distribution
 *
 * • Prize from usePrizePool (52-spin block-guaranteed pool)
 * • Spin duration randomised 4 000–7 000 ms
 * • Full rotations randomised 5–9 turns
 * • Jitter ±40 % of segment width for natural feel
 * • All callbacks stable via useRef — no stale closure issues
 */

import { useState, useRef, useCallback } from 'react';
import wheelConfig from '../config/wheelConfig';
import type { SegmentConfig } from '../config/wheelConfig';
import { usePrizePool } from './usePrizePool';
import type { PrizeId } from './usePrizePool';
import { playerService } from '../services/playerService';

export type SpinState = {
  isSpinning:      boolean;
  currentRotation: number;
  winner:          SegmentConfig | null;
  showResult:      boolean;
  spinsLeft:       number;
  isGameOver:      boolean;
  spinDuration:    number;
};

export type SpinControls = {
  spin:        (playerCin?: string) => void;
  closeResult: () => void;
  reset:       () => void;
};

const randBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export function useSpinLogic(): [SpinState, SpinControls] {
  const { segments } = wheelConfig;
  const segmentAngle = 360 / segments.length;

  // ── prize pool ──────────────────────────────────────────────────────────────
  const { isGameOver, spinsLeft, peekNextPrize, consumePrize, reset } = usePrizePool();

  // ── ui state ────────────────────────────────────────────────────────────────
  const [isSpinning,      setIsSpinning]      = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [winner,          setWinner]          = useState<SegmentConfig | null>(null);
  const [showResult,      setShowResult]      = useState(false);
  const [spinDuration,    setSpinDuration]    = useState(wheelConfig.spinDuration);

  // ── stable refs ─────────────────────────────────────────────────────────────
  // Accumulated degrees — always increasing, never resets
  const accRotRef    = useRef(0);
  // Prevent double-spin
  const isSpinningRef = useRef(false);
  // Timeout handle for cleanup
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── segment id → index ──────────────────────────────────────────────────────
  const segmentIndexForPrize = useCallback((prizeId: PrizeId): number => {
    const idx = segments.findIndex(s => s.id === prizeId);
    return idx >= 0 ? idx : 0;
  }, [segments]);

  // ── spin ────────────────────────────────────────────────────────────────────
  const spin = useCallback((playerCin?: string) => {
    // Guard via ref (not state) — immune to stale closure
    if (isSpinningRef.current || isGameOver) return;

    // 1. Peek the next controlled prize
    const prizeId     = peekNextPrize();
    const winnerIndex = segmentIndexForPrize(prizeId);
    const selectedSeg = segments[winnerIndex];

    // 2. Randomise feel
    const thisDuration  = Math.round(randBetween(4000, 7000));
    const thisRotations = Math.floor(randBetween(5, 10)); // 5–9 full turns

    // 3. Calculate target
    //    polarToCart draws 0° = top (12 o'clock), clockwise.
    //    Segment i center = i * segAngle + segAngle/2  (degrees from top, clockwise)
    //    The pointer tip is at the RIGHT side = 90° in this coordinate system.
    //    We need: (centerAngle + rotation) % 360 = 90°
    //    => targetOffset = (90 - centerAngle + 360) % 360
    const centerAngle  = winnerIndex * segmentAngle + segmentAngle / 2;
    const targetOffset = (90 - centerAngle + 360) % 360;

    // 4. Natural jitter — ±40 % of half-segment, never dead-center
    const jitter = randBetween(-segmentAngle * 0.40, segmentAngle * 0.40);

    // 5. Accumulate forward
    const base        = accRotRef.current;
    const correction  = (360 - (base % 360)) % 360;
    const newRotation = base + correction + thisRotations * 360 + targetOffset + jitter;
    accRotRef.current = newRotation;

    // 6. Lock spin
    isSpinningRef.current = true;

    // Save the spin outcome immediately to block any exploits (like refreshing during the spin)
    if (playerCin) {
      const dbPrizeName = selectedSeg.id === 'chasselane' ? 'Chaise de plage' : selectedSeg.name;
      playerService.completeSpin(playerCin, selectedSeg.id, dbPrizeName).catch(err => {
        console.error('Failed to register completed spin in database:', err);
      });
    }

    // 7. Update state
    setSpinDuration(thisDuration);
    setIsSpinning(true);
    setWinner(null);
    setShowResult(false);
    setCurrentRotation(newRotation);

    // 8. After animation → unlock + reveal
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      isSpinningRef.current = false;
      setIsSpinning(false);
      setWinner(selectedSeg);
      setShowResult(true);
      consumePrize(); // advance pool index only after animation done
    }, thisDuration + 250);
  }, [
    isGameOver,
    peekNextPrize,
    segmentIndexForPrize,
    segments,
    segmentAngle,
    consumePrize,
  ]);

  // ── close modal ─────────────────────────────────────────────────────────────
  const closeResult = useCallback(() => {
    setShowResult(false);
    setWinner(null);
  }, []);

  return [
    { isSpinning, currentRotation, winner, showResult, spinsLeft, isGameOver, spinDuration },
    { spin, closeResult, reset },
  ];
}
