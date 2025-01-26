import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

import { auth } from '../utils/firebaseConfig';
import PhoneInput from 'react-native-phone-number-input';
import { signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
const App = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [otp, setOtp] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Request OTP
  const sendOtp = async () => {
    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber);
      setVerificationId(confirmation.verificationId);
      Alert.alert('OTP sent', 'Please check your SMS for the OTP.');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (verificationId && otp.length === 6) {
      try {
        const credential = PhoneAuthProvider.credential(verificationId, otp);
        await signInWithCredential(auth,credential);
        setIsAuthenticated(true);
        Alert.alert('Success', 'You are now authenticated!');
      } catch (error: any) {
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.alert('Error', 'Please enter a valid OTP.');
    }
  };

  return (
    <View style={styles.container}>
      {!isAuthenticated ? (
        <View>
          {verificationId ? (
            // Enter OTP Screen
            <>
              <Text style={styles.label}>Enter OTP</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                keyboardType="numeric"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
              />
              <Button title="Verify OTP" onPress={verifyOtp} />
            </>
          ) : (
            // Enter Phone Number Screen
            <>
              <PhoneInput
                defaultValue={phoneNumber}
                defaultCode="US"
                layout="first"
                onChangeFormattedText={(text: string) => setPhoneNumber(text)}
                withShadow
                autoFocus
              />
              <Button title="Send OTP" onPress={sendOtp} />
            </>
          )}
        </View>
      ) : (
        // Authenticated Screen
        <View>
          <Text style={styles.successText}>You are authenticated!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  successText: {
    fontSize: 18,
    color: 'green',
    textAlign: 'center',
  },
});

export default App;
