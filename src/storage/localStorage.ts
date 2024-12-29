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

export const getSecureCode = async () => {
    const secureCode = await SecureStore.getItemAsync("secure_code");
    const hashSecureCode = await SecureStore.getItemAsync("hash_secure_code");
    return { secureCode, hashSecureCode };
};

export const saveSecureCode = async (
    secure_code: string,
    hash_secure_code: string
) => {
    await SecureStore.setItemAsync("secure_code", secure_code);
    await SecureStore.setItemAsync("hash_secure_code", hash_secure_code);
};

export const deleteSecureCode = async () => {
    await SecureStore.deleteItemAsync("secure_code");
    await SecureStore.deleteItemAsync("hash_secure_code");
};
