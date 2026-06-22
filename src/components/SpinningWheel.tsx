import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSequence, withSpring,
  runOnJS, Easing, FadeInUp,
} from 'react-native-reanimated';
import { Topic } from '../types';

const { width } = Dimensions.get('window');

const TOPIC_DATA: Record<Topic, { iconName: string; label: string; color: string; colorDark: string }> = {
  Cinema:    { iconName: 'film-outline',          label: 'Cinema',    color: '#ef4444', colorDark: '#3b0a0a' },
  Sport:     { iconName: 'football-outline',      label: 'Sport',     color: '#22c55e', colorDark: '#052e16' },
  Geography: { iconName: 'globe-outline',         label: 'Geografia', color: '#3b82f6', colorDark: '#1e3a5f' },
  Music:     { iconName: 'musical-notes-outline', label: 'Musica',    color: '#a855f7', colorDark: '#2e1065' },
  Science:   { iconName: 'flask-outline',         label: 'Scienza',   color: '#06b6d4', colorDark: '#083344' },
};

const ALL_TOPICS: Topic[] = ['Cinema', 'Sport', 'Geography', 'Music', 'Science'];

const ITEM_HEIGHT    = 76;
const VISIBLE_ITEMS  = 5;
const VISIBLE_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS; // 380
const PRE_PAD        = 2;
const POST_PAD       = 2;
const SPIN_CYCLES    = 5;

// translateY to center item at index i: centerOffset - i * ITEM_HEIGHT
const CENTER_OFFSET  = (VISIBLE_HEIGHT - ITEM_HEIGHT) / 2; // 152

interface Props {
  topic: Topic;
  onDone: () => void;
  /** Called the instant the reel animation stops (before INIZIA button appears).
   *  Use this to stop spin sound and play a "select" SFX. */
  onSettle?: () => void;
  /** When true: fills parent with opaque blue bg (solo mode).
   *  When false (default): dark overlay (multiplayer). */
  standalone?: boolean;
}

