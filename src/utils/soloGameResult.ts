import { Question } from '../types';

export interface SoloGameResult {
  questions: Question[];
  myAnswers: Record<number, number>;   // qIdx → optionIndex scelto (assente = non risposto)
  botAnswers: Record<number, number>;  // qIdx → optionIndex scelto (assente = non risposto)
}

let _result: SoloGameResult | null = null;

export function setSoloGameResult(r: SoloGameResult): void { _result = r; }
export function getSoloGameResult(): SoloGameResult | null { return _result; }
export function clearSoloGameResult(): void { _result = null; }
