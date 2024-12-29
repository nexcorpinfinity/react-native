import { AuthContext, AuthContextProps } from "@/src/context/AuthProvider";
import React, { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    Pressable,
    StyleSheet,
} from "react-native";
import {
    SafeAreaView,
    TextInput,
    Text,
    TouchableOpacity,
    View,
    Button,
} from "react-native";
import styled from "styled-components/native";
import Toast from "react-native-toast-message";
import * as LocalAuthentication from "expo-local-authentication";
import { deleteCredentials, getCredentials } from "@/src/storage/localStorage";
import LottieView from "lottie-react-native";

export default function Login() {
    const { login, loading, haveCredentialSave, loginBiometric } =
        useContext<AuthContextProps>(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hasBiometrics, setHasBiometrics] = useState<boolean>(false);
    const [useCredentalSave, setUseCredentialSave] = useState<boolean>(false);

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", () => {
            return true;
        });
        const checkBiometricSupport = async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setHasBiometrics(compatible);

            const credentials = await getCredentials();
            if (credentials.email && credentials.password) {
                setEmail(String(credentials.email));
                // setPassword(String(credentials.password));
            }
            const have = await haveCredentialSave();

            setUseCredentialSave(have);
        };

        checkBiometricSupport();
    }, [hasBiometrics]);

    const handleBiometricAuth = async () => {
        if (useCredentalSave === false) {
            Toast.show({
                type: "error",
                text1: "Você não possui credenciais salvas",
            });
            return;
        }

        if (hasBiometrics) {
            try {
                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: "Autenticar usando a digital",
                    fallbackLabel: "Usar senha",
                });

                if (result.success) {
                    await handleSubmit(true);
                }
            } catch (error) {
                Toast.show({
                    type: "error",
                    text1: "Erro ao tentar autenticar",
                    text2: "Ocorreu um erro desconhecido.",
                });
            }
        }
    };

    const handleSubmit = async (biometric?: boolean) => {
        if (biometric) {
            return await loginBiometric();
        }
        await login(email, password);
    };

    useEffect(() => {
        const checkSavedCredentials = async () => {
            if (useCredentalSave && hasBiometrics) {
                await handleBiometricAuth();
            }
        };

        setTimeout(() => {
            checkSavedCredentials();
        }, 1000);
    }, [hasBiometrics, useCredentalSave]);

    return (
        <Container>
            <Toast />

            <LottieView
                source={require("../../../assets/animations/animation-two.json")}
                autoPlay
                loop={true}
                style={styles.animation}
            />

            <InputContainer>
                <StyledTextInput
                    placeholder="E-mail"
                    value={email}
                    onChangeText={setEmail}
                />
                <StyledTextInput
                    placeholder="Digite sua senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />
                <SubmitButton onPress={() => handleSubmit()}>
                    <ButtonText>
                        {loading ? (
                            <ActivityIndicator size={30} color="#ffffff" />
                        ) : (
                            "Login"
                        )}
                    </ButtonText>
                </SubmitButton>
                <BiometricDiv onPress={handleBiometricAuth}>
                    <BiometricText>Usar Biometria</BiometricText>
                </BiometricDiv>
            </InputContainer>
        </Container>
    );
}

const styles = StyleSheet.create({
    animation: {
        width: 200,
        height: 200,
    },
});

const Container = styled(SafeAreaView)`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
`;

const InputContainer = styled(View)`
    width: 100%;
    max-width: 400px;
    padding: 16px;
`;

const StyledTextInput = styled(TextInput)`
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 12px;
    font-size: 16px;
    margin-bottom: 16px;
`;

const SubmitButton = styled(TouchableOpacity)`
    background-color: #3b82f6;
    padding: 12px;
    border-radius: 8px;
    align-items: center;
`;

const ButtonText = styled(Text)`
    color: white;
    font-size: 18px;
`;

const BiometricDiv = styled(Pressable)`
    margin-top: 20px;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    padding: 8px;
    border-radius: 8px;
`;

export const BiometricText = styled(Text)`
    font-size: 16px;
    font-weight: bold;
    text-decoration: underline;
`;
