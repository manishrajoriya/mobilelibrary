import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import Onboarding from '@/component/Onbording';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';


export default function Index() {
  const router = useRouter();
  const currentUser = getAuth().currentUser;
  console.log(currentUser);
  if (currentUser?.uid) {
     router.replace('/(tabs)');
  }
  return (
   
   <SafeAreaProvider>
   <Onboarding/>
      <Toast/>
    </SafeAreaProvider>
 
  );
}

const styles = StyleSheet.create({})


