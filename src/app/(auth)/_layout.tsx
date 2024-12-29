import { Stack } from "expo-router";
import { Animated } from "react-native";

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerTintColor: "#fff",
                animation: "fade",
            }}
        >
            <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
    );
}
