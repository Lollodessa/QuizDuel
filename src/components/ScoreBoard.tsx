import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import PlayerAvatar from './PlayerAvatar';
import { PlayerState } from '../types';

interface Props {
  me: PlayerState;
  opponent: PlayerState | null;
  questionIndex: number;
  totalQuestions: number;
}

function ScoreChip({ score, right }: { score: number; right?: boolean }) {
  const scale = useSharedValue(1);
  const prev = React.useRef(score);

  useEffect(() => {
    if (score !== prev.current) {
      scale.value = withSequence(withSpring(1.25, { damping: 6 }), withSpring(1));
      prev.current = score;
    }
  }, [score]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.Text style={[styles.score, right && styles.scoreRight, style]}>
      {score}
    </Animated.Text>
  );
}

export default function ScoreBoard({ me, opponent, questionIndex, totalQuestions }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        <PlayerAvatar username={me.username} size={38} isMe />
        <View>
          <Text style={styles.name}>{me.username}</Text>
          <ScoreChip score={me.score} />
        </View>
      </View>

      <View style={styles.center}>
        <Text style={styles.qNum}>{questionIndex + 1}</Text>
        <Text style={styles.qSep}>/</Text>
        <Text style={styles.qTotal}>{totalQuestions}</Text>
      </View>

      <View style={[styles.side, styles.sideRight]}>
        {opponent ? (
          <>
            <View style={styles.infoRight}>
              <Text style={[styles.name, styles.nameRight]}>{opponent.username}</Text>
              <ScoreChip score={opponent.score} right />
            </View>
            <PlayerAvatar
              username={opponent.username}
              size={38}
              hasAnswered={!!opponent.lastAnswerAt}
            />
          </>
        ) : (
          <Text style={styles.waiting}>Attesa…</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#16161a',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a35',
  },
  side: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  sideRight: { justifyContent: 'flex-end' },
  infoRight: { alignItems: 'flex-end' },
  name: { color: '#6b6b80', fontSize: 11, fontWeight: '600', marginBottom: 2 },
  nameRight: { textAlign: 'right' },
  score: { color: '#f4f4f8', fontSize: 22, fontWeight: '900' },
  scoreRight: { textAlign: 'right' },
  center: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  qNum: { color: '#c9a84c', fontSize: 18, fontWeight: '900' },
  qSep: { color: '#3a3a4a', fontSize: 14 },
  qTotal: { color: '#3a3a4a', fontSize: 14, fontWeight: '600' },
  waiting: { color: '#3a3a4a', fontSize: 12 },
});
