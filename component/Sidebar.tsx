import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons"; // Use Expo or your preferred icon library
import MembersDashboard from "./MemberDashbord";
import MemberProfileCard from "./MemberProfileCard";
import ShiftForm from "./ShiftForm";
import AddMemberForm from "./AddMemberForm";
import ShiftDetails from "./ShiftDetails";
import Finance from "./Finance";
import PricingSection from "./Pricing";
import SeatsPage from "./Seat";
import WhatsAppMessageScreen from "./WhatsappMessage";
import AttendancePage from "./member/Attendance";
import AttendanceReport from "./member/AttendaceReport";
import AllotSeat from "./member/AllotSeat";

type DrawerParamList = {
  Home: undefined;
  Profile: undefined;
  ShiftForm: undefined;
  AddMemberForm: undefined;
  ShiftDetails: undefined;
  Finance: undefined;
  Pricing: undefined;
  SeatManagement: undefined;
  WhatsAppMessage: undefined;
  Attendance: undefined;
  AttendanceReport: undefined;
  AllotSeat: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props}>
      {/* Drawer Header */}
      <View style={styles.drawerHeader}>
        <Text style={styles.headerText}>Welcome!</Text>
      </View>

      {/* Drawer Items with Dividers */}
      {props.state.routes.map((route: any, index: number) => {
        const { options } = props.descriptors[route.key];
        const isFocused = props.state.index === index;

        return (
          <View key={route.key}>
            <TouchableOpacity
              style={[
                styles.drawerItem,
                isFocused && styles.activeDrawerItem,
              ]}
              onPress={() => props.navigation.navigate(route.name)}
            >
              <Ionicons
                name={options.drawerIcon?.({ color: "#555", size: 24 }).props.name}
                size={24}
                color={isFocused ? "#6B46C1" : "#555"}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.drawerLabel,
                  isFocused && styles.activeDrawerLabel,
                ]}
              >
                {options.title || route.name}
              </Text>
            </TouchableOpacity>
            {/* Add a divider after each item except the last one */}
            {index !== props.state.routes.length - 1 && (
              <View style={styles.divider} />
            )}
          </View>
        );
      })}
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
      }}
    >
      <Drawer.Screen
        name="Home"
        component={MembersDashboard}
        options={{
          title: "Home",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={MemberProfileCard}
        options={{
          title: "Profile",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ShiftForm"
        component={ShiftForm}
        options={{
          title: "Shift Form",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AddMemberForm"
        component={AddMemberForm}
        options={{
          title: "Add Member",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ShiftDetails"
        component={ShiftDetails}
        options={{
          title: "Shift Details",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Finance"
        component={Finance}
        options={{
          title: "Finance",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Pricing"
        component={PricingSection}
        options={{
          title: "Pricing",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="pricetag-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="SeatManagement"
        component={SeatsPage}
        options={{
          title: "Seat Management",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="fitness-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="WhatsAppMessage"
        component={WhatsAppMessageScreen}
        options={{
          title: "WhatsApp Message",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="chatbox-ellipses-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Attendance"
        component={AttendancePage}
        options={{
          title: "Attendance",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AttendanceReport"
        component={AttendanceReport}
        options={{
          title: "Attendance Report",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AllotSeat"
        component={AllotSeat}
        options={{
          title: "Allot Seat",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="fitness-outline" size={size} color={color} />
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
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activeDrawerItem: {
    backgroundColor: "#6B46C110",
    borderRadius: 8,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginLeft: 10,
  },
  activeDrawerLabel: {
    color: "#6B46C1",
  },
  icon: {
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
    marginVertical: 4,
  },
});

export default Sidebar;