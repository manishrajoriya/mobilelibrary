import React from 'react';
import { StyleSheet, View } from 'react-native';
import MemberProfileCards from '@/component/MemberProfileCard';

const MemberProfileCard = () => {
    return (
        <View style={styles.container}>
            <MemberProfileCards />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Ensures the component takes up full available space
        backgroundColor: '#fff', // Example styling if needed
    },
});

export default MemberProfileCard;
