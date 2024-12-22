import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";
import { loginApi } from "../service/users";
import { deleteToken, getToken, saveToken } from "../storage/localStorage";

interface DecodedToken {
  id: string;
  name: string;
  permission: string;
  iat: number;
}

export interface AuthContextProps {
  user: DecodedToken | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<boolean | undefined>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  loading: false,
  login: async () => {},
  checkAuth: async () => false,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const token = await loginApi(email, password);

      await saveToken("token", token);

      const decoded = jwtDecode<DecodedToken>(token);

      setUser(decoded);

      router.replace("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = await getToken("token");

      if (token && !user) {
        const decoded = jwtDecode<DecodedToken>(token);
        setUser(decoded);
        return true;
      } else if (!token && !user) {
        logout();
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);

    await deleteToken("token");

    setUser(null);

    router.replace("/(auth)/login");

    setLoading(false);
  };

  useEffect(() => {
    const logged = checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        checkAuth,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
