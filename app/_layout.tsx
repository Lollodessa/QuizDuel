import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { LanguageProvider } from '../src/i18n';

try { SplashScreen.preventAutoHideAsync(); } catch {}

export default function RootLayout() {
  useEffect(() => {
    try { SplashScreen.hideAsync(); } catch {}
  }, []);

  return (
    <LanguageProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0c0c0e' },
          animation: 'fade_from_bottom',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="friend" />
        <Stack.Screen name="matchmaking" />
        <Stack.Screen name="game" options={{ gestureEnabled: false }} />
        <Stack.Screen name="result" options={{ gestureEnabled: false }} />
      </Stack>
    </LanguageProvider>
  );
}
