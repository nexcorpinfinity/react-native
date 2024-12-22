import { View, Text, Button, SafeAreaView, ScrollView } from "react-native";
import React, { useContext } from "react";
import { AuthContext, AuthContextProps } from "@/src/context/AuthProvider";
import styled from "styled-components/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  ConfigurationLinks,
} from "@/src/components/ConfigurationLinks";

export const HeaderNameProfile = styled(View)`
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
`;

export const NameProfile = styled(Text)`
  font-size: 17px;
  font-weight: bold;
`;

export const PermissionProfile = styled(Text)`
  font-size: 13px;
`;

export const TitleProfile = styled.View`
  flex-direction: column;
`;

export const IconContainer = styled(View)`
  background-color: #d6d6d6;
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

const routeConfigUser = [
  {
    title: "Dados da sua conta",
    description: "Email, Senha, Código de segurança",
    icon: "shield-account-outline",
    iconLib: "MaterialCommunityIcons",
    routePath: "/(tabs)/configuration/profile",
  },
];

const routeConfigAdmin = [
  {
    title: "Criar um novo usuário",
    description: "Criação de um novo usuário para o aplicativo",
    icon: "user-plus",
    iconLib: "Feather",
    routePath: "/(tabs)/configuration/create",
  },
  {
    title: "Todos Usuários",
    description: "Todos usuários da plataforma",
    icon: "users",
    iconLib: "FontAwesome5",
    routePath: "/(tabs)/configuration/users",
  },
  {
    title: "Contas do alura",
    description: "Emails do alura",
    icon: "email-multiple-outline",
    iconLib: "MaterialCommunityIcons",
    routePath: "/(tabs)/configuration/alura",
  },
];

export default function Configuration() {
  const { user, logout } = useContext<AuthContextProps>(AuthContext);

  console.log(user?.permission);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", padding: 10 }}>
      <HeaderNameProfile>
        <IconContainer>
          <FontAwesome name="user-o" size={34} color="black" />
        </IconContainer>
        <TitleProfile>
          <NameProfile>{user?.name}</NameProfile>
          <PermissionProfile>
            {user?.permission === "admin" ? "Administrador" : ""}
          </PermissionProfile>
        </TitleProfile>
      </HeaderNameProfile>

      <OptionsLinks>
        {routeConfigUser.map((route, index) => (
          <ConfigurationLinks
            key={index}
            title={route.title}
            description={route.description}
            icon={route.icon}
            iconLib={route.iconLib}
            routePath={route.routePath}
            idUser={user?.id}
          />
        ))}

        {user?.permission === "admin" &&
          routeConfigAdmin.map((route, index) => (
            <ConfigurationLinks
              key={index}
              title={route.title}
              description={route.description}
              icon={route.icon}
              iconLib={route.iconLib}
              routePath={route.routePath}
            />
          ))}

        <Button title="Sair" onPress={logout} />
      </OptionsLinks>
    </SafeAreaView>
  );
}
