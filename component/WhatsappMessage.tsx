import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";

const WhatsAppMessageScreen: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  const handleSendMessage = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message.");
      return;
    }

    // Format the message for WhatsApp
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

    try {
      // Check if WhatsApp is installed
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "WhatsApp is not installed on your device.");
      }
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
      Alert.alert("Error", "Failed to open WhatsApp.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send Message to WhatsApp</Text>

      {/* Message Input */}
      <TextInput
        placeholder="Enter your message"
        value={message}
        onChangeText={setMessage}
        style={styles.input}
        multiline
        numberOfLines={4}
      />

      {/* Send Button */}
      <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
        <Text style={styles.sendButtonText}>Send via WhatsApp</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
    textAlignVertical: "top", // For multiline input
  },
  sendButton: {
    backgroundColor: "#25D366", // WhatsApp green color
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default WhatsAppMessageScreen;