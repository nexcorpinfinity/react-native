import React, { useContext, useEffect } from "react";
import { Slot, useRouter } from "expo-router";
import {
  AuthContext,
  AuthContextProps,
  AuthProvider,
} from "../context/AuthProvider";

const InitalLayout = () => {
  const router = useRouter();

  const { checkAuth, isAuthenticated } = useContext<AuthContextProps>(AuthContext);

  useEffect(() => {
    const checkAuthentication = async () => {
      checkAuth();
      console.log("isAuthenticated", isAuthenticated);
      if (!isAuthenticated) {
        router.replace("/(auth)/login");
      } else {
        router.replace("/dashboard");
      }
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
