import { View, Text, ScrollView } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { AuthContext, AuthContextProps } from "@/src/context/AuthProvider";
import { useNavigation } from "expo-router";
import styled from "styled-components/native";
import { getAllUsers } from "@/src/service/users";
import { getAllPasswd } from "@/src/service/passwds";

export default function Dashboard() {
  const { user } = useContext<AuthContextProps>(AuthContext);
  const navigation = useNavigation();
  const [userCount, setUserCount] = useState<number>(0);
  const [passwordCount, setPasswordCount] = useState<number>(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: user?.name ? `Olá, ${user?.name}` : "Dashboard",
    });
  }, [user]);

  useEffect(() => {
    async function getAllDataDash() {
      const allUsers = await getAllUsers();
      const allPasswds = await getAllPasswd();

      setUserCount(allUsers.length);
      setPasswordCount(allPasswds.length);
    }

    getAllDataDash();
  }, [user]);

  return (
    <ScrollView style={{ flex: 1, padding: 15, backgroundColor: "#ffffff" }}>
      <View>
        <WelcomeText>Meu Dashboard</WelcomeText>
      </View>

      <BlocksContainer>
        {user?.permission === "admin" && (
          <>
            <Block>
              <BlockTitle>Usuários</BlockTitle>
              <BlockValue>{userCount ? userCount : 0}</BlockValue>
            </Block>

            <Block>
              <BlockTitle>Total de Senhas</BlockTitle>
              <BlockValue>0</BlockValue>
            </Block>
          </>
        )}

        <Block>
          <BlockTitle>Suas Senhas</BlockTitle>
          <BlockValue>{passwordCount ? passwordCount : 0}</BlockValue>
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
