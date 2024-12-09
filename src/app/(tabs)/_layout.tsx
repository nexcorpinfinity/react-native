import { Tabs} from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="dashboard" options={{ headerShown: false}} />
      <Tabs.Screen name="user" options={{ headerShown: false}} />
      <Tabs.Screen name="passwods" options={{ headerShown: false}} />
    </Tabs>
  );
}
