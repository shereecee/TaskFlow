import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message'; // 1. Import the global toast controller

import { useColorScheme } from '@/hooks/use-color-scheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      {/* Navigation Stack Tree */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Drops down into your app/(tabs)/_layout.tsx configuration */}
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      
      {/* Dynamic Status Bar Styling */}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* 🚀 2. Global Toast Layer Mount (Allows self-dismissing alerts to float over everything) */}
      <Toast />
    </>
  );
}