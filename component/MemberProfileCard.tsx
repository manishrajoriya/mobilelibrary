import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  FlatList,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import { getMembers, getLiveMembers, getExpiredMembers } from "@/firebase/functions";
import type { MemberDetails } from "@/types/MemberProfile";
import MemberCard from "./MemberCard";
import { useRouter } from "expo-router";
import { DocumentData, QueryDocumentSnapshot } from "@firebase/firestore";

const MemberProfileCards: React.FC = () => {
  const [members, setMembers] = useState<MemberDetails[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<MemberDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false); // General loading state
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Load more state
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData, DocumentData>>();
  const [hasMore, setHasMore] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "live" | "expired">("all"); // Filter state
  const router = useRouter();

  // Fetch initial members
  const fetchInitialMembers = async () => {
    setIsLoading(true);
    try {
      const { members: newMembers, lastVisibleDoc, hasMore: more } = await getMembers();
      setMembers(newMembers);
      setFilteredMembers(newMembers); // Initialize filtered members with all members
      setLastVisible(lastVisibleDoc);
      setHasMore(more);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch more members when scrolling
  const fetchMoreMembers = async () => {
    if (isLoadingMore || !hasMore) return; // Prevent duplicate calls if already loading or no more items
    setIsLoadingMore(true);
    try {
      const { members: newMembers, lastVisibleDoc, hasMore: more } = await getMembers(5, lastVisible);
      setMembers((prev) => [...prev, ...newMembers]); // Append new members to the existing list
      setFilteredMembers((prev) => [...prev, ...newMembers]); // Update filtered members as well
      setLastVisible(lastVisibleDoc);
      setHasMore(more);
    } catch (error) {
      console.error("Error fetching more members:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Apply filters
  const applyFilter = (filter: "all" | "live" | "expired") => {
    setActiveFilter(filter);
    switch (filter) {
      case "live":
        const liveMembers = members.filter((member) => {
          const expiryDate = new Date(member.expiryDate);
          return expiryDate > new Date(); // Members with expiry date in the future
        });
        setFilteredMembers(liveMembers);
        break;
      case "expired":
        const expiredMembers = members.filter((member) => {
          const expiryDate = new Date(member.expiryDate);
          return expiryDate <= new Date(); // Members with expiry date in the past
        });
        setFilteredMembers(expiredMembers);
        break;
      default:
        setFilteredMembers(members); // Show all members
        break;
    }
  };

  useEffect(() => {
    fetchInitialMembers();
  }, []);

  // Handle member click
  const handleMemberClick = (id: string) => {
    router.push(`/(tabs)/memberData?id=${id}`);
  };

  // Render member card
  const renderItem = ({ item }: { item: MemberDetails }) => (
    <MemberCard member={item} onPress={() => handleMemberClick(item.id)} />
  );

  // Show "No Members" message if no data
  if (!isLoading && filteredMembers.length === 0) {
    return <Text style={styles.noMembersText}>No members found.</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, activeFilter === "all" && styles.activeFilter]}
          onPress={() => applyFilter("all")}
        >
          <Text style={styles.filterText}>All ({members.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, activeFilter === "live" && styles.activeFilter]}
          onPress={() => applyFilter("live")}
        >
          <Text style={styles.filterText}>Live ({members.filter((m) => new Date(m.expiryDate) > new Date()).length})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, activeFilter === "expired" && styles.activeFilter]}
          onPress={() => applyFilter("expired")}
        >
          <Text style={styles.filterText}>Expired ({members.filter((m) => new Date(m.expiryDate) <= new Date()).length})</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Popup */}
      <Modal visible={isLoading || isLoadingMore} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#6B46C1" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </View>
      </Modal>

      {/* Member List */}
      <FlatList
        data={filteredMembers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={fetchMoreMembers} // Trigger when the user scrolls near the bottom
        onEndReachedThreshold={0.5} // Trigger when 50% away from the bottom
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f8f9fa",
  },
  filterButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  activeFilter: {
    backgroundColor: "#6B46C1",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  loader: {
    marginVertical: 20,
  },
  noMembersText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 150,
    elevation: 5,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6B46C1",
  },
});

export default MemberProfileCards;