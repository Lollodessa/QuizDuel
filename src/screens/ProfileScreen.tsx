import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat,
  withSequence, withTiming, Easing, FadeIn, FadeInDown,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getRankForTrophies, RANKS } from '../data/ranks';
import { STORAGE_KEYS } from '../data/storage';
import { USERNAME_KEY, TROPHIES_KEY } from './HomeScreen';
import { useLanguage, LANGUAGES } from '../i18n';

export default function ProfileScreen() {
  const router = useRouter();
  const { t, lang, setLang } = useLanguage();
  const [username, setUsername] = useState('');
  const [trophies, setTrophies] = useState(0);
  const [coins, setCoins] = useState(0);
  const [gems, setGems] = useState(0);
  const [streak, setStreak] = useState(0);
  const [streakShield, setStreakShield] = useState(false);

  const glowAnim = useSharedValue(0.7);

  useEffect(() => {
    AsyncStorage.multiGet([
      USERNAME_KEY, TROPHIES_KEY,
      STORAGE_KEYS.COINS, STORAGE_KEYS.GEMS,
      STORAGE_KEYS.STREAK, STORAGE_KEYS.STREAK_SHIELD,
    ]).then(([[, name], [, t], [, c], [, g], [, s], [, shield]]) => {
      setUsername(name ?? '');
      setTrophies(parseInt(t ?? '0', 10));
      setCoins(parseInt(c ?? '0', 10));
      setGems(parseInt(g ?? '0', 10));
      setStreak(parseInt(s ?? '0', 10));
      setStreakShield(shield === '1');
    });

    glowAnim.value = withRepeat(
      withSequence(
        withTiming(1,   { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
  }, []);

  const rank = getRankForTrophies(trophies);
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowAnim.value }));

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#1244c8', rank.colorDark, '#1244c8']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile')}</Text>
        <View style={styles.headerSpacer} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Rank hero */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.heroSection}>
          <View style={[styles.avatarOuter, { borderColor: rank.color + '44' }]}>
            <Animated.View style={[styles.avatarGlow, { backgroundColor: rank.color + '20' }, glowStyle]} />
            <View style={[styles.avatarInner, { backgroundColor: rank.color + '18' }]}>
              <Text style={styles.rankEmoji}>{rank.icon}</Text>
            </View>
          </View>
          <Text style={styles.heroName}>{username}</Text>
          <View style={[styles.rankBadge, { borderColor: rank.color + '55', backgroundColor: rank.color + '12' }]}>
            <Text style={[styles.rankBadgeText, { color: rank.color }]}>{rank.tier}</Text>
          </View>
          {streak > 0 && (
            <View style={styles.streakRow}>
              <Ionicons name="flame" size={18} color="#ff8c00" />
              <Text style={styles.streakText}>{streak} {streak === 1 ? t('day') : t('days')} {t('inARow')}</Text>
              {streakShield && <Ionicons name="shield" size={16} color="#f4f4f8" />}
            </View>
          )}
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.statsCard}>
          {[
            { label: t('trophies'), iconName: 'trophy',  count: trophies, color: '#c9a84c' },
            { label: t('coins'),    iconName: 'wallet',  count: coins,    color: '#f59e0b' },
            { label: t('gems'),     iconName: 'diamond', count: gems,     color: '#06b6d4' },
          ].map(({ label, iconName, count, color }) => (
            <View key={label} style={styles.statItem}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name={iconName as any} size={14} color={color} />
                <Text style={[styles.statValue, { color }]}>{count}</Text>
              </View>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Language selector */}
        <Animated.View entering={FadeInDown.delay(260)} style={styles.section}>
          <Text style={styles.sectionTitle}>{t('chooseLanguage')}</Text>
          <View style={styles.langRow}>
            {LANGUAGES.map((l) => (
              <TouchableOpacity
                key={l.code}
                onPress={() => setLang(l.code)}
                style={[styles.langBtn, lang === l.code && styles.langBtnActive]}
                activeOpacity={0.8}
              >
                <Text style={styles.langFlag}>{l.flag}</Text>
                <Text style={[styles.langName, lang === l.code && styles.langNameActive]}>{l.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Rank progression */}
        <Animated.View entering={FadeInDown.delay(280)} style={styles.section}>
          <Text style={styles.sectionTitle}>{t('rankPath')}</Text>
          <View style={styles.rankList}>
            {[...RANKS].reverse().map((r) => {
              const isCurrentRank = r.tier === rank.tier;
              const unlocked = trophies >= r.minTrophies;
              return (
                <View key={r.tier} style={[styles.rankRow, isCurrentRank && { backgroundColor: r.color + '12', borderColor: r.color + '44' }]}>
                  <Text style={[styles.rankRowIcon, !unlocked && styles.locked]}>{r.icon}</Text>
                  <View style={styles.rankRowInfo}>
                    <Text style={[styles.rankRowTier, { color: unlocked ? r.color : '#3a60d8' }]}>{r.tier}</Text>
                    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 3 }, !unlocked && styles.locked]}>
                      <Ionicons name="trophy" size={11} color={unlocked ? r.color : '#3a60d8'} />
                      <Text style={[styles.rankRowRange, !unlocked && styles.locked]}>
                        {r.minTrophies}{r.maxTrophies !== Infinity ? ` – ${r.maxTrophies}` : '+'}
                      </Text>
                    </View>
                  </View>
                  {isCurrentRank && (
                    <View style={[styles.currentBadge, { backgroundColor: r.color + '22', borderColor: r.color + '55' }]}>
                      <Text style={[styles.currentBadgeText, { color: r.color }]}>{t('here')}</Text>
                    </View>
                  )}
                  {!unlocked && <Ionicons name="lock-closed" size={14} color="#f4f4f8" />}
                </View>
              );
            })}
          </View>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1244c8' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, gap: 20 },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  backBtn: { padding: 8 },
  backIcon: { color: '#f4f4f8', fontSize: 28, fontWeight: '300', lineHeight: 28 },
  headerTitle: { flex: 1, color: '#f4f4f8', fontSize: 18, fontWeight: '800', textAlign: 'center' },
  headerSpacer: { width: 44 },

  heroSection: { alignItems: 'center', gap: 12, paddingVertical: 12 },
  avatarOuter: {
    width: 140, height: 140, borderRadius: 70,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
  },
  avatarGlow: { position: 'absolute', width: 160, height: 160, borderRadius: 80 },
  avatarInner: {
    width: 110, height: 110, borderRadius: 55,
    alignItems: 'center', justifyContent: 'center',
  },
  rankEmoji: { fontSize: 58 },
  heroName: { color: '#f4f4f8', fontSize: 26, fontWeight: '900' },
  rankBadge: {
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999, borderWidth: 1,
  },
  rankBadgeText: { fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  streakFire: { fontSize: 18 },
  streakText: { color: '#ff8c00', fontSize: 14, fontWeight: '800' },
  shieldIcon: { fontSize: 16 },

  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 18,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', overflow: 'hidden',
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 18, gap: 4 },
  statValue: { fontSize: 16, fontWeight: '900' },
  statLabel: { color: '#9ab8ff', fontSize: 11, fontWeight: '600' },

  section: {
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 18,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', padding: 16, gap: 10,
  },
  sectionTitle: { color: '#f4f4f8', fontSize: 15, fontWeight: '800', marginBottom: 4 },
  langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  langBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)',
  },
  langBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.5)',
  },
  langFlag: { fontSize: 18 },
  langName: { color: '#9ab8ff', fontSize: 13, fontWeight: '700' },
  langNameActive: { color: '#f4f4f8' },

  rankList: { gap: 6 },
  rankRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 12, borderRadius: 12,
    borderWidth: 1, borderColor: 'transparent',
  },
  rankRowIcon: { fontSize: 24 },
  rankRowInfo: { flex: 1, gap: 2 },
  rankRowTier: { fontSize: 14, fontWeight: '800' },
  rankRowRange: { color: '#9ab8ff', fontSize: 11, fontWeight: '600' },
  locked: { opacity: 0.35 },
  currentBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1,
  },
  currentBadgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  lockIcon: { fontSize: 14 },
});
