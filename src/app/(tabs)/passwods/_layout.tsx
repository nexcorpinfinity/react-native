import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack >
      <Stack.Screen name="mypass" options={{ title: "Minhas Senhas" }} />
    </Stack>
  );
}
