import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const Index = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const profileData = params.id;
    return (
        <View>
            {profileData ? (
                <View>
                    <Text>{profileData}</Text>
                </View>
            ) : (
                <View>
                    <Text>No data available</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({})

export default Index;
