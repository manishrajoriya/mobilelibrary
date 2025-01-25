import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  FlatList,
  View,
  Modal,
} from "react-native";
import { getMembers } from "@/firebase/functions";
import type { MemberDetails } from "@/types/MemberProfile";
import MemberCard from "./MemberCard";
import { useRouter } from "expo-router";
import { DocumentData, QueryDocumentSnapshot } from "@firebase/firestore";

const MemberProfileCards: React.FC = () => {
  const [members, setMembers] = useState<MemberDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false); // General loading state
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Load more state
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData, DocumentData>>();
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  // Fetch initial members
  const fetchInitialMembers = async () => {
    setIsLoading(true);
    try {
      const { members: newMembers, lastVisibleDoc, hasMore: more } = await getMembers();
      setMembers(newMembers);
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
      setLastVisible(lastVisibleDoc);
      setHasMore(more);
    } catch (error) {
      console.error("Error fetching more members:", error);
    } finally {
      setIsLoadingMore(false);
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
  if (!isLoading && members.length === 0) {
    return <Text style={styles.noMembersText}>No members found.</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Loading Popup */}
      <Modal visible={isLoading || isLoadingMore} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#6B46C1" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </View>
      </Modal>

      <FlatList
        data={members}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={fetchMoreMembers} // Trigger when the user scrolls near the bottom
        onEndReachedThreshold={0.5} // Trigger when 50% away from the bottom
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
