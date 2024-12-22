import { AuthContext } from "@/src/context/AuthProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styled from "styled-components/native";

import { Picker } from "@react-native-picker/picker";
import { getProfileUser, updateProfile } from "@/src/service/users";

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
  padding: 14px;
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

export default function CreateUser() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("user");

  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (!id) {
      const sair = async () => await logout();
      sair();
    }

    async function getProfile() {
      try {
        const userApi = await getProfileUser(String(id));

        setName(userApi.name);
        setEmail(userApi.email);

        setRole(userApi.permission);
      } catch (error) {
        console.log(error);
      }
    }

    getProfile();
  }, []);

  const handleSubmit = async () => {
    const data = {
      name: name,
      email: email,
      password: password,
      permission: role,
    };

    try {
      if (user?.permission === "admin" && id !== user.id) {
        const updatePorfileForAdmin = await updateProfile(data, String(id));

        if (updatePorfileForAdmin.msg === "Usuário atualizado com sucesso!") {
          return router.push("/(tabs)/configuration/users");
        }
      }

      const updateUser = await updateProfile(data);

      if (updateUser.msg === "Usuário atualizado com sucesso!") {
        return router.push("/(tabs)/configuration");
      }

      // se ocorreu algum erro
      return alert("Ocorreu algum erro verifique com o administrador");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <InputContainer>
        <StyledTextInput
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
        <StyledTextInput
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          editable={user?.permission === "admin" ? true : false}
          style={{
            backgroundColor:
              user?.id === id && user.permission !== "admin" ? "#ccc" : "",
          }}
        />
        {/* <StyledTextInput
          placeholder="Senha antiga"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        /> */}
        <StyledTextInput
          placeholder="Nova senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        {user?.permission === "admin" && (
          <View
            style={{
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 8,
              marginBottom: 16,
            }}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue: React.SetStateAction<string>) =>
                setRole(itemValue)
              }
              style={{}}>
              <Picker.Item label="Permissão Administrador" value="admin" />
              <Picker.Item label="Permissão Comum" value="user" />
            </Picker>
          </View>
        )}
        <SubmitButton onPress={handleSubmit}>
          <ButtonText>Editar dados</ButtonText>
        </SubmitButton>
      </InputContainer>
    </Container>
  );
}
