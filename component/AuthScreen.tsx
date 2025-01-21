import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "@/utils/firebaseConfig"; // Import the Firebase auth instance
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const AuthEmail: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // For checking initial auth state
  const router = useRouter();

  // Check if the user is logged in when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in, redirect to the main screen
        router.replace("/(tabs)");
      } else {
        // User is not logged in, stop loading
        setIsLoading(false);
      }
    });

    // Cleanup the listener on unmount
    return unsubscribe;
  }, [router]);

  // Handle user registration or login
  const handleAuth = async () => {
    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert("Success", `User registered: ${userCredential.user.email}`);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        Alert.alert("Success", `User logged in: ${userCredential.user.email}`);
        router.push("/(tabs)");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  if (isLoading) {
    // Show a loading spinner while checking the auth state
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? "Register" : "Login"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title={isRegistering ? "Register" : "Login"} onPress={handleAuth} />

      <Text
        style={styles.toggleText}
        onPress={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </Text>
    </View>
  );
};

export default AuthEmail;

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
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  toggleText: {
    marginTop: 15,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
});
