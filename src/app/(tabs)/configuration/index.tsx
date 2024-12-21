import { View, Text, Button, SafeAreaView, ScrollView } from "react-native";
import React, { useContext } from "react";
import { Link } from "expo-router";
import { AuthContext, AuthContextProps } from "@/src/context/AuthProvider";
import styled from "styled-components/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { ConfigurationLinks } from "@/src/components/ConfigurationLinks";

export const HeaderNameProfile = styled(View)`
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  background-color: #d6d6d6;
  border-radius: 10px;
`;

export const NameProfile = styled(Text)`
  font-size: 17px;
  font-weight: bold;
`;

export const IconContainer = styled(View)`
  background-color: white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OptionsLinks = styled(ScrollView)`
  margin-top: 10px;
`;

const routeConfig = [
  {
    name: "Dados da sua conta",
    description: "Email, Senha, Código de segurança",
    icon: "shield-account-outline",
    iconLib: "MaterialCommunityIcons",
  },
  {
    name: "Dados da sua conta",
    description: "Email, Senha, Código de segurança",
    icon: "shield-account-outline",
    iconLib: "MaterialCommunityIcons",
  },
];

export default function User() {
  const admin = true;
  const { user, logout } = useContext<AuthContextProps>(AuthContext);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", padding: 10 }}>
      <HeaderNameProfile>
        <IconContainer>
          <FontAwesome name="user-o" size={34} color="black" />
        </IconContainer>
        <NameProfile>{user?.name}</NameProfile>
      </HeaderNameProfile>

      <OptionsLinks>

        {routeConfig.map((route) => (
          <ConfigurationLinks
            key={route.name}
            title={route.name}
            description={route.description}
            icon={route.icon}
          />
        ))}


        {admin && <Link href={"/(tabs)/configuration/profile"}>Profile </Link>}
        <Button title="Sair" onPress={logout} />
      </OptionsLinks>
    </SafeAreaView>
  );
}
