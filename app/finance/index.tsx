import { View, Text } from 'react-native'
import React from 'react'
import Finance from '@/component/Finance'
import { useAuth } from '@/hooks/authContext'
import useStore from '@/hooks/store'


const index = () => {
//  const currentUser = useStore((state: any) => state.currentUser);
//  console.log("currentUser", currentUser);
 const activeLibrary = useStore((state: any) => state.activeLibrary);
  console.log("currentLibrary", activeLibrary);
  return (
    <Finance />
  )
}

export default index