import React, { useContext, useEffect } from "react";
import { Slot, useRouter } from "expo-router";
import {
  AuthContext,
  AuthContextProps,
  AuthProvider,
} from "../context/AuthProvider";

const InitalLayout = () => {
  const router = useRouter();

  const { checkAuth, isAuthenticated } =
    useContext<AuthContextProps>(AuthContext);

    // TODO: corrigir essa parte de login ainda nao está bom
  useEffect(() => {
    const checkAuthentication = async () => {
      setTimeout(() => {
        const isLogged = checkAuth();

        if (!isAuthenticated && !isLogged) {
          router.replace("/(auth)/login");
        } else {
          router.replace("/dashboard");
        }
      }, 2000);
    };

    checkAuthentication();
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
