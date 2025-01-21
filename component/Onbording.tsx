import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native"
import { StatusBar } from "expo-status-bar"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from "react-native-reanimated"
import { useRouter } from "expo-router"


const { width, height } = Dimensions.get("window")

const onboardingData = [
  {
    title: "Welcome to LibraryPal",
    description: "Your personal library management assistant",
    image: "https://example.com/library-pal-logo.png",
  },
  {
    title: "Browse Your Collection",
    description: "Easily manage and browse through your book collection",
    image: "https://example.com/browse-books.png",
  },
  {
    title: "Track Your Reading",
    description: "Set reading goals and track your progress",
    image: "https://example.com/track-reading.png",
  },
  {
    title: "Discover New Books",
    description: "Get personalized book recommendations",
    image: "https://example.com/discover-books.png",
  },
]

const Onboarding: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollX = useSharedValue(0)
  const router = useRouter()

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1)
      scrollX.value = withTiming((currentIndex + 1) * width)
    }
  }

  const handleSkip = () => {
    setCurrentIndex(onboardingData.length - 1)
    scrollX.value = withTiming((onboardingData.length - 1) * width)
  }

  const handleGetStarted = () => {
    // Navigate to the main app or login screen
    router.push("/auth")
    console.log("Get Started")
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {onboardingData.map((item, index) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width]

        const imageStyle = useAnimatedStyle(() => {
          const scale = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5])
          const opacity = interpolate(scrollX.value, inputRange, [0, 1, 0])
          return {
            transform: [{ scale }],
            opacity,
          }
        })

        const textStyle = useAnimatedStyle(() => {
          const translateY = interpolate(scrollX.value, inputRange, [height / 2, 0, -height / 2])
          const opacity = interpolate(scrollX.value, inputRange, [0, 1, 0])
          return {
            transform: [{ translateY }],
            opacity,
          }
        })

        return (
          <Animated.View style={[styles.slide, { width }]} key={index}>
            <Animated.Image source={{ uri: item.image }} style={[styles.image, imageStyle]} />
            <Animated.View style={[styles.textContainer, textStyle]}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </Animated.View>
          </Animated.View>
        )
      })}
      <View style={styles.bottomContainer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View key={index} style={[styles.paginationDot, index === currentIndex && styles.paginationDotActive]} />
          ))}
        </View>
        {currentIndex < onboardingData.length - 1 ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleSkip} style={styles.button}>
              <Text style={styles.buttonText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext} style={[styles.button, styles.nextButton]}>
              <Text style={[styles.buttonText, styles.nextButtonText]}>Next</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleGetStarted} style={[styles.button, styles.getStartedButton]}>
            <Text style={[styles.buttonText, styles.getStartedText]}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: "contain",
  },
  textContainer: {
    alignItems: "center",
    marginTop: 20,
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
    paddingHorizontal: 20,
    color: "#666",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#333",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
  },
  nextButton: {
    backgroundColor: "#333",
  },
  nextButtonText: {
    color: "#fff",
  },
  getStartedButton: {
    backgroundColor: "#333",
    paddingVertical: 15,
    alignItems: "center",
  },
  getStartedText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default Onboarding

