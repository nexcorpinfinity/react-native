import { Stack } from "expo-router";

export default function PasswordLayout() {
  return (
    <Stack >
      <Stack.Screen name="index" options={{ title: "Minha senhas" }} />
    </Stack>
  );
}
