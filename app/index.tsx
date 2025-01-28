import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import Onboarding from '@/component/Onbording';
import { auth } from '@/utils/firebaseConfig';
import { useRouter } from 'expo-router';


export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/(tabs)")
      }
    })
    return () => unsubscribe()
  }, [auth])

  return (
   
   <SafeAreaProvider>
   <Onboarding/>
      <Toast/>
    </SafeAreaProvider>
 
  );
}

const styles = StyleSheet.create({})


