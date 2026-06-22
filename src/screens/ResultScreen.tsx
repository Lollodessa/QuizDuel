import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

import { subscribeToRoom } from '../services/matchmaking';
import { calculateTrophyChange } from '../services/scoring';
import { auth } from '../services/firebase';
import { Room } from '../types';
import PlayerAvatar from '../components/PlayerAvatar';
import { getRankForTrophies } from '../data/ranks';
import { STORAGE_KEYS } from '../data/storage';
import { USERNAME_KEY, TROPHIES_KEY } from './HomeScreen';
import { useLanguage } from '../i18n';

const COIN_REWARDS = { win: 20, draw: 10, loss: 5 };

const { width, height } = Dimensions.get('window');

// ─── Coriandoli ───────────────────────────────────────────────────────────────

const CONFETTI_COLORS = ['#c9a84c', '#4a1d96', '#1d4ed8', '#16a34a', '#b91c1c', '#0891b2'];

function ConfettiParticle({ delay }: { delay: number }) {
  const startX = useMemo(() => Math.random() * width, []);
  const drift = useMemo(() => (Math.random() - 0.5) * 120, []);
  const dur = useMemo(() => 1800 + Math.random() * 1000, []);
  const color = useMemo(() => CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)], []);
  const size = useMemo(() => 6 + Math.random() * 9, []);
  const isCircle = useMemo(() => Math.random() > 0.5, []);

  const y = useSharedValue(-20);
  const x = useSharedValue(startX);
  const rot = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 100 }));
    y.value = withDelay(delay, withTiming(height + 60, { duration: dur }));
    x.value = withDelay(delay, withTiming(startX + drift, { duration: dur }));
    rot.value = withDelay(delay, withTiming(Math.random() * 720 - 360, { duration: dur }));
    opacity.value = withDelay(delay + dur * 0.65, withTiming(0, { duration: dur * 0.35 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }, { rotate: `${rot.value}deg` }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[style, {
      position: 'absolute', width: size, height: size,
      backgroundColor: color, borderRadius: isCircle ? size / 2 : 2, top: 0, left: 0,
    }]} />
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ResultScreen() {
  const router = useRouter();
  const { roomId, myUid } = useLocalSearchParams<{ roomId: string; myUid: string }>();
  const { t } = useLanguage();
  const [room, setRoom] = useState<Room | null>(null);
  const [myTrophies, setMyTrophies] = useState(0);
  const [trophyChange, setTrophyChange] = useState(0);
  const [savedTrophies, setSavedTrophies] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);

  const uid = myUid ?? auth.currentUser?.uid ?? '';

  useEffect(() => {
    const unsub = subscribeToRoom(roomId, setRoom);
    AsyncStorage.getItem(TROPHIES_KEY).then((t) => setMyTrophies(parseInt(t || '0', 10)));
    return unsub;
  }, [roomId]);

  const { myPlayer, opponent, winnerId, iWon, isDraw } = useMemo(() => {
    if (!room) return { myPlayer: null, opponent: null, winnerId: null, iWon: false, isDraw: false };
    const me = room.players[uid];
    const opp = Object.entries(room.players).find(([id]) => id !== uid)?.[1] ?? null;
    let winner: string | null = null;
    if (me && opp) {
      if (me.score > opp.score) winner = uid;
      else if (opp.score > me.score) winner = opp.uid;
    }
    return { myPlayer: me, opponent: opp, winnerId: winner, iWon: winner === uid, isDraw: winner === null };
  }, [room, uid]);

  // Salva i trofei aggiornati (solo per partite ranked)
  useEffect(() => {
    if (!myPlayer || !opponent || savedTrophies || room?.mode !== 'ranked') return;
    setSavedTrophies(true);

    const change = calculateTrophyChange(iWon, myTrophies, opponent.trophies);
    const newTrophies = Math.max(0, myTrophies + change);
    setTrophyChange(change);

    const reward = iWon ? COIN_REWARDS.win : isDraw ? COIN_REWARDS.draw : COIN_REWARDS.loss;
    setCoinsEarned(reward);

    AsyncStorage.multiGet([STORAGE_KEYS.COINS, STORAGE_KEYS.STREAK, STORAGE_KEYS.LAST_PLAY_DATE]).then(
      ([[, c], [, streakStr], [, lastDate]]) => {
        const newCoins = (parseInt(c ?? '0', 10) + reward).toString();
        const today = new Date().toISOString().slice(0, 10);
        const currentStreak = parseInt(streakStr ?? '0', 10);
        let newStreak = currentStreak;
        if (lastDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().slice(0, 10);
          newStreak = (lastDate === yesterdayStr || currentStreak === 0) ? currentStreak + 1 : 1;
        }
        AsyncStorage.multiSet([
          [TROPHIES_KEY, newTrophies.toString()],
          [STORAGE_KEYS.COINS, newCoins],
          [STORAGE_KEYS.STREAK, newStreak.toString()],
          [STORAGE_KEYS.LAST_PLAY_DATE, today],
        ]);
      },
    );

    if (iWon) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else if (!isDraw) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, [myPlayer, opponent]);

  const heroScale = useSharedValue(0.5);
  const heroOpacity = useSharedValue(0);
  useEffect(() => {
    heroScale.value = withSpring(1, { damping: 8 });
    heroOpacity.value = withTiming(1, { duration: 400 });
  }, []);
  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heroScale.value }],
    opacity: heroOpacity.value,
  }));

  const myRank = getRankForTrophies(myTrophies);

  if (!room || !myPlayer) {
    return (
      <SafeAreaView style={styles.safe}>
        <LinearGradient colors={['#1244c8', '#1040b8']} style={StyleSheet.absoluteFillObject} />
        <View style={styles.loading}><Text style={styles.loadingText}>{t('loadingResults')}</Text></View>
      </SafeAreaView>
    );
  }

  const handleRematch = () => {
    router.replace({
      pathname: '/matchmaking',
      params: { username: myPlayer.username, trophies: Math.max(0, myTrophies + trophyChange).toString(), mode: 'ranked' },
    });
  };

  const handleHome = () => router.replace('/(tabs)' as any);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#1244c8', myRank.colorDark, '#1244c8']} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFillObject} />

      {iWon && (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          {Array.from({ length: 36 }).map((_, i) => <ConfettiParticle key={i} delay={i * 55} />)}
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero risultato */}
        <Animated.View style={[styles.hero, heroStyle]}>
          <Ionicons
            name={iWon ? 'trophy' : isDraw ? 'people' : 'skull'}
            size={80}
            color={iWon ? '#c9a84c' : isDraw ? '#9ab8ff' : '#dc2626'}
          />
          <Text style={[styles.resultLabel, iWon ? styles.win : isDraw ? styles.draw : styles.lose]}>
            {iWon ? t('victory') : isDraw ? t('drawResult') : t('defeat')}
          </Text>
          <Text style={styles.resultSub}>
            {isDraw
              ? "Siete a pari merito — quasi quasi un'amicizia."
              : iWon
              ? `${opponent?.username ?? 'Il tuo avversario'} non sapeva con chi si stava mettendo 😤`
              : `${opponent?.username ?? 'Il tuo avversario'} ti ha asfaltato. Rivincita?`}
          </Text>
        </Animated.View>

        {/* Monete guadagnate */}
        {savedTrophies && coinsEarned > 0 && (
          <Animated.View entering={FadeIn.delay(400)} style={[styles.trophyChange, { borderColor: '#f59e0b44' }]}>
            <Ionicons name="wallet" size={22} color="#f59e0b" />
            <Text style={[styles.trophyChangeValue, { color: '#f59e0b' }]}>+{coinsEarned}</Text>
            <Text style={styles.trophyChangeLabel}>{t('coinsLabel')}</Text>
          </Animated.View>
        )}

        {/* Variazione trofei (solo ranked) */}
        {room.mode === 'ranked' && savedTrophies && trophyChange !== 0 && (
          <Animated.View entering={FadeIn.delay(500)} style={styles.trophyChange}>
            <Ionicons name="trophy" size={22} color="#c9a84c" />
            <Text style={[styles.trophyChangeValue, trophyChange > 0 ? styles.trophyWin : styles.trophyLose]}>
              {trophyChange > 0 ? `+${trophyChange}` : trophyChange}
            </Text>
            <Text style={styles.trophyChangeLabel}>{t('trophiesLabel')}</Text>
          </Animated.View>
        )}

        {/* Punteggi */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.scoresCard}>
          <Text style={styles.scoresTitle}>{t('finalScores')}</Text>
          {[
            { p: myPlayer, isMe: true },
            ...(opponent ? [{ p: opponent, isMe: false }] : []),
          ].map(({ p, isMe }) => (
            <View key={p.uid} style={[styles.scoreRow, winnerId === p.uid && styles.scoreRowWinner]}>
              <PlayerAvatar username={p.username} size={42} isMe={isMe} />
              <View style={styles.scoreInfo}>
                <Text style={styles.scoreName}>{p.username} {isMe ? t('youLabel') : ''}</Text>
                {winnerId === p.uid && <Text style={styles.winnerLabel}>{t('winner')}</Text>}
              </View>
              <Text style={styles.scoreValue}>{p.score}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(450)} style={styles.statsRow}>
          {[
            { label: t('correct'),   value: Object.values(myPlayer.answers).filter((a) => a.correct).length },
            { label: t('bestCombo'), value: myPlayer.combo },
            { label: t('ptsPerQ'),   value: Object.keys(myPlayer.answers).length > 0 ? Math.round(myPlayer.score / Object.keys(myPlayer.answers).length) : 0 },
          ].map(({ label, value }) => (
            <View key={label} style={styles.stat}>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Bottoni */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.actions}>
          <TouchableOpacity onPress={handleRematch} activeOpacity={0.85}>
            <LinearGradient
              colors={[myRank.color, myRank.colorDark]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.rematchBtn}
            >
              <Text style={styles.rematchText}>{t('rematch')}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeBtn} onPress={handleHome}>
            <Text style={styles.homeText}>{t('backHome')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1244c8' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#9ab8ff', fontSize: 16 },
  scroll: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 40, gap: 24 },
  hero: { alignItems: 'center', gap: 10, paddingVertical: 16 },
  resultEmoji: { fontSize: 80 },
  resultLabel: { fontSize: 40, fontWeight: '900', letterSpacing: 2 },
  win: { color: '#c9a84c' },
  draw: { color: '#9ab8ff' },
  lose: { color: '#dc2626' },
  resultSub: { color: '#9ab8ff', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  trophyChange: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#0e38a8',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3068e8',
  },
  trophyChangeIcon: { fontSize: 22 },
  trophyChangeValue: { fontSize: 28, fontWeight: '900' },
  trophyWin: { color: '#c9a84c' },
  trophyLose: { color: '#dc2626' },
  trophyChangeLabel: { color: '#9ab8ff', fontSize: 14, fontWeight: '600' },
  scoresCard: {
    backgroundColor: '#0e38a8',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#3068e8',
    padding: 18,
    gap: 10,
  },
  scoresTitle: { color: '#9ab8ff', fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 4 },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#1040b8',
  },
  scoreRowWinner: { borderWidth: 1, borderColor: '#c9a84c44', backgroundColor: '#c9a84c0a' },
  scoreInfo: { flex: 1 },
  scoreName: { color: '#f4f4f8', fontSize: 15, fontWeight: '700' },
  winnerLabel: { color: '#c9a84c', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginTop: 2 },
  scoreValue: { color: '#f4f4f8', fontSize: 26, fontWeight: '900' },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#0e38a8',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#3068e8',
    overflow: 'hidden',
  },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 16, gap: 4 },
  statValue: { color: '#f4f4f8', fontSize: 24, fontWeight: '900' },
  statLabel: { color: '#9ab8ff', fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  actions: { gap: 12 },
  rematchBtn: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  rematchText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  homeBtn: { alignItems: 'center', paddingVertical: 14 },
  homeText: { color: '#9ab8ff', fontSize: 15, fontWeight: '600' },
});
