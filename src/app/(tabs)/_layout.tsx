import { AuthContext } from "@/src/context/AuthProvider";
import { Tabs } from "expo-router";
import { useContext, useEffect } from "react";
import Feather from "react-native-vector-icons/Feather";

export default function TabsLayout() {
  const { checkAuth } = useContext(AuthContext);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Tabs>
      <Tabs.Screen
        name="dashboard"
        options={{
          headerShown: false,
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
          tabBarLabel: () => null,
          tabBarItemStyle: {
            alignItems: "center",
            justifyContent: "center",
            marginTop: 5,
          },
        }}
      />
      <Tabs.Screen
        name="passwods"
        options={{
          headerShown: false,
          title: "Minha Senhas",
          tabBarIcon: ({ color, size }) => (
            <Feather name="lock" size={size} color={color} />
          ),
          tabBarLabel: () => null,
          tabBarItemStyle: {
            alignItems: "center",
            justifyContent: "center",
            marginTop: 5,
          },
        }}
      />
      <Tabs.Screen
        name="configuration"
        options={{
          headerShown: false,
          title: "Configuração",
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
          tabBarLabel: () => null,
          tabBarItemStyle: {
            marginTop: 5,
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      />
    </Tabs>
  );
}
