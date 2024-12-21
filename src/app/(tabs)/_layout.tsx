import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="dashboard"
        options={{ headerShown: false, title: "Dashboard" }}
      />
      <Tabs.Screen
        name="passwods"
        options={{ headerShown: false, title: "Minha Senhas" }}
      />
      <Tabs.Screen
        name="configuration"
        options={{ headerShown: false, title: "Configuração" }}
      />
    </Tabs>
  );
}
