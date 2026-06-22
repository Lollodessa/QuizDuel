import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../data/storage';
import { useLanguage } from '../i18n';

const ITEM_DEFS = [
  {
    id: 'streak_shield',
    nameKey: 'streakShieldName' as const,
    descKey: 'streakShieldDesc' as const,
    emoji: '🛡️',
    iconName: 'shield',
    costCoins: 150,
    costGems: 0,
    color: '#22d3ee',
    colorDark: '#042030',
    storageKey: STORAGE_KEYS.STREAK_SHIELD,
    oneTime: true,
  },
  {
    id: 'double_win',
    nameKey: 'doubleWinName' as const,
    descKey: 'doubleWinDesc' as const,
    emoji: '⚡',
    iconName: 'flash',
    costCoins: 200,
    costGems: 0,
    color: '#f59e0b',
    colorDark: '#2d1a00',
    storageKey: '@quizduel_double_win',
    oneTime: true,
  },
];

export default function ShopScreen() {
  const { t } = useLanguage();
  const [coins, setCoins] = useState(0);
  const [gems, setGems] = useState(0);
  const [owned, setOwned] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const ITEMS = ITEM_DEFS.map((d) => ({ ...d, name: t(d.nameKey), description: t(d.descKey) }));

  useEffect(() => {
    AsyncStorage.multiGet([
      STORAGE_KEYS.COINS, STORAGE_KEYS.GEMS,
      STORAGE_KEYS.STREAK_SHIELD, '@quizduel_double_win',
    ]).then(([[, c], [, g], [, shield], [, dw]]) => {
      setCoins(parseInt(c ?? '0', 10));
      setGems(parseInt(g ?? '0', 10));
      setOwned({
        [STORAGE_KEYS.STREAK_SHIELD]: shield === '1',
        '@quizduel_double_win': dw === '1',
      });
    });
  }, []);

  const handleBuy = useCallback(async (item: typeof ITEMS[0]) => {
    if (item.costCoins > 0 && coins < item.costCoins) return;
    if (item.costGems > 0 && gems < item.costGems) return;
    if (owned[item.storageKey]) return;

    const newCoins = coins - item.costCoins;
    const newGems  = gems  - item.costGems;

    await AsyncStorage.multiSet([
      [STORAGE_KEYS.COINS, newCoins.toString()],
      [STORAGE_KEYS.GEMS,  newGems.toString()],
      [item.storageKey, '1'],
    ]);

    setCoins(newCoins);
    setGems(newGems);
    setOwned((prev) => ({ ...prev, [item.storageKey]: true }));
    setFeedback(`${item.emoji} ${item.name} attivato!`);
    setTimeout(() => setFeedback(null), 2500);
  }, [coins, gems, owned]);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#1244c8', '#1040b8']} style={StyleSheet.absoluteFillObject} />

      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Text style={styles.headerTitle}>{t('shop')}</Text>
        <View style={styles.currencyRow}>
          <View style={styles.currencyPill}>
            <Ionicons name="wallet" size={14} color="#f59e0b" />
            <Text style={styles.currencyValue}>{coins}</Text>
          </View>
          <View style={styles.currencyPill}>
            <Ionicons name="diamond" size={14} color="#06b6d4" />
            <Text style={styles.currencyValue}>{gems}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Feedback toast */}
      {feedback && (
        <Animated.View entering={FadeIn.duration(200)} style={styles.toast}>
          <Text style={styles.toastText}>{feedback}</Text>
        </Animated.View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <Animated.View entering={FadeInDown.delay(80)} style={styles.sectionLabel}>
          <Text style={styles.sectionTitle}>{t('powerUps')}</Text>
          <Text style={styles.sectionSub}>{t('powerUpsSub')}</Text>
        </Animated.View>

        {ITEMS.map((item, i) => {
          const isOwned    = owned[item.storageKey];
          const canAfford  = (item.costCoins === 0 || coins >= item.costCoins) &&
                             (item.costGems  === 0 || gems  >= item.costGems);
          const disabled   = isOwned || !canAfford;

          return (
            <Animated.View key={item.id} entering={FadeInDown.delay(140 + i * 70)}>
              <TouchableOpacity onPress={() => handleBuy(item)} disabled={disabled} activeOpacity={0.85}>
                <View style={[styles.itemCard, disabled && styles.itemCardDisabled]}>
                  <LinearGradient
                    colors={[item.colorDark, '#1244c8']}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <View style={[styles.itemBorder, { borderColor: item.color + (isOwned ? '88' : '33') }]}>
                    <Ionicons name={item.iconName as any} size={38} color={item.color} />
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemName, { color: item.color }]}>{item.name}</Text>
                      <Text style={styles.itemDesc}>{item.description}</Text>
                    </View>
                    {isOwned ? (
                      <View style={[styles.ownedBadge, { borderColor: item.color + '66' }]}>
                        <Text style={[styles.ownedText, { color: item.color }]}>{t('active')}</Text>
                      </View>
                    ) : (
                      <View style={[styles.pricePill, !canAfford && styles.pricePillCantAfford]}>
                        <Ionicons name={item.costCoins > 0 ? 'wallet' : 'diamond'} size={14} color={item.costCoins > 0 ? '#f59e0b' : '#06b6d4'} />
                        <Text style={[styles.priceText, !canAfford && styles.priceTextCantAfford]}>
                          {item.costCoins > 0 ? item.costCoins : item.costGems}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* How to earn */}
        <Animated.View entering={FadeInDown.delay(320)} style={styles.earnCard}>
          <Text style={styles.earnTitle}>{t('howToEarn')}</Text>
          {[
            { iconName: 'trophy', iconColor: '#c9a84c', label: t('win'),  amount: '+20' },
            { iconName: 'people', iconColor: '#f4f4f8', label: t('draw'), amount: '+10' },
            { iconName: 'skull',  iconColor: '#dc2626', label: t('loss'), amount: '+5'  },
          ].map(({ iconName, iconColor, label, amount }) => (
            <View key={label} style={styles.earnRow}>
              <Ionicons name={iconName as any} size={18} color={iconColor} style={{ width: 24 }} />
              <Text style={styles.earnLabel}>{label}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Text style={styles.earnCoins}>{amount}</Text>
                <Ionicons name="wallet" size={13} color="#f59e0b" />
              </View>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)} style={styles.comingSoonCard}>
          <Text style={styles.comingSoonText}>{t('comingSoon')}</Text>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1244c8' },
  scroll: { paddingHorizontal: 16, paddingBottom: 40, gap: 12 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8,
  },
  headerTitle: { color: '#f4f4f8', fontSize: 24, fontWeight: '900' },
  currencyRow: { flexDirection: 'row', gap: 8 },
  currencyPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
  },
  currencyEmoji: { fontSize: 14 },
  currencyValue: { color: '#f4f4f8', fontSize: 14, fontWeight: '800' },

  toast: {
    alignSelf: 'center', marginHorizontal: 20, marginBottom: 8,
    backgroundColor: '#1c2d1c', borderWidth: 1, borderColor: '#22c55e55',
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999,
  },
  toastText: { color: '#22c55e', fontSize: 14, fontWeight: '800' },

  sectionLabel: { gap: 4, paddingTop: 4 },
  sectionTitle: { color: '#f4f4f8', fontSize: 17, fontWeight: '900' },
  sectionSub: { color: '#9ab8ff', fontSize: 12, fontWeight: '500' },

  itemCard: { borderRadius: 18, overflow: 'hidden', marginBottom: 4 },
  itemCardDisabled: { opacity: 0.6 },
  itemBorder: {
    borderWidth: 1, borderRadius: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16,
  },
  itemEmoji: { fontSize: 38 },
  itemInfo: { flex: 1, gap: 5 },
  itemName: { fontSize: 16, fontWeight: '900' },
  itemDesc: { color: '#93b4f5', fontSize: 12, lineHeight: 18 },
  ownedBadge: {
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1,
  },
  ownedText: { fontSize: 12, fontWeight: '900' },
  pricePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#f59e0b18', borderWidth: 1, borderColor: '#f59e0b44',
    paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10,
  },
  pricePillCantAfford: { backgroundColor: '#dc262618', borderColor: '#dc262644' },
  priceEmoji: { fontSize: 14 },
  priceText: { color: '#f59e0b', fontSize: 14, fontWeight: '900' },
  priceTextCantAfford: { color: '#dc2626' },

  earnCard: {
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 18, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)', padding: 16, gap: 10, marginTop: 8,
  },
  earnTitle: { color: '#f4f4f8', fontSize: 15, fontWeight: '800', marginBottom: 4 },
  earnRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  earnIcon: { fontSize: 18, width: 24 },
  earnLabel: { flex: 1, color: '#93b4f5', fontSize: 13, fontWeight: '600' },
  earnCoins: { color: '#f59e0b', fontSize: 13, fontWeight: '800' },

  comingSoonCard: {
    padding: 16, borderRadius: 14,
    backgroundColor: '#06b6d410', borderWidth: 1, borderColor: '#06b6d430',
    alignItems: 'center',
  },
  comingSoonText: { color: '#06b6d4', fontSize: 13, fontWeight: '600', textAlign: 'center' },
});
