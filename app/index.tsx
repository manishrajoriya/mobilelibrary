import React from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import Onboarding from "@/component/Onbording"
import MemberProfileCard from "@/component/Profile"

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Onboarding />
      <MemberProfileCard/>
    </GestureHandlerRootView>
  )
}

