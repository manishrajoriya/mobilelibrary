import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import MembersDashboard from "./MemberDashbord"
import MemberProfileCard from "./MemberProfileCard"
import ShiftForm from "./ShiftForm"
import AddMemberForm from "./AddMemberForm"

const Drawer = createDrawerNavigator()

const Sidebar = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#f5f5f5",
          width: 240,
        },
        drawerLabelStyle: {
          color: "#333",
        },
      }}
    >
      <Drawer.Screen name="Home" component={MembersDashboard} />
      <Drawer.Screen name="Profile" component={MemberProfileCard} />
      <Drawer.Screen name="ShiftForm" component={ShiftForm} />
      <Drawer.Screen name="AddMemberForm" component={AddMemberForm} />
    </Drawer.Navigator>
  )
}

export default Sidebar

