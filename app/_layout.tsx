import { Tabs } from "expo-router";
import React, { useState } from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  const [autenticado, setAutenticado] = useState(false); // Simulando a lógica de autenticação

    setAutenticado(false)

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index" 
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
        }}
      />

      {autenticado && (
        <Tabs.Screen
          name="teste" // Garantindo nome único
          options={{
            title: "Teste",
          }}
        />
      )}
    </Tabs>
  );
}
