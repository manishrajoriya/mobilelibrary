import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { auth } from "../utils/firebaseConfig"; // Import Firebase auth
import { signOut, User } from "firebase/auth";
import { useRouter } from "expo-router";
import useStore from "@/hooks/store";

const LogoutScreen = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  const router = useRouter();
  const currentUser = useStore((state: any) => state.currentUser);
  const clearCurrentUser = useStore((state: any) => state.clearCurrentUser);
  const clearActiveLibrary = useStore((state: any) => state.clearActiveLibrary);
  useEffect(() => {
    setUser(currentUser); // Get logged-in user
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      clearCurrentUser();
      clearActiveLibrary();
      router.replace("/auth"); // Navigate to Login screen after logout
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Logout</Text>

      {user && (
        <Text style={styles.userInfo}>Logged in as: {user.email}</Text>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Logout</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default LogoutScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  userInfo: { fontSize: 16, marginBottom: 20 },
  logoutButton: { backgroundColor: "red", padding: 15, borderRadius: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
