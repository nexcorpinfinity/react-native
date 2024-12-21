import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

export default function Profile() {
  return (
    <View>
      <Text>Profile teste</Text>
      <Link href={"/"}>Voltar para home </Link>
    </View>
  )
}