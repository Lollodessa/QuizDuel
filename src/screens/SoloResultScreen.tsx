import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useLanguage } from '../i18n';

export default function SoloResultScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const params = useLocalSearchParams<{
    myScore: string; botScore: string; username: string; difficulty: string;
  }>();

  const myScore  = parseInt(params.myScore ?? '0', 10);
  const botScore = parseInt(params.botScore ?? '0', 10);
  const username = params.username ?? 'Tu';
  const difficulty = params.difficulty ?? 'medium';

  const iWon  = myScore > botScore;
  const isDraw = myScore === botScore;

  const resultIcon  = iWon ? 'trophy'  : isDraw ? 'people' : 'skull';
  const resultColor = iWon ? '#c9a84c' : isDraw ? '#9ab8ff' : '#dc2626';
  const resultText  = iWon ? t('victory') : isDraw ? t('drawResult') : t('defeat');

  const diffLabel = difficulty === 'easy' ? t('easy') : difficulty === 'hard' ? t('hard') : t('medium');

  const handlePlayAgain = () => {
    router.replace({ pathname: '/difficulty', params: { username } } as any);
  };
  const handleHome = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#0c0c0e', '#0d1a2e', '#0c0c0e']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Hero */}
      <Animated.View entering={FadeIn.duration(500)} style={styles.hero}>
        <Ionicons name={resultIcon as any} size={80} color={resultColor} />
        <Text style={[styles.resultText, { color: resultColor }]}>{resultText}</Text>
        <View style={[styles.diffBadge, { borderColor: resultColor + '44' }]}>
          <Text style={[styles.diffLabel, { color: resultColor }]}>{diffLabel}</Text>
        </View>
      </Animated.View>

      {/* Score comparison */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.scoreCard}>
        <LinearGradient
          colors={['#16161a', '#1e1e2a']}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.scoreBorder, { borderColor: 'rgba(255,255,255,0.08)' }]}>
          <View style={styles.scoreRow}>
            {/* Me */}
            <View style={styles.scoreBlock}>
              <Text style={styles.scoreName}>{username}</Text>
              <Text style={[styles.scoreValue, iWon && { color: '#c9a84c' }]}>{myScore}</Text>
              <Text style={styles.scoreSub}>{t('youLabel')}</Text>
            </View>

            {/* VS */}
            <Text style={styles.vs}>VS</Text>

            {/* CPU */}
            <View style={[styles.scoreBlock, styles.scoreBlockRight]}>
              <Text style={styles.scoreName}>CPU</Text>
              <Text style={[styles.scoreValue, !iWon && !isDraw && { color: '#c9a84c' }]}>{botScore}</Text>
              <Text style={styles.scoreSub}>{t('cpuName')}</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* No trophies notice */}
      <Animated.View entering={FadeInDown.delay(320)} style={styles.noticeRow}>
        <Ionicons name="barbell-outline" size={13} color="#3a3a4a" />
        <Text style={styles.noticeText}>{t('noTrophies')}</Text>
      </Animated.View>

      {/* Buttons */}
      <Animated.View entering={FadeInDown.delay(420)} style={styles.buttons}>
        <TouchableOpacity onPress={handlePlayAgain} activeOpacity={0.85}>
          <LinearGradient
            colors={['#4a1d96', '#1d4ed8']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.primaryBtn}
          >
            <Ionicons name="barbell-outline" size={20} color="#fff" />
            <Text style={styles.primaryBtnText}>{t('playAgain')}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleHome} activeOpacity={0.7} style={styles.secondaryBtn}>
          <Text style={styles.secondaryBtnText}>{t('backHome')}</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0c0c0e' },
  hero: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16,
  },
  resultText: { fontSize: 38, fontWeight: '900', letterSpacing: -0.5 },
  diffBadge: {
    borderWidth: 1, borderRadius: 999,
    paddingHorizontal: 16, paddingVertical: 6,
  },
  diffLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 2 },

  scoreCard: {
    marginHorizontal: 20, borderRadius: 20, overflow: 'hidden',
    marginBottom: 20,
  },
  scoreBorder: {
    borderWidth: 1, borderRadius: 20, padding: 24,
  },
  scoreRow: {
    flexDirection: 'row', alignItems: 'center',
  },
  scoreBlock: { flex: 1, alignItems: 'flex-start', gap: 4 },
  scoreBlockRight: { alignItems: 'flex-end' },
  scoreName: { color: '#6b6b80', fontSize: 12, fontWeight: '700' },
  scoreValue: { color: '#f4f4f8', fontSize: 40, fontWeight: '900' },
  scoreSub: { color: '#3a3a4a', fontSize: 11, fontWeight: '600' },
  vs: { color: '#2a2a35', fontSize: 18, fontWeight: '900', paddingHorizontal: 12 },

  noticeRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginBottom: 28,
  },
  noticeText: { color: '#3a3a4a', fontSize: 11, fontWeight: '500' },

  buttons: { paddingHorizontal: 20, paddingBottom: 16, gap: 12 },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 18, borderRadius: 16,
    shadowColor: '#4a1d96', shadowOpacity: 0.5, shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 }, elevation: 10,
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  secondaryBtn: {
    alignItems: 'center', paddingVertical: 14,
  },
  secondaryBtnText: { color: '#6b6b80', fontSize: 14, fontWeight: '600' },
});