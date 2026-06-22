import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Modal, Dimensions, ScrollView, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
  FadeIn, FadeInDown, withSequence, withRepeat, Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Character } from '../types';
import { CHARACTERS, RARITY_CONFIG, STORAGE_KEYS } from '../data/characters';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 3;

// ─── Character Card ────────────────────────────────────────────────────────────

function CharacterCard({
  char, unlocked, active, onPress,
}: {
  char: Character; unlocked: boolean; active: boolean; onPress: () => void;
}) {
  const rarity = RARITY_CONFIG[char.rarity];
  const scale = useSharedValue(1);
  const glowAnim = useSharedValue(0.6);

  useEffect(() => {
    if (unlocked) {
      glowAnim.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.5, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
      );
    }
  }, [unlocked]);

  const handlePressIn = () => { scale.value = withSpring(0.93, { damping: 10 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 10 }); };

  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowAnim.value }));

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View style={[styles.card, cardStyle]}>
        {/* Border glow */}
        <View style={[
          styles.cardBorder,
          { borderColor: unlocked ? rarity.border : '#2255c0' },
          active && styles.activeBorder,
        ]}>
          {/* Glow overlay */}
          {unlocked && (
            <Animated.View style={[
              StyleSheet.absoluteFillObject,
              { borderRadius: 14, backgroundColor: rarity.glow },
              glowStyle,
            ]} />
          )}

          {/* Letter or image */}
          {char.image ? (
            <Image
              source={char.image}
              style={[styles.cardImage, !unlocked && styles.cardImageLocked]}
              resizeMode="contain"
            />
          ) : (
            <Text style={[styles.cardLetter, { color: unlocked ? char.color : '#3a3a4a' }]}>
              {char.letter}
            </Text>
          )}

          {/* Name */}
          <Text style={[styles.cardName, !unlocked && styles.cardNameLocked]}>
            {char.name}
          </Text>

          {/* Rarity badge */}
          <View style={[
            styles.rarityBadge,
            { backgroundColor: unlocked ? rarity.border + '22' : '#0e3590' },
          ]}>
            <Text style={[
              styles.rarityText,
              { color: unlocked ? rarity.border : '#3a3a4a' },
            ]}>
              {rarity.label.charAt(0)}
            </Text>
          </View>

          {/* Lock icon */}
          {!unlocked && (
            <View style={styles.lockOverlay}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
          )}

          {/* Active indicator */}
          {active && (
            <View style={styles.activeIndicator}>
              <Text style={styles.activeCheck}>✓</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Character Detail Modal ────────────────────────────────────────────────────

function CharacterModal({
  char, unlocked, active, onClose, onSelect,
}: {
  char: Character | null;
  unlocked: boolean;
  active: boolean;
  onClose: () => void;
  onSelect: () => void;
}) {
  if (!char) return null;
  const rarity = RARITY_CONFIG[char.rarity];

  return (
    <Modal transparent animationType="fade" visible={!!char} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <Animated.View
          entering={FadeInDown.duration(300).springify()}
          style={styles.modalCard}
        >
          <LinearGradient
            colors={[char.colorDark, '#071e54']}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Hero */}
          <View style={[styles.modalHero, { borderColor: rarity.border + '55' }]}>
            <View style={[styles.modalGlow, { backgroundColor: char.color + '20' }]} />
            {char.image ? (
              <Image
                source={char.image}
                style={[styles.modalImage, !unlocked && { opacity: 0.3 }]}
                resizeMode="contain"
              />
            ) : (
              <Text style={[styles.modalLetter, { color: unlocked ? char.color : '#3a3a4a' }]}>
                {char.letter}
              </Text>
            )}
          </View>

          {/* Name + rarity */}
          <Text style={styles.modalName}>{char.name}</Text>
          <View style={[styles.modalRarityBadge, { borderColor: rarity.border + '60' }]}>
            <Text style={[styles.modalRarityText, { color: rarity.border }]}>
              {rarity.label}
            </Text>
          </View>

          {/* Power */}
          <View style={styles.modalPowerBox}>
            <Text style={[styles.modalPowerLabel, { color: unlocked ? char.color : '#6b6b80' }]}>
              ⚡ {char.powerLabel}
            </Text>
            <Text style={styles.modalPowerDesc}>{char.description}</Text>
          </View>

          {/* CTA */}
          {unlocked ? (
            active ? (
              <View style={styles.activeChip}>
                <Text style={styles.activeChipText}>✓ Personaggio attivo</Text>
              </View>
            ) : (
              <TouchableOpacity onPress={onSelect} activeOpacity={0.85}>
                <LinearGradient
                  colors={[char.color, char.colorDark]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.selectBtn}
                >
                  <Text style={styles.selectBtnText}>SELEZIONA</Text>
                </LinearGradient>
              </TouchableOpacity>
            )
          ) : (
            <View style={styles.lockedCTA}>
              <Text style={styles.lockedCTAText}>🔒 Trova questa lettera nelle buste dello Shop</Text>
            </View>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Chiudi</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function CharactersScreen() {
  const [unlockedLetters, setUnlockedLetters] = useState<string[]>([]);
  const [activeCharacter, setActiveCharacter] = useState<string | null>(null);
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);

  useEffect(() => {
    AsyncStorage.multiGet([STORAGE_KEYS.CHARACTERS, STORAGE_KEYS.ACTIVE_CHARACTER]).then(
      ([[, chars], [, active]]) => {
        setUnlockedLetters(chars ? JSON.parse(chars) : []);
        setActiveCharacter(active ?? null);
      },
    );
  }, []);

  const handleSelect = useCallback(async () => {
    if (!selectedChar) return;
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_CHARACTER, selectedChar.letter);
    setActiveCharacter(selectedChar.letter);
    setSelectedChar(null);
  }, [selectedChar]);

  const unlockedCount = unlockedLetters.length;

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#071e54', '#0a2568']} style={StyleSheet.absoluteFillObject} />

      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Text style={styles.headerTitle}>Le tue Lettere</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerCount}>{unlockedCount}</Text>
          <Text style={styles.headerTotal}>/26</Text>
        </View>
      </Animated.View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: `${(unlockedCount / 26) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressHint}>
          {unlockedCount === 0
            ? 'Nessuna lettera sbloccata — cerca le buste nello Shop!'
            : unlockedCount === 26
            ? '👑 Collezione completa!'
            : `${26 - unlockedCount} lettere ancora da trovare`}
        </Text>
      </View>

      {/* Grid */}
      <FlatList
        data={CHARACTERS}
        keyExtractor={(c) => c.letter}
        numColumns={3}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 30).duration(300)}>
            <CharacterCard
              char={item}
              unlocked={unlockedLetters.includes(item.letter)}
              active={activeCharacter === item.letter}
              onPress={() => setSelectedChar(item)}
            />
          </Animated.View>
        )}
      />

      <CharacterModal
        char={selectedChar}
        unlocked={selectedChar ? unlockedLetters.includes(selectedChar.letter) : false}
        active={selectedChar?.letter === activeCharacter}
        onClose={() => setSelectedChar(null)}
        onSelect={handleSelect}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#071e54' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8,
  },
  headerTitle: { color: '#f4f4f8', fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  headerBadge: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  headerCount: { color: '#a78bfa', fontSize: 22, fontWeight: '900' },
  headerTotal: { color: '#6b6b80', fontSize: 15, fontWeight: '700' },

  progressContainer: { paddingHorizontal: 20, gap: 6, marginBottom: 16 },
  progressTrack: { height: 6, backgroundColor: '#0e3590', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#7c3aed', borderRadius: 3 },
  progressHint: { color: '#6b6b80', fontSize: 12, fontWeight: '500' },

  grid: { paddingHorizontal: 16, paddingBottom: 24, gap: 8 },

  card: { width: CARD_SIZE, padding: 4 },
  cardBorder: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0a2568',
    overflow: 'hidden',
    minHeight: CARD_SIZE,
    justifyContent: 'center',
  },
  activeBorder: { borderColor: '#a78bfa', borderWidth: 2 },
  cardLetter: { fontSize: CARD_SIZE * 0.68, fontWeight: '900', lineHeight: CARD_SIZE * 0.72, transform: [{ translateY: 6 }] },
  cardImage: {
    width: CARD_SIZE * 0.9,
    height: CARD_SIZE * 0.9,
    transform: [{ scale: 1.45 }, { translateY: 8 }],
  },
  cardImageLocked: { opacity: 0.2 },
  modalImage: { width: 220, height: 220 },
  cardName: { color: '#f4f4f8', fontSize: 10, fontWeight: '700', textAlign: 'center' },
  cardNameLocked: { color: '#3a3a4a' },
  rarityBadge: {
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginTop: 2,
  },
  rarityText: { fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  lockOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#0c0c0ecc', borderRadius: 12,
  },
  lockIcon: { fontSize: 18 },
  activeIndicator: {
    position: 'absolute', top: 6, right: 6,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#7c3aed', alignItems: 'center', justifyContent: 'center',
  },
  activeCheck: { color: '#fff', fontSize: 9, fontWeight: '900' },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: '#000000aa',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 28, paddingBottom: 40,
    overflow: 'hidden', gap: 16,
    alignItems: 'center',
    backgroundColor: '#071e54',
    borderWidth: 1, borderColor: '#2255c0',
    borderBottomWidth: 0,
  },
  modalHero: {
    width: 160, height: 160, borderRadius: 80,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  modalGlow: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
  },
  modalLetter: { fontSize: 110, fontWeight: '900', lineHeight: 120 },
  modalName: { color: '#f4f4f8', fontSize: 26, fontWeight: '900' },
  modalRarityBadge: {
    paddingHorizontal: 14, paddingVertical: 5, borderRadius: 999,
    borderWidth: 1,
  },
  modalRarityText: { fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  modalPowerBox: {
    backgroundColor: '#0c2d7a', borderRadius: 16,
    borderWidth: 1, borderColor: '#2255c0',
    padding: 16, gap: 8, alignSelf: 'stretch',
  },
  modalPowerLabel: { fontSize: 15, fontWeight: '900' },
  modalPowerDesc: { color: '#9ca3af', fontSize: 13, lineHeight: 20 },
  selectBtn: {
    paddingVertical: 16, paddingHorizontal: 48, borderRadius: 14, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  selectBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  activeChip: {
    paddingVertical: 14, paddingHorizontal: 32, borderRadius: 14,
    backgroundColor: '#7c3aed22', borderWidth: 1, borderColor: '#7c3aed',
  },
  activeChipText: { color: '#a78bfa', fontSize: 15, fontWeight: '800' },
  lockedCTA: {
    paddingVertical: 14, paddingHorizontal: 20, borderRadius: 14,
    backgroundColor: '#0c2d7a', borderWidth: 1, borderColor: '#2255c0',
  },
  lockedCTAText: { color: '#6b6b80', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  closeBtn: { paddingVertical: 10 },
  closeBtnText: { color: '#6b6b80', fontSize: 14, fontWeight: '600' },
});
