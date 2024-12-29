import React, { useContext, useEffect } from "react";
import { Slot, SplashScreen, useRouter } from "expo-router";
import { AuthProvider } from "../context/AuthProvider";

const InitalLayout = () => {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.replace("/(auth)/login");
        }, 5000);
    }, []);

    return <Slot />;
};

export default function RootLayout() {
    return (
        <AuthProvider>
            <InitalLayout />
        </AuthProvider>
    );
}
