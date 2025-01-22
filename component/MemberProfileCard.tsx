import type React from "react"
import { useEffect, useState, useCallback, useRef } from "react"
import { ActivityIndicator, StyleSheet, Text, FlatList } from "react-native"
import { getMembers } from "@/firebase/functions"
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore"
import MemberCard from "./MemberCard"
import type { MemberDetails } from "@/types/MemberProfile"

const MemberProfileCards: React.FC = () => {
  const [members, setMembers] = useState<MemberDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const flatListRef = useRef<FlatList<MemberDetails>>(null)

  const fetchMembers = useCallback(
    async (lastVisibleDoc?: QueryDocumentSnapshot<DocumentData>) => {
      if (!hasMore && lastVisibleDoc) return

      setIsLoading(true)
      try {
        const {
          members: newMembers,
          lastVisibleDoc: newLastVisible,
          hasMore: newHasMore,
        } = await getMembers(lastVisibleDoc)

        if (lastVisibleDoc) {
          setMembers((prev) => [...prev, ...newMembers])
        } else {
          setMembers(newMembers)
        }

        setLastVisible(newLastVisible || null)
        setHasMore(newHasMore)
      } catch (error) {
        console.error("Error fetching members:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [hasMore],
  )

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchMembers(lastVisible || undefined)
    }
  }

  const renderItem = useCallback(({ item }: { item: MemberDetails }) => <MemberCard member={item} />, [])

  const keyExtractor = useCallback((item: MemberDetails) => item.id || `member-${item.fullName}-${item.seatNumber}`, [])

  if (isLoading && members.length === 0) {
    return <ActivityIndicator size="large" color="#6B46C1" style={styles.loader} />
  }

  if (members.length === 0) {
    return <Text style={styles.noMembersText}>No members found.</Text>
  }

  return (
    <FlatList
      ref={flatListRef}
      data={members}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={() =>
        isLoading ? <ActivityIndicator size="small" color="#6B46C1" style={styles.loader} /> : null
      }
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={21}
      removeClippedSubviews={true}
      updateCellsBatchingPeriod={50}
    />
  )
}

const styles = StyleSheet.create({
  loader: {
    marginVertical: 20,
  },
  noMembersText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
})

export default MemberProfileCards

