import type React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

interface Feature {
  readonly name: string;
  readonly included: boolean;
}

interface PricingTier {
  readonly name: string;
  readonly price: string;
  readonly features: Feature[];
}

interface PricingTierProps {
  readonly tier: PricingTier;
  readonly isPopular?: boolean;
}

const PricingTier: React.FC<PricingTierProps> = (({ tier, isPopular }) => (
  <View style={StyleSheet.flatten([styles.tierContainer, isPopular && styles.popularTier])}>
    {isPopular && (
      <Text style={styles.popularBadge} accessibilityLabel="Most Popular Plan">
        Most Popular
      </Text>
    )}
    <Text style={styles.tierName}>{tier.name}</Text>
    <Text style={styles.tierPrice}>{tier.price}</Text>
    <View style={styles.featuresContainer}>
      {tier.features.map((feature, index) => (
        <Text
          key={index}
          style={StyleSheet.flatten([styles.feature, !feature.included && styles.featureDisabled])}
          accessibilityLabel={`${feature.name} is ${feature.included ? "included" : "not included"}`}
        >
          {feature.included ? "✓" : "✗"} {feature.name}
        </Text>
      ))}
    </View>
    <TouchableOpacity style={styles.button} accessibilityRole="button">
      <Text style={styles.buttonText}>Choose Plan</Text>
    </TouchableOpacity>
  </View>
));

const PricingSection: React.FC = () => {
  const pricingTiers: PricingTier[] = [
    {
      name: "Basic",
      price: "$9.99/mo",
      features: [
        { name: "Feature 1", included: true },
        { name: "Feature 2", included: true },
        { name: "Feature 3", included: false },
        { name: "Feature 4", included: false },
      ],
    },
    {
      name: "Pro",
      price: "$19.99/mo",
      features: [
        { name: "Feature 1", included: true },
        { name: "Feature 2", included: true },
        { name: "Feature 3", included: true },
        { name: "Feature 4", included: false },
      ],
    },
    {
      name: "Enterprise",
      price: "$39.99/mo",
      features: [
        { name: "Feature 1", included: true },
        { name: "Feature 2", included: true },
        { name: "Feature 3", included: true },
        { name: "Feature 4", included: true },
      ],
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Choose Your Plan
      </Text>
      {pricingTiers.map((tier, index) => (
        <PricingTier key={tier.name} tier={tier} isPopular={index === 1} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  tierContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  popularTier: {
    borderColor: "#007bff",
    borderWidth: 2,
  },
  popularBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#007bff",
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
  },
  tierName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tierPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 15,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  feature: {
    fontSize: 16,
    marginBottom: 5,
  },
  featureDisabled: {
    color: "#999",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PricingSection;