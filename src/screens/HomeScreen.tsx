import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Dimensions, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, withSequence, Easing,
  FadeIn, FadeInDown,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ensureAuth } from '../services/matchmaking';
import { getRankForTrophies, getNextRank, getProgressToNext } from '../data/ranks';
import { STORAGE_KEYS } from '../data/storage';
import { useLanguage, LANGUAGES } from '../i18n';
import { Ionicons } from '@expo/vector-icons';

export const USERNAME_KEY = '@quizduel_username';
export const TROPHIES_KEY = '@quizduel_trophies';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { t, lang, setLang } = useLanguage();
  const [username, setUsername] = useState('');
  const [trophies, setTrophies] = useState(0);
  const [coins, setCoins] = useState(0);
  const [gems, setGems] = useState(0);
  const [streak, setStreak] = useState(0);
  const [inputName, setInputName] = useState('');
  const [error, setError] = useState('');
  const [isSetup, setIsSetup] = useState(false);

  const glowScale = useSharedValue(1);

  useEffect(() => {
    ensureAuth();
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1,    { duration: 2200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
  }, []);

  useEffect(() => {
    const DEV_SEED_KEY = '@quizduel_dev_seeded_v2';
    AsyncStorage.getItem(DEV_SEED_KEY).then(async (seeded) => {
      if (!seeded) {
        await AsyncStorage.multiSet([
          [STORAGE_KEYS.COINS, '9999'],
          [STORAGE_KEYS.GEMS, '999'],
          [STORAGE_KEYS.STREAK, '3'],
          [DEV_SEED_KEY, '1'],
        ]);
      }
      const [[, name], [, t], [, c], [, g], [, s]] = await AsyncStorage.multiGet([
        USERNAME_KEY, TROPHIES_KEY,
        STORAGE_KEYS.COINS, STORAGE_KEYS.GEMS,
        STORAGE_KEYS.STREAK,
      ]);
      if (name) { setUsername(name); setIsSetup(true); }
      if (t) setTrophies(parseInt(t, 10) || 0);
      if (c) setCoins(parseInt(c, 10) || 0);
      if (g) setGems(parseInt(g, 10) || 0);
      if (s) setStreak(parseInt(s, 10) || 0);
    });
  }, []);

  const glowStyle = useAnimatedStyle(() => ({ transform: [{ scale: glowScale.value }] }));

  const rank = getRankForTrophies(trophies);
  const nextRank = getNextRank(trophies);
  const { progressPct, trophiesNeeded } = getProgressToNext(trophies);

  const handleSaveName = async () => {
    const name = inputName.trim();
    if (!name || name.length < 2) { setError(t('minChars')); return; }
    if (name.length > 16) { setError(t('maxChars')); return; }
    await AsyncStorage.multiSet([
      [USERNAME_KEY, name],
      [TROPHIES_KEY, '0'],
      [STORAGE_KEYS.COINS, '0'],
      [STORAGE_KEYS.GEMS, '0'],
    ]);
    setUsername(name);
    setTrophies(0);
    setIsSetup(true);
  };

  const handlePlay = () => {
    router.push({ pathname: '/matchmaking', params: { username, trophies: trophies.toString(), mode: 'ranked' } });
  };

  const handleFriend = () => {
    router.push({ pathname: '/friend', params: { username, trophies: trophies.toString() } });
  };

  const handleTraining = () => {
    router.push({ pathname: '/difficulty' as any, params: { username } });
  };

  // ── Setup screen ──────────────────────────────────────────────────────────────
  if (!isSetup) {
    return (
      <SafeAreaView style={styles.safe}>
        <LinearGradient colors={['#1244c8', '#1040b8']} style={StyleSheet.absoluteFillObject} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.setupContainer}>
          <Animated.View entering={FadeIn.duration(600)} style={styles.setupHero}>
            <Ionicons name="flash" size={64} color="#f4f4f8" />
            <Text style={styles.setupTitle}>QuizDuel</Text>
            <Text style={styles.setupSub}>{t('howAreYouCalled')}</Text>
            {/* Language selector */}
            <View style={styles.langRow}>
              {LANGUAGES.map((l) => (
                <TouchableOpacity
                  key={l.code}
                  onPress={() => setLang(l.code)}
                  style={[styles.langBtn, lang === l.code && styles.langBtnActive]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.langFlag}>{l.flag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)} style={styles.setupForm}>
            <TextInput
              style={styles.input}
              value={inputName}
              onChangeText={(v) => { setInputName(v); setError(''); }}
              placeholder={t('yourName')}
              placeholderTextColor="#3a60d8"
              maxLength={16}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
              onSubmitEditing={handleSaveName}
              autoFocus
            />
            {!!error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity onPress={handleSaveName} activeOpacity={0.85} style={styles.startBtnWrapper}>
              <LinearGradient
                colors={['#4a1d96', '#1d4ed8']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.startBtn}
              >
                <Text style={styles.startBtnText}>{t('enterArena')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ── Main screen ───────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#0e38b8', '#1244c8', '#0e38b8']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.wordmark}>QUIZDUEL</Text>
        <View style={styles.currencyGroup}>
          <View style={styles.currencyPill}>
            <Ionicons name="wallet" size={12} color="#f59e0b" />
            <Text style={styles.currencyCount}>{coins}</Text>
          </View>
          <View style={styles.currencyPill}>
            <Ionicons name="diamond" size={12} color="#06b6d4" />
            <Text style={styles.currencyCount}>{gems}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile')} style={styles.profileBtn} activeOpacity={0.8}>
          <View style={[styles.profileCircle, { borderColor: rank.color + '88' }]}>
            <Text style={[styles.profileInitial, { color: rank.color }]}>
              {username.charAt(0).toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Rank hero */}
      <View style={styles.heroSection}>
        <Animated.View style={[styles.rankGlow, { backgroundColor: rank.color + '20' }, glowStyle]} />

        {/* Streak */}
        {streak > 0 && (
          <Animated.View entering={FadeIn.delay(200)} style={styles.streakBadge}>
            <Ionicons name="flame" size={16} color="#ff8c00" />
            <Text style={styles.streakCount}>{streak}</Text>
            <Text style={styles.streakLabel}>{streak === 1 ? t('day') : t('days')}</Text>
          </Animated.View>
        )}

        <View style={[styles.rankRing, { borderColor: rank.color + '55' }]}>
          <View style={[styles.rankInner, { backgroundColor: rank.color + '18' }]}>
            <Text style={styles.rankEmoji}>{rank.icon}</Text>
          </View>
        </View>

        <Text style={[styles.rankTier, { color: rank.color }]}>{rank.tier}</Text>
        <Text style={styles.usernameLabel}>{username}</Text>
      </View>

      {/* Trophies progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="trophy" size={14} color="#f4f4f8" />
            <Text style={styles.progressTrophies}>{trophies}</Text>
          </View>
          {nextRank && (
            <Text style={styles.progressNext}>{nextRank.icon} {nextRank.minTrophies}</Text>
          )}
        </View>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: `${progressPct * 100}%` as any, backgroundColor: rank.color }]} />
        </View>
        {nextRank && trophiesNeeded > 0 ? (
          <Text style={styles.progressHint}>
            {trophiesNeeded} {t('trophiesTo')} {nextRank.icon} {nextRank.tier}
          </Text>
        ) : !nextRank ? (
          <Text style={[styles.progressHint, { color: '#fbbf24' }]}>{t('youAreMax')}</Text>
        ) : null}
      </View>

      {/* Buttons */}
      <View style={styles.buttonsSection}>
        <TouchableOpacity onPress={handlePlay} activeOpacity={0.85}>
          <LinearGradient
            colors={[rank.color, rank.colorDark]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.playBtn}
          >
            <Ionicons name="game-controller" size={32} color="#fff" />
            <View style={styles.playBtnTextGroup}>
              <Text style={styles.playBtnLabel}>{t('play')}</Text>
              <Text style={styles.playBtnSub}>{t('rankedMode')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={28} color="#ffffff66" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleFriend} activeOpacity={0.8} style={styles.friendBtn}>
          <Ionicons name="people" size={20} color="#f4f4f8" />
          <Text style={styles.friendBtnText}>{t('challengeFriend')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleTraining} activeOpacity={0.8} style={styles.trainingBtn}>
          <Ionicons name="barbell-outline" size={20} color="#f4f4f8" />
          <View style={styles.trainingBtnTextGroup}>
            <Text style={styles.friendBtnText}>{t('training')}</Text>
            <Text style={styles.trainingBtnSub}>{t('trainingVsCpu')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1244c8' },

  // Setup
  setupContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 40 },
  setupHero: { alignItems: 'center', gap: 8 },
  setupEmoji: { fontSize: 64 },
  setupTitle: { fontSize: 52, fontWeight: '900', color: '#f4f4f8', letterSpacing: -2 },
  setupSub: { fontSize: 16, color: '#9ab8ff', fontWeight: '500' },
  langRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  langBtn: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)',
  },
  langBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderColor: 'rgba(255,255,255,0.6)',
  },
  langFlag: { fontSize: 22 },
  setupForm: { width: '100%', gap: 12 },
  input: {
    backgroundColor: '#0e38a8', borderWidth: 1, borderColor: '#3068e8', borderRadius: 14,
    paddingHorizontal: 18, paddingVertical: 16,
    color: '#f4f4f8', fontSize: 17, fontWeight: '600',
  },
  errorText: { color: '#dc2626', fontSize: 13 },
  startBtnWrapper: { marginTop: 8 },
  startBtn: {
    paddingVertical: 18, borderRadius: 14, alignItems: 'center',
    shadowColor: '#4a1d96', shadowOpacity: 0.5, shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 }, elevation: 10,
  },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 2 },

  // Top bar
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4, gap: 8,
  },
  wordmark: { color: '#f4f4f8', fontSize: 13, fontWeight: '900', letterSpacing: 3, opacity: 0.6, flex: 1 },
  currencyGroup: { flexDirection: 'row', gap: 6 },
  currencyPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  currencyEmoji: { fontSize: 12 },
  currencyCount: { color: '#f4f4f8', fontSize: 12, fontWeight: '800' },
  profileBtn: { marginLeft: 4 },
  profileCircle: {
    width: 36, height: 36, borderRadius: 18, borderWidth: 2,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
    borderColor: 'rgba(255,255,255,0.35)',
  },
  profileInitial: { fontSize: 16, fontWeight: '900' },

  // Hero
  heroSection: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  rankGlow: { position: 'absolute', width: 280, height: 280, borderRadius: 140 },
  streakBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#ff6b0015', borderWidth: 1, borderColor: '#ff6b0040',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999,
  },
  streakFire: { fontSize: 16 },
  streakCount: { color: '#ff8c00', fontSize: 18, fontWeight: '900' },
  streakLabel: { color: '#ff8c0099', fontSize: 12, fontWeight: '700' },
  rankRing: {
    width: 160, height: 160, borderRadius: 80,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
  },
  rankInner: {
    width: 130, height: 130, borderRadius: 65,
    alignItems: 'center', justifyContent: 'center',
  },
  rankEmoji: { fontSize: 72 },
  rankTier: { fontSize: 28, fontWeight: '900', letterSpacing: 1, marginTop: 4 },
  usernameLabel: { color: '#9ab8ff', fontSize: 14, fontWeight: '600' },

  // Progress
  progressSection: { paddingHorizontal: 24, gap: 8, marginBottom: 16 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressTrophies: { color: '#f4f4f8', fontSize: 14, fontWeight: '700' },
  progressNext: { color: '#9ab8ff', fontSize: 14, fontWeight: '600' },
  progressTrack: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressHint: { color: '#9ab8ff', fontSize: 12, textAlign: 'center' },

  // Buttons
  buttonsSection: { paddingHorizontal: 20, paddingBottom: 16, gap: 12 },
  playBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    paddingVertical: 20, paddingHorizontal: 24, borderRadius: 18,
    shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 }, elevation: 10,
  },
  playBtnIcon: { fontSize: 32 },
  playBtnTextGroup: { flex: 1 },
  playBtnLabel: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  playBtnSub: { color: '#ffffff88', fontSize: 12, fontWeight: '500', marginTop: 2 },
  playBtnArrow: { color: '#ffffff66', fontSize: 28, fontWeight: '300' },
  friendBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 16, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  friendBtnIcon: { fontSize: 20 },
  friendBtnText: { color: '#f4f4f8', fontSize: 15, fontWeight: '700' },
  trainingBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 16, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  trainingBtnTextGroup: { alignItems: 'center', gap: 1 },
  trainingBtnSub: { color: '#ffffff66', fontSize: 11, fontWeight: '500' },
});
