import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { auth } from '../services/firebase';
import { subscribeToRoom, startGame, finishGame, submitAnswer } from '../services/matchmaking';
import { calculateScore } from '../services/scoring';
import { getQuestionById } from '../data/questions';
import { Room, Question } from '../types';
import { useLanguage } from '../i18n';

import ScoreBoard from '../components/ScoreBoard';
import QuestionCard from '../components/QuestionCard';
import AnswerButton from '../components/AnswerButton';
import TrueFalseButtons from '../components/TrueFalseButtons';
import TimerBar from '../components/TimerBar';
import SpinningWheel from '../components/SpinningWheel';

const QUESTION_DURATION_MS = 10_500;
const TOTAL_QUESTIONS = 10;

// ─── Countdown overlay ────────────────────────────────────────────────────────

function CountdownOverlay({ onDone }: { onDone: () => void }) {
  const [num, setNum] = useState(3);
  const [showGo, setShowGo] = useState(false);
  const scale = useSharedValue(3);
  const opacity = useSharedValue(0);

  const animTick = () => {
    scale.value = 3;
    opacity.value = 0;
    scale.value = withSpring(1, { damping: 7, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 150 });
  };

  useEffect(() => {
    animTick();
    const t1 = setTimeout(() => { setNum(2); animTick(); }, 1000);
    const t2 = setTimeout(() => { setNum(1); animTick(); }, 2000);
    const t3 = setTimeout(() => { setShowGo(true); animTick(); }, 3000);
    const t4 = setTimeout(onDone, 3600);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.overlay}>
      <LinearGradient colors={['#0c0c0eee', '#0f0f14ee']} style={StyleSheet.absoluteFillObject} />
      <Animated.Text style={[styles.countdownNum, style]}>
        {showGo ? 'VIA!' : num}
      </Animated.Text>
    </View>
  );
}

// ─── Combo badge ──────────────────────────────────────────────────────────────

