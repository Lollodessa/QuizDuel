import React from 'react';
import {
  View, Text, StyleSheet, Modal, ScrollView,
  TouchableOpacity, Dimensions, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import { ARENAS, Arena } from '../data/arenas';

const { height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  currentTrophies: number;
  onClose: () => void;
}

export default function ArenaProgressionModal({ visible, currentTrophies, onClose }: Props) {
  const currentArenaIdx = ARENAS.findLastIndex((a) => currentTrophies >= a.minTrophies);

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <Animated.View entering={FadeIn.duration(250)} style={styles.sheet}>
          <LinearGradient
            colors={['#0c2d7a', '#071e54']}
            style={StyleSheet.absoluteFillObject}
          />

          <Text style={styles.title}>Percorso Arene</Text>
          <View style={styles.subRow}>
            <Ionicons name="trophy" size={13} color="#6b6b80" />
            <Text style={styles.sub}>{currentTrophies} coppe</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          >
            {[...ARENAS].reverse().map((arena, revIdx) => {
              const idx = ARENAS.length - 1 - revIdx;
              const unlocked = currentTrophies >= arena.minTrophies;
              const isCurrent = idx === currentArenaIdx;
              const isLast = revIdx === ARENAS.length - 1;

              return (
                <Animated.View
                  key={arena.name}
                  entering={FadeInRight.delay(revIdx * 40).duration(300)}
                  style={styles.row}
                >
                  {/* Vertical line */}
                  <View style={styles.lineColumn}>
                    <View style={[
                      styles.dot,
                      { backgroundColor: unlocked ? arena.color : '#2255c0' },
                      isCurrent && styles.dotCurrent,
                    ]}>
                      {isCurrent && (
                        <View style={[styles.dotInner, { backgroundColor: arena.color }]} />
                      )}
                    </View>
                    {!isLast && (
                      <View style={[
                        styles.line,
                        { backgroundColor: unlocked ? arena.color + '44' : '#2a2a3522' },
                      ]} />
                    )}
                  </View>

                  {/* Arena info */}
                  <View style={[
                    styles.arenaCard,
                    isCurrent && { borderColor: arena.color + '66', backgroundColor: arena.color + '0f' },
                    !unlocked && styles.arenaCardLocked,
                  ]}>
                    <View style={styles.arenaLeft}>
                      {arena.image ? (
                        <Image
                          source={arena.image}
                          style={[styles.arenaThumb, !unlocked && styles.locked]}
                          resizeMode="contain"
                        />
                      ) : (
                        <Text style={[styles.arenaIcon, !unlocked && styles.locked]}>
                          {arena.icon}
                        </Text>
                      )}
                      <View>
                        <Text style={[styles.arenaName, !unlocked && styles.lockedText]}>
                          {arena.name}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 }}>
                          <Ionicons name="trophy" size={11} color={unlocked ? arena.color : '#4a4a5a'} />
                          <Text style={[styles.arenaTrophies, { color: unlocked ? arena.color : '#4a4a5a', marginTop: 0 }]}>
                            {arena.minTrophies}{arena.maxTrophies !== Infinity ? ` – ${arena.maxTrophies}` : '+'}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {isCurrent && (
                      <View style={[styles.currentBadge, { backgroundColor: arena.color + '22', borderColor: arena.color + '55' }]}>
                        <Text style={[styles.currentBadgeText, { color: arena.color }]}>QUI</Text>
                      </View>
                    )}
                    {!unlocked && (
                      <Ionicons name="lock-closed" size={14} color="#6b6b80" />
                    )}
                  </View>
                </Animated.View>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Chiudi</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: '#000000bb',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: height * 0.82,
    paddingTop: 24, paddingBottom: 36,
    borderWidth: 1, borderColor: '#2255c0', borderBottomWidth: 0,
    overflow: 'hidden',
  },
  title: {
    color: '#f4f4f8', fontSize: 20, fontWeight: '900',
    textAlign: 'center', marginBottom: 4,
  },
  subRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, marginBottom: 20,
  },
  sub: {
    color: '#6b6b80', fontSize: 13, fontWeight: '600',
  },
  list: {
    paddingHorizontal: 20, paddingBottom: 8,
  },
  row: {
    flexDirection: 'row', gap: 14, alignItems: 'flex-start',
    marginBottom: 0,
  },
  lineColumn: {
    alignItems: 'center', width: 20, paddingTop: 14,
  },
  dot: {
    width: 14, height: 14, borderRadius: 7,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 1,
  },
  dotCurrent: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: '#f4f4f8',
    backgroundColor: 'transparent',
  },
  dotInner: {
    width: 8, height: 8, borderRadius: 4,
  },
  line: {
    width: 2, flex: 1, minHeight: 24,
    marginTop: 2, marginBottom: 2,
  },
  arenaCard: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0c2d7a', borderRadius: 14,
    borderWidth: 1, borderColor: '#2255c0',
    paddingHorizontal: 14, paddingVertical: 12,
    marginBottom: 8,
  },
  arenaCardLocked: { opacity: 0.45 },
  arenaLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  arenaIcon: { fontSize: 26 },
  arenaThumb: { width: 36, height: 36 },
  locked: { opacity: 0.3 },
  arenaName: { color: '#f4f4f8', fontSize: 13, fontWeight: '800' },
  lockedText: { color: '#6b6b80' },
  arenaTrophies: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  currentBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 999, borderWidth: 1,
  },
  currentBadgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  lockIcon: { fontSize: 14 },
  closeBtn: { alignSelf: 'center', paddingVertical: 12, paddingHorizontal: 40, marginTop: 8 },
  closeBtnText: { color: '#6b6b80', fontSize: 15, fontWeight: '700' },
});
