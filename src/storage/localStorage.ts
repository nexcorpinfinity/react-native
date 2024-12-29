import * as SecureStore from "expo-secure-store";

export const saveToken = async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
};

export const getToken = async (key: string) => {
    return await SecureStore.getItemAsync(key);
};

export const deleteToken = async (key: string) => {
    await SecureStore.deleteItemAsync(key);
};

export const saveCredentials = async (email: string, password: string) => {
    await SecureStore.setItemAsync("email", email);
    await SecureStore.setItemAsync("password", password);
};

export const getCredentials = async () => {
    const email = await SecureStore.getItemAsync("email");
    const password = await SecureStore.getItemAsync("password");

    return { email, password };
};

export const deleteCredentials = async () => {
    await SecureStore.deleteItemAsync("email");
    await SecureStore.deleteItemAsync("password");
};

