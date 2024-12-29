import {
    createPasswd,
    deletePasswd,
    getAllPasswd,
    updatePasswd,
} from "@/src/service/passwds";
import * as LocalAuthentication from "expo-local-authentication";
import React, { useContext, useEffect, useState } from "react";
import {
    Text,
    ScrollView,
    View,
    ActivityIndicator,
    TextInput,
    Button,
    Alert,
} from "react-native";
import styled from "styled-components/native";
import { FontAwesome } from "@expo/vector-icons";
import {
    createSecureCode,
    getHashCode,
    getProfileUser,
} from "@/src/service/users";
import { AuthContext, AuthContextProps } from "@/src/context/AuthProvider";
import {
    deleteSecureCode,
    getSecureCode,
    saveSecureCode,
} from "@/src/storage/localStorage";
import ModalComponent from "@/src/components/Modal";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";

export default function MyPasswd() {
    const { user } = useContext<AuthContextProps>(AuthContext);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState<string>("");
    const [passwds, setPasswds] = useState<IPasswd[]>([]);
    const [modalCreatedSecureCode, setModalCreatedSecureCode] =
        useState<boolean>(false);
    const [modalGetSecureCode, setModalGetSecureCode] =
        useState<boolean>(false);
    const [modalCreatePasswd, setModalCreatePasswd] = useState<boolean>(false);
    const [modalEditPasswd, setModalEditPasswd] = useState<boolean>(false);
    const [modalViewPasswd, setModalViewPasswd] = useState<boolean>(false);

    const [haveSecureCode, setHaveSecureCode] = useState({
        haveHashSave: false,
        haveCodeSave: false,
        haveCredentialInDB: false,
    });

    const [createCode, setCreateCode] = useState("");
    const [sendCodeForGetHashCode, setSendCodeForGetHashCode] = useState("");
    const [createNewPasswd, setCreateNewPasswd] = useState({
        name: "",
        login_email: "",
        password: "",
    });
    const [editPasswd, setEditPasswd] = useState({
        id: "",
        name: "",
        login_email: "",
        password: "",
    });

    const [viewerPasswd, setViewPasswd] = useState({
        id: "",
        name: "",
        login_email: "",
        password: "",
    });

    const handleChange = (field: string, value: string) => {
        setCreateNewPasswd((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };
    const handleChangeEdit = (field: string, value: string) => {
        setEditPasswd((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    useEffect(() => {
        async function verifyExistSecureCodeUser() {
            const verify = await getProfileUser(String(user?.id));

            if (verify.data[0].user.security_code) {
                const getStorageCode = await getSecureCode();

                setHaveSecureCode({
                    haveHashSave: getStorageCode.hashSecureCode ? true : false,
                    haveCodeSave: getStorageCode.secureCode ? true : false,
                    haveCredentialInDB: true,
                });
            }
        }

        verifyExistSecureCodeUser();
        getAllPasswds();
    }, []);

    const createdPasswordOrSaveCode = () => {
        if (
            !haveSecureCode.haveCodeSave &&
            !haveSecureCode.haveCredentialInDB &&
            !haveSecureCode.haveHashSave
        ) {
            setModalCreatedSecureCode(true);
        } else if (
            !haveSecureCode.haveCodeSave &&
            haveSecureCode.haveCredentialInDB &&
            !haveSecureCode.haveHashSave
        ) {
            setModalGetSecureCode(true);
        } else {
            setModalCreatePasswd(true);
        }
    };

    const createHashCode = async (createCode: string) => {
        try {
            const createdCodeAPI = await createSecureCode(String(createCode));

            if (!createdCodeAPI.data.success) {
                return Alert.alert("Error desconhecido, consulte o admin");
            }

            await saveSecureCode(
                createCode,
                createdCodeAPI.data[0].secure_code
            );

            setHaveSecureCode({
                haveHashSave: true,
                haveCodeSave: true,
                haveCredentialInDB: true,
            });

            setModalCreatedSecureCode(false);
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Erro ao criar codigo",
                text2: "Por favor entre em contato com o administrador",
            });
        }
    };

    const submitGetHashCode = async (code: string) => {
        if (!sendCodeForGetHashCode) {
            return Alert.alert("Por favor digite o codigo");
        }

        try {
            const createdCodeAPI = await getHashCode(code);

            if (
                !createdCodeAPI.data.success &&
                createdCodeAPI.data.message === "Código de segurança inválido"
            ) {
                return Alert.alert(createdCodeAPI.data.message);
            }

            await saveSecureCode(code, createdCodeAPI.data[0].secure_code);

            setHaveSecureCode({
                haveHashSave: true,
                haveCodeSave: true,
                haveCredentialInDB: true,
            });

            setSendCodeForGetHashCode("");
            setModalGetSecureCode(false);
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Erro ao trazer codigo",
                text2: "Por favor entre em contato com o administrador",
            });
        }
    };

    const submitNewPasswdSend = async () => {
        if (!createNewPasswd.name) {
            return Alert.alert("Por favor digite o nome da senha");
        } else if (!createNewPasswd.password) {
            return Alert.alert("Por favor digite a senha");
        }

        try {
            const createdNew = await createPasswd(
                createNewPasswd.name,
                createNewPasswd.login_email,
                createNewPasswd.password
            );

            if (createdNew.data.success === false) {
                return Alert.alert(createdNew.data.message);
            }

            setModalCreatePasswd(false);
            setCreateNewPasswd({
                name: "",
                login_email: "",
                password: "",
            });

            return Toast.show({
                type: "success",
                text1: "Senha criada com sucesso",
            });
        } catch (error) {
            console.log(error);
            return Alert.alert("Ocorreu algum erro na hora de salvar");
        }
    };

    async function getAllPasswds() {
        setLoading(true);
        const getStorageCode = await getSecureCode();

        if (!getStorageCode.hashSecureCode || !getStorageCode.secureCode) {
            deleteSecureCode();

            return Alert.alert(
                "Por favor crie ou salve seu codigo secreto no botão criar"
            );
        }

        try {
            const obj = await getAllPasswd(
                String(getStorageCode.hashSecureCode)
            );
            setPasswds(obj.data[0].passwords);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const filteredUsers = passwds.filter((passwd) =>
        passwd.name.toLowerCase().includes(search.toLowerCase())
    );

    const openEditModal = async (passwdData: {
        _id: string;
        name: string;
        login_email: string;
        password: string;
    }) => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isBiometricSupported =
            await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || !isBiometricSupported) {
            alert("Seu dispositivo não suporta autenticação biométrica.");
            return;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Autenticação necessária",
            fallbackLabel: "Usar senha",
        });

        if (result.success) {
            setEditPasswd({
                id: passwdData._id,
                name: passwdData.name,
                login_email: passwdData.login_email,
                password: passwdData.password,
            });
            setModalEditPasswd(true);
        }
    };

    const editPasswds = async () => {
        try {
            console.log(editPasswd);

            const dataUpdate = await updatePasswd(
                editPasswd.id,
                editPasswd.name,
                editPasswd.login_email,
                editPasswd.password
            );

            if (
                !dataUpdate.data.success &&
                dataUpdate.data.message === "Nome de senha já existe"
            ) {
                return Alert.alert(dataUpdate.data.message);
            }

            setModalEditPasswd(false);
            getAllPasswds();
        } catch (error) {
            return Alert.alert("Ocorreu algum error");
        }
    };

    const viewPasswd = async (passwdData: {
        _id: string;
        name: string;
        login_email: string;
        password: string;
    }) => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isBiometricSupported =
            await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || !isBiometricSupported) {
            alert("Seu dispositivo não suporta autenticação biométrica.");
            return;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Autenticação necessária",
            fallbackLabel: "Usar senha",
        });

        if (result.success) {
            setViewPasswd({
                id: passwdData._id,
                name: passwdData.name,
                login_email: passwdData.login_email,
                password: passwdData.password,
            });

            setModalViewPasswd(true);
        }
    };

    const handleDeletePassword = (id: string) => {
        Alert.alert(
            "Confirmar Apagamento",
            "Você tem certeza de que deseja apagar esta senha?",
            [
                {
                    text: "Não",
                    onPress: () => console.log("Cancelado"),
                    style: "cancel",
                },
                {
                    text: "Sim",
                    onPress: async () => {
                        try {
                            await deletePasswd(String(id));
                            setModalViewPasswd(false);
                            getAllPasswds();
                        } catch (error) {
                            Alert.alert("Erro ao apagar a senha");
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={{ flex: 1, padding: 15, backgroundColor: "white" }}>
            <Toast />
            <InputContainer
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <InputField
                    placeholder="Buscar por nome ou senha"
                    value={search}
                    onChangeText={setSearch}
                />
                <PressableButton onPress={() => createdPasswordOrSaveCode()}>
                    <ButtonText>Criar</ButtonText>
                </PressableButton>
            </InputContainer>

            {loading && <ActivityIndicator size={40} color="#0084ff" />}

            {filteredUsers.length === 0 && !loading && (
                <Text>Nenhuma senha encontrada.</Text>
            )}

            {filteredUsers.map((passwd) => (
                <CardPasswords key={passwd._id}>
                    <IconContainer>
                        <FontAwesome name="lock" size={25} color="black" />
                    </IconContainer>

                    <Titles>{passwd.name}</Titles>

                    <ContentButton>
                        <PressableButton onPress={() => openEditModal(passwd)}>
                            <ButtonText>Editar</ButtonText>
                        </PressableButton>
                        <PressableButton onPress={() => viewPasswd(passwd)}>
                            <ButtonText>Ver</ButtonText>
                        </PressableButton>
                    </ContentButton>
                </CardPasswords>
            ))}

            {/* modal de criar codigo */}
            <ModalComponent
                visible={modalCreatedSecureCode}
                onClose={() => setModalCreatedSecureCode(false)}
            >
                <ViewSecretCode>
                    <ContentCode>
                        <TextInputCode>Crie seu Codigo secreto</TextInputCode>
                        <StyledTextInput
                            placeholder="Crie seu codigo secreto"
                            value={createCode}
                            onChangeText={setCreateCode}
                        />
                    </ContentCode>
                    <PressableButton onPress={() => createHashCode(createCode)}>
                        <ButtonText>Salvar</ButtonText>
                    </PressableButton>
                </ViewSecretCode>
            </ModalComponent>

            {/* modal de Trazer o hash do codigo */}
            <ModalComponent
                visible={modalGetSecureCode}
                onClose={() => setModalGetSecureCode(false)}
            >
                <ViewSecretCode>
                    <ContentCode>
                        <TextInputCode>
                            Salvar seu Codigo secreto para poder buscar suas
                            senhas
                        </TextInputCode>
                        <StyledTextInput
                            placeholder="Salvar seu codigo secreto"
                            value={sendCodeForGetHashCode}
                            onChangeText={setSendCodeForGetHashCode}
                        />
                    </ContentCode>
                    <PressableButton
                        onPress={() =>
                            submitGetHashCode(sendCodeForGetHashCode)
                        }
                    >
                        <ButtonText>Salvar</ButtonText>
                    </PressableButton>
                </ViewSecretCode>
            </ModalComponent>

            {/* modal Para criar senha */}
            <ModalComponent
                visible={modalCreatePasswd}
                onClose={() => setModalCreatePasswd(false)}
            >
                <ViewSecretCode style={{ height: 500 }}>
                    <ContentCode>
                        <TextInputCode>Salve sua senha</TextInputCode>
                        <StyledTextInput
                            placeholder="Nome da sua senha / Plataforma"
                            value={createNewPasswd.name}
                            onChangeText={(text) => handleChange("name", text)}
                        />
                        <StyledTextInput
                            placeholder="E-mail ou Login"
                            value={createNewPasswd.login_email}
                            onChangeText={(text) =>
                                handleChange("login_email", text)
                            }
                        />
                        <StyledTextInput
                            placeholder="Senha"
                            value={createNewPasswd.password}
                            onChangeText={(text) =>
                                handleChange("password", text)
                            }
                        />
                    </ContentCode>
                    <PressableButton onPress={() => submitNewPasswdSend()}>
                        <ButtonText>Salvar</ButtonText>
                    </PressableButton>
                </ViewSecretCode>
            </ModalComponent>

            {/* modal Editar criar senha */}
            <ModalComponent
                visible={modalEditPasswd}
                onClose={() => setModalEditPasswd(false)}
            >
                <ViewSecretCode style={{ height: 500 }}>
                    <ContentCode>
                        <TextInputCode>Editar sua senha</TextInputCode>
                        <StyledTextInput
                            placeholder="Nome da sua senha / Plataforma"
                            value={editPasswd.name}
                            onChangeText={(text) =>
                                handleChangeEdit("name", text)
                            }
                        />
                        <StyledTextInput
                            placeholder="E-mail ou Login"
                            value={editPasswd.login_email}
                            onChangeText={(text) =>
                                handleChangeEdit("login_email", text)
                            }
                        />
                        <StyledTextInput
                            placeholder="Senha"
                            value={editPasswd.password}
                            onChangeText={(text) =>
                                handleChangeEdit("password", text)
                            }
                        />
                    </ContentCode>
                    <PressableButton onPress={() => editPasswds()}>
                        <ButtonText>Editar</ButtonText>
                    </PressableButton>
                </ViewSecretCode>
            </ModalComponent>

            {/* modal Vizualizar criar senha */}
            <ModalComponent
                visible={modalViewPasswd}
                onClose={() => setModalViewPasswd(false)}
            >
                <ViewSecretCode style={{ height: 500 }}>
                    <ContentCode>
                        <TextInputCode>Visualizar</TextInputCode>

                        <ContentViewPassWd>
                            <ContentViewPassWdInput>
                                <Text>Nome da sua senha / Plataforma</Text>
                                <StyledTextInput
                                    placeholder="Nome da sua senha / Plataforma"
                                    value={viewerPasswd.name}
                                    editable={false}
                                    style={{
                                        backgroundColor: "#f0f0f0",
                                        color: "#353535",
                                    }}
                                />
                            </ContentViewPassWdInput>
                        </ContentViewPassWd>
                        <ContentViewPassWd>
                            <ContentViewPassWdInput>
                                <Text>Email ou login</Text>
                                <StyledTextInput
                                    placeholder="E-mail ou Login"
                                    value={viewerPasswd.login_email}
                                    editable={false}
                                    style={{
                                        backgroundColor: "#f0f0f0",
                                        color: "#353535",
                                    }}
                                />
                            </ContentViewPassWdInput>
                            <PressableButton
                                onPress={() => {
                                    Clipboard.setStringAsync(
                                        viewerPasswd.login_email
                                    );
                                    alert(
                                        "Senha copiada para a área de transferência!"
                                    );
                                }}
                            >
                                <ButtonText>Copiar</ButtonText>
                            </PressableButton>
                        </ContentViewPassWd>
                        <ContentViewPassWd>
                            <ContentViewPassWdInput>
                                <Text>Senha</Text>
                                <StyledTextInput
                                    placeholder="Senha"
                                    value={viewerPasswd.password}
                                    editable={false}
                                    style={{
                                        backgroundColor: "#f0f0f0",
                                        color: "#353535",
                                    }}
                                />
                            </ContentViewPassWdInput>
                            <PressableButton
                                onPress={() => {
                                    Clipboard.setStringAsync(
                                        viewerPasswd.password
                                    );
                                    alert(
                                        "Senha copiada para a área de transferência!"
                                    );
                                }}
                            >
                                <ButtonText>Copiar</ButtonText>
                            </PressableButton>
                        </ContentViewPassWd>
                    </ContentCode>
                </ViewSecretCode>
                <PressableButton
                    style={{ backgroundColor: "red" }}
                    onPress={() => handleDeletePassword(viewerPasswd.id)}
                >
                    <ButtonText>Apagar</ButtonText>
                </PressableButton>
            </ModalComponent>
        </ScrollView>
    );
}

export const CardPasswords = styled(View)`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 12px;
    margin-bottom: 10px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
`;

export const InputContainer = styled(View)`
    margin-bottom: 20px;
    width: 100%;
`;

export const InputField = styled(TextInput)`
    width: 80%;
    border-color: #ccc;
    border-width: 1px;
    padding-left: 10px;
    border-radius: 8px;
    font-size: 16px;
`;

interface IPasswd {
    _id: string;
    name: string;
    login_email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

export const Titles = styled(Text)`
    font-size: 14px;
    font-weight: bold;
    color: #2c3e50;
`;

export const PressableContainer = styled(View)`
    margin-top: 10px;
    align-items: flex-end;
`;

export const PressableButton = styled.TouchableOpacity`
    background-color: #3498db;
    padding: 10px 15px;
    border-radius: 5px;
    justify-content: center;
    align-items: center;
`;

export const ButtonText = styled(Text)`
    color: white;
    font-weight: bold;
`;

export const IconContainer = styled(View)`
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
`;

export const ContentButton = styled.View`
    flex-direction: row;
    gap: 10px;
`;

const ViewSecretCode = styled(View)`
    height: 300px;
`;

const StyledTextInput = styled(TextInput)`
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 14px;
    font-size: 16px;
    margin-bottom: 16px;
`;

export const TextInputCode = styled(Text)`
    text-align: center;
    font-size: 16px;
    font-weight: bold;
`;

const ContentCode = styled(View)`
    flex-direction: column;
    gap: 10px;
`;

const ContentViewPassWd = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const ContentViewPassWdInput = styled(View)`
    width: 75%;
`;
