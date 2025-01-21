import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';


interface ShiftDetailsProps {
  shift: {
    name: string;
    description: string;
    duration: string;
    amount: string;
    createdAt?: string; // Optional timestamp
  };
}

export default function ShiftDetails({ shift }: ShiftDetailsProps) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{shift.name}</Text>
          {shift.createdAt && (
            <Text style={styles.date}>{new Date(shift.createdAt).toLocaleDateString()}</Text>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Duration</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{shift.duration} days</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>${shift.amount}</Text>
            </View>
          </View>

          {shift.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>Description</Text>
              <Text style={styles.description}>{shift.description}</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
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
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#64748b',
  },
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  label: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  valueContainer: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  value: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '500',
  },
  descriptionContainer: {
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
    marginTop: 8,
  },
});