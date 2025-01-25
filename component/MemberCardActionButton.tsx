import React from "react"
import { TouchableOpacity, Text, StyleSheet, FlatList } from "react-native"
import { Feather } from "@expo/vector-icons"

interface ActionButtonProps {
  icon: keyof typeof Feather.glyphMap
  label: string
  onPress: () => void
}

const ActionButton: React.FC<ActionButtonProps> = React.memo(({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Feather name={icon} size={20} color="#555" />
    <Text style={styles.actionButtonText}>{label}</Text>
  </TouchableOpacity>
))

export const ActionButtons: React.FC = React.memo(() => {
  const actionData: ActionButtonProps[] = [
    { icon: "edit-2", label: "Edit", onPress: () => {} },
    { icon: "plus", label: "Add Pay", onPress: () => {} },
    { icon: "refresh-ccw", label: "Renew", onPress: () => {} },
    { icon: "user", label: "Profile", onPress: () => {} },
  ]

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.actionScrollView}
      data={actionData}
      renderItem={({ item }) => <ActionButton {...item} />}
      keyExtractor={(item) => `action-${item.icon}`}
    />
  )
})

const styles = StyleSheet.create({
  actionScrollView: {
    flexGrow: 0,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginRight: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    minWidth: 100,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
})

