import React from 'react';
import { StyleSheet, View } from 'react-native';
import AddMemberForm from '@/component/AddMemberForm';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';

const AddMemberFormScreen = () => {
    return (
         <>
           <AddMemberForm/>
         </>
    );
}

const styles = StyleSheet.create({})

export default AddMemberFormScreen;
