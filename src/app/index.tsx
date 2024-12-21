import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

export default function Loading() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Carregando...</Text>
      <ActivityIndicator size={40} color="#0000ff" />
    </View>
  );
}
