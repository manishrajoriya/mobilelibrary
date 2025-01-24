import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import { useRouter } from "expo-router"

const onboardingSteps = [
  {
    title: "Welcome to Our App",
    description: "Discover amazing features and boost your productivity.",
    image: "https://via.placeholder.com/300",
  },
  {
    title: "Seamless Integration",
    description: "Connect with your favorite tools and services effortlessly.",
    image: "https://via.placeholder.com/300",
  },
  {
    title: "Stay Organized",
    description: "Keep track of your tasks and projects with ease.",
    image: "https://via.placeholder.com/300",
  },
]

export function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0)
  const navigation = useNavigation()
  const router = useRouter()

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleFinish()
    }
  }

  const handleFinish = async () => {
    await AsyncStorage.setItem("onboardingCompleted", "true")
    router.replace("/(tabs)/memberProfileCard")
  }

  const currentOnboardingStep = onboardingSteps[currentStep]

  return (
    <View style={styles.container}>
      <Image source={{ uri: currentOnboardingStep.image }} style={styles.image} />
      <Text style={styles.title}>{currentOnboardingStep.title}</Text>
      <Text style={styles.description}>{currentOnboardingStep.description}</Text>
      <View style={styles.dotContainer}>
        {onboardingSteps.map((_, index) => (
          <View key={index} style={[styles.dot, index === currentStep ? styles.activeDot : null]} />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>{currentStep === onboardingSteps.length - 1 ? "Get Started" : "Next"}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  dotContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#007AFF",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

