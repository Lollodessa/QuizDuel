export interface Arena {
  name: string;
  icon: string;
  color: string;
  colorDark: string;
  minTrophies: number;
  maxTrophies: number;
  image?: any;
}

export const ARENAS: Arena[] = [
  { name: 'Caverna del Principiante', icon: '🪨', color: '#78716c', colorDark: '#1c1412', minTrophies: 0,    maxTrophies: 100  },
  { name: 'Campo di Addestramento',   icon: '⚔️',  color: '#a16207', colorDark: '#1c1200', minTrophies: 100,  maxTrophies: 250  },
  { name: 'Fortezza di Pietra',       icon: '🏰', color: '#1d4ed8', colorDark: '#0d1c4a', minTrophies: 250,  maxTrophies: 500  },
  { name: 'Abisso Tempestoso',        icon: '🌊', color: '#0369a1', colorDark: '#021425', minTrophies: 500,  maxTrophies: 800  },
  { name: 'Vulcano di Fuoco',         icon: '🔥', color: '#b91c1c', colorDark: '#2d0707', minTrophies: 800,  maxTrophies: 1200 },
  { name: 'Vetta Glaciale',           icon: '❄️',  color: '#0891b2', colorDark: '#021a22', minTrophies: 1200, maxTrophies: 1700 },
  { name: 'Torre del Fulmine',        icon: '⚡',  color: '#6d28d9', colorDark: '#1a0840', minTrophies: 1700, maxTrophies: 2300 },
  { name: 'Regno Oscuro',             icon: '🌑', color: '#374151', colorDark: '#0c0e12', minTrophies: 2300, maxTrophies: 3000 },
  { name: 'Olimpo dei Saggi',         icon: '🌟', color: '#b45309', colorDark: '#1c0e00', minTrophies: 3000, maxTrophies: 4000 },
  { name: 'Trono Supremo',            icon: '👑', color: '#c9a84c', colorDark: '#2a1f00', minTrophies: 4000, maxTrophies: Infinity },
];

export function getArenaForTrophies(trophies: number): Arena {
  for (let i = ARENAS.length - 1; i >= 0; i--) {
    if (trophies >= ARENAS[i].minTrophies) return ARENAS[i];
  }
  return ARENAS[0];
}

export function getNextArena(trophies: number): Arena | null {
  const current = getArenaForTrophies(trophies);
  const idx = ARENAS.findIndex((a) => a.name === current.name);
  return idx < ARENAS.length - 1 ? ARENAS[idx + 1] : null;
}

export function getProgressToNext(trophies: number): {
  progressPct: number;
  trophiesInArena: number;
  trophiesNeeded: number;
} {
  const current = getArenaForTrophies(trophies);
  if (current.maxTrophies === Infinity) {
    return { progressPct: 1, trophiesInArena: trophies - current.minTrophies, trophiesNeeded: 0 };
  }
  const span = current.maxTrophies - current.minTrophies;
  const earned = trophies - current.minTrophies;
  return {
    progressPct: Math.min(earned / span, 1),
    trophiesInArena: earned,
    trophiesNeeded: current.maxTrophies - trophies,
  };
}
