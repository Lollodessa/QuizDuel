import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Topic } from '../types';

const TOPIC_COLORS: Record<Topic, { bg: string; border: string; label: string }> = {
  Cinema:    { bg: '#1a0a3a', border: '#4a1d96', label: '#a78bfa' },
  Sport:     { bg: '#0a1f12', border: '#166534', label: '#4ade80' },
  Geography: { bg: '#0a1a2a', border: '#1d4ed8', label: '#60a5fa' },
  Music:     { bg: '#2a0a20', border: '#9d174d', label: '#f472b6' },
  Science:   { bg: '#0a1a1a', border: '#0e7490', label: '#22d3ee' },
};

const TOPIC_ICON_NAMES: Record<Topic, string> = {
  Cinema: 'film-outline', Sport: 'football-outline', Geography: 'globe-outline',
  Music: 'musical-notes-outline', Science: 'flask-outline',
};

interface Props {
  topic: Topic;
  questionText: string;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionCard({ topic, questionText, questionNumber, totalQuestions }: Props) {
  const colors = TOPIC_COLORS[topic];

  return (
    <View style={[styles.card, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <View style={styles.topRow}>
        <Ionicons name={TOPIC_ICON_NAMES[topic] as any} size={18} color={colors.label} />
        <Text style={[styles.topicLabel, { color: colors.label }]}>{topic.toUpperCase()}</Text>
      </View>
      <Text style={styles.question}>{questionText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    padding: 22,
    gap: 12,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { fontSize: 18 },
  topicLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  question: { color: '#f4f4f8', fontSize: 19, fontWeight: '700', lineHeight: 27 },
});
