import { View, Text } from 'react-native'
import React from 'react'
import  LoginScreen  from '@/component/AuthScreen'
import { useRouter } from 'expo-router'

const index = () => {
  const router = useRouter()
  return (
    <>
      <LoginScreen />
    </>
  )
}

export default index