import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Clipboard,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { createRoom } from '../services/matchmaking';
import { deleteRoom } from '../services/matchmaking';

export default function FriendScreen() {
  const router = useRouter();
  const { username, trophies } = useLocalSearchParams<{ username: string; trophies: string }>();

  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const id = await createRoom(username, parseInt(trophies || '0', 10), 'friendly');
      setRoomCode(id);
    } catch {
      Alert.alert('Errore', 'Non riesco a creare la stanza. Riprova.');
      setCreating(false);
    }
  };

  const handleCopy = () => {
    Clipboard.setString(roomCode);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copiato!', 'Codice copiato — mandalo al tuo amico!');
  };

  const handleWaitForFriend = () => {
    router.push({
      pathname: '/matchmaking',
      params: { username, trophies: trophies ?? '0', mode: 'friendly', roomId: roomCode },
    });
  };

  const handleJoin = () => {
    const code = joinCode.trim();
    if (!code) { Alert.alert('Inserisci il codice!'); return; }
    router.push({
      pathname: '/matchmaking',
      params: { username, trophies: trophies ?? '0', mode: 'friendly', joinRoomId: code },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#0c0c0e', '#0f0f14']} style={StyleSheet.absoluteFillObject} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Indietro</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Sfida un amico</Text>
      </View>

      {/* Tab switcher */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'create' && styles.tabActive]}
          onPress={() => { setTab('create'); setRoomCode(''); }}
        >
          <Text style={[styles.tabText, tab === 'create' && styles.tabTextActive]}>Crea stanza</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'join' && styles.tabActive]}
          onPress={() => setTab('join')}
        >
          <Text style={[styles.tabText, tab === 'join' && styles.tabTextActive]}>Entra con codice</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {tab === 'create' ? (
          roomCode ? (
            /* Stanza creata — mostra codice */
            <View style={styles.codeSection}>
              <Text style={styles.codeLabel}>Il tuo codice stanza</Text>
              <Text style={styles.codeHint}>Mandalo al tuo amico 👇</Text>
              <TouchableOpacity style={styles.codeBox} onPress={handleCopy}>
                <Text style={styles.codeText}>{roomCode.slice(-6).toUpperCase()}</Text>
                <Text style={styles.codeCopyLabel}>tocca per copiare</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleWaitForFriend} activeOpacity={0.85} style={styles.waitBtn}>
                <LinearGradient
                  colors={['#4a1d96', '#1d4ed8']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.waitBtnGradient}
                >
                  <Text style={styles.waitBtnText}>Aspetta l'amico →</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            /* Crea stanza */
            <View style={styles.createSection}>
              <Ionicons name="home" size={56} color="#f4f4f8" />
              <Text style={styles.createTitle}>Crea una stanza privata</Text>
              <Text style={styles.createDesc}>
                Riceverai un codice da condividere con il tuo amico. Nessun trofeo in palio, solo gloria!
              </Text>
              <TouchableOpacity
                onPress={handleCreate}
                disabled={creating}
                activeOpacity={0.85}
                style={styles.createBtnWrapper}
              >
                <LinearGradient
                  colors={['#4a1d96', '#1d4ed8']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.createBtn}
                >
                  <Text style={styles.createBtnText}>
                    {creating ? 'Creazione...' : 'CREA STANZA'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )
        ) : (
          /* Entra con codice */
          <View style={styles.joinSection}>
            <Ionicons name="key" size={56} color="#f4f4f8" />
            <Text style={styles.createTitle}>Entra nella stanza</Text>
            <Text style={styles.createDesc}>Inserisci il codice che ti ha mandato il tuo amico</Text>
            <TextInput
              style={styles.joinInput}
              value={joinCode}
              onChangeText={setJoinCode}
              placeholder="Codice stanza..."
              placeholderTextColor="#3a3a4a"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
              onSubmitEditing={handleJoin}
            />
            <TouchableOpacity onPress={handleJoin} activeOpacity={0.85} style={styles.createBtnWrapper}>
              <LinearGradient
                colors={['#4a1d96', '#1d4ed8']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.createBtn}
              >
                <Text style={styles.createBtnText}>ENTRA →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0c0c0e' },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16, gap: 8 },
  backBtn: { alignSelf: 'flex-start' },
  backText: { color: '#6b6b80', fontSize: 15, fontWeight: '600' },
  title: { color: '#f4f4f8', fontSize: 26, fontWeight: '900' },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#16161a',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: '#2a2a35' },
  tabText: { color: '#6b6b80', fontSize: 14, fontWeight: '700' },
  tabTextActive: { color: '#f4f4f8' },
  body: { flex: 1, paddingHorizontal: 24 },
  createSection: { alignItems: 'center', gap: 16, paddingTop: 20 },
  createEmoji: { fontSize: 56 },
  createTitle: { color: '#f4f4f8', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  createDesc: { color: '#6b6b80', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  createBtnWrapper: { width: '100%', marginTop: 8 },
  createBtn: { paddingVertical: 18, borderRadius: 14, alignItems: 'center' },
  createBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  codeSection: { alignItems: 'center', gap: 12, paddingTop: 20 },
  codeLabel: { color: '#f4f4f8', fontSize: 20, fontWeight: '800' },
  codeHint: { color: '#6b6b80', fontSize: 14 },
  codeBox: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: '#16161a',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4a1d96',
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  codeText: { color: '#f4f4f8', fontSize: 32, fontWeight: '900', letterSpacing: 6 },
  codeCopyLabel: { color: '#4a1d96', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  waitBtn: { width: '100%', marginTop: 8 },
  waitBtnGradient: { paddingVertical: 18, borderRadius: 14, alignItems: 'center' },
  waitBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  joinSection: { alignItems: 'center', gap: 16, paddingTop: 20 },
  joinInput: {
    width: '100%',
    backgroundColor: '#16161a',
    borderWidth: 1,
    borderColor: '#2a2a35',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    color: '#f4f4f8',
    fontSize: 17,
    fontWeight: '600',
  },
});
