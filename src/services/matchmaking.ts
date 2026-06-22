import {
  ref,
  set,
  get,
  push,
  update,
  onValue,
  off,
  query,
  orderByChild,
  equalTo,
  DataSnapshot,
} from 'firebase/database';
import { signInAnonymously } from 'firebase/auth';
import { auth, database } from './firebase';
import { Room, PlayerState, Topic, MatchMode } from '../types';
import { shuffleQuestionIds } from '../data/questions';
import { getArenaForTrophies } from '../data/arenas';

const ROOMS_PATH = 'rooms';
const TOTAL_QUESTIONS = 10;
const ALL_TOPICS: Topic[] = ['Cinema', 'Sport', 'Geography', 'Music', 'Science'];

const randomTopic = (): Topic => ALL_TOPICS[Math.floor(Math.random() * ALL_TOPICS.length)];

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function ensureAuth(): Promise<string> {
  if (auth.currentUser) return auth.currentUser.uid;
  const cred = await signInAnonymously(auth);
  return cred.user.uid;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildPlayerState(uid: string, username: string, trophies: number): PlayerState {
  return { uid, username, score: 0, combo: 0, trophies, answers: {}, lastAnswerAt: 0 };
}

// ─── Room lifecycle ───────────────────────────────────────────────────────────

export async function createRoom(
  username: string,
  trophies: number,
  mode: MatchMode = 'ranked',
): Promise<string> {
  const uid = await ensureAuth();
  const roomRef = push(ref(database, ROOMS_PATH));
  const roomId = roomRef.key!;
  const topic = randomTopic();

  const room: Omit<Room, 'id'> = {
    topic,
    mode,
    status: 'waiting',
    hostUid: uid,
    players: { [uid]: buildPlayerState(uid, username, trophies) },
    questionIds: shuffleQuestionIds(topic, TOTAL_QUESTIONS),
    startedAt: 0,
    countdownAt: 0,
    createdAt: Date.now(),
    totalQuestions: TOTAL_QUESTIONS,
  };

  await set(roomRef, room);
  return roomId;
}

export async function joinRoom(roomId: string, username: string, trophies: number): Promise<Room> {
  const uid = await ensureAuth();
  const roomRef = ref(database, `${ROOMS_PATH}/${roomId}`);
  const snap = await get(roomRef);

  if (!snap.exists()) throw new Error('Stanza non trovata');
  const room = { id: roomId, ...snap.val() } as Room;

  if (room.status !== 'waiting') throw new Error('La stanza non è più disponibile');
  if (Object.keys(room.players).length >= 2) throw new Error('Stanza piena');
  if (room.players[uid]) return room;

  await update(
    ref(database, `${ROOMS_PATH}/${roomId}/players/${uid}`),
    buildPlayerState(uid, username, trophies),
  );
  return room;
}

/** Matchmaking casuale: cerca una stanza aperta o ne crea una nuova */
export async function findOrCreateRoom(
  username: string,
  trophies: number,
): Promise<{ roomId: string; isHost: boolean }> {
  const uid = await ensureAuth();

  const waitingQuery = query(
    ref(database, ROOMS_PATH),
    orderByChild('status'),
    equalTo('waiting'),
  );

  const snap = await get(waitingQuery);

  if (snap.exists()) {
    const rooms = snap.val() as Record<string, Omit<Room, 'id'>>;
    const myArena = getArenaForTrophies(trophies);
    const match = Object.entries(rooms).find(
      ([, room]) => {
        if (room.mode !== 'ranked') return false;
        if (Object.keys(room.players).length !== 1) return false;
        if (room.players[uid]) return false;
        // Match only within the same arena
        const hostTrophies = Object.values(room.players)[0]?.trophies ?? 0;
        const hostArena = getArenaForTrophies(hostTrophies);
        return hostArena.name === myArena.name;
      },
    );

    if (match) {
      await joinRoom(match[0], username, trophies);
      return { roomId: match[0], isHost: false };
    }
  }

  const roomId = await createRoom(username, trophies, 'ranked');
  return { roomId, isHost: true };
}

// ─── Transizioni di stato ─────────────────────────────────────────────────────

export async function startCountdown(roomId: string): Promise<void> {
  await update(ref(database, `${ROOMS_PATH}/${roomId}`), {
    status: 'countdown',
    countdownAt: Date.now(),
  });
}

export async function startGame(roomId: string): Promise<void> {
  await update(ref(database, `${ROOMS_PATH}/${roomId}`), {
    status: 'active',
    startedAt: Date.now(),
  });
}

export async function finishGame(roomId: string): Promise<void> {
  await update(ref(database, `${ROOMS_PATH}/${roomId}`), { status: 'finished' });
}

// ─── Azioni in game ───────────────────────────────────────────────────────────

export async function submitAnswer(
  roomId: string,
  uid: string,
  questionIndex: number,
  optionIndex: number,
  correct: boolean,
  pointsEarned: number,
  newScore: number,
  newCombo: number,
): Promise<void> {
  const now = Date.now();
  await update(ref(database, `${ROOMS_PATH}/${roomId}/players/${uid}`), {
    [`answers/${questionIndex}`]: { optionIndex, correct, answeredAt: now, pointsEarned },
    score: newScore,
    combo: newCombo,
    lastAnswerAt: now,
  });
}

// ─── Subscription ─────────────────────────────────────────────────────────────

export function subscribeToRoom(
  roomId: string,
  callback: (room: Room | null) => void,
): () => void {
  const roomRef = ref(database, `${ROOMS_PATH}/${roomId}`);
  const handler = (snap: DataSnapshot) =>
    callback(snap.exists() ? ({ id: roomId, ...snap.val() } as Room) : null);
  onValue(roomRef, handler);
  return () => off(roomRef, 'value', handler);
}

export async function deleteRoom(roomId: string): Promise<void> {
  await set(ref(database, `${ROOMS_PATH}/${roomId}`), null);
}
