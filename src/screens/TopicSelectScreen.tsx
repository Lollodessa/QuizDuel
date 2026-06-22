import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Topic, MatchMode } from '../types';

const { width } = Dimensions.get('window');

const TOPICS: { topic: Topic; icon: string; gradient: [string, string]; description: string }[] = [
  { topic: 'Cinema',    icon: '🎬', gradient: ['#7c3aed', '#2563eb'], description: 'Films, directors & icons' },
  { topic: 'Sport',     icon: '⚡', gradient: ['#059669', '#0284c7'], description: 'Records, teams & legends' },
  { topic: 'Geography', icon: '🌍', gradient: ['#0891b2', '#7c3aed'], description: 'Countries, capitals & wonders' },
  { topic: 'Music',     icon: '🎵', gradient: ['#db2777', '#7c3aed'], description: 'Artists, albums & history' },
  { topic: 'Science',   icon: '🔬', gradient: ['#0891b2', '#059669'], description: 'Physics, biology & cosmos' },
];

export default function TopicSelectScreen() {
  const router = useRouter();
  const { username } = useLocalSearchParams<{ username: string }>();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [mode, setMode] = useState<MatchMode>('random');

  const handleSelectTopic = (topic: Topic) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTopic(topic);
  };

  const handleGo = () => {
    if (!selectedTopic) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/matchmaking',
      params: { username, topic: selectedTopic, mode },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#0a0a1a', '#0d0d2b']} style={StyleSheet.absoluteFillObject} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Text style={styles.heading}>What do you know?</Text>
          <Text style={styles.sub}>Both players get the same questions — so no excuses 😤</Text>
        </Animated.View>

        {/* Topic grid */}
        <View style={styles.grid}>
          {TOPICS.map(({ topic, icon, gradient, description }, i) => {
            const isSelected = selectedTopic === topic;
            return (
              <Animated.View key={topic} entering={FadeInDown.delay(i * 80).springify()}>
                <TouchableOpacity
                  onPress={() => handleSelectTopic(topic)}
                  activeOpacity={0.8}
                  style={[styles.card, isSelected && styles.cardSelected]}
                >
                  <LinearGradient
                    colors={isSelected ? gradient : ['#12122a', '#12122a']}
                    style={styles.cardInner}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.cardIcon}>{icon}</Text>
                    <Text style={styles.cardTopic}>{topic}</Text>
                    <Text style={styles.cardDesc}>{description}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Mode picker */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.modePicker}>
          <Text style={styles.modeLabel}>MATCH MODE</Text>
          <View style={styles.modeRow}>
            {(['random', 'friend'] as MatchMode[]).map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
                onPress={() => { setMode(m); Haptics.selectionAsync(); }}
              >
                <Text style={[styles.modeBtnText, mode === m && styles.modeBtnTextActive]}>
                  {m === 'random' ? '🎲 Random' : '🔗 Friend'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {mode === 'friend' && (
            <Text style={styles.modeHint}>You'll get a code — send it to your friend and wait for them to join</Text>
          )}
        </Animated.View>

        {/* Go button */}
        <TouchableOpacity
          onPress={handleGo}
          disabled={!selectedTopic}
          activeOpacity={0.85}
          style={[styles.goBtn, !selectedTopic && styles.goBtnDisabled]}
        >
          <LinearGradient
            colors={selectedTopic ? ['#7c3aed', '#2563eb'] : ['#1e1e4a', '#1e1e4a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.goBtnGradient}
          >
            <Text style={styles.goBtnText}>
              {selectedTopic ? `FIND MATCH  →` : 'SELECT A TOPIC'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_WIDTH = (width - 48) / 2;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a1a' },
  scroll: { paddingHorizontal: 16, paddingBottom: 40, gap: 24 },
  header: { paddingTop: 12, gap: 4 },
  heading: { color: '#ffffff', fontSize: 28, fontWeight: '900' },
  sub: { color: '#4a4a7a', fontSize: 14 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#1e1e4a',
  },
  cardSelected: { borderColor: '#7c3aed' },
  cardInner: { padding: 20, gap: 6, minHeight: 130 },
  cardIcon: { fontSize: 32 },
  cardTopic: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  cardDesc: { color: '#94a3b8', fontSize: 12, lineHeight: 16 },
  modePicker: { gap: 10 },
  modeLabel: { color: '#6366f1', fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  modeRow: { flexDirection: 'row', gap: 12 },
  modeBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1e1e4a',
    backgroundColor: '#12122a',
    alignItems: 'center',
  },
  modeBtnActive: { borderColor: '#7c3aed', backgroundColor: '#7c3aed22' },
  modeBtnText: { color: '#4a4a7a', fontSize: 15, fontWeight: '700' },
  modeBtnTextActive: { color: '#a78bfa' },
  modeHint: { color: '#4a4a7a', fontSize: 12, textAlign: 'center' },
  goBtn: { marginTop: 8 },
  goBtnDisabled: { opacity: 0.5 },
  goBtnGradient: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  goBtnText: { color: '#ffffff', fontSize: 17, fontWeight: '900', letterSpacing: 2 },
});
