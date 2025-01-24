import React, { useState } from "react"
import { View, TextInput, Button, StyleSheet, Text } from "react-native"
import { useAuth } from "@/firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"

export function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { signIn, signUp } = useAuth()

  const handleSignIn = async () => {
    try {
      await signIn(email, password)
    } catch (error) {
      setError("Failed to sign in")
    }
  }

  const handleSignUp = async () => {
    try {
      await signUp(email, password)
      await AsyncStorage.removeItem("onboardingCompleted")
    } catch (error) {
      setError("Failed to sign up")
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign In" onPress={handleSignIn} />
      <Button title="Sign Up" onPress={handleSignUp} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  error: {
    color: "red",
    marginTop: 12,
  },
})

