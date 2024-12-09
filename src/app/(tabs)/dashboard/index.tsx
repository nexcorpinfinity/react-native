import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

export default function Dashboard() {
  return (
    <View>
      <Text>Dashboard</Text>
      <Link href={"/"}>Voltar para home </Link>
    </View>
  )
}