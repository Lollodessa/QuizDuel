import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GRADIENT_PAIRS: [string, string][] = [
  ['#8b5cf6', '#6366f1'],
  ['#3b82f6', '#06b6d4'],
  ['#f59e0b', '#ef4444'],
  ['#22c55e', '#06b6d4'],
  ['#ec4899', '#8b5cf6'],
];

function pickGradient(username: string): [string, string] {
  const idx = (username.charCodeAt(0) + username.charCodeAt(username.length - 1)) % GRADIENT_PAIRS.length;
  return GRADIENT_PAIRS[idx];
}

interface Props {
  username: string;
  size?: number;
  /** Shown when the player has answered the current question */
  hasAnswered?: boolean;
  isMe?: boolean;
}

export default function PlayerAvatar({ username, size = 48, hasAnswered = false, isMe = false }: Props) {
  const [from, to] = pickGradient(username);
  const initial = username.charAt(0).toUpperCase();
  const fontSize = size * 0.4;

  return (
    <View style={[styles.wrapper, isMe && styles.wrapperMe]}>
      <LinearGradient
        colors={[from, to]}
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <Text style={[styles.initial, { fontSize }]}>{initial}</Text>
      </LinearGradient>

      {/* "Answered" pulse dot */}
      {hasAnswered && (
        <View style={styles.dot} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative', alignItems: 'center' },
  wrapperMe: {
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    padding: 2,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: '#ffffff',
    fontWeight: '800',
  },
  dot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#0a0a1a',
  },
});
