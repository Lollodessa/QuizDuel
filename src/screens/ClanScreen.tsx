import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, Easing,
  FadeIn, FadeInDown,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClanScreen() {
  const shieldScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);

  useEffect(() => {
    shieldScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2400 }),
        withTiming(0.3, { duration: 2400 }),
      ),
      -1,
    );
  }, []);

  const shieldStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shieldScale.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#0c0c0e', '#0d1a2e', '#0c0c0e']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.container}>
        {/* Shield hero */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.heroWrapper}>
          <Animated.View style={[styles.outerGlow, glowStyle]} />
          <Animated.View style={[styles.shieldWrapper, shieldStyle]}>
            <Ionicons name="shield" size={96} color="#f4f4f8" />
          </Animated.View>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.textGroup}>
          <Text style={styles.comingSoon}>PROSSIMAMENTE</Text>
          <Text style={styles.title}>I Clan stanno{'\n'}arrivando</Text>
          <Text style={styles.subtitle}>
            Unisciti a un clan, sfida altri gruppi e scala le classifiche a squadre.
            Rimani aggiornato — sarà epico.
          </Text>
        </Animated.View>

        {/* Feature pills */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.pillsRow}>
          {[
            { icon: 'game-controller', label: 'Guerre clan' },
            { icon: 'trophy',          label: 'Classifiche' },
            { icon: 'chatbubble',      label: 'Chat'        },
            { icon: 'gift',            label: 'Ricompense'  },
          ].map(({ icon, label }) => (
            <View key={label} style={styles.pill}>
              <Ionicons name={icon as any} size={13} color="#9ca3af" />
              <Text style={styles.pillText}>{label}</Text>
            </View>
          ))}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0c0c0e' },
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 32, gap: 36,
  },
  heroWrapper: { alignItems: 'center', justifyContent: 'center', height: 180 },
  outerGlow: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: '#1d4ed820',
  },
  shieldWrapper: { alignItems: 'center', justifyContent: 'center' },
  shieldEmoji: { fontSize: 96 },

  textGroup: { alignItems: 'center', gap: 12 },
  comingSoon: {
    color: '#1d4ed8', fontSize: 11, fontWeight: '900', letterSpacing: 4,
    backgroundColor: '#1d4ed820', paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: 999, borderWidth: 1, borderColor: '#1d4ed840',
  },
  title: {
    color: '#f4f4f8', fontSize: 32, fontWeight: '900',
    textAlign: 'center', lineHeight: 38, letterSpacing: -0.5,
  },
  subtitle: {
    color: '#6b6b80', fontSize: 14, textAlign: 'center',
    lineHeight: 22, fontWeight: '500',
  },

  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
    backgroundColor: '#16161a', borderWidth: 1, borderColor: '#2a2a35',
  },
  pillText: { color: '#9ca3af', fontSize: 12, fontWeight: '700' },
});
