import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ShiftForm from '@/component/ShiftForm';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Sidebar from '@/component/Sidebar';
import { useRouter } from 'expo-router';


const Index = () => {
  const router = useRouter();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Sidebar />
      
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({})

export default Index;
