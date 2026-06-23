import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withSequence, withTiming,
} from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { calculateScore } from '../services/scoring';
import { shuffleQuestionIdsByDifficulty, getQuestionById } from '../data/questions';
import { Question, Topic, PlayerState } from '../types';
import { useLanguage } from '../i18n';
import { initSounds, playSound, stopSound, disposeSounds } from '../utils/sounds';
import { setSoloGameResult } from '../utils/soloGameResult';

import ScoreBoard from '../components/ScoreBoard';
import QuestionCard from '../components/QuestionCard';
import AnswerButton from '../components/AnswerButton';
import TrueFalseButtons from '../components/TrueFalseButtons';
import TimerBar from '../components/TimerBar';
import SpinningWheel from '../components/SpinningWheel';

// ─── Constants ────────────────────────────────────────────────────────────────

const QUESTION_DURATION_MS = 10_500;
const TOTAL_QUESTIONS = 10;
const ALL_TOPICS: Topic[] = ['Cinema', 'Sport', 'Geography', 'Music', 'Science'];

const BOT_CONFIGS = {
  easy:   { correctProbability: 0.55, minDelayMs: 4500, maxDelayMs: 9000 },
  medium: { correctProbability: 0.72, minDelayMs: 3000, maxDelayMs: 7500 },
  hard:   { correctProbability: 0.88, minDelayMs: 1500, maxDelayMs: 5500 },
};

type Difficulty = 'easy' | 'medium' | 'hard';
type Phase = 'wheel' | 'countdown' | 'playing' | 'finished';

// ─── Countdown overlay (fasi separate, non overlay) ──────────────────────────

