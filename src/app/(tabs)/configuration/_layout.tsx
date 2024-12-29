import { Stack, useRouter } from "expo-router";
import { Button } from "react-native";

export default function UserLayout() {
    const router = useRouter();

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
                name="profile/[id]"
                options={{
                    title: "Perfil",
                }}
            />
            <Stack.Screen
                name="editprofile/[id]"
                options={{
                    title: "Editar Perfil",
                }}
            />
            <Stack.Screen
                name="users"
                options={{
                    title: "Usuários",
                    headerRight: () => (
                        <Button
                            title="Criar"
                            onPress={() =>
                                router.push("/(tabs)/configuration/create")
                            }
                        />
                    ),
                }}
            />
            <Stack.Screen name="create" options={{ title: "Criar Usuário" }} />
            <Stack.Screen name="alura" options={{ title: "Contas do alura" }} />
        </Stack>
    );
}
