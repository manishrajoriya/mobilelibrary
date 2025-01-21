import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ShiftForm from '@/component/ShiftForm';
import ShiftDetails from '@/component/ShiftDetails';
import AddMemberForm from '@/component/AddMemberForm';
import MemberProfileCard from '@/component/MemberProfileCard';
import MemberDashbord from '@/component/MemberDashbord';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import Sidebar from '@/component/Sidebar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Onboarding from '@/component/Onbording';

export default function Index() {
  return (
   
   <SafeAreaProvider>
      <Onboarding />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({})


