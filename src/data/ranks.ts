export type RankTier = 'Bronzo' | 'Argento' | 'Oro' | 'Platino' | 'Diamante' | 'Leggenda';

export interface Rank {
  tier: RankTier;
  icon: string;
  color: string;
  colorDark: string;
  minTrophies: number;
  maxTrophies: number;
}

export const RANKS: Rank[] = [
  { tier: 'Bronzo',   icon: '🥉', color: '#cd7f32', colorDark: '#2d1800', minTrophies: 0,    maxTrophies: 299      },
  { tier: 'Argento',  icon: '🥈', color: '#94a3b8', colorDark: '#1a1e26', minTrophies: 300,  maxTrophies: 699      },
  { tier: 'Oro',      icon: '🥇', color: '#f59e0b', colorDark: '#2d1a00', minTrophies: 700,  maxTrophies: 1299     },
  { tier: 'Platino',  icon: '💠', color: '#22d3ee', colorDark: '#042030', minTrophies: 1300, maxTrophies: 1999     },
  { tier: 'Diamante', icon: '💎', color: '#818cf8', colorDark: '#1e1b4b', minTrophies: 2000, maxTrophies: 2999     },
  { tier: 'Leggenda', icon: '👑', color: '#fbbf24', colorDark: '#2a1f00', minTrophies: 3000, maxTrophies: Infinity },
];

export function getRankForTrophies(trophies: number): Rank {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (trophies >= RANKS[i].minTrophies) return RANKS[i];
  }
  return RANKS[0];
}

export function getNextRank(trophies: number): Rank | null {
  const current = getRankForTrophies(trophies);
  const idx = RANKS.findIndex((r) => r.tier === current.tier);
  return idx < RANKS.length - 1 ? RANKS[idx + 1] : null;
}

export function getProgressToNext(trophies: number): { progressPct: number; trophiesNeeded: number } {
  const current = getRankForTrophies(trophies);
  if (current.maxTrophies === Infinity) return { progressPct: 1, trophiesNeeded: 0 };
  const span = current.maxTrophies - current.minTrophies + 1;
  const earned = trophies - current.minTrophies;
  return {
    progressPct: Math.min(earned / span, 1),
    trophiesNeeded: current.maxTrophies + 1 - trophies,
  };
}
