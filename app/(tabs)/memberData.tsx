import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  ActivityIndicator, 
  Image,
  TouchableOpacity 
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign } from '@expo/vector-icons';
import { getMemberById } from "@/firebase/functions";

interface MemberDetails {
  id: string;
  fullName: string;
  address: string;
  contactNumber: string;
  email: string;
  addmissionDate: Date;
  expiryDate: Date;
  status: string;
  seatNumber: string;
  profileImage: string;
  document: string;
  dueAmount: number;
  totalAmount: number;
  paidAmount: number;
  planId: string;
  plan: string;
}

interface DetailRowProps {
  label: string;
  value: string | number;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value || 'NA'}</Text>
  </View>
);

const MemberDetails: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const memberId = params.id as string | undefined;
  const [member, setMember] = useState<MemberDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAttendance, setShowAttendance] = useState(false);

  const fetchMemberData = async () => {
    try {
      if (memberId) {
        const fetchedMember = await getMemberById({ id: memberId });
        setMember(fetchedMember);
      }
    } catch (error) {
      console.error("Error fetching member data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberData();
  }, [memberId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00A0E3" />
      </View>
    );
  }

  if (!member) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: member.profileImage }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.headerValue}>{member.fullName}</Text>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.headerValue}>{member.address}</Text>
          <Text style={styles.label}>Contact Number:</Text>
          <Text style={styles.headerValue}>{member.contactNumber}</Text>
        </View>
      </View>

      {/* Member Details Card */}
      <View style={styles.card}>
        <DetailRow label="Membership ID" value={member.id} />
        <DetailRow label="Admission Date" value={member.addmissionDate.toDateString()} />
        <DetailRow label="Date Of Birth" value="NA" />
        <DetailRow label="Email" value={member.email} />
        <DetailRow label="Gender" value="Male" />
        <DetailRow label="Company:" value="NA" />
        <DetailRow label="Marriage Anniversary" value="NA" />
        <DetailRow label="Home Phone" value="NA" />
        <DetailRow label="Care of (c/o)" value="NA" />
        <DetailRow label="Remark" value="NA" />
      </View>

      {/* Attendance Report */}
      <TouchableOpacity 
        style={styles.card}
        onPress={() => setShowAttendance(!showAttendance)}
      >
        <View style={styles.reportHeader}>
          <Text style={styles.reportTitle}>Attendance Report</Text>
          <AntDesign 
            name={showAttendance ? "up" : "down"} 
            size={20} 
            color="#00A0E3" 
          />
        </View>
      </TouchableOpacity>

      {/* Documents Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Documents:</Text>
        <Text style={styles.noDataText}>:( Nothing Found</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.gymPlanButton}>
          <Text style={styles.gymPlanButtonText}>GYM Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addOnPlanButton}>
          <Text style={styles.addOnPlanButtonText}>Add On Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Plan Details */}
      <View style={styles.card}>
        <Text style={styles.planName}>{member.plan}</Text>
        <View style={styles.planGrid}>
          <View style={styles.planColumn}>
            <Text style={styles.planLabel}>Start Date</Text>
            <Text style={styles.planValue}>{member.addmissionDate.toDateString()}</Text>
            <Text style={styles.planLabel}>Plan Amount</Text>
            <Text style={styles.planValue}>{member.totalAmount}</Text>
            <Text style={styles.planLabel}>Final Amount</Text>
            <Text style={styles.planValue}>{member.totalAmount}</Text>
            <Text style={styles.planLabel}>Paid Amount</Text>
            <Text style={styles.planValue}>{member.paidAmount}</Text>
          </View>
          <View style={styles.planColumn}>
            <Text style={styles.planLabel}>End Date</Text>
            <Text style={styles.planValue}>{member.expiryDate.toDateString()}</Text>
            <Text style={styles.planLabel}>Discount</Text>
            <Text style={styles.planValue}>0</Text>
            <Text style={styles.planLabel}>Tax/Enrolment</Text>
            <Text style={styles.planValue}>0/0</Text>
            <Text style={[styles.planLabel, styles.dueAmount]}>Due Amount</Text>
            <Text style={[styles.planValue, styles.dueAmount]}>{member.dueAmount}</Text>
          </View>
        </View>
      </View>

      {/* Bill Table */}
      <View style={styles.card}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Bill Date</Text>
            <Text style={styles.tableHeaderCell}>Invoice No.</Text>
            <Text style={styles.tableHeaderCell}>Paid Amount</Text>
            <Text style={styles.tableHeaderCell}>Print Bill</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{member.addmissionDate.toDateString()}</Text>
            <Text style={styles.tableCell}>INV1</Text>
            <Text style={styles.tableCell}>{member.paidAmount}</Text>
            <TouchableOpacity>
              <Text style={[styles.tableCell, styles.printButton]}>Print</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#00A0E3',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#9DE7BF',
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  headerValue: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    margin: 10,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    color: '#666',
    flex: 1,
    fontSize: 14,
  },
  detailValue: {
    color: '#333',
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportTitle: {
    color: '#00A0E3',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  noDataText: {
    color: '#666',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  gymPlanButton: {
    backgroundColor: '#00A0E3',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  addOnPlanButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  gymPlanButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  addOnPlanButtonText: {
    color: '#333',
    textAlign: 'center',
    fontSize: 16,
  },
  planName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 15,
  },
  planGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planColumn: {
    flex: 1,
  },
  planLabel: {
    color: '#00A0E3',
    marginBottom: 5,
    fontSize: 14,
  },
  planValue: {
    color: '#333',
    marginBottom: 15,
    fontSize: 14,
  },
  dueAmount: {
    color: '#ff0000',
  },
  table: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 12,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  tableCell: {
    flex: 1,
    padding: 12,
    textAlign: 'center',
    fontSize: 14,
  },
  printButton: {
    color: '#00A0E3',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MemberDetails;