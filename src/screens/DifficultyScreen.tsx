import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useLanguage } from '../i18n';

type Difficulty = 'easy' | 'medium' | 'hard';

const LEVELS: {
  key: Difficulty;
  icon: string;
  color: string;
  colorDark: string;
  labelKey: 'easy' | 'medium' | 'hard';
  descKey: 'easyDesc' | 'mediumDesc' | 'hardDesc';
}[] = [
  { key: 'easy',   icon: 'leaf-outline',      color: '#22c55e', colorDark: '#052e16', labelKey: 'easy',   descKey: 'easyDesc'   },
  { key: 'medium', icon: 'flash-outline',      color: '#f59e0b', colorDark: '#2d1a00', labelKey: 'medium', descKey: 'mediumDesc' },
  { key: 'hard',   icon: 'skull-outline',      color: '#ef4444', colorDark: '#450a0a', labelKey: 'hard',   descKey: 'hardDesc'   },
];

export default function DifficultyScreen() {
  const router = useRouter();
  const { username } = useLocalSearchParams<{ username: string }>();
  const { t } = useLanguage();

  const handleSelect = (diff: Difficulty) => {
    router.push({ pathname: '/solo', params: { difficulty: diff, username } } as any);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#0c0c0e', '#0d1a2e', '#0c0c0e']} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />

      {/* Back */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
        <Ionicons name="chevron-back" size={22} color="#9ab8ff" />
        <Text style={styles.backText}>Home</Text>
      </TouchableOpacity>

      {/* Header */}
      <Animated.View entering={FadeInDown.delay(0)} style={styles.header}>
        <Ionicons name="barbell-outline" size={44} color="#f4f4f8" />
        <Text style={styles.title}>{t('training')}</Text>
        <Text style={styles.subtitle}>{t('chooseDifficulty')}</Text>
      </Animated.View>

      {/* Cards */}
      <View style={styles.cards}>
        {LEVELS.map((lvl, i) => (
          <Animated.View key={lvl.key} entering={FadeInDown.delay(100 + i * 90)}>
            <TouchableOpacity onPress={() => handleSelect(lvl.key)} activeOpacity={0.82}>
              <View style={styles.card}>
                <LinearGradient
                  colors={[lvl.colorDark, '#0d1a2e']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                />
                <View style={[styles.cardBorder, { borderColor: lvl.color + '44' }]}>
                  <View style={[styles.iconCircle, { backgroundColor: lvl.color + '20', borderColor: lvl.color + '55' }]}>
                    <Ionicons name={lvl.icon as any} size={28} color={lvl.color} />
                  </View>
                  <View style={styles.cardText}>
                    <Text style={[styles.cardLabel, { color: lvl.color }]}>{t(lvl.labelKey)}</Text>
                    <Text style={styles.cardDesc}>{t(lvl.descKey)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={lvl.color + '88'} />
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <Animated.Text entering={FadeInDown.delay(400)} style={styles.notice}>
        {t('noTrophies')}
      </Animated.Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0c0c0e' },
  backBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4,
    alignSelf: 'flex-start',
  },
  backText: { color: '#9ab8ff', fontSize: 15, fontWeight: '600' },
  header: {
    alignItems: 'center', gap: 10,
    paddingTop: 32, paddingBottom: 40,
  },
  title: { color: '#f4f4f8', fontSize: 34, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: '#6b6b80', fontSize: 15, fontWeight: '500' },
  cards: { paddingHorizontal: 20, gap: 14 },
  card: { borderRadius: 18, overflow: 'hidden' },
  cardBorder: {
    borderWidth: 1, borderRadius: 18,
    flexDirection: 'row', alignItems: 'center', gap: 16,
    padding: 18,
  },
  iconCircle: {
    width: 52, height: 52, borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  cardText: { flex: 1, gap: 4 },
  cardLabel: { fontSize: 19, fontWeight: '900' },
  cardDesc: { color: '#6b6b80', fontSize: 12, fontWeight: '500' },
  notice: {
    color: '#3a3a4a', fontSize: 12, textAlign: 'center',
    paddingHorizontal: 32, marginTop: 32, fontWeight: '500',
  },
});