import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile/[id]"
        options={{
          title: "Perfil",
        }}
      />
      <Stack.Screen name="users" options={{ title: "Usuários" }} />
      <Stack.Screen name="create" options={{ title: "Criar Usuário" }} />
      <Stack.Screen name="alura" options={{ title: "Contas do alura" }} />
    </Stack>
  );
}
