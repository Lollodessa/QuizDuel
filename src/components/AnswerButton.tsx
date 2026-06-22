import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type ButtonState = 'idle' | 'selected-correct' | 'selected-wrong' | 'reveal-correct' | 'disabled';

interface Props {
  label: string;
  index: number;
  state: ButtonState;
  onPress: () => void;
}

const LETTERS = ['A', 'B', 'C', 'D'];

export default function AnswerButton({ label, index, state, onPress }: Props) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (state === 'selected-correct') {
      scale.value = withSequence(withSpring(1.03, { damping: 5 }), withSpring(1));
    } else if (state === 'selected-wrong') {
      translateX.value = withSequence(
        withTiming(10, { duration: 55 }),
        withTiming(-10, { duration: 55 }),
        withTiming(8, { duration: 55 }),
        withTiming(-8, { duration: 55 }),
        withTiming(0, { duration: 55 }),
      );
    }
  }, [state]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }],
  }));

  const getBg = () => {
    switch (state) {
      case 'selected-correct': return '#0a2a14';
      case 'reveal-correct':   return '#0a2014';
      case 'selected-wrong':   return '#2a0a0a';
      default: return '#16161a';
    }
  };

  const getBorder = () => {
    switch (state) {
      case 'selected-correct':
      case 'reveal-correct':   return '#16a34a';
      case 'selected-wrong':   return '#dc2626';
      default: return '#2a2a35';
    }
  };

  return (
    <Animated.View style={[styles.wrapper, containerStyle]}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: getBg(), borderColor: getBorder() }]}
        onPress={onPress}
        activeOpacity={0.75}
        disabled={state !== 'idle'}
      >
        <Text style={styles.letter}>{LETTERS[index]}</Text>
        <Text style={styles.label} numberOfLines={2}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginHorizontal: 16 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 13,
    borderWidth: 1.5,
  },
  letter: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#2a2a35',
    color: '#f4f4f8',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 28,
    overflow: 'hidden',
  },
  label: { flex: 1, color: '#f4f4f8', fontSize: 15, fontWeight: '600' },
});
