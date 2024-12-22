import { AuthContext } from "@/src/context/AuthProvider";
import { useRouter } from "expo-router";
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
import { createUser } from "@/src/service/users";

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
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("user");

  console.log(role);

  useEffect(() => {
    if (user?.permission !== "admin") {
      router.push("/dashboard");
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    console.log(name, email, password, role);

    try {
      const created = await createUser(name, email, password, role);

      if (created?.status === 201) {
        alert("Usuário criado com sucesso!");
        router.push("/configuration/users");
      }
      console.log(created);
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
        />
        <StyledTextInput
          placeholder="Digite sua senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
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
        <SubmitButton onPress={handleSubmit}>
          <ButtonText>Cadastrar</ButtonText>
        </SubmitButton>
      </InputContainer>
    </Container>
  );
}