export default function SpinningWheel({ topic, onDone, onSettle, standalone = false }: Props) {
  const [settled, setSettled] = useState(false);

  const onDoneRef     = useRef(onDone);
  const onSettleRef   = useRef(onSettle);
  const standaloneRef = useRef(standalone);
  onDoneRef.current     = onDone;
  onSettleRef.current   = onSettle;
  standaloneRef.current = standalone;

  // ── Build reel (no empty slots ever) ────────────────────────────────────────
  const reel: Topic[] = [];
  // Pre-pad: last PRE_PAD items from the cycle before the main spin
  for (let i = 0; i < PRE_PAD; i++) {
    reel.push(ALL_TOPICS[(ALL_TOPICS.length - PRE_PAD + i) % ALL_TOPICS.length]);
  }
  // Main spin: SPIN_CYCLES full rotations
  for (let c = 0; c < SPIN_CYCLES; c++) reel.push(...ALL_TOPICS);
  // Target
  const targetIdx = reel.length; // 2 + 25 = 27
  reel.push(topic);
  // Post-pad: items that would follow topic in cycle
  const topicOffset = ALL_TOPICS.indexOf(topic);
  for (let i = 0; i < POST_PAD; i++) {
    reel.push(ALL_TOPICS[(topicOffset + 1 + i) % ALL_TOPICS.length]);
  }

  const finalTranslateY = CENTER_OFFSET - targetIdx * ITEM_HEIGHT;       // -1900
  const fastTranslateY  = CENTER_OFFSET - (targetIdx - 2) * ITEM_HEIGHT; // -1748

  // ── Animated values ─────────────────────────────────────────────────────────
  const translateY    = useSharedValue(CENTER_OFFSET);
  const frameOpacity  = useSharedValue(0.2);
  const frameScale    = useSharedValue(1);
  const revealOpacity = useSharedValue(0);
  const revealScale   = useSharedValue(0.85);

  const handleSettled = useCallback(() => {
    onSettleRef.current?.(); // stop spin + play select SFX
    setSettled(true);
    if (!standaloneRef.current) {
      setTimeout(() => onDoneRef.current(), 1800);
    }
  }, []);

  useEffect(() => {
    translateY.value = withSequence(
      withTiming(fastTranslateY, {
        duration: 2800,
        easing: Easing.out(Easing.quad),
      }),
      withTiming(finalTranslateY, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      }, (finished) => {
        if (!finished) return;
        // Frame glow pop
        frameOpacity.value = withTiming(1, { duration: 250 });
        frameScale.value   = withSequence(
          withSpring(1.05, { damping: 4, stiffness: 320 }),
          withSpring(1,    { damping: 8, stiffness: 220 }),
        );
        // Reveal badge
        revealOpacity.value = withTiming(1, { duration: 380 });
        revealScale.value   = withSpring(1, { damping: 8, stiffness: 180 });
        runOnJS(handleSettled)();
      }),
    );
  }, []);

  const reelStyle   = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
  const frameStyle  = useAnimatedStyle(() => ({
    opacity:   frameOpacity.value,
    transform: [{ scale: frameScale.value }],
  }));
  const revealStyle = useAnimatedStyle(() => ({
    opacity:   revealOpacity.value,
    transform: [{ scale: revealScale.value }],
  }));

  const info = TOPIC_DATA[topic];

  return (
    <View style={standalone ? styles.containerStandalone : styles.container}>
      <LinearGradient
        colors={standalone ? ['#0e38b8', '#1244c8'] : ['#0c0c0eee', '#0c0c0ef8']}
        style={StyleSheet.absoluteFill}
      />

      <Text style={styles.topLabel}>Tema della partita</Text>

      {/* ── Reel ── */}
      <View style={styles.reelOuter}>
        {/* Top & bottom fade masks */}
        <LinearGradient
          colors={standalone ? ['#0e38b8ff', '#0e38b800'] : ['#0c0c0eff', '#0c0c0e00']}
          style={[styles.fadeMask, styles.fadeTop]}
          pointerEvents="none"
        />
        <LinearGradient
          colors={standalone ? ['#1244c800', '#1244c8ff'] : ['#0c0c0e00', '#0c0c0eff']}
          style={[styles.fadeMask, styles.fadeBottom]}
          pointerEvents="none"
        />

        {/* Scrolling items */}
        <View style={styles.reelMask}>
          <Animated.View style={reelStyle}>
            {reel.map((t, i) => {
              const td       = TOPIC_DATA[t];
              const isCenter = i === targetIdx;
              return (
                <View key={i} style={styles.reelItem}>
                  <View style={[
                    styles.iconBubble,
                    { backgroundColor: td.color + '22', borderColor: td.color + '55' },
                    isCenter && { backgroundColor: td.color + '33', borderColor: td.color + 'aa' },
                  ]}>
                    <Ionicons
                      name={td.iconName as any}
                      size={22}
                      color={isCenter ? td.color : td.color + '99'}
                    />
                  </View>
                  <Text style={[
                    styles.reelLabel,
                    { color: isCenter ? '#f4f4f8' : '#6b6b90' },
                  ]}>
                    {td.label}
                  </Text>
                </View>
              );
            })}
          </Animated.View>
        </View>

        {/* Fixed selection frame — stays at center, animates on settle */}
        <Animated.View style={[styles.selectionFrameWrap, frameStyle]} pointerEvents="none">
          <View style={[styles.selectionFrame, { borderColor: info.color + '99' }]} />
        </Animated.View>
      </View>

      {/* ── Reveal badge ── */}
      <Animated.View style={[styles.reveal, revealStyle]}>
        <View style={[styles.revealBadge, {
          borderColor: info.color,
          backgroundColor: info.colorDark,
        }]}>
          <Ionicons name={info.iconName as any} size={30} color={info.color} />
          <View style={styles.revealText}>
            <Text style={styles.revealSub}>Sfida su</Text>
            <Text style={[styles.revealTopic, { color: info.color }]}>{info.label}</Text>
          </View>
        </View>
      </Animated.View>

      {/* ── INIZIA button — solo mode only, appears when settled ── */}
      {standalone && settled && (
        <Animated.View entering={FadeInUp.duration(300)} style={styles.startBtnWrap}>
          <TouchableOpacity onPress={onDone} activeOpacity={0.85} style={styles.startBtn}>
            <LinearGradient
              colors={['#4a1d96', '#1d4ed8']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.startBtnGrad}
            >
              <Text style={styles.startBtnText}>INIZIA</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    gap: 24,
  },
  containerStandalone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },

  topLabel: {
    color: '#9ab8ff99', fontSize: 12, fontWeight: '700',
    letterSpacing: 2, textTransform: 'uppercase',
  },

  reelOuter: {
    width: width * 0.75,
    height: VISIBLE_HEIGHT,
    position: 'relative',
  },
  reelMask: {
    width: '100%',
    height: VISIBLE_HEIGHT,
    overflow: 'hidden',
    borderRadius: 16,
  },
  fadeMask: {
    position: 'absolute', left: 0, right: 0,
    height: ITEM_HEIGHT * 1.6, zIndex: 10,
  },
  fadeTop:    { top: 0 },
  fadeBottom: { bottom: 0 },

  selectionFrameWrap: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2, // center slot of 5 visible items
    left: 0, right: 0,
    height: ITEM_HEIGHT,
    zIndex: 5,
    paddingHorizontal: 2,
  },
  selectionFrame: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 2,
    backgroundColor: '#ffffff06',
  },

  reelItem: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 14,
  },
  iconBubble: {
    width: 42, height: 42, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  reelLabel: {
    fontSize: 17, fontWeight: '700', letterSpacing: -0.2,
  },

  reveal: { alignItems: 'center' },
  revealBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14, paddingHorizontal: 24,
    borderRadius: 20, borderWidth: 2,
    shadowColor: '#000', shadowOpacity: 0.5,
    shadowRadius: 20, shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  revealText:  { gap: 2 },
  revealSub:   { color: '#9ca3af', fontSize: 11, fontWeight: '600', letterSpacing: 1 },
  revealTopic: { fontSize: 20, fontWeight: '900' },

  startBtnWrap: {
    width: width * 0.75,
  },
  startBtn: {
    borderRadius: 16, overflow: 'hidden',
    shadowColor: '#4a1d96', shadowOpacity: 0.6,
    shadowRadius: 20, shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  startBtnGrad: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
    paddingVertical: 18,
  },
  startBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
});
