import React from "react"
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { LoginScreen } from "@/component/AuthScreen"
import MembersDashboard from "@/component/MemberDashbord"
import { useAuth } from "@/firebase/auth"
import Sidebar from "@/component/Sidebar"

const Stack = createNativeStackNavigator()

export default function App() {
  const { user } = useAuth()

  return (
    <NavigationIndependentTree>
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen name="Home" component={Sidebar} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </NavigationIndependentTree>
  )
}

