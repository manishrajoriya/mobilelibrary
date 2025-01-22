import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import Onboarding from '@/component/Onbording';

export default function Index() {
  return (
   
   <SafeAreaProvider>
      <Onboarding />
      <Toast/>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({})


