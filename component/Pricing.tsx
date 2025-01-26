import type React from "react"
import { Button, Alert, Platform } from "react-native"
import RazorpayCheckout from "react-native-razorpay"

// Replace with your actual Razorpay key
const RAZORPAY_KEY = "rzp_test_Q6S9mNEnK32Xd9"

interface PaymentOptions {
  description: string
  image: string
  currency: string
  key: string
  amount: number
  name: string
  order_id: string
  prefill: {
    email: string
    contact: string
    name: string
  }
  theme: { color: string }
}

const RazorpayPayment: React.FC = () => {
  const handlePayment = async () => {
    const options: PaymentOptions = {
      description: "Sample Payment",
      image: "https://your-company-logo.com/logo.png",
      currency: "INR",
      key: RAZORPAY_KEY,
      amount: 50000, // amount in paise (500 INR)
      name: "Your Company Name",
      order_id: "order_123",
      prefill: {
        email: "customer@example.com",
        contact: "9876543210",
        name: "John Doe",
      },
      theme: { color: "#F37254" },
    }

    try {
      const data = await RazorpayCheckout.open(options)
      Alert.alert("Success", `Payment ID: ${data.razorpay_payment_id}`)
    } catch (error:any) {
      Alert.alert("Error", error.description || "Payment failed")
    }
  }

  return (
    <Button title="Pay with Razorpay" onPress={handlePayment} color={Platform.OS === "ios" ? "#007AFF" : undefined} />
  )
}

export default RazorpayPayment

