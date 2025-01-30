import { useEffect, useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, type AuthError } from "firebase/auth"
import { auth } from "@/utils/firebaseConfig"
import { useRouter } from "expo-router"
import useStore from "@/hooks/store"



export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()
  const setCurrentUser = useStore((state: any) => state.setCurrentUser);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
      if (user) {
        router.push("/(tabs)")
      }
    })
    return () => unsubscribe()
  }, [auth])

  const validateForm = (): boolean => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address")
      return false
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long")
      return false
    }
    return true
  }

  const handleAuth = async (): Promise<void> => {
    if (!validateForm()) return

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password)
        Alert.alert("Success", "Logged in successfully")
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
        Alert.alert("Success", "Account created successfully")
      }
      router.replace("/(tabs)")
    } catch (error) {
      const authError = error as AuthError
      Alert.alert("Error", isLogin ? "Login failed: " : "Signup failed: " + authError.message)
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
        autoComplete="email"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
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



export const styles = StyleSheet.create({
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

