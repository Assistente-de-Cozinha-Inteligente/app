import { initDatabase } from '@/data/local/initDatabase';
import { useAppBackground } from '@/hooks/use-app-background';
import {
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from '@expo-google-fonts/poppins';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "../global.css";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FAFAFF', // Cor que combina com o gradiente do background
  },
};

function RootLayoutNav() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="buscar" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="editar-perfil" options={{ headerShown: false }} />
        <Stack.Screen name="receita/[id]" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="chat" options={{ headerShown: false, animation: 'fade_from_bottom' }} />
        <Stack.Screen name="oferta-limitada" options={{ headerShown: false }} />
        <Stack.Screen name="paywall" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false, animation: 'fade_from_bottom' }} />
        <Stack.Screen name="registro" options={{ headerShown: false, animation: 'fade_from_bottom' }} />
        <Stack.Screen name="resetar-senha" options={{ headerShown: false }} />
        <Stack.Screen name="adicionar-item-lista" options={{ headerShown: false, animation: 'fade_from_bottom' }} />
        <Stack.Screen name="adicionar-item-inventario" options={{ headerShown: false, animation: 'fade_from_bottom' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Thin': Poppins_100Thin,
    'Poppins-ThinItalic': Poppins_100Thin_Italic,
    'Poppins-ExtraLight': Poppins_200ExtraLight,
    'Poppins-ExtraLightItalic': Poppins_200ExtraLight_Italic,
    'Poppins-Light': Poppins_300Light,
    'Poppins-LightItalic': Poppins_300Light_Italic,
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Italic': Poppins_400Regular_Italic,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-MediumItalic': Poppins_500Medium_Italic,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-SemiBoldItalic': Poppins_600SemiBold_Italic,
    'Poppins-Bold': Poppins_700Bold,
    'Poppins-BoldItalic': Poppins_700Bold_Italic,
    'Poppins-ExtraBold': Poppins_800ExtraBold,
    'Poppins-ExtraBoldItalic': Poppins_800ExtraBold_Italic,
    'Poppins-Black': Poppins_900Black,
    'Poppins-BlackItalic': Poppins_900Black_Italic,
  });

  useEffect(() => {
    async function prepare() {
      try {
        await initDatabase(); // SQLite + migrations + FTS
      } catch (e) {
        console.error('Erro ao iniciar DB', e);
      } finally {
        await SplashScreen.hideAsync();
      }

      if (fontsLoaded || fontError) {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [fontsLoaded, fontError]);

  useAppBackground(() => {
    console.log(
      `Agora vamos sincronizar lista e cozinha`
    );
  });

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#FAFAFF'); // Cor que combina com o gradiente do background
      NavigationBar.setButtonStyleAsync('dark');
    }
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <ThemeProvider value={theme}>
            <RootLayoutNav />
          </ThemeProvider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
