import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";
import { LinearGradient } from "expo-linear-gradient";
import MembersDashboard from "./MemberDashbord";
import MemberProfileCard from "./member/MemberProfileCard";
import ShiftForm from "./ShiftForm";
import AddMemberForm from "./member/AddMemberForm";
import ShiftDetails from "./ShiftDetails";
import Finance from "./Finance";
import PricingSection from "./Pricing";
import AddSeatsPage from "./Seat";
import WhatsAppMessageScreen from "./WhatsappMessage";
import AttendancePage from "./member/Attendance";
import AttendanceReport from "./member/AttendaceReport";
import AllocateSeatsPage from "./member/AllotSeat";
import LogoutScreen from "./Logout";
import AddLibraryScreen from "./library/AddLibrary";
import DownloadMembersPage from "./download/MemberData";
import MemberPaymentList from "./member/MemberPaymentList.tsx";

type DrawerParamList = {
  Home: undefined;
  Profile: undefined;
  ShiftForm: undefined;
  AddMember: undefined;
  ShiftDetails: undefined;
  Finance: undefined;
  Pricing: undefined;
  AddSeats: undefined;
  WhatsAppMessage: undefined;
  Attendance: undefined;
  AttendanceReport: undefined;
  AllotSeat: undefined;
  Logout: undefined;
  AddLibrary: undefined;
  DownloadMembers: undefined;
  MemberPayment: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

// Collapsible Section Component
const CollapsibleSection = ({ title, icon, children, isCollapsed, onToggle, isActive }: { title: string; icon: keyof typeof Ionicons.glyphMap; children: React.ReactNode; isCollapsed: boolean; onToggle: () => void; isActive: boolean }) => {
  return (
    <View>
      <TouchableOpacity onPress={onToggle} style={[styles.sectionHeader, isActive && styles.activeSectionHeader]}>
        <Ionicons name={icon} size={24} color={isActive ? "#6B46C1" : "#555"} />
        <Text style={[styles.sectionTitle, isActive && styles.activeSectionTitle]}>{title}</Text>
        <Ionicons
          name={isCollapsed ? "chevron-down" : "chevron-up"}
          size={20}
          color={isActive ? "#6B46C1" : "#555"}
          style={{ marginLeft: "auto" }}
        />
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>{children}</Collapsible>
    </View>
  );
};

const CustomDrawerContent = (props: any) => {
  const [sections, setSections] = useState({
    members: false,
    shifts: false,
    finance: false,
    attendance: false,
    others: false,
  });

  const toggleSection = (section: string) => {
    setSections((prev: any) => ({ ...prev, [section]: !prev[section] }));
  };

  const { state } = props;
  const activeRoute = state.routes[state.index].name;

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
      {/* Drawer Header */}
      <LinearGradient
        colors={["#6B46C1", "#8250E8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.drawerHeader}
      >
        <Text style={styles.headerText}>Welcome!</Text>
      </LinearGradient>

      {/* Direct Drawer Items */}
      <DrawerItem
        label="Home"
        icon="home-outline"
        onPress={() => props.navigation.navigate("Home")}
        isActive={activeRoute === "Home"}
      />
      <DrawerItem
        label="Add Library"
        icon="library-outline"
        onPress={() => props.navigation.navigate("AddLibrary")}
        isActive={activeRoute === "AddLibrary"}
      />
      <DrawerItem
        label="Download Members"
        icon="download-outline"
        onPress={() => props.navigation.navigate("DownloadMembers")}
        isActive={activeRoute === "DownloadMembers"}
      />
      <DrawerItem
        label="Add Seats"
        icon="add-outline"
        onPress={() => props.navigation.navigate("AddSeats")}
        isActive={activeRoute === "AddSeats"}
      />
      <DrawerItem
        label="Allot Seat"
        icon="person-add-outline"
        onPress={() => props.navigation.navigate("AllotSeat")}
        isActive={activeRoute === "AllotSeat"}
      />

      {/* Collapsible Sections */}
      <CollapsibleSection
        title="Members"
        icon="people-outline"
        isCollapsed={sections.members}
        onToggle={() => toggleSection("members")}
        isActive={activeRoute === "AddMember" || activeRoute === "Profile" || activeRoute === "MemberPayment"}
      >
        <DrawerItem
          label="Add Member"
          icon="person-add-outline"
          onPress={() => props.navigation.navigate("AddMember")}
          isActive={activeRoute === "AddMember"}
        />
        <DrawerItem
          label="Profile"
          icon="person-outline"
          onPress={() => props.navigation.navigate("Profile")}
          isActive={activeRoute === "Profile"}
        />
        <DrawerItem
          label="Member Payment"
          icon="card-outline"
          onPress={() => props.navigation.navigate("MemberPayment")}
          isActive={activeRoute === "MemberPayment"}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Shifts"
        icon="calendar-outline"
        isCollapsed={sections.shifts}
        onToggle={() => toggleSection("shifts")}
        isActive={activeRoute === "ShiftForm" || activeRoute === "ShiftDetails"}
      >
        <DrawerItem
          label="Shift Form"
          icon="calendar-outline"
          onPress={() => props.navigation.navigate("ShiftForm")}
          isActive={activeRoute === "ShiftForm"}
        />
        <DrawerItem
          label="Shift Details"
          icon="document-text-outline"
          onPress={() => props.navigation.navigate("ShiftDetails")}
          isActive={activeRoute === "ShiftDetails"}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Finance"
        icon="card-outline"
        isCollapsed={sections.finance}
        onToggle={() => toggleSection("finance")}
        isActive={activeRoute === "Finance" || activeRoute === "Pricing"}
      >
        <DrawerItem
          label="Finance"
          icon="card-outline"
          onPress={() => props.navigation.navigate("Finance")}
          isActive={activeRoute === "Finance"}
        />
        <DrawerItem
          label="Pricing"
          icon="pricetag-outline"
          onPress={() => props.navigation.navigate("Pricing")}
          isActive={activeRoute === "Pricing"}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Attendance"
        icon="checkbox-outline"
        isCollapsed={sections.attendance}
        onToggle={() => toggleSection("attendance")}
        isActive={activeRoute === "Attendance" || activeRoute === "AttendanceReport"}
      >
        <DrawerItem
          label="Attendance"
          icon="checkbox-outline"
          onPress={() => props.navigation.navigate("Attendance")}
          isActive={activeRoute === "Attendance"}
        />
        <DrawerItem
          label="Attendance Report"
          icon="bar-chart-outline"
          onPress={() => props.navigation.navigate("AttendanceReport")}
          isActive={activeRoute === "AttendanceReport"}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Others"
        icon="ellipsis-horizontal-outline"
        isCollapsed={sections.others}
        onToggle={() => toggleSection("others")}
        isActive={activeRoute === "WhatsAppMessage" || activeRoute === "Logout"}
      >
        <DrawerItem
          label="WhatsApp Message"
          icon="logo-whatsapp"
          onPress={() => props.navigation.navigate("WhatsAppMessage")}
          isActive={activeRoute === "WhatsAppMessage"}
        />
        <DrawerItem
          label="Logout"
          icon="log-out-outline"
          onPress={() => props.navigation.navigate("Logout")}
          isActive={activeRoute === "Logout"}
        />
      </CollapsibleSection>
    </DrawerContentScrollView>
  );
};

// Drawer Item Component
const DrawerItem = ({ label, icon, onPress, isActive }: { label: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void; isActive: boolean }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.drawerItem, isActive && styles.activeDrawerItem]}>
      <Ionicons name={icon} size={24} color={isActive ? "#6B46C1" : "#555"} />
      <Text style={[styles.drawerLabel, isActive && styles.activeDrawerLabel]}>{label}</Text>
    </TouchableOpacity>
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
          marginLeft: 10,
        },
        drawerActiveBackgroundColor: "#6B46C110",
        drawerActiveTintColor: "#6B46C1",
        drawerInactiveTintColor: "#555",
        drawerItemStyle: {
          borderRadius: 8,
          marginHorizontal: 8,
          marginVertical: 4,
        },
        drawerContentStyle: {
          paddingTop: 0,
        },
        drawerContentContainerStyle: {
          paddingTop: 0,
        },
      }}
    >
      <Drawer.Screen name="Home" component={MembersDashboard} />
      <Drawer.Screen name="Profile" component={MemberProfileCard} />
      <Drawer.Screen name="AddLibrary" component={AddLibraryScreen} />
      <Drawer.Screen name="AddMember" component={AddMemberForm} />
      <Drawer.Screen name="ShiftForm" component={ShiftForm} />
      <Drawer.Screen name="ShiftDetails" component={ShiftDetails} />
      <Drawer.Screen name="AddSeats" component={AddSeatsPage} />
      <Drawer.Screen name="AllotSeat" component={AllocateSeatsPage} />
      <Drawer.Screen name="Attendance" component={AttendancePage} />
      <Drawer.Screen name="AttendanceReport" component={AttendanceReport} />
      <Drawer.Screen name="WhatsAppMessage" component={WhatsAppMessageScreen} />
      <Drawer.Screen name="Finance" component={Finance} />
      <Drawer.Screen name="Pricing" component={PricingSection} />
      <Drawer.Screen name="Logout" component={LogoutScreen} />
      <Drawer.Screen name="DownloadMembers" component={DownloadMembersPage} />
      <Drawer.Screen name="MemberPayment" component={MemberPaymentList} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 24,
   marginTop: 40,
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
  headerSubtext: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activeSectionHeader: {
    backgroundColor: "#6B46C110",
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginLeft: 10,
  },
  activeSectionTitle: {
    color: "#6B46C1",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  activeDrawerItem: {
    backgroundColor: "#6B46C110",
    borderRadius: 8,
  },
  drawerLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginLeft: 10,
  },
  activeDrawerLabel: {
    color: "#6B46C1",
  },
});

export default Sidebar;