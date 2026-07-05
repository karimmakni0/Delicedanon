/**
 * usePrizePool.ts — v3
 *
 * Controlled prize distribution — 52 total spins
 *   - 'danup'      × 48  (normal prize, no confetti)
 *   - 'glaciere'   × 2   (premium prize, confetti)
 *   - 'chasselane' × 2   (premium prize, confetti)
 *
 * Distribution guarantee:
 *   The 52 spins are split into 4 blocks of 12. Each block contains
 *   exactly ONE premium prize at a random position inside it.
 *   Spins 49-52 are always Danup (all 4 premiums consumed in blocks 1-4).
 *   This ensures the user perceives randomness while premiums are
 *   spread naturally across the entire session.
 *
 * Persistence:
 *   Pool + index stored in localStorage under v3 keys so old sessions
 *   don't interfere.
 *
 * Admin reset:
 *   reset() clears localStorage and rebuilds a fresh pool.
 */

import { useState, useCallback, useRef } from 'react';

// ── Constants ────────────────────────────────────────────────────────────────
// Prize breakdown: 48 × Danup, 2 × Glacière, 2 × Chasselane = 52 total
export const TOTAL_SPINS = 52;

// Use v4 keys — clears any old v3 block-based pools
const LS_POOL_KEY  = 'delice_v4_prize_pool';
const LS_INDEX_KEY = 'delice_v4_spin_index';

// Fixed 0-indexed positions that MUST be a premium prize:
// spin 12 → index 11, spin 24 → index 23, spin 36 → index 35, spin 48 → index 47
const PREMIUM_SLOTS = [11, 23, 35, 47] as const;

// ── Types ─────────────────────────────────────────────────────────────────────
export type PrizeId = 'danup' | 'glaciere' | 'chasselane';

// ── Fisher-Yates in-place shuffle ──────────────────────────────────────────────
function fisherYates<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── Build a fresh pool — every 12th spin is a guaranteed premium ─────────────
//
//   Spin 12  → index 11  → Glacière or Chaise longue
//   Spin 24  → index 23  → Glacière or Chaise longue
//   Spin 36  → index 35  → Glacière or Chaise longue
//   Spin 48  → index 47  → Glacière or Chaise longue
//   All other 48 spins   → Danup
//
function buildPool(): PrizeId[] {
  // Fill every slot with Danup
  const pool: PrizeId[] = new Array<PrizeId>(TOTAL_SPINS).fill('danup');

  // Shuffle which premium type fills which slot (keeps 2 Glacière + 2 Chasselane)
  const premiums: PrizeId[] = ['glaciere', 'glaciere', 'chasselane', 'chasselane'];
  fisherYates(premiums);

  // Stamp each fixed slot with its premium
  PREMIUM_SLOTS.forEach((slot, i) => {
    pool[slot] = premiums[i];
  });

  return pool;
}

// ── Load from localStorage or create a fresh pool ────────────────────────────
function loadOrCreate(): { pool: PrizeId[]; index: number } {
  try {
    const storedPool  = localStorage.getItem(LS_POOL_KEY);
    const storedIndex = localStorage.getItem(LS_INDEX_KEY);

    if (storedPool && storedIndex !== null) {
      const pool  = JSON.parse(storedPool) as PrizeId[];
      const index = parseInt(storedIndex, 10);
      if (
        Array.isArray(pool) &&
        pool.length === TOTAL_SPINS &&
        !isNaN(index) &&
        index >= 0 &&
        index <= TOTAL_SPINS
      ) {
        return { pool, index };
      }
    }
  } catch {
    // Corrupted storage — rebuild silently
  }

  const pool = buildPool();
  localStorage.setItem(LS_POOL_KEY, JSON.stringify(pool));
  localStorage.setItem(LS_INDEX_KEY, '0');
  return { pool, index: 0 };
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function usePrizePool() {
  const [state, setState] = useState<{ pool: PrizeId[]; index: number }>(loadOrCreate);

  // Refs keep callbacks stable and always up-to-date
  const indexRef = useRef(state.index);
  indexRef.current = state.index;

  const poolRef = useRef(state.pool);
  poolRef.current = state.pool;

  const isGameOver = state.index >= TOTAL_SPINS;
  const spinsLeft  = Math.max(0, TOTAL_SPINS - state.index);

  /** Peek the next prize id without advancing the index */
  const peekNextPrize = useCallback((): PrizeId => {
    const idx  = indexRef.current;
    const pool = poolRef.current;
    if (idx >= pool.length) return 'danup';
    return pool[idx];
  }, []);

  /** Advance the index — call only after the spin animation completes */
  const consumePrize = useCallback(() => {
    const newIndex       = indexRef.current + 1;
    indexRef.current     = newIndex;
    localStorage.setItem(LS_INDEX_KEY, String(newIndex));
    setState(prev => ({ ...prev, index: newIndex }));
  }, []);

  /**
   * Admin reset — wipes localStorage and rebuilds a fresh 52-spin pool.
   * Called when the admin clicks "Mettre à jour les cadeaux".
   */
  const reset = useCallback(() => {
    localStorage.removeItem(LS_POOL_KEY);
    localStorage.removeItem(LS_INDEX_KEY);
    const fresh      = loadOrCreate();
    indexRef.current = fresh.index;
    poolRef.current  = fresh.pool;
    setState(fresh);
  }, []);

  return {
    pool:          state.pool,
    index:         state.index,
    isGameOver,
    spinsLeft,
    peekNextPrize,
    consumePrize,
    reset,
  };
}
