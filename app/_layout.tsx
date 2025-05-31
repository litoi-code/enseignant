import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import SplashScreenComponent from '@/components/SplashScreen';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppStore } from '@/lib/store';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const initializeApp = useAppStore((state) => state.initializeApp);
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const setupApp = async () => {
      if (loaded) {
        try {
          await initializeApp();
          setAppReady(true);
        } catch (error) {
          console.error('Failed to initialize app:', error);
          setAppReady(true); // Still show app even if init fails
        }
      }
    };

    setupApp();
  }, [loaded, initializeApp]);

  const handleSplashFinish = () => {
    setShowSplash(false);
    SplashScreen.hideAsync();
  };

  if (!loaded || !appReady) {
    return null;
  }

  if (showSplash) {
    return <SplashScreenComponent onFinish={handleSplashFinish} />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
