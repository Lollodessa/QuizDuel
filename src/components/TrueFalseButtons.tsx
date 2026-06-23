import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withSequence, withTiming,
} from 'react-native-reanimated';

type ButtonState = 'idle' | 'selected-pending' | 'selected-correct' | 'selected-wrong' | 'reveal-correct' | 'disabled';

interface Props {
  labels: [string, string];          // options[lang][0] e options[lang][1]
  getState: (idx: number) => ButtonState;
  onPress: (idx: number) => void;
}

// ─── Singolo quadrone V o F ───────────────────────────────────────────────────

function TFButton({
  letter, label, state, onPress,
}: {
  letter: 'V' | 'F';
  label: string;
  state: ButtonState;
  onPress: () => void;
}) {
  const scale      = useSharedValue(1);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (state === 'selected-pending') {
      scale.value = withSequence(withSpring(1.03, { damping: 5 }), withSpring(1));
    } else if (state === 'selected-correct') {
      scale.value = withSequence(withSpring(1.04, { damping: 5 }), withSpring(1));
    } else if (state === 'selected-wrong') {
      translateX.value = withSequence(
        withTiming(10, { duration: 55 }), withTiming(-10, { duration: 55 }),
        withTiming(8,  { duration: 55 }), withTiming(-8,  { duration: 55 }),
        withTiming(0,  { duration: 55 }),
      );
    }
  }, [state]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }],
  }));

  const getBg = () => {
    switch (state) {
      case 'selected-correct': return '#0a3a18';
      case 'reveal-correct':   return '#0a3a18';
      case 'selected-wrong':   return '#3a0a0a';
      case 'disabled':         return '#111116';
      default: return letter === 'V' ? '#0d2e18' : '#2e0d0d';
    }
  };

  const getBorder = () => {
    switch (state) {
      case 'selected-pending': return '#f4f4f8'; // bordo bianco = "ho scelto questo"
      case 'selected-correct':
      case 'reveal-correct': return '#22c55e';
      case 'selected-wrong': return '#ef4444';
      case 'disabled':       return '#1e1e26';
      default: return letter === 'V' ? '#22c55e77' : '#ef444477';
    }
  };

  const getLetterColor = () => {
    switch (state) {
      case 'selected-correct':
      case 'reveal-correct': return '#4ade80';
      case 'selected-wrong': return '#f87171';
      case 'disabled':       return '#2a2a35';
      default: return '#f4f4f8'; // bianco in idle — leggibile su qualsiasi bg
    }
  };

  return (
    <Animated.View style={[styles.wrapper, animStyle]}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: getBg(), borderColor: getBorder() }]}
        onPress={onPress}
        activeOpacity={0.75}
        disabled={state !== 'idle'}
      >
        <Text style={[styles.letter, { color: getLetterColor() }]}>{letter}</Text>
        <Text style={[styles.label, state === 'disabled' && { color: '#2a2a35' }]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Coppia affiancata ────────────────────────────────────────────────────────

export default function TrueFalseButtons({ labels, getState, onPress }: Props) {
  return (
    <View style={styles.row}>
      <TFButton letter="V" label={labels[0]} state={getState(0)} onPress={() => onPress(0)} />
      <TFButton letter="F" label={labels[1]} state={getState(1)} onPress={() => onPress(1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  wrapper: { flex: 1 },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 6,
  },
  letter: {
    fontSize: 72,
    fontWeight: '900',
    lineHeight: 80,
  },
  label: {
    color: '#9ab8ff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
