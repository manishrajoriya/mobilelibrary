import type React from "react";
import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const onboardingData = [
  {
    title: "Welcome to LibraryPal",
    description: "Your personal library management assistant",
    image: "../assets/images/book1.jpg",
  },
  {
    title: "Browse Your Collection",
    description: "Easily manage and browse through your book collection",
    image: "../assets/images/book2.jpg",
  },
  {
    title: "Track Your Reading",
    description: "Set reading goals and track your progress",
    image: "../assets/images/book3.jpg",
  },
  {
    title: "Discover New Books",
    description: "Get personalized book recommendations",
    image: "../assets/images/book4.jpg",
  },
];

const OnboardingSlide: React.FC<{
  item: typeof onboardingData[0];
  index: number;
  scrollX: Animated.SharedValue<number>;
}> = ({ item, index, scrollX }) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const imageStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5]);
    const opacity = interpolate(scrollX.value, inputRange, [0, 1, 0]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollX.value, inputRange, [height / 2, 0, -height / 2]);
    const opacity = interpolate(scrollX.value, inputRange, [0, 1, 0]);
    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  return (
    <View style={[styles.slide, { width }]}>
      <Animated.Image source={{ uri: item.image }} style={[styles.image, imageStyle]} />
      <Animated.View style={[styles.textContainer, textStyle]}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    </View>
  );
};

const PaginationDots: React.FC<{
  data: typeof onboardingData;
  scrollX: Animated.SharedValue<number>;
}> = ({ data, scrollX }) => {
  return (
    <View style={styles.pagination}>
      {data.map((_, index) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

        const dotStyle = useAnimatedStyle(() => {
          const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3]);
          const scale = interpolate(scrollX.value, inputRange, [0.7, 1, 0.7]);
          return {
            opacity,
            transform: [{ scale }],
          };
        });

        return (
          <Animated.View key={index} style={[styles.paginationDot, dotStyle]} />
        );
      })}
    </View>
  );
};

const OnboardingButtons: React.FC<{
  currentIndex: number;
  onNext: () => void;
  onSkip: () => void;
  onGetStarted: () => void;
}> = ({ currentIndex, onNext, onSkip, onGetStarted }) => {
  return (
    <View style={styles.buttonContainer}>
      {currentIndex < onboardingData.length - 1 ? (
        <>
          <TouchableOpacity onPress={onSkip} style={styles.button}>
            <Text style={styles.buttonText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onNext} style={[styles.button, styles.nextButton]}>
            <Text style={[styles.buttonText, styles.nextButtonText]}>Next</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity onPress={onGetStarted} style={[styles.button, styles.getStartedButton]}>
          <Text style={[styles.buttonText, styles.getStartedText]}>Get Started</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const Onboarding: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      scrollX.value = withTiming(nextIndex * width);
    }
  };

  const handleSkip = () => {
    const lastIndex = onboardingData.length - 1;
    setCurrentIndex(lastIndex);
    flatListRef.current?.scrollToIndex({ index: lastIndex, animated: true });
    scrollX.value = withTiming(lastIndex * width);
  };

  const handleGetStarted = () => {
    router.push("/auth");
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Animated.FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={({ item, index }) => (
          <OnboardingSlide item={item} index={index} scrollX={scrollX} />
        )}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />
      <View style={styles.bottomContainer}>
        <PaginationDots data={onboardingData} scrollX={scrollX} />
        <OnboardingButtons
          currentIndex={currentIndex}
          onNext={handleNext}
          onSkip={handleSkip}
          onGetStarted={handleGetStarted}
        />
      </View>
    </View>
  );
};

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
    backgroundColor: "#333",
    marginHorizontal: 5,
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
    width: "100%",
  },
  getStartedText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Onboarding;