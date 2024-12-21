import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#121212",
        },
        headerTintColor: "#fff",
      }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
