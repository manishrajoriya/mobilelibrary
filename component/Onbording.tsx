import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StatCard = ({ icon, title, value, color }: { icon: any; title: string; value: string; color: string }) => (
  <View style={styles.card}>
    <View style={[styles.iconContainer, { backgroundColor: `${color}10` }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

export default function MembersDashboard() {
  const stats = [
    { icon: 'people', title: 'Total Members', value: '5', color: '#4285F4' },
    { icon: 'people', title: 'Live Members', value: '5', color: '#34A853' },
    { icon: 'person-remove', title: 'Inactive Members', value: '0', color: '#EA4335' },
    { icon: 'card', title: 'Total Amount', value: '2600', color: '#4285F4' },
    { icon: 'cash', title: 'Paid Amount', value: '1800', color: '#9C27B0' },
    { icon: 'time', title: 'Due Amount', value: '800', color: '#FB8C00' },
    { icon: 'trending-up', title: 'Total Expense', value: '1200', color: '#34A853' },
    { icon: 'stats-chart', title: 'P&L', value: '600', color: '#EA4335' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Ionicons name="desktop-outline" size={24} color="#34A853" />
          </View>
          <Text style={styles.profileName}>Manish Rajoriya</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="chevron-down" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addMemberButton}>
        <View style={styles.addIcon}>
          <Ionicons name="add" size={24} color="#666" />
        </View>
        <Text style={styles.addMemberText}>Add Member</Text>
      </TouchableOpacity>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0f2e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  addIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addMemberText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    width: '45%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
});