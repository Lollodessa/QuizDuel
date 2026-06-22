import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const { width } = Dimensions.get('window');

const TABS = [
  { name: 'index', label: 'Home',  icon: 'home'    },
  { name: 'clans', label: 'Clan',  icon: 'people'  },
  { name: 'shop',  label: 'Shop',  icon: 'diamond' },
];

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom || 12 }]}>
      {state.routes.map((route, index) => {
        const tab = TABS.find((t) => t.name === route.name);
        if (!tab) return null;
        const isFocused = state.index === index;

        const handlePress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <TabItem
            key={route.key}
            label={tab.label}
            icon={tab.icon}
            isFocused={isFocused}
            onPress={handlePress}
          />
        );
      })}
    </View>
  );
}

function TabItem({
  label, icon, isFocused, onPress,
}: {
  label: string; icon: string; isFocused: boolean; onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(isFocused ? 1 : 0);

  const handlePressIn = () => { scale.value = withSpring(0.88, { damping: 10 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 10 }); };

  glowOpacity.value = withTiming(isFocused ? 1 : 0, { duration: 200 });

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View style={[styles.tabItemInner, animStyle]}>
        <Animated.View style={[styles.activeGlow, glowStyle]} />
        <Ionicons name={icon as any} size={22} color={isFocused ? '#ffffff' : 'rgba(255,255,255,0.5)'} />
        <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="clans" />
      <Tabs.Screen name="shop" />
      <Tabs.Screen name="characters" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1244c8',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabItemInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    position: 'relative',
  },
  activeGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: '#ffffff',
  },
});
