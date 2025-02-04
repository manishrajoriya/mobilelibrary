import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const tabsLayout = () => {
  return (
    <Stack >
    <Stack.Screen name="index" options={{ headerShown: false }}/>
    <Stack.Screen name="addMemberForm" options={{ headerTitle: 'Add Member' }} />
    <Stack.Screen name="memberProfileCard" options={{ headerTitle: 'Member Profile' }} />
    {/* <Stack.Screen name="shiftForm" options={{ headerTitle: 'Add Shift' }} />
    <Stack.Screen name="shiftDetails" options={{ headerTitle: 'Shift Details' }} /> */}
    <Stack.Screen name="financeScreen" options={{ headerTitle: 'Finance' }} />
  </Stack>
  )
}

export default tabsLayout