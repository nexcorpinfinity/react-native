import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";
import { loginApi } from "../service/users";
import {
    deleteToken,
    getCredentials,
    getToken,
    saveCredentials,
    saveToken,
} from "../storage/localStorage";
import Toast from "react-native-toast-message";

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
    loginBiometric: () => Promise<void>;
    checkAuth: () => Promise<boolean | undefined>;
    logout: () => Promise<void>;
    haveCredentialSave: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    isAuthenticated: false,
    loading: false,
    login: async () => {},
    checkAuth: async () => false,
    logout: async () => {},
    loginBiometric: async () => {},
    haveCredentialSave: async () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<DecodedToken | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const validateEmail = (email: string) => {
        return emailRegex.test(email);
    };

    const login = async (email: string, password: string) => {
        setLoading(true);

        const errors = [];

        if (!email && !password) {
            errors.push("E-mail e senha é obrigatório");
        }

        if (!email) {
            errors.push("E-mail é obrigatório");
        } else if (!validateEmail(email)) {
            errors.push("E-mail é inválido");
        }

        if (!password) {
            errors.push("Senha é obrigatória");
        }

        if (errors.length > 0) {
            Toast.show({
                type: "error",
                text1: errors.join("\n"),
            });
            setLoading(false);
            return;
        }

        try {
            const token = await loginApi(email, password);

            if (!token.data.success && token.status === 401) {
                if (token.data.message === "Preencha todos os campos") {
                    return Toast.show({
                        type: "error",
                        text1: token.data.message,
                    });
                } else if (token.data.message === "Usuário não existe") {
                    return Toast.show({
                        type: "error",
                        text1: token.data.message,
                    });
                } else if (token.data.message === "Senha inválida") {
                    return Toast.show({
                        type: "error",
                        text1: token.data.message,
                    });
                }
            }

            await saveToken("token", token.data[0].token);
            await saveCredentials(email, password);

            const decoded = jwtDecode<DecodedToken>(token.data[0].token);

            setUser(decoded);
            return router.replace("/(tabs)/dashboard");
        } catch (error) {
            setLoading(false);
            return Toast.show({
                type: "error",
                text1: "Erro ao fazer login",
                text2: "Por favor entre em contato com o administrador",
            });
        } finally {
            setLoading(false);
        }
    };

    const loginBiometric = async () => {
        setLoading(true);

        const credentials = await getCredentials();

        try {
            const token = await loginApi(
                String(credentials.email),
                String(credentials.password)
            );

            if (!token.data.success && token.status === 401) {
                if (token.data.message === "Preencha todos os campos") {
                    return Toast.show({
                        type: "error",
                        text1: token.data.message,
                    });
                } else if (token.data.message === "Usuário não existe") {
                    return Toast.show({
                        type: "error",
                        text1: token.data.message,
                    });
                } else if (token.data.message === "Senha inválida") {
                    return Toast.show({
                        type: "error",
                        text1: token.data.message,
                    });
                }
            }

            await saveToken("token", token.data[0].token);

            const decoded = jwtDecode<DecodedToken>(token.data[0].token);

            setUser(decoded);
            return router.replace("/(tabs)/dashboard");
        } catch (error) {
            setLoading(false);
            return Toast.show({
                type: "error",
                text1: "Erro ao fazer login",
                text2: "Por favor entre em contato com o administrador",
            });
        } finally {
            setLoading(false);
        }
    };

    const haveCredentialSave = async () => {
        const credentials = await getCredentials();

        if (credentials.email && credentials.password) {
            return true;
        } else {
            return false;
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
            setLoading(false);
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

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                login,
                loginBiometric,
                checkAuth,
                logout,
                haveCredentialSave,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
