import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native"
import { getPlans } from "@/firebase/functions"

type PlanDetailsProps = {
  id: string
  name: string
  description: string
  duration: string
  amount: string
  createdAt?: string
}

export default function AllPlans() {
  const [plans, setPlans] = useState<PlanDetailsProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansData = await getPlans()
        setPlans(plansData)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch plans. Please try again later.")
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {plans.map((plan) => (
        <View key={plan.id} style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{plan.name}</Text>
            {plan.createdAt && <Text style={styles.date}>{new Date(plan.createdAt).toLocaleDateString()}</Text>}
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Duration</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{plan.duration} Days</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Amount</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>₹{plan.amount}</Text>
              </View>
            </View>

            {plan.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.label}>Description</Text>
                <Text style={styles.description}>{plan.description}</Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#64748b",
  },
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  label: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  valueContainer: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  value: {
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "500",
  },
  descriptionContainer: {
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: "#334155",
    lineHeight: 24,
    marginTop: 8,
  },
})

