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

export default function Index() {
  return (
    
      <NavigationContainer>
        <Sidebar />
      </NavigationContainer>
   
  );
}

const styles = StyleSheet.create({})


