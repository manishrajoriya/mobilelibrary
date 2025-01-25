import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MemberProfileCards from '@/component/MemberProfileCard';
import { useRouter, useLocalSearchParams } from 'expo-router';

const MemberProfileCard = () => {

    return (
        <>
       
        <MemberProfileCards/>
        </>
    );
}

const styles = StyleSheet.create({})

export default MemberProfileCard;