function CountdownOverlay({ onDone }: { onDone: () => void }) {
  const [num, setNum]       = useState(3);
  const [showGo, setShowGo] = useState(false);
  const scale   = useSharedValue(3);
  const opacity = useSharedValue(0);

  const animTick = () => {
    scale.value   = 3;
    opacity.value = 0;
    scale.value   = withSpring(1, { damping: 7, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 150 });
  };

  useEffect(() => {
    playSound('beep');   // "3"
    animTick();
    const t1 = setTimeout(() => { setNum(2);       animTick(); playSound('beep'); }, 1000);
    const t2 = setTimeout(() => { setNum(1);       animTick(); playSound('beep'); }, 2000);
    const t3 = setTimeout(() => { setShowGo(true); animTick(); playSound('go');   }, 3000);
    const t4 = setTimeout(onDone, 3600);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.countdownFull}>
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
    else            scale.value = withTiming(0, { duration: 180 });
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

export default function SoloGameScreen() {
  const router   = useRouter();
  const params   = useLocalSearchParams<{ difficulty: string; username: string }>();
  const difficulty = (params.difficulty ?? 'medium') as Difficulty;
  const username   = params.username ?? 'Tu';
  const { lang }   = useLanguage();

  // ── Game state ─────────────────────────────────────────────────────────────
  const [topic,          setTopic]          = useState<Topic>('Cinema');
  const [questions,      setQuestions]      = useState<Question[]>([]);
  const [phase,          setPhase]          = useState<Phase>('wheel');
  const [startedAt,      setStartedAt]      = useState(0);
  const [currentQIdx,    setCurrentQIdx]    = useState(0);
  const [myScore,        setMyScore]        = useState(0);
  const [myCombo,        setMyCombo]        = useState(0);
  const [myAnswerIdx,    setMyAnswerIdx]    = useState<number | null>(null);
  const [answerCorrect,  setAnswerCorrect]  = useState<boolean | null>(null);
  const [botScore,       setBotScore]       = useState(0);
  const [botLastAnswerAt,setBotLastAnswerAt]= useState(0);
  const [showReveal,     setShowReveal]     = useState(false);

  // ── Refs (avoid stale closures in timers) ─────────────────────────────────
  const currentQIdxRef = useRef(0);
  const startedAtRef   = useRef(0);
  const questionsRef   = useRef<Question[]>([]);
  const difficultyRef  = useRef<Difficulty>(difficulty);
  const botScoreRef    = useRef(0);
  const botComboRef    = useRef(0);
  const myScoreRef     = useRef(0);
  const myComboRef     = useRef(0);
  const botTimerRef        = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef           = useRef<Phase>('wheel');
  const hasRevealedRef     = useRef(false);
  const pendingMyScoreRef  = useRef<number | null>(null);
  const pendingMyComboRef  = useRef<number | null>(null);
  const pendingBotScoreRef = useRef<number | null>(null);
  const myAnswersRef       = useRef<Record<number, number>>({});
  const botAnswersRef      = useRef<Record<number, number>>({});

  difficultyRef.current = difficulty;

  // ── Audio: init on mount, dispose on unmount ───────────────────────────────
  useEffect(() => {
    initSounds();
    return () => disposeSounds();
  }, []);

  // ── Init: random topic + questions ─────────────────────────────────────────
  useEffect(() => {
    const t = ALL_TOPICS[Math.floor(Math.random() * ALL_TOPICS.length)];
    setTopic(t);
    const ids = shuffleQuestionIdsByDifficulty(t, difficulty, TOTAL_QUESTIONS);
    const qs  = ids.map((id) => getQuestionById(id)).filter((q): q is Question => !!q);
    questionsRef.current = qs;
    setQuestions(qs);
  }, []);

  // ── Spin sound: play while wheel is active and questions are ready ─────────
  const questionsReady = questions.length > 0;
  useEffect(() => {
    if (phase !== 'wheel' || !questionsReady) return;
    playSound('spin');
    return () => stopSound('spin');
  }, [phase, questionsReady]);

  // ── Bot timer scheduling ───────────────────────────────────────────────────
  const scheduleBotAnswer = useCallback((qIdx: number) => {
    if (botTimerRef.current) { clearTimeout(botTimerRef.current); botTimerRef.current = null; }
    const cfg   = BOT_CONFIGS[difficultyRef.current];
    const delay = cfg.minDelayMs + Math.random() * (cfg.maxDelayMs - cfg.minDelayMs);
    const qStart = startedAtRef.current + qIdx * QUESTION_DURATION_MS;

    botTimerRef.current = setTimeout(() => {
      if (phaseRef.current === 'finished') return;
      const question = questionsRef.current[qIdx];
      if (!question) return;
      const elapsed    = Date.now() - qStart;
      const correct    = Math.random() < cfg.correctProbability;
      const { newScore, newCombo } = calculateScore(correct, elapsed, botScoreRef.current, botComboRef.current);
      botScoreRef.current = newScore;
      botComboRef.current = newCombo;
      pendingBotScoreRef.current = newScore;
      setBotLastAnswerAt(Date.now());
      // Sceglie un optionIndex concreto (necessario per il riepilogo)
      const ci = question.correctIndex;
      const wrongIndices = question.options.it.map((_, i) => i).filter(i => i !== ci);
      const botOptionIdx = correct
        ? ci
        : wrongIndices[Math.floor(Math.random() * wrongIndices.length)] ?? ci;
      botAnswersRef.current[qIdx] = botOptionIdx;
    }, delay);
  }, []);

  // ── Game loop ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing' || startedAt === 0) return;
    phaseRef.current    = 'playing';
    startedAtRef.current = startedAt;
    scheduleBotAnswer(0);

    const interval = setInterval(() => {
      const elapsed    = Date.now() - startedAtRef.current;
      const qIdx       = Math.min(Math.floor(elapsed / QUESTION_DURATION_MS), TOTAL_QUESTIONS - 1);
      const elapsedInQ = elapsed - currentQIdxRef.current * QUESTION_DURATION_MS;

      // Reveal a 10s: mostra esito e punteggi
      if (elapsedInQ >= 10_000 && !hasRevealedRef.current) {
        hasRevealedRef.current = true;
        setShowReveal(true);
        if (pendingMyScoreRef.current !== null) {
          setMyScore(pendingMyScoreRef.current);
          setMyCombo(pendingMyComboRef.current ?? 0);
          pendingMyScoreRef.current = null;
          pendingMyComboRef.current = null;
        }
        if (pendingBotScoreRef.current !== null) {
          setBotScore(pendingBotScoreRef.current);
          pendingBotScoreRef.current = null;
        }
      }

      if (qIdx !== currentQIdxRef.current) {
        hasRevealedRef.current = false;
        currentQIdxRef.current = qIdx;
        setCurrentQIdx(qIdx);
        setMyAnswerIdx(null);
        setAnswerCorrect(null);
        setShowReveal(false);
        scheduleBotAnswer(qIdx);
      }

      if (elapsed >= QUESTION_DURATION_MS * TOTAL_QUESTIONS) {
        clearInterval(interval);
        phaseRef.current = 'finished';
        setPhase('finished');
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [phase, startedAt]);

  // ── Navigate to result when finished ──────────────────────────────────────
  useEffect(() => {
    if (phase !== 'finished') return;
    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    setSoloGameResult({
      questions:  questionsRef.current,
      myAnswers:  { ...myAnswersRef.current },
      botAnswers: { ...botAnswersRef.current },
    });

    console.log('[SoloGame] risultati salvati:', {
      questions:  questionsRef.current.map((q, i) => ({
        idx: i, id: q.id, correct: q.correctIndex,
        myAnswer:  myAnswersRef.current[i] ?? null,
        botAnswer: botAnswersRef.current[i] ?? null,
      })),
    });

    setTimeout(() => {
      router.replace({
        pathname: '/solo-result',
        params: {
          myScore:  myScoreRef.current.toString(),
          botScore: botScoreRef.current.toString(),
          username,
          difficulty,
        },
      } as any);
    }, 400);
  }, [phase]);

  // ── User answer ────────────────────────────────────────────────────────────
  const handleAnswer = (optionIndex: number) => {
    if (myAnswerIdx !== null || phase !== 'playing' || startedAt === 0) return;
    const question = questions[currentQIdx];
    if (!question) return;
    const qStart  = startedAt + currentQIdx * QUESTION_DURATION_MS;
    const elapsed = Date.now() - qStart;
    const correct = optionIndex === question.correctIndex;
    const { newScore, newCombo } = calculateScore(correct, elapsed, myScoreRef.current, myComboRef.current);
    myScoreRef.current = newScore;
    myComboRef.current = newCombo;
    setMyAnswerIdx(optionIndex);
    setAnswerCorrect(correct);
    pendingMyScoreRef.current = newScore;
    pendingMyComboRef.current = newCombo;
    myAnswersRef.current[currentQIdx] = optionIndex;
    Haptics.notificationAsync(
      correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error,
    );
  };

  // ── Derived values ─────────────────────────────────────────────────────────
  const currentQuestion   = questions[currentQIdx] ?? null;
  const questionStartTime = startedAt > 0 ? startedAt + currentQIdx * QUESTION_DURATION_MS : 0;

  const meState: PlayerState = useMemo(() => ({
    uid: 'me', username, score: myScore, combo: myCombo,
    trophies: 0, answers: {}, lastAnswerAt: 0,
  }), [username, myScore, myCombo]);

  const botState: PlayerState = useMemo(() => ({
    uid: 'cpu', username: 'CPU', score: botScore, combo: 0,
    trophies: 0, answers: {}, lastAnswerAt: botLastAnswerAt,
  }), [botScore, botLastAnswerAt]);

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

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER — una fase alla volta, mai sovrapposte
  // ══════════════════════════════════════════════════════════════════════════

  // ── Fase WHEEL ─────────────────────────────────────────────────────────────
  // Schermata a tutto schermo, sfondo blu opaco, NESSUN contenuto di gioco.
  if (phase === 'wheel') {
    return (
      <SafeAreaView style={styles.safeBlue}>
        <LinearGradient colors={['#0e38b8', '#1244c8']} style={StyleSheet.absoluteFill} />
        {questionsReady ? (
          <SpinningWheel
            topic={topic}
            standalone
            onSettle={() => {
              stopSound('spin');
              playSound('select');
            }}
            onDone={() => setPhase('countdown')}
          />
        ) : (
          <View style={styles.loading}>
            <Text style={styles.loadingText}>Caricamento…</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // ── Fase COUNTDOWN ────────────────────────────────────────────────────────
  // Schermata a tutto schermo, 3-2-1-VIA!, poi passa a 'playing'.
  if (phase === 'countdown') {
    return (
      <SafeAreaView style={styles.safeBlue}>
        <LinearGradient colors={['#0e38b8', '#1244c8']} style={StyleSheet.absoluteFill} />
        <CountdownOverlay
          onDone={() => {
            const now = Date.now();
            startedAtRef.current = now;
            setStartedAt(now);
            setPhase('playing');
          }}
        />
      </SafeAreaView>
    );
  }

  // ── Fase PLAYING / FINISHED ───────────────────────────────────────────────
  if (!currentQuestion) return null; // transizione brevissima

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#1244c8', '#1040b8']} style={StyleSheet.absoluteFill} />

      <ScoreBoard
        me={meState}
        opponent={botState}
        questionIndex={currentQIdx}
        totalQuestions={TOTAL_QUESTIONS}
      />

      <View style={styles.body}>
        {questionStartTime > 0 && (
          <TimerBar key={currentQIdx} questionStartTime={questionStartTime} durationMs={10_000} />
        )}

        <QuestionCard
          topic={topic}
          questionText={currentQuestion.text[lang]}
          questionNumber={currentQIdx}
          totalQuestions={TOTAL_QUESTIONS}
        />

        {botLastAnswerAt > 0 && myAnswerIdx === null && (
          <View style={styles.botHint}>
            <View style={styles.botDot} />
            <Text style={styles.botHintText}>CPU ha risposto — sbrigati!</Text>
          </View>
        )}

        <ComboBadge combo={myCombo} />

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: '#1244c8' },
  safeBlue: { flex: 1, backgroundColor: '#0e38b8' },
  loading:  { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#9ab8ff', fontSize: 16 },

  body:    { flex: 1, justifyContent: 'space-around', paddingVertical: 12, gap: 14 },
  answers: { gap: 9, paddingBottom: 8 },

  botHint:     { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20 },
  botDot:      { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#ef4444' },
  botHintText: { color: '#ef4444', fontSize: 12, fontWeight: '600' },

  comboBadge: {
    alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingVertical: 6, paddingHorizontal: 18, borderRadius: 999,
    backgroundColor: '#c9a84c18', borderWidth: 1, borderColor: '#c9a84c',
  },
  comboText: { color: '#c9a84c', fontSize: 13, fontWeight: '900' },

  // Countdown — riempie tutto lo schermo, centrato
  countdownFull: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  countdownNum: {
    fontSize: 110, fontWeight: '900', color: '#f4f4f8',
    textShadowColor: '#4a1d96', textShadowRadius: 40,
    textShadowOffset: { width: 0, height: 0 },
  },
});