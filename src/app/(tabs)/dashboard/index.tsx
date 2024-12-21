import { View, Text, Button } from "react-native";
import React, { useContext } from "react";
import { AuthContext, AuthContextProps } from "@/src/context/AuthProvider";

export default function Dashboard() {
  const { user } = useContext<AuthContextProps>(AuthContext);
  console.log("user", user);
  return (
    <View>
      <Text>Dashboard {user?.name}</Text>
      
    </View>
  );
}
