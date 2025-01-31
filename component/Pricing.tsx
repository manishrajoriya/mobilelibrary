import React from "react";
import { View, Text, StyleSheet, Button, Alert, Platform, ScrollView } from "react-native";
import RazorpayCheckout from "react-native-razorpay";

// Replace with your actual Razorpay key
const RAZORPAY_KEY = "rzp_test_Q6S9mNEnK32Xd9";

interface PaymentOptions {
  description: string;
  image: string;
  currency: string;
  key: string;
  amount: number;
  name: string;
  order_id: string;
  prefill: {
    email: string;
    contact: string;
    name: string;
  };
  theme: { color: string };
}

const pricingPlans = [
  {
    id: "basic",
    name: "Basic Plan",
    price: 50000, // 500 INR in paise
    features: ["Feature 1", "Feature 2", "Feature 3"],
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: 100000, // 1000 INR in paise
    features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    price: 150000, // 1500 INR in paise
    features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  },
];

const RazorpayPayment: React.FC = () => {
  const handlePayment = async (amount: number, planName: string) => {
    const options: PaymentOptions = {
      description: `Payment for ${planName}`,
      image: "https://your-company-logo.com/logo.png",
      currency: "INR",
      key: RAZORPAY_KEY,
      amount: amount,
      name: "Your Company Name",
      order_id: `order_${Math.random().toString(36).substring(7)}`, // Generate a random order ID
      prefill: {
        email: "customer@example.com",
        contact: "9876543210",
        name: "John Doe",
      },
      theme: { color: "#F37254" },
    };

    try {
      const data = await RazorpayCheckout.open(options);
      Alert.alert("Success", `Payment ID: ${data.razorpay_payment_id}`);
    } catch (error: any) {
      Alert.alert("Error", error.description || "Payment failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Choose a Plan</Text>
      {pricingPlans.map((plan) => (
        <View key={plan.id} style={styles.planContainer}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planPrice}>₹{plan.price / 100}</Text>
          <View style={styles.featuresContainer}>
            {plan.features.map((feature, index) => (
              <Text key={index} style={styles.featureText}>
                {feature}
              </Text>
            ))}
          </View>
          <Button
            title="Buy Now"
            onPress={() => handlePayment(plan.price, plan.name)}
            color={Platform.OS === "ios" ? "#007AFF" : undefined}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  planContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  planName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  planPrice: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15,
    color: "#007AFF",
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
  },
});

export default RazorpayPayment;