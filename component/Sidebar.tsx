import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer"
import { Ionicons } from "@expo/vector-icons" // Use Expo or your preferred icon library
import MembersDashboard from "./MemberDashbord"
import MemberProfileCard from "./member/MemberProfileCard"
import ShiftForm from "./ShiftForm"
import AddMemberForm from "./member/AddMemberForm"
import ShiftDetails from "./ShiftDetails"
import Finance from "./Finance"
import PricingSection from "./Pricing"
import AddSeatsPage from "./Seat"
import WhatsAppMessageScreen from "./WhatsappMessage"
import AttendancePage from "./member/Attendance"
import AttendanceReport from "./member/AttendaceReport"
import AllotSeat from "./member/AllotSeat"
import LogoutScreen from "./Logout"
import AddLibraryScreen from "./library/AddLibrary"


type DrawerParamList = {
  Home: undefined
  Profile: undefined
  ShiftForm: undefined
  AddMember: undefined
  ShiftDetails: undefined
  Finance: undefined
  Pricing: undefined
  AddSeats: undefined
  WhatsAppMessage: undefined
  Attendance: undefined
  AttendanceReport: undefined
  AllotSeat: undefined
  Logout: undefined
  AddLibrary: undefined

}

const Drawer = createDrawerNavigator<DrawerParamList>()

const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
      {/* Drawer Header */}
      <View style={styles.drawerHeader}>
        <Text style={styles.headerText}>Welcome!</Text>
      </View>
      {/* Drawer Items */}
      {props.state.routes.map((route: any, index: number) => {
        const { options } = props.descriptors[route.key]
        const label =
          options.drawerLabel !== undefined
            ? options.drawerLabel
            : options.title !== undefined
              ? options.title
              : route.name

        const isFocused = props.state.index === index

        const onPress = () => {
          const event = props.navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            props.navigation.navigate(route.name)
          }
        }

        return (
          <React.Fragment key={route.key}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={[styles.drawerItem, isFocused && styles.activeDrawerItem]}
            >
              {options.drawerIcon && options.drawerIcon({ color: isFocused ? "#6B46C1" : "#555", size: 24 })}
              <Text style={[styles.drawerLabel, isFocused && styles.activeDrawerLabel]}>{label}</Text>
            </TouchableOpacity>
            {index < props.state.routes.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        )
      })}
    </DrawerContentScrollView>
  )
}

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
        drawerIcon: ({ focused, size, color }) => (
          <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
        ),
        drawerContentStyle: {
          paddingTop: 0,
        },
        drawerContentContainerStyle: {
          paddingTop: 0,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={MembersDashboard}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      
      <Drawer.Screen
        name="Profile"
        component={MemberProfileCard}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="AddLibrary"
        component={AddLibraryScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="library-outline" size={size} color={color} />,
        }}
      />
       <Drawer.Screen
        name="AddMember"
        component={AddMemberForm}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="person-add-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="ShiftForm"
        component={ShiftForm}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
        }}
      />

      <Drawer.Screen
        name="ShiftDetails"
        component={ShiftDetails}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} />,
        }}
      />
    
      <Drawer.Screen
        name="AddSeats"
        component={AddSeatsPage}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />,
        }}
      />
       <Drawer.Screen
        name="AllotSeat"
        component={AllotSeat}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="attach" size={size} color={color} />,
        }}
      />
      
      <Drawer.Screen
        name="Attendance"
        component={AttendancePage}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="checkbox-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="AttendanceReport"
        component={AttendanceReport}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="bar-chart-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="WhatsAppMessage"
        component={WhatsAppMessageScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="logo-whatsapp" size={size} color={color} />,
        }}
      />
     
        <Drawer.Screen
        name="Finance"
        component={Finance}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="card-outline" size={size} color={color} />,
        }}
        />
        <Drawer.Screen
        name="Pricing"
        component={PricingSection}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="pricetag-outline" size={size} color={color} />,
        }}
       />
       <Drawer.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="log-out-outline" size={size} color={color} />,
        }}
       />
       
    </Drawer.Navigator>
  )
}

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
})

export default Sidebar

