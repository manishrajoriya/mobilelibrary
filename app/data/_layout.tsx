import { Stack } from "expo-router"

   
   
   
export default function DataLayout(){
    return(
    <Stack screenOptions={{ headerShown: false }}>

      <Stack.Screen name="index" />
    </Stack>
    )
}