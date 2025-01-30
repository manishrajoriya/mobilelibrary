import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { ActionButton } from "./ActionBtnUi"; 
import { Feather } from "@expo/vector-icons";

interface ActionItem {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}

export const ActionButtons: React.FC = React.memo(() => {
  const actionData: ActionItem[] = [
    { icon: "edit-2", label: "Edit", onPress: handleEdit },
    { icon: "plus", label: "Add Pay", onPress: handleAddPay },
    { icon: "refresh-ccw", label: "Renew", onPress: handleRenew },
    { icon: "user", label: "Profile", onPress: handleProfile },
  ];

  // Define handlers
  function handleEdit() {
    console.log("Edit pressed");
  }

  function handleAddPay() {
    console.log("Add Pay pressed");
  }

  function handleRenew() {
    console.log("Renew pressed");
  }

  function handleProfile() {
    console.log("Profile pressed");
  }

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.actionScrollView}
      data={actionData}
      renderItem={({ item }) => <ActionButton {...item} />}
      keyExtractor={(item) => item.label} // Use label as the key
    />
  );
});

const styles = StyleSheet.create({
  actionScrollView: {
    flexGrow: 0,
  },
});