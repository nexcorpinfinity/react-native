import { AuthContext } from "@/src/context/AuthProvider";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
    ScrollView,
    Text,
    View,
    ActivityIndicator,
    TextInput,
    RefreshControl,
} from "react-native";
import styled from "styled-components/native";

import { getAllUsers } from "@/src/service/users";
import { FontAwesome } from "@expo/vector-icons";

interface IUsers {
    _id: string;
    name: string;
    email: string;
    permission: string;
    createdAt: string;
    updatedAt: string;
}

export default function Users() {
    const { user } = useContext(AuthContext);
    const router = useRouter();
    const [users, setUsers] = useState<IUsers[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState<string>("");
    const [refresh, setRefreshing] = useState(false);

    useEffect(() => {
        if (user?.permission !== "admin") {
            router.push("/dashboard");
        }
    }, [user]);

    async function getAllUser() {
        setLoading(true);
        const obj = await getAllUsers();
        setUsers(obj.data[0].users);
        setLoading(false);
    }

    useEffect(() => {
        getAllUser();
    }, []);

    const filteredUsers = users.filter(
        (user: IUsers) =>
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.name.toLowerCase().includes(search.toLowerCase())
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await getAllUser();
        setRefreshing(false);
    };

    return (
        <ScrollView
            style={{
                flex: 1,
                padding: 20,
                backgroundColor: "#fff",
            }}
            refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
            }
        >
            <InputContainer>
                <InputField
                    placeholder="Buscar por nome ou por email"
                    value={search}
                    onChangeText={setSearch}
                />
            </InputContainer>

            {loading && <ActivityIndicator size={40} color="#0084ff" />}

            {filteredUsers.map((user: IUsers) => (
                <CardEmails key={user._id}>
                    <ContentDiv>
                        <IconContainer>
                            <FontAwesome
                                name="user-o"
                                size={25}
                                color="black"
                            />
                        </IconContainer>

                        <PermissionDiv>
                            <Titles>{user.name}</Titles>
                            <Titles>{user.email}</Titles>
                            <PermissionTitle>
                                {user.permission === "admin"
                                    ? "Administrador"
                                    : "User"}
                            </PermissionTitle>
                        </PermissionDiv>
                    </ContentDiv>

                    <PressableButton
                        onPress={() => {
                            router.push(
                                `/(tabs)/configuration/profile/${user._id}`
                            );
                        }}
                    >
                        <ButtonText>Ver</ButtonText>
                    </PressableButton>
                </CardEmails>
            ))}
        </ScrollView>
    );
}

const CardEmails = styled(View)`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 12px;
    margin-bottom: 10px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
`;

const Titles = styled(Text)`
    font-size: 14px;
    font-weight: bold;
    color: #2c3e50;
`;

const ContentDiv = styled(View)`
    flex-direction: row;
    align-items: center;
    gap: 10px;
`;

const PermissionDiv = styled(View)`
    flex-direction: column;
`;

const PermissionTitle = styled(Text)`
    font-size: 12px;
`;

const IconContainer = styled(View)`
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ccc;
    width: 40px;
    height: 40px;
`;

const InputContainer = styled(View)`
    margin-bottom: 20px;
`;

const InputField = styled(TextInput)`
    height: 40px;
    border-color: #ccc;
    border-width: 1px;
    padding-left: 10px;
    border-radius: 8px;
    font-size: 16px;
`;

const PressableContainer = styled(View)`
    margin-top: 10px;
    align-items: flex-end;
`;

const PressableButton = styled.TouchableOpacity`
    background-color: #3498db;
    padding: 10px 15px;
    border-radius: 5px;
    justify-content: center;
    align-items: center;
`;

const ButtonText = styled(Text)`
    color: white;
    font-weight: bold;
`;
