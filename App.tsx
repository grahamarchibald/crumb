import {
  Newsreader_400Regular,
  Newsreader_500Medium,
  Newsreader_600SemiBold,
} from '@expo-google-fonts/newsreader';
import {
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
} from '@expo-google-fonts/nunito-sans';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import BuilderScreen from './src/screens/BuilderScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import { useStore } from './src/store/useStore';
import { C } from './src/theme/tokens';

export default function App() {
  const [fontsLoaded] = useFonts({
    Newsreader_400Regular,
    Newsreader_500Medium,
    Newsreader_600SemiBold,
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
  });
  const screen = useStore((s) => s.screen);

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: C.screen }} />;

  return (
    <View style={{ flex: 1, backgroundColor: C.screen }}>
      <StatusBar style="dark" />
      {screen === 'builder' ? <BuilderScreen /> : <LibraryScreen />}
    </View>
  );
}
