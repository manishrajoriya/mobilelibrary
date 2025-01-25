import React from 'react';
import { StyleSheet, View } from 'react-native';
import AddMemberForm from '@/component/AddMemberForm';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const AddMemberFormScreen = () => {
  return (
   <SafeAreaProvider>
      <AddMemberForm />
    </SafeAreaProvider>
  );
}



const styles = StyleSheet.create({})

export default AddMemberFormScreen;
