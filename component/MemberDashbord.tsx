import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { totalMemberCount, liveMemberCount, InactiveMemberCount } from '@/firebase/functions';
import { useRouter } from 'expo-router';
const StatCard = ({ icon, title, value, color, style, onPress }: { icon: any; title: string; value: number; color: string; style: any; onPress: () => void }) => (
  <View style={[styles.card, style]}>
    <View style={[styles.iconContainer, { backgroundColor: `${color}10` }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <TouchableOpacity onPress={onPress}>
    <Text style={styles.cardTitle}>{title}</Text>
    </TouchableOpacity>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

export default function MembersDashboard() {
  const [member, setMember] = useState<number>(0);
  const [liveMember, setLiveMember] = useState<number>(0);
  const [inactiveMember, setInactiveMember] = useState<number>(0);

  const router = useRouter();

useEffect(() => {
  const fetchMemberCount = async () => {
    const count = await totalMemberCount();
    setMember(count);

    const liveCount = await liveMemberCount();
    setLiveMember(liveCount);

    const inactiveCount = await InactiveMemberCount();
    setInactiveMember(inactiveCount);

  };
  fetchMemberCount();
}, []);


  const stats = [
    { icon: 'people', title: 'Total Members', value: member, color: '#4285F4' , style: {backgroundColor: '#fff'}, onPress: () => {router.push('/(tabs)/memberProfileCard')} },
    { icon: 'people', title: 'Live Members', value: liveMember, color: '#34A853', style: {backgroundColor: '#fff'}, onPress: () => {router.push('/(tabs)/memberProfileCard')} },
    { icon: 'person-remove', title: 'Inactive Members', value: inactiveMember, color: '#EA4335', style: {backgroundColor: '#fff'}, onPress: () => {router.push('/(tabs)/memberProfileCard')} },
    { icon: 'card', title: 'Total Amount', value: 2600, color: '#4285F4', style: {backgroundColor: '#fff'}, onPress: () => {router.push('/(tabs)/memberProfileCard')} },
    { icon: 'cash', title: 'Paid Amount', value: 1800, color: '#9C27B0', style: {backgroundColor: '#fff'}, onPress: () => {router.push('/(tabs)/memberProfileCard')} },
    { icon: 'time', title: 'Due Amount', value: 800, color: '#FB8C00', style: {backgroundColor: '#fff'}, onPress: () => {router.push('/(tabs)/memberProfileCard')} },
    { icon: 'trending-up', title: 'Total Expense', value: 1200, color: '#34A853', style: {backgroundColor: '#fff'}, onPress: () => {router.push('/(tabs)/financeScreen')} },
    { icon: 'stats-chart', title: 'P&L', value: 600, color: '#EA4335', style: {backgroundColor: '#fff'}, onPress: () => {router.push('/(tabs)/financeScreen')} },
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

      <TouchableOpacity style={styles.addMemberButton} onPress={() => {router.push('/(tabs)/addMemberForm')}}>
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
    // backgroundColor: '#e0f2e9',
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