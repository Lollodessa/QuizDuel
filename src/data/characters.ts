import { Character, CharacterRarity } from '../types';

export const CHARACTERS: Character[] = [
  {
    letter: 'A', name: 'Ace', powerLabel: 'Prima Mossa',
    description: 'La prima risposta corretta della partita vale il doppio dei punti.',
    color: '#ef4444', colorDark: '#450a0a', rarity: 'common',
  },
  {
    letter: 'B', name: 'Bolt', powerLabel: 'Turbo Timer',
    description: 'Il timer scorre del 20% più lentamente per te.',
    color: '#f59e0b', colorDark: '#451a03', rarity: 'rare',
  },
  {
    letter: 'C', name: 'Clutch', powerLabel: 'Combo Lock',
    description: 'La tua combo non si azzera mai (una volta a partita).',
    color: '#f97316', colorDark: '#431407', rarity: 'rare',
  },
  {
    letter: 'D', name: 'Dusk', powerLabel: 'Scudo Trofei',
    description: 'Perdi il 25% di trofei in meno in caso di sconfitta.',
    color: '#a855f7', colorDark: '#2e1065', rarity: 'common',
  },
  {
    letter: 'E', name: 'Echo', powerLabel: 'Lettore di Menti',
    description: "Vedi la scelta dell'avversario 3 secondi dopo che ha risposto.",
    color: '#14b8a6', colorDark: '#042f2e', rarity: 'rare',
  },
  {
    letter: 'F', name: 'Flash', powerLabel: 'Tempo Extra',
    description: 'Hai 2 secondi aggiuntivi per ogni domanda.',
    color: '#06b6d4', colorDark: '#083344', rarity: 'common',
  },
  {
    letter: 'G', name: 'Grit', powerLabel: 'Testa di Serie',
    description: 'Inizi ogni partita con 50 punti bonus.',
    color: '#22c55e', colorDark: '#052e16', rarity: 'common',
  },
  {
    letter: 'H', name: 'Haze', powerLabel: 'Velocità+',
    description: 'Il bonus velocità vale 1.5× in più per te.',
    color: '#ec4899', colorDark: '#500724', rarity: 'rare',
  },
  {
    letter: 'I', name: 'Iron', powerLabel: 'Combo di Ferro',
    description: 'Una risposta sbagliata non azzera la tua combo (una volta).',
    color: '#94a3b8', colorDark: '#0f172a', rarity: 'common',
  },
  {
    letter: 'J', name: 'Jinx', powerLabel: 'Elimina Opzione',
    description: 'Una volta a partita puoi eliminare una risposta sbagliata.',
    color: '#84cc16', colorDark: '#1a2e05', rarity: 'epic',
  },
  {
    letter: 'K', name: 'King', powerLabel: 'Re dei Trofei',
    description: 'Guadagni il 30% di trofei in più per ogni vittoria.',
    color: '#c9a84c', colorDark: '#2a1f00', rarity: 'legendary',
  },
  {
    letter: 'L', name: 'Luck', powerLabel: 'Fortuna Cieca',
    description: 'Ogni risposta corretta ha il 30% di chance di dare punti doppi.',
    color: '#8b5cf6', colorDark: '#2e1065', rarity: 'rare',
  },
  {
    letter: 'M', name: 'Mirage', powerLabel: 'Pareggio Vittorioso',
    description: 'In caso di pareggio, viene contato come vittoria (una volta).',
    color: '#6366f1', colorDark: '#1e1b4b', rarity: 'epic',
  },
  {
    letter: 'N', name: 'Neon', powerLabel: 'Risposta Perfetta',
    description: 'La prima risposta corretta in meno di 2 secondi vale il triplo.',
    color: '#10b981', colorDark: '#022c22', rarity: 'rare',
  },
  {
    letter: 'O', name: 'Orb', powerLabel: 'Serie Crescente',
    description: 'Ogni 2 risposte corrette di fila guadagni +10% punti extra.',
    color: '#3b82f6', colorDark: '#1e3a5f', rarity: 'common',
  },
  {
    letter: 'P', name: 'Phoenix', powerLabel: 'Risurrezione',
    description: "Se sei sotto al 30% dei punti avversario, guadagni +50% punti.",
    color: '#f43f5e', colorDark: '#4c0519', rarity: 'rare',
  },
  {
    letter: 'Q', name: 'Quake', powerLabel: 'Terra Tremante',
    description: 'Tutte le domande valgono il 10% in più per te.',
    color: '#78716c', colorDark: '#1c1412', rarity: 'epic',
  },
  {
    letter: 'R', name: 'Rage', powerLabel: 'Furia Massima',
    description: 'La tua combo può arrivare fino a ×4 invece di ×3.',
    color: '#dc2626', colorDark: '#450a0a', rarity: 'legendary',
  },
  {
    letter: 'S', name: 'Shade', powerLabel: 'Salvezza',
    description: 'Una volta a sessione, una sconfitta non toglie trofei.',
    color: '#0ea5e9', colorDark: '#082f49', rarity: 'common',
  },
  {
    letter: 'T', name: 'Tide', powerLabel: 'Ultima Ondata',
    description: "L'ultima domanda vale il doppio dei punti.",
    color: '#0891b2', colorDark: '#164e63', rarity: 'rare',
  },
  {
    letter: 'U', name: 'Ultra', powerLabel: 'Inizio Esplosivo',
    description: 'Le prime 3 risposte corrette danno il 50% di punti in più.',
    color: '#d946ef', colorDark: '#4a044e', rarity: 'legendary',
  },
  {
    letter: 'V', name: 'Void', powerLabel: 'Blackout',
    description: "Il punteggio dell'avversario viene nascosto per 5 secondi.",
    color: '#475569', colorDark: '#020617', rarity: 'epic',
  },
  {
    letter: 'W', name: 'Wave', powerLabel: 'Surf Lightning',
    description: 'Se rispondi nei primi 3 secondi, guadagni punti doppi.',
    color: '#38bdf8', colorDark: '#082f49', rarity: 'rare',
  },
  {
    letter: 'X', name: 'Xerox', powerLabel: 'Visione X',
    description: 'Una volta a partita, la risposta corretta è evidenziata per 1 secondo.',
    color: '#e2e8f0', colorDark: '#1e293b', rarity: 'epic',
  },
  {
    letter: 'Y', name: 'Yell', powerLabel: 'Urlo di Guerra',
    description: 'Vibrazione rinforzata per ogni risposta corretta. Pura motivazione.',
    color: '#fb923c', colorDark: '#431407', rarity: 'common',
  },
  {
    letter: 'Z', name: 'Zenith', powerLabel: 'Partita Perfetta',
    description: '10/10 risposte corrette = +50 trofei bonus a fine partita.',
    color: '#fbbf24', colorDark: '#451a03', rarity: 'legendary',
  },
];

export const RARITY_CONFIG: Record<string, { border: string; glow: string; label: string }> = {
  common:    { border: '#6b7280', glow: '#37415120', label: 'COMUNE' },
  rare:      { border: '#3b82f6', glow: '#1d4ed840', label: 'RARO' },
  epic:      { border: '#8b5cf6', glow: '#6d28d940', label: 'EPICO' },
  legendary: { border: '#c9a84c', glow: '#92400e60', label: 'LEGGENDARIO' },
};

export const STORAGE_KEYS = {
  COINS: '@quizduel_coins',
  GEMS: '@quizduel_gems',
  CHARACTERS: '@quizduel_characters',
  ACTIVE_CHARACTER: '@quizduel_active_character',
};
