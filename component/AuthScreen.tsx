import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../utils/firebaseConfig"; // Import the Firebase auth instance
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

// Custom hook for Firebase auth logic
const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/(tabs)");
      } else {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, [router]);

  const handleRegister = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", `User registered: ${userCredential.user.email}`);
    } catch (error: any) {
      Alert.alert("Error", getFriendlyErrorMessage(error.code));
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", `User logged in: ${userCredential.user.email}`);
      router.push("/(tabs)");
    } catch (error: any) {
      Alert.alert("Error", getFriendlyErrorMessage(error.code));
    }
  };

  const getFriendlyErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/email-already-in-use":
        return "This email is already in use.";
      case "auth/user-not-found":
        return "No user found with this email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  return { isLoading, handleRegister, handleLogin };
};

const AuthForm: React.FC<{
  email: string;
  password: string;
  isRegistering: boolean;
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}> = ({ email, password, isRegistering, onEmailChange, onPasswordChange, onSubmit, isSubmitting }) => (
  <View style={styles.formContainer}>
    <TextInput
      style={styles.input}
      placeholder="Email"
      keyboardType="email-address"
      autoCapitalize="none"
      value={email}
      onChangeText={onEmailChange}
      accessibilityLabel="Email input"
    />

    <TextInput
      style={styles.input}
      placeholder="Password"
      secureTextEntry
      value={password}
      onChangeText={onPasswordChange}
      accessibilityLabel="Password input"
    />

    <Button
      title={isRegistering ? "Register" : "Login"}
      onPress={onSubmit}
      disabled={isSubmitting || !email || !password}
      accessibilityLabel={isRegistering ? "Register button" : "Login button"}
    />
  </View>
);

const AuthToggle: React.FC<{
  isRegistering: boolean;
  onToggle: () => void;
}> = ({ isRegistering, onToggle }) => (
  <TouchableOpacity onPress={onToggle} style={styles.toggleContainer}>
    <Text style={styles.toggleText}>
      {isRegistering
        ? "Already have an account? Login"
        : "Don't have an account? Register"}
    </Text>
  </TouchableOpacity>
);

const AuthEmail: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoading, handleRegister, handleLogin } = useAuth();

  const handleAuth = async () => {
    setIsSubmitting(true);
    if (isRegistering) {
      await handleRegister(email, password);
    } else {
      await handleLogin(email, password);
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? "Register" : "Login"}</Text>

      <AuthForm
        email={email}
        password={password}
        isRegistering={isRegistering}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleAuth}
        isSubmitting={isSubmitting}
      />

      <AuthToggle
        isRegistering={isRegistering}
        onToggle={() => setIsRegistering(!isRegistering)}
      />
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
  formContainer: {
    width: "100%",
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
  toggleContainer: {
    marginTop: 15,
  },
  toggleText: {
    color: "#007BFF",
    textDecorationLine: "underline",
  },
});