import { View, Text, ScrollView, RefreshControl } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { AuthContext, AuthContextProps } from "@/src/context/AuthProvider";
import { useNavigation } from "expo-router";
import styled from "styled-components/native";
import { getAllUsersCount, getProfileUser } from "@/src/service/users";
import {
    getAllPasswdAdminCount,
    getAllPasswdCount,
} from "@/src/service/passwds";

export default function Dashboard() {
    const { user } = useContext<AuthContextProps>(AuthContext);
    const navigation = useNavigation();
    const [userCount, setUserCount] = useState<number>(0);
    const [passwordCount, setPasswordCount] = useState<number>(0);
    const [passwordCountAllUsers, setPasswordCountAllUsers] =
        useState<number>(0);
    const [nameUser, setNameUser] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: nameUser ? `Olá, ${nameUser}` : "Dashboard",
        });
    }, [nameUser]);

    const fetchDashboardData = async () => {
        if (user?.permission === "admin") {
            const allUsers = await getAllUsersCount();
            const allPasswdsByAdmin = await getAllPasswdAdminCount();

            setPasswordCountAllUsers(allPasswdsByAdmin.data[0]?.count || 0);
            setUserCount(allUsers.data[0]?.count || 0);
        }

        const allPasswds = await getAllPasswdCount();
        const getDataUser = await getProfileUser(String(user?.id));
        setNameUser(getDataUser.data[0]?.user?.name || "Usuário");
        setPasswordCount(allPasswds.data[0]?.count || 0);
    };

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchDashboardData();
        setRefreshing(false);
    };

    return (
        <ScrollView
            style={{ flex: 1, padding: 15, backgroundColor: "#ffffff" }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View>
                <WelcomeText>Meu Dashboard</WelcomeText>
            </View>

            <BlocksContainer>
                {user?.permission === "admin" && (
                    <>
                        <Block>
                            <BlockTitle>Usuários</BlockTitle>
                            <BlockValue>{userCount || 0}</BlockValue>
                        </Block>

                        <Block>
                            <BlockTitle>Total de Senhas Cadastradas</BlockTitle>
                            <BlockValue>{passwordCountAllUsers || 0}</BlockValue>
                        </Block>
                    </>
                )}

                <Block>
                    <BlockTitle>Suas Senhas</BlockTitle>
                    <BlockValue>{passwordCount || 0}</BlockValue>
                </Block>

                <Block>
                    <BlockTitle>Suas Anotações</BlockTitle>
                    <BlockValue>0</BlockValue>
                </Block>
            </BlocksContainer>
        </ScrollView>
    );
}

const WelcomeText = styled(Text)`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
`;

const BlocksContainer = styled(View)`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 5px;
`;

const Block = styled(View)`
    width: 48%;
    padding: 20px;
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    border: 1px solid #ddd;
`;

const BlockTitle = styled(Text)`
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const BlockValue = styled(Text)`
    font-size: 30px;
    font-weight: bold;
    color: #3498db;
`;
