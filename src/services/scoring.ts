const BASE_POINTS = 100;
const MAX_SPEED_BONUS = 90;
const QUESTION_DURATION_MS = 10_000;
const COMBO_THRESHOLD = 3;
const COMBO_MULTIPLIER = 2;

// Trofei guadagnati/persi per partita ranked
const TROPHY_WIN = 25;
const TROPHY_LOSE = 15;

export interface ScoreResult {
  pointsEarned: number;
  newScore: number;
  newCombo: number;
  isComboActive: boolean;
}

export function calculateScore(
  correct: boolean,
  elapsedMs: number,
  currentScore: number,
  currentCombo: number,
): ScoreResult {
  if (!correct) {
    return { pointsEarned: 0, newScore: currentScore, newCombo: 0, isComboActive: false };
  }

  const clampedElapsed = Math.min(elapsedMs, QUESTION_DURATION_MS);
  const remaining = QUESTION_DURATION_MS - clampedElapsed;
  const speedBonus = Math.floor((remaining / QUESTION_DURATION_MS) * MAX_SPEED_BONUS);

  const newCombo = currentCombo + 1;
  const isComboActive = newCombo >= COMBO_THRESHOLD;
  const multiplier = isComboActive ? COMBO_MULTIPLIER : 1;
  const pointsEarned = (BASE_POINTS + speedBonus) * multiplier;

  return { pointsEarned, newScore: currentScore + pointsEarned, newCombo, isComboActive };
}

/** Calcola trofei vinti/persi in una partita ranked */
export function calculateTrophyChange(iWon: boolean, myTrophies: number, opponentTrophies: number): number {
  if (iWon) {
    // Bonus se l'avversario ha più trofei
    const bonus = Math.max(0, Math.floor((opponentTrophies - myTrophies) / 50));
    return TROPHY_WIN + bonus;
  } else {
    // Penalità ridotta se l'avversario è molto più forte
    const reduction = Math.max(0, Math.floor((myTrophies - opponentTrophies) / 50));
    return -(Math.max(5, TROPHY_LOSE - reduction));
  }
}
