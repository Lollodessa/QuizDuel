import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';

interface Props {
  /** Absolute timestamp (ms) when this question window began */
  questionStartTime: number;
  /** Duration of one question window in ms */
  durationMs: number;
}

export default function TimerBar({ questionStartTime, durationMs }: Props) {
  const [containerWidth, setContainerWidth] = useState(0);
  const barWidth = useSharedValue(0);
  const displaySeconds = useSharedValue(10);
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    if (!containerWidth || !questionStartTime) return;

    const elapsed = Date.now() - questionStartTime;
    const remaining = Math.max(0, durationMs - elapsed);
    const startPercent = (remaining / durationMs) * 100;
    const startPixels = (startPercent / 100) * containerWidth;

    // Snap to current state without animation, then animate to 0
    barWidth.value = startPixels;
    barWidth.value = withTiming(0, { duration: remaining, easing: Easing.linear });
  }, [containerWidth, questionStartTime]);

  // Update displayed digit every 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - questionStartTime;
      const remaining = Math.max(0, (durationMs - elapsed) / 1000);
      setSeconds(Math.ceil(remaining));
    }, 100);
    return () => clearInterval(interval);
  }, [questionStartTime]);

  const barStyle = useAnimatedStyle(() => {
    // Goes from green → yellow → red as time runs out
    const pct = containerWidth > 0 ? (barWidth.value / containerWidth) * 100 : 100;
    return {
      width: barWidth.value,
      backgroundColor: interpolateColor(pct, [0, 30, 100], ['#ef4444', '#f59e0b', '#22c55e']),
    };
  });

  const onLayout = (e: LayoutChangeEvent) => setContainerWidth(e.nativeEvent.layout.width);

  return (
    <View style={styles.wrapper}>
      <View style={styles.track} onLayout={onLayout}>
        <Animated.View style={[styles.bar, barStyle]} />
      </View>
      <Text style={[styles.digit, seconds <= 3 && styles.digitUrgent]}>{seconds}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16 },
  track: {
    flex: 1,
    height: 6,
    backgroundColor: '#1e1e4a',
    borderRadius: 3,
    overflow: 'hidden',
  },
  bar: { height: '100%', borderRadius: 3 },
  digit: { color: '#94a3b8', fontSize: 14, fontWeight: '700', width: 22, textAlign: 'right' },
  digitUrgent: { color: '#ef4444' },
});
