export type Topic = 'Cinema' | 'Sport' | 'Geography' | 'Music' | 'Science';

export type CharacterLetter =
  'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' |
  'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

export type CharacterRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Character {
  letter: CharacterLetter;
  name: string;
  powerLabel: string;
  description: string;
  color: string;
  colorDark: string;
  rarity: CharacterRarity;
  image?: any;
}

export type MatchMode = 'ranked' | 'friendly';

export type QuestionType = 'multiple' | 'truefalse';

export interface Question {
  id: string;
  topic: Topic;
  difficulty: 'easy' | 'medium' | 'hard';
  type?: QuestionType; // omitted = 'multiple'
  text: { it: string; en: string; fr: string; es: string };
  options: { it: string[]; en: string[]; fr: string[]; es: string[] };
  correctIndex: number;
}

export interface PlayerAnswer {
  optionIndex: number;
  correct: boolean;
  answeredAt: number;
  pointsEarned: number;
}

export interface PlayerState {
  uid: string;
  username: string;
  score: number;
  combo: number;
  trophies: number;
  answers: Record<number, PlayerAnswer>;
  lastAnswerAt: number;
}

export type RoomStatus = 'waiting' | 'countdown' | 'active' | 'finished';

export interface Room {
  id: string;
  topic: Topic;
  mode: MatchMode;
  status: RoomStatus;
  hostUid: string;
  players: Record<string, PlayerState>;
  questionIds: string[];
  startedAt: number;
  countdownAt: number;
  createdAt: number;
  totalQuestions: number;
}

export interface UserProfile {
  username: string;
  trophies: number;
  wins: number;
  losses: number;
}
