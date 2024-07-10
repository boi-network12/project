import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import AuthProvider, { useAuth } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

const MainLayout = () => {
  const {isAuthenticated} = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const [fontsLoaded] = useFonts({
      'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
      'Roboto-Black': require('../assets/fonts/Roboto-Black.ttf'),
      'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
      'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    });

  useEffect(() => {
    // 
    if (typeof isAuthenticated == 'undefined') return

    const inApp = segments[0] == '(app)'
    if (isAuthenticated && !inApp){
      router.replace('home')
    } else if (isAuthenticated === false) {
      router.replace('welcome')
  }
  },[isAuthenticated])

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot/>

}


export default function RootLayout(){
  return (
     
    <ThemeProvider>
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  </ThemeProvider>
  )
}
