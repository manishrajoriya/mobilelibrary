import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import AddMemberForm from '@/component/AddMemberForm';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const AddMemberFormScreen = () => {
  return (
   <ScrollView>
      <AddMemberForm />
    </ScrollView>
  );
}



const styles = StyleSheet.create({})

export default AddMemberFormScreen;