function ComboBadge({ combo }: { combo: number }) {
  const scale = useSharedValue(0);
  useEffect(() => {
    if (combo >= 3) scale.value = withSequence(withSpring(1.15, { damping: 5 }), withSpring(1));
    else scale.value = withTiming(0, { duration: 180 });
  }, [combo]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  if (combo < 3) return null;
  return (
    <Animated.View style={[styles.comboBadge, style]}>
      <Ionicons name="flame" size={13} color="#c9a84c" />
      <Text style={styles.comboText}>{combo} di fila — vai!</Text>
    </Animated.View>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function GameScreen() {
  const router = useRouter();
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { lang } = useLanguage();

  const [room, setRoom] = useState<Room | null>(null);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [myAnswerIdx, setMyAnswerIdx] = useState<number | null>(null);
  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);
  const [showWheel, setShowWheel] = useState(true);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showReveal,            setShowReveal]            = useState(false);
  const [revealedMyScore,       setRevealedMyScore]       = useState(0);
  const [revealedMyCombo,       setRevealedMyCombo]       = useState(0);
  const [revealedOpponentScore, setRevealedOpponentScore] = useState(0);

  const currentQIdxRef = useRef(0);
  const finishedRef    = useRef(false);
  const gameStartedRef = useRef(false);
  const unsubRef       = useRef<(() => void) | null>(null);
  const hasRevealedRef = useRef(false);
  const roomRef        = useRef<Room | null>(null);

  const uid = auth.currentUser?.uid ?? '';
  roomRef.current = room;

  useEffect(() => {
    if (!roomId) return;
    unsubRef.current = subscribeToRoom(roomId, setRoom);
    return () => unsubRef.current?.();
  }, [roomId]);

  const handleCountdownDone = () => {
    setShowCountdown(false);
    if (room?.hostUid === uid && !gameStartedRef.current) {
      gameStartedRef.current = true;
      startGame(roomId);
    }
  };

  useEffect(() => {
    if (!room?.startedAt || room.status !== 'active') return;
    const startedAt = room.startedAt;

    const interval = setInterval(() => {
      const elapsed    = Date.now() - startedAt;
      const qIdx       = Math.min(Math.floor(elapsed / QUESTION_DURATION_MS), TOTAL_QUESTIONS - 1);
      const elapsedInQ = elapsed - currentQIdxRef.current * QUESTION_DURATION_MS;

      // Reveal a 10s: aggiorna i punteggi visualizzati da Firebase
      if (elapsedInQ >= 10_000 && !hasRevealedRef.current) {
        hasRevealedRef.current = true;
        setShowReveal(true);
        const r = roomRef.current;
        if (r) {
          setRevealedMyScore(r.players[uid]?.score ?? 0);
          setRevealedMyCombo(r.players[uid]?.combo ?? 0);
          const opp = Object.values(r.players).find(p => p.uid !== uid);
          if (opp) setRevealedOpponentScore(opp.score);
        }
      }

      if (qIdx !== currentQIdxRef.current) {
        hasRevealedRef.current = false;
        currentQIdxRef.current = qIdx;
        setCurrentQIdx(qIdx);
        setMyAnswerIdx(null);
        setAnswerCorrect(null);
        setShowReveal(false);
      }

      if (elapsed >= QUESTION_DURATION_MS * TOTAL_QUESTIONS && !finishedRef.current) {
        finishedRef.current = true;
        clearInterval(interval);
        if (room.hostUid === uid) finishGame(roomId);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [room?.startedAt, room?.status]);

  useEffect(() => {
    if (!room || room.status !== 'finished') return;
    unsubRef.current?.();
    setTimeout(() => {
      router.replace({ pathname: '/result', params: { roomId, myUid: uid } });
    }, 400);
  }, [room?.status]);

  const questions: Question[] = useMemo(() => {
    if (!room) return [];
    return room.questionIds.map((id) => getQuestionById(id)).filter((q): q is Question => !!q);
  }, [room?.questionIds]);

  const currentQuestion = questions[currentQIdx] ?? null;
  const myPlayer = room?.players[uid];
  const opponentEntry = Object.entries(room?.players ?? {}).find(([id]) => id !== uid);
  const opponentPlayer = opponentEntry?.[1] ?? null;
  const questionStartTime = room?.startedAt ? room.startedAt + currentQIdx * QUESTION_DURATION_MS : 0;

  const handleAnswer = async (optionIndex: number) => {
    if (myAnswerIdx !== null || !currentQuestion || !room?.startedAt) return;

    const elapsed = (Date.now() - room.startedAt) % QUESTION_DURATION_MS;
    const correct = optionIndex === currentQuestion.correctIndex;
    const { pointsEarned, newScore, newCombo } = calculateScore(
      correct, elapsed, myPlayer?.score ?? 0, myPlayer?.combo ?? 0,
    );

    setMyAnswerIdx(optionIndex);
    setAnswerCorrect(correct);
    Haptics.notificationAsync(
      correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error,
    );

    await submitAnswer(roomId, uid, currentQIdx, optionIndex, correct, pointsEarned, newScore, newCombo);
  };

  const getButtonState = (idx: number) => {
    if (myAnswerIdx === null) {
      if (showReveal && idx === currentQuestion?.correctIndex) return 'reveal-correct';
      return 'idle';
    }
    if (!showReveal) return idx === myAnswerIdx ? 'selected-pending' : 'disabled';
    if (idx === myAnswerIdx) return answerCorrect ? 'selected-correct' : 'selected-wrong';
    if (!answerCorrect && idx === currentQuestion?.correctIndex) return 'reveal-correct';
    return 'disabled';
  };

  if (!room || !currentQuestion) {
    return (
      <SafeAreaView style={styles.safe}>
        <LinearGradient colors={['#1244c8', '#1040b8']} style={StyleSheet.absoluteFillObject} />
        <View style={styles.loading}><Text style={styles.loadingText}>Caricamento…</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#1244c8', '#1040b8']} style={StyleSheet.absoluteFillObject} />

      <ScoreBoard
        me={{ ...(myPlayer ?? { uid, username: 'Tu', score: 0, combo: 0, trophies: 0, answers: {}, lastAnswerAt: 0 }), score: revealedMyScore, combo: revealedMyCombo }}
        opponent={opponentPlayer ? { ...opponentPlayer, score: revealedOpponentScore } : null}
        questionIndex={currentQIdx}
        totalQuestions={TOTAL_QUESTIONS}
      />

      <View style={styles.body}>
        {room.status === 'active' && questionStartTime > 0 && (
          <TimerBar key={currentQIdx} questionStartTime={questionStartTime} durationMs={10_000} />
        )}

        <QuestionCard
          topic={room.topic}
          questionText={currentQuestion.text[lang]}
          questionNumber={currentQIdx}
          totalQuestions={TOTAL_QUESTIONS}
        />

        {opponentPlayer?.answers[currentQIdx] && (
          <View style={styles.opponentHint}>
            <View style={styles.opponentDot} />
            <Text style={styles.opponentHintText}>
              {opponentPlayer.username} ha già risposto — sbrigati!
            </Text>
          </View>
        )}

        <ComboBadge combo={revealedMyCombo} />

        {(currentQuestion.type ?? 'multiple') === 'truefalse' ? (
          <TrueFalseButtons
            labels={[currentQuestion.options[lang][0], currentQuestion.options[lang][1]]}
            getState={getButtonState}
            onPress={handleAnswer}
          />
        ) : (
          <View style={styles.answers}>
            {currentQuestion.options[lang].map((option, idx) => (
              <AnswerButton
                key={idx}
                index={idx}
                label={option}
                state={getButtonState(idx)}
                onPress={() => handleAnswer(idx)}
              />
            ))}
          </View>
        )}
      </View>

      {showWheel && room.status === 'countdown' && (
        <SpinningWheel
          topic={room.topic}
          onDone={() => { setShowWheel(false); setShowCountdown(true); }}
        />
      )}

      {showCountdown && room.status === 'countdown' && (
        <CountdownOverlay onDone={handleCountdownDone} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1244c8' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#9ab8ff', fontSize: 16 },
  body: { flex: 1, justifyContent: 'space-around', paddingVertical: 12, gap: 14 },
  answers: { gap: 9, paddingBottom: 8 },
  opponentHint: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20 },
  opponentDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#16a34a' },
  opponentHintText: { color: '#16a34a', fontSize: 12, fontWeight: '600' },
  comboBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: '#c9a84c18',
    borderWidth: 1,
    borderColor: '#c9a84c',
  },
  comboText: { color: '#c9a84c', fontSize: 13, fontWeight: '900' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  countdownNum: {
    fontSize: 110,
    fontWeight: '900',
    color: '#f4f4f8',
    textShadowColor: '#4a1d96',
    textShadowRadius: 40,
    textShadowOffset: { width: 0, height: 0 },
  },
});
