import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import Onboarding from '@/component/Onbording';
import { auth } from '@/utils/firebaseConfig';
import { AuthProvider } from '@/hooks/authContext';
import useStore from '@/hooks/store';

export default function Index() {
  const router = useRouter();
  const initializeStore = useStore((state: any) => state.initializeStore);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/(tabs)");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    initializeStore(); // Load persisted state
  }, []);

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <Onboarding />
        <Toast />
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({});
