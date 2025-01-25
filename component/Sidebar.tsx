import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons"; // Use Expo or your preferred icon library
import MembersDashboard from "./MemberDashbord";
import MemberProfileCard from "./MemberProfileCard";
import ShiftForm from "./ShiftForm";
import AddMemberForm from "./AddMemberForm";
import ShiftDetails from "./ShiftDetails";
import Finance from "./Finance";
import PricingSection from "./Pricing";
import GymProfile from "./MemberData";
import SeatManagementScreen from "./Seat";
import WhatsAppMessageScreen from "./WhatsappMessage";

type DrawerParamList = {
  Home: undefined;
  Profile: undefined;
  ShiftForm: undefined;
  AddMemberForm: undefined;
  ShiftDetails: undefined;
  Finance: undefined;
  Pricing: undefined;
  GymProfile: undefined;
  SeatManagement: undefined;
  WhatsAppMessage: undefined;
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
          width: 280,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "500",
          color: "#555",
          marginLeft: 10, // Add space between icon and text
        },
        drawerActiveBackgroundColor: "#6B46C110", // Light accent color for active item
        drawerActiveTintColor: "#6B46C1", // Accent color for active item text
        drawerInactiveTintColor: "#555",
        drawerItemStyle: {
          borderRadius: 8,
          marginHorizontal: 8,
          marginVertical: 4,
        },
        drawerIcon: ({ focused, size, color }) => (
          <Ionicons
            name={focused ? "home" : "home-outline"}
            size={size}
            color={color}
          />
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
            <Ionicons name="pricetag-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="GymProfile"
        component={GymProfile}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="fitness-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="SeatManagement"
        component={SeatManagementScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="fitness-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="WhatsAppMessage"
        component={WhatsAppMessageScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="chatbox-ellipses-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 24,
    backgroundColor: "#6B46C1", // Gradient-like color
    marginBottom: 16,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default Sidebar;