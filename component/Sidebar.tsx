import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons"; // Use Expo or your preferred icon library
import MembersDashboard from "./MemberDashbord";
import MemberProfileCard from "./MemberProfileCard";
import ShiftForm from "./ShiftForm";
import AddMemberForm from "./AddMemberForm";
import ShiftDetails from "./ShiftDetails";
import Finance from "./Finance";
import PricingSection from "./Pricing";

type DrawerParamList = {
  Home: undefined;
  Profile: undefined;
  ShiftForm: undefined;
  AddMemberForm: undefined;
  ShiftDetails: undefined;
  Finance: undefined;
  Pricing: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props}>
      {/* Drawer Header */}
      <View style={styles.drawerHeader}>
        <Text style={styles.headerText}>Welcome!</Text>
      </View>
      {/* Drawer Items */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const Sidebar = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#f8f9fa",
          width: 260,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "500",
          color: "#555",
        },
        drawerActiveBackgroundColor: "#e4e6eb",
        drawerActiveTintColor: "#000",
        drawerInactiveTintColor: "#555",
        drawerIcon: ({ focused, size, color }) => (
          <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
        ),
      }}
    >
      <Drawer.Screen
        name="Home"
        component={MembersDashboard}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={MemberProfileCard}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ShiftForm"
        component={ShiftForm}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AddMemberForm"
        component={AddMemberForm}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ShiftDetails"
        component={ShiftDetails}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Finance"
        component={Finance}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Pricing"
        component={PricingSection}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    backgroundColor: "#4285F4",
    marginBottom: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Sidebar;
