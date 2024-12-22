import { View, Text, ActivityIndicator, SafeAreaView } from "react-native";
import React, { useContext, useEffect } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { getProfileUser } from "@/src/service/users";
import { AuthContext } from "@/src/context/AuthProvider";
import styled from "styled-components/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

interface IUsers {
  _id: string;
  name: string;
  email: string;
  permission: string;
  createdAt: string;
  updatedAt: string;
}

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
  font-size: 16px;
  font-weight: bold;
`;

export const DescriptionProfile = styled(Text)`
  font-size: 14px;
  font-weight: bold;
`;

export const PermissionProfile = styled(Text)`
  font-size: 13px;
`;

export const TitleProfile = styled(View)`
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

export const Description = styled.View`
  margin-top: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
`;

export const TitleDescription = styled.Text``;

export const ButtonContainer = styled(View)`
  margin-top: 20px;
  flex-direction: row;
  gap: 20px;
`;

export const Button = styled.TouchableOpacity`
  background-color: #0084ff;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const ButtonText = styled(Text)`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export default function Profile() {
  const { logout, user } = useContext(AuthContext);
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = React.useState(false);
  const [loadingDate, setLoadingDate] = React.useState(false);

  const [userProfile, setUserProfile] = React.useState<IUsers | null>(null);

  useEffect(() => {
    if (!id) {
      const sair = async () => await logout();
      sair();
    }
    async function getProfile() {
      setLoading(true);

      const userApi = await getProfileUser(String(id));

      setUserProfile(userApi);
      setLoading(false);
    }

    getProfile();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
      date.getSeconds()
    ).padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
      {loading && <ActivityIndicator size={40} color="#0084ff" />}

      <HeaderNameProfile>
        <IconContainer>
          <FontAwesome name="user-o" size={34} color="black" />
        </IconContainer>
        <TitleProfile>
          <NameProfile>{userProfile?.name}</NameProfile>
          <PermissionProfile>
            {userProfile?.permission === "admin"
              ? "Administrador"
              : userProfile?.permission === "user" && "Usuário"}
          </PermissionProfile>
        </TitleProfile>
      </HeaderNameProfile>

      <Description>
        <DescriptionProfile>
          E-mail: {userProfile?.email ? userProfile?.email : "Carregando..."}
        </DescriptionProfile>
        <DescriptionProfile>
          Criado Em:{" "}
          {userProfile?.createdAt
            ? formatDate(String(userProfile?.createdAt))
            : "00/00/00 00:00:00"}
        </DescriptionProfile>
        <DescriptionProfile>
          Atualizado em:{" "}
          {userProfile?.updatedAt
            ? formatDate(String(userProfile?.updatedAt))
            : "00/00/00 00:00:00"}
        </DescriptionProfile>
      </Description>

      <ButtonContainer>
        <Button onPress={() => {}}>
          <ButtonText>Editar</ButtonText>
        </Button>

        {user?.permission === "admin" && id !== user.id && (
          <Button onPress={() => {}}>
            <ButtonText>Deletar</ButtonText>
          </Button>
        )}
      </ButtonContainer>
    </SafeAreaView>
  );
}
