import React, { useState, useEffect } from "react"
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from "react-native"
import { useRouter } from "expo-router"
import { getMembers } from "@/firebase/functions"
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore"
import useStore from "@/hooks/store"
import * as XLSX from "xlsx"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import { Ionicons } from "@expo/vector-icons"

interface Member {
  id: string
  fullName: string
  dueAmount: number
  totalAmount: number
  paidAmount: number
}

const PAGE_SIZE = 10

export default function MemberPaymentList() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | undefined>(undefined)
  const [hasMore, setHasMore] = useState(true)
  const router = useRouter()

  const currentUser = useStore((state: any) => state.currentUser)
  const activeLibrary = useStore((state: any) => state.activeLibrary)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async (loadMore = false) => {
    if (!loadMore) setLoading(true)
    setError(null)

    try {
      const result = await getMembers({
        pageSize: PAGE_SIZE,
        lastVisible: loadMore ? lastVisible : undefined,
        currentUser: currentUser,
        libraryId: activeLibrary?.id || "",
      })

      setMembers((prevMembers) => (loadMore ? [...prevMembers, ...result.members] : result.members))
      setLastVisible(result.lastVisibleDoc)
      setHasMore(result.hasMore)
    } catch (err) {
      setError("Failed to fetch members. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const renderMemberItem = ({ item }: { item: Member }) => (
    <TouchableOpacity style={styles.memberItem}>
      <Text style={styles.memberName}>{item.fullName}</Text>
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Paid:</Text>
        <Text style={styles.amountValue}>{item.paidAmount}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Due:</Text>
        <Text style={[styles.amountValue, styles.dueAmount]}>{item.dueAmount}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Total:</Text>
        <Text style={styles.amountValue}>{item.totalAmount}</Text>
      </View>
    </TouchableOpacity>
  )

  const renderFooter = () => {
    if (!hasMore) return <Text style={styles.endMessage}>No more members to load</Text>
    if (loading && members.length > 0) return <ActivityIndicator size="large" color="#6B46C1" />
    return null
  }

  const generateExcel = async () => {
    try {
      const ws = XLSX.utils.json_to_sheet(
        members.map((member) => ({
          "Full Name": member.fullName,
          "Paid Amount": member.paidAmount,
          "Due Amount": member.dueAmount,
          "Total Amount": member.totalAmount,
        })),
      )

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Members")

      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" })

      const fileName = FileSystem.documentDirectory + "member_payment_summary.xlsx"
      await FileSystem.writeAsStringAsync(fileName, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      })

      await Sharing.shareAsync(fileName, {
        UTI: ".xlsx",
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      Alert.alert("Success", "Excel file has been generated and shared.")
    } catch (error) {
      console.error("Error generating Excel:", error)
      Alert.alert("Error", "Failed to generate Excel file. Please try again.")
    }
  }

  if (loading && members.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6B46C1" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchMembers()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Member Payment Summary</Text>
        <TouchableOpacity style={styles.downloadButton} onPress={generateExcel}>
          <Ionicons name="download-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={members}
        renderItem={renderMemberItem}
        keyExtractor={(item) => item.id}
        onEndReached={() => hasMore && fetchMembers(true)}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  downloadButton: {
    backgroundColor: "#6B46C1",
    padding: 8,
    borderRadius: 8,
  },
  memberItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memberName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  amountLabel: {
    fontSize: 14,
    color: "#666",
  },
  amountValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  dueAmount: {
    color: "#e53e3e",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#e53e3e",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#6B46C1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  endMessage: {
    textAlign: "center",
    color: "#666",
    padding: 16,
  },
})

