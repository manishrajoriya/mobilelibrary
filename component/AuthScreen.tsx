import type React from "react"
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, type AuthError } from "firebase/auth"
import { auth } from "@/utils/firebaseConfig"
import { useRouter } from "expo-router"

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [isLogin, setIsLogin] = useState<boolean>(true)
  const router = useRouter()

  const handleAuth = async (): Promise<void> => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password)
        router.push("/(tabs)")
        Alert.alert("Success", "Logged in successfully")
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
        router.push("/(tabs)")
        Alert.alert("Success", "Account created successfully")
      }
    } catch (error) {
      const authError = error as AuthError
      Alert.alert("Error", authError.message)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Sign Up"}</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>{isLogin ? "Login" : "Sign Up"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>{isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchText: {
    marginTop: 20,
    color: "#007AFF",
  },
})

export default LoginScreen

