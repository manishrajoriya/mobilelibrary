import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth/index" />
      <Stack.Screen name="index" />
       
      <Stack.Screen name="(tabs)/index" />

    </Stack>
  )
}