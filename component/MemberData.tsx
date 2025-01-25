import type React from "react"
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import type { ProfileData, DetailRowProps, BillDetails } from "@/types/MemberProfile"

const profileData: ProfileData = {
  name: "Me",
  address: "hh",
  contactNumber: "8888888",
  membershipId: "1",
  admissionDate: "2025-01-23",
  gender: "Male",
  plan: {
    name: "g1 (INV1)",
    startDate: "2025-01-23",
    endDate: "2025-02-22",
    planAmount: "2000",
    discount: "0",
    finalAmount: "2000",
    tax: "0/0",
    paidAmount: "600",
    dueAmount: "1400",
  },
}

const billDetails: BillDetails = {
  billDate: "2025-01-23",
  invoiceNo: "INV1",
  paidAmount: "600",
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
)

const GymProfile: React.FC = () => {
  const handleAttendancePress = (): void => {
    // Handle attendance report expansion
  }

  const handleGymPlanPress = (): void => {
    // Handle gym plan button press
  }

  const handleAddOnPlanPress = (): void => {
    // Handle add on plan button press
  }

  const handlePrintBill = (): void => {
    // Handle print bill action
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-24%20at%2018.23.56_cb701d99.jpg-hH7KLmijoz4GPYL2yHMq9v5OuQntR0.jpeg",
          }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>Name</Text>
          <Text style={styles.value}>{profileData.name}</Text>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.value}>{profileData.address}</Text>
          <Text style={styles.label}>Contact Number:</Text>
          <Text style={styles.value}>{profileData.contactNumber}</Text>
        </View>
      </View>

      {/* Details Card */}
      <View style={styles.card}>
        <DetailRow label="Membership ID" value={profileData.membershipId} />
        <DetailRow label="Admission Date" value={profileData.admissionDate} />
        <DetailRow label="Date Of Birth" value="NA" />
        <DetailRow label="Email" value="NA" />
        <DetailRow label="Gender" value={profileData.gender} />
        <DetailRow label="Company:" value="NA" />
        <DetailRow label="Marriage Anniversary" value="NA" />
        <DetailRow label="Home Phone" value="NA" />
        <DetailRow label="Care of (c/o)" value="NA" />
        <DetailRow label="Remark" value="NA" />
      </View>

      {/* Attendance Report */}
      <TouchableOpacity style={styles.reportButton} onPress={handleAttendancePress}>
        <View style={styles.reportButtonContent}>
          <Text style={styles.reportButtonText}>Attendance Report</Text>
          <AntDesign name="down" size={20} color="#00A0E3" />
        </View>
      </TouchableOpacity>

      {/* Documents */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Documents:</Text>
        <Text style={styles.noData}>:( Nothing Found</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.gymPlanButton} onPress={handleGymPlanPress}>
          <Text style={styles.gymPlanButtonText}>GYM Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addOnPlanButton} onPress={handleAddOnPlanPress}>
          <Text style={styles.addOnPlanButtonText}>Add On Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Plan Details */}
      <View style={styles.card}>
        <Text style={styles.planName}>{profileData.plan.name}</Text>
        <View style={styles.planGrid}>
          <View style={styles.planColumn}>
            <Text style={styles.planLabel}>Start Date</Text>
            <Text style={styles.planValue}>{profileData.plan.startDate}</Text>
            <Text style={styles.planLabel}>Plan Amount</Text>
            <Text style={styles.planValue}>{profileData.plan.planAmount}</Text>
            <Text style={styles.planLabel}>Final Amount</Text>
            <Text style={styles.planValue}>{profileData.plan.finalAmount}</Text>
            <Text style={styles.planLabel}>Paid Amount</Text>
            <Text style={styles.planValue}>{profileData.plan.paidAmount}</Text>
          </View>
          <View style={styles.planColumn}>
            <Text style={styles.planLabel}>End Date</Text>
            <Text style={styles.planValue}>{profileData.plan.endDate}</Text>
            <Text style={styles.planLabel}>Discount</Text>
            <Text style={styles.planValue}>{profileData.plan.discount}</Text>
            <Text style={styles.planLabel}>Tax/Enrolment</Text>
            <Text style={styles.planValue}>{profileData.plan.tax}</Text>
            <Text style={[styles.planLabel, styles.dueAmount]}>Due Amount</Text>
            <Text style={[styles.planValue, styles.dueAmount]}>{profileData.plan.dueAmount}</Text>
          </View>
        </View>
      </View>

      {/* Bill Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Bill Date</Text>
          <Text style={styles.tableHeaderCell}>Invoice No.</Text>
          <Text style={styles.tableHeaderCell}>Paid Amount</Text>
          <Text style={styles.tableHeaderCell}>Print Bill</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{billDetails.billDate}</Text>
          <Text style={styles.tableCell}>{billDetails.invoiceNo}</Text>
          <Text style={styles.tableCell}>{billDetails.paidAmount}</Text>
          <TouchableOpacity onPress={handlePrintBill}>
            <Text style={[styles.tableCell, styles.printButton]}>Print</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#00A0E3",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#9DE7BF",
  },
  profileInfo: {
    marginLeft: 20,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    margin: 10,
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    color: "#666",
    flex: 1,
  },
  value: {
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
  reportButton: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  reportButtonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportButtonText: {
    color: "#00A0E3",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  noData: {
    color: "#666",
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  gymPlanButton: {
    backgroundColor: "#00A0E3",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  addOnPlanButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  gymPlanButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  addOnPlanButtonText: {
    color: "#333",
    textAlign: "center",
    fontSize: 16,
  },
  planName: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 15,
  },
  planGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  planColumn: {
    flex: 1,
  },
  planLabel: {
    color: "#00A0E3",
    marginBottom: 5,
  },
  planValue: {
    color: "#333",
    marginBottom: 15,
  },
  dueAmount: {
    color: "#ff0000",
  },
  table: {
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  tableHeaderCell: {
    flex: 1,
    padding: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  tableCell: {
    flex: 1,
    padding: 12,
    textAlign: "center",
  },
  printButton: {
    color: "#00A0E3",
  },
})

export default GymProfile

