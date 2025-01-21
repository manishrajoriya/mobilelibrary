import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';

interface MemberDetails {
  name: string;
  initials: string;
  location: string;
  phone: string;
  id: number;
  seat: number;
  status: 'ACTIVE' | 'INACTIVE';
  plan: string;
  joinDate: string;
  endDate: string;
  finalAmount: number;
  paidAmount: number;
  dueAmount: number;
}

interface ActionButtonProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Feather name={icon} size={20} color="#555" />
    <Text style={styles.actionButtonText}>{label}</Text>
  </TouchableOpacity>
);

const MemberProfileCard: React.FC = () => {
  const member: MemberDetails = {
    name: "Manish Rajoriya",
    initials: "MR",
    location: "Lotwara dausa Rajasthan",
    phone: "3121286800",
    id: 46,
    seat: 7,
    status: "ACTIVE",
    plan: "m2",
    joinDate: "11/30/2024",
    endDate: "12/30/2024",
    finalAmount: 600,
    paidAmount: 400,
    dueAmount: 200
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{member.initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{member.name}</Text>
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={16} color="#666" />
              <Text style={styles.locationText}>{member.location}</Text>
            </View>
            <View style={styles.phoneRow}>
              <MaterialIcons name="phone" size={16} color="#666" />
              <Text style={styles.phoneText}>{member.phone}</Text>
            </View>
          </View>
        </View>
        <View style={styles.statusSection}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{member.status}</Text>
          </View>
          <Text style={styles.idText}>ID: {member.id}</Text>
          <Text style={styles.seatText}>Seat: {member.seat}</Text>
        </View>
      </View>

      <View style={styles.planSection}>
        <View style={styles.planItem}>
          <Text style={styles.planLabel}>Plan</Text>
          <Text style={styles.planValue}>{member.plan}</Text>
        </View>
        <View style={styles.planItem}>
          <Text style={styles.planLabel}>Join Date</Text>
          <Text style={styles.planValue}>{member.joinDate}</Text>
        </View>
        <View style={styles.planItem}>
          <Text style={styles.planLabel}>End Date</Text>
          <Text style={styles.planValue}>{member.endDate}</Text>
        </View>
      </View>

      <View style={styles.amountSection}>
        <View style={styles.amountItem}>
          <Text style={styles.amountLabel}>Final Amount</Text>
          <Text style={styles.finalAmount}>${member.finalAmount}</Text>
        </View>
        <View style={styles.amountItem}>
          <Text style={styles.amountLabel}>Paid Amount</Text>
          <Text style={styles.paidAmount}>${member.paidAmount}</Text>
        </View>
        <View style={styles.amountItem}>
          <Text style={styles.amountLabel}>Due Amount</Text>
          <Text style={styles.dueAmount}>${member.dueAmount}</Text>
        </View>
      </View>

      <View style={styles.actionSection}>
        <ActionButton icon="edit-2" label="Edit" onPress={() => {}} />
        <ActionButton icon="plus" label="Add Pay" onPress={() => {}} />
        <ActionButton icon="refresh-ccw" label="Renew" onPress={() => {}} />
        <ActionButton icon="file-plus" label="Add Bill" onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatarSection: {
    flexDirection: 'row',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6B46C1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  phoneText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  statusSection: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    backgroundColor: '#E9D5FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    color: '#6B46C1',
    fontWeight: '600',
    fontSize: 12,
  },
  idText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 2,
  },
  seatText: {
    color: '#666',
    fontSize: 14,
  },
  planSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  planItem: {
    alignItems: 'center',
  },
  planLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  planValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  amountSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  amountItem: {
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  finalAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  paidAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#059669',
  },
  dueAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC2626',
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginHorizontal: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
});

export default MemberProfileCard;