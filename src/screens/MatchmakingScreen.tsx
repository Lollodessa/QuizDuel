import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  findOrCreateRoom,
  joinRoom,
  startCountdown,
  subscribeToRoom,
  deleteRoom,
} from '../services/matchmaking';
import { auth } from '../services/firebase';
import { Room, MatchMode } from '../types';
import PlayerAvatar from '../components/PlayerAvatar';

export default function MatchmakingScreen() {
  const router = useRouter();
  const { username, trophies, mode, roomId: existingRoomId, joinRoomId } =
    useLocalSearchParams<{
      username: string;
      trophies: string;
      mode: MatchMode;
      roomId?: string;       // friendly: host già ha creato la stanza
      joinRoomId?: string;   // friendly: guest si unisce
    }>();

  const [room, setRoom] = useState<Room | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const unsubRef = useRef<(() => void) | null>(null);
  const countdownTriggeredRef = useRef(false);

  const pulse = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
    rotate.value = withRepeat(withTiming(360, { duration: 3000, easing: Easing.linear }), -1, false);

    init();
    return () => unsubRef.current?.();
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  const spinStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotate.value}deg` }] }));

  const t = parseInt(trophies || '0', 10);

  async function init() {
    try {
      let id: string;
      let host: boolean;

      if (joinRoomId) {
        // Guest entra in una stanza amico
        await joinRoom(joinRoomId, username, t);
        id = joinRoomId;
        host = false;
      } else if (existingRoomId) {
        // Host ha già creato la stanza (da FriendScreen)
        id = existingRoomId;
        host = true;
      } else {
        // Ranked: matchmaking casuale
        const result = await findOrCreateRoom(username, t);
        id = result.roomId;
        host = result.isHost;
      }

      setRoomId(id);
      setIsHost(host);

      unsubRef.current = subscribeToRoom(id, (r) => {
        if (!r) return;
        setRoom(r);

        const players = Object.values(r.players);

        if (players.length === 2 && r.status === 'waiting' && host && !countdownTriggeredRef.current) {
          countdownTriggeredRef.current = true;
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          startCountdown(id);
        }

        if (r.status === 'countdown') {
          unsubRef.current?.();
          setTimeout(() => {
            router.replace({ pathname: '/game', params: { roomId: id } });
          }, 300);
        }
      });
    } catch (e: any) {
      setErrorMsg(e.message ?? 'Qualcosa è andato storto. Riprova.');
    }
  }

  const handleCancel = async () => {
    unsubRef.current?.();
    if (roomId && isHost) await deleteRoom(roomId);
    router.back();
  };

  const players = room ? Object.values(room.players) : [];

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#1244c8', '#1040b8']} style={StyleSheet.absoluteFillObject} />

      <View style={styles.container}>
        {/* Icona animata */}
        <Animated.View style={[styles.outerRing, pulseStyle]}>
          <Animated.View style={[styles.innerRing, spinStyle]}>
            <LinearGradient colors={['#4a1d96', '#1d4ed8']} style={styles.searchCircle}>
              <Ionicons name="game-controller" size={34} color="#fff" />
            </LinearGradient>
          </Animated.View>
        </Animated.View>

        {/* Stato */}
        <View style={styles.statusArea}>
          {errorMsg ? (
            <Text style={styles.errorText}>{errorMsg}</Text>
          ) : mode === 'ranked' ? (
            <>
              <Text style={styles.heading}>Cercando avversario…</Text>
              <Text style={styles.sub}>Modalità classificata • Argomento casuale</Text>
            </>
          ) : existingRoomId ? (
            <>
              <Text style={styles.heading}>In attesa del tuo amico…</Text>
              <Text style={styles.sub}>La partita inizierà appena entra</Text>
            </>
          ) : (
            <Text style={styles.heading}>Entrando nella stanza…</Text>
          )}
        </View>

        {/* Slot giocatori */}
        {players.length > 0 && (
          <View style={styles.slots}>
            {players.map((p) => (
              <View key={p.uid} style={styles.slot}>
                <PlayerAvatar username={p.username} size={56} isMe={p.uid === auth.currentUser?.uid} />
                <Text style={styles.slotName}>{p.username}</Text>
                <View style={styles.slotReadyDot} />
              </View>
            ))}
            {players.length === 1 && (
              <View style={[styles.slot, styles.slotEmpty]}>
                <View style={styles.emptyAvatar}>
                  <Text style={styles.emptyDots}>···</Text>
                </View>
                <Text style={styles.slotName}>Attesa…</Text>
              </View>
            )}
          </View>
        )}

        {!errorMsg && (
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.8}>
            <Text style={styles.cancelIcon}>✕</Text>
            <Text style={styles.cancelText}>Annulla ricerca</Text>
          </TouchableOpacity>
        )}

        {errorMsg && (
          <TouchableOpacity style={styles.retryBtn} onPress={() => { setErrorMsg(''); init(); }}>
            <Text style={styles.retryText}>Riprova</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1244c8' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 32, paddingHorizontal: 24 },
  outerRing: {
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: '#4a1d9620',
    alignItems: 'center', justifyContent: 'center',
  },
  innerRing: {
    width: 108, height: 108, borderRadius: 54,
    borderWidth: 1.5, borderColor: '#4a1d96',
    borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
  },
  searchCircle: { width: 78, height: 78, borderRadius: 39, alignItems: 'center', justifyContent: 'center' },
  searchEmoji: { fontSize: 34 },
  statusArea: { alignItems: 'center', gap: 8 },
  heading: { color: '#f4f4f8', fontSize: 20, fontWeight: '800', textAlign: 'center' },
  sub: { color: '#9ab8ff', fontSize: 13, fontWeight: '500' },
  errorText: { color: '#dc2626', fontSize: 15, textAlign: 'center', lineHeight: 22 },
  slots: { flexDirection: 'row', gap: 28 },
  slot: { alignItems: 'center', gap: 8 },
  slotEmpty: { opacity: 0.35 },
  slotName: { color: '#f4f4f8', fontSize: 14, fontWeight: '700' },
  slotReadyDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#16a34a' },
  emptyAvatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#1244c0',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#3068e8',
  },
  emptyDots: { color: '#3a60d8', fontSize: 18, fontWeight: '900' },
  cancelBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 14, paddingHorizontal: 28,
    borderRadius: 14, backgroundColor: '#0e38a8',
    borderWidth: 1, borderColor: '#3068e8',
  },
  cancelIcon: { color: '#dc2626', fontSize: 14, fontWeight: '900' },
  cancelText: { color: '#f4f4f8', fontSize: 15, fontWeight: '700' },
  retryBtn: {
    paddingVertical: 14, paddingHorizontal: 40,
    borderRadius: 12, backgroundColor: '#0e38a8',
    borderWidth: 1, borderColor: '#3068e8',
  },
  retryText: { color: '#f4f4f8', fontSize: 15, fontWeight: '700' },
});
