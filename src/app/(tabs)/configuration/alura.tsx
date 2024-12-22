import { AuthContext } from "@/src/context/AuthProvider";
import { getAllAlura } from "@/src/service/alura";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components/native";
import * as Clipboard from "expo-clipboard";
import { MaterialIcons } from "@expo/vector-icons";

export const CardEmails = styled(View)`
  padding: 20px;
  background-color: #d3d3d3;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.5);
  flex-direction: column;
  gap: 10px;
`;

export const Titles = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
`;

export const TitlesDiv = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const EmailInfo = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const EmailDiv = styled(View)`
  flex-direction: column;
`;

export const Emails = styled(Text)`
  font-size: 16px;
  color: #34495e;
`;

export const Button = styled(TouchableOpacity)`
  background-color: #3498db;
  padding: 5px 10px;
  border-radius: 5px;
  gap: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const ButtonText = styled(Text)`
  color: #fff;
  font-weight: bold;
  font-size: 14px;
`;

export const CopyIcon = styled(MaterialIcons)`
  color: #fff;
`;

interface AluraEmail {
  _id: string;
  email: string;
  expiracao: string;
  plataforma: string;
  senha: string;
}

export default function Alura() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [emails, setEmails] = useState<AluraEmail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.permission !== "admin") {
      router.push("/dashboard");
    }
  }, [user]);

  useEffect(() => {
    async function getAllEmails() {
      setLoading(true);
      const obj = await getAllAlura();
      setEmails(obj);
      setLoading(false);
    }

    getAllEmails();
  }, []);

  const copyEmail = (email: string) => {
    Clipboard.setString(email);
    Alert.alert(
      "Email Copiado",
      "O email foi copiado para a área de transferência."
    );
  };

  const copySenha = (senha: string) => {
    Clipboard.setString(senha);
    Alert.alert(
      "Senha Copiada",
      "A senha foi copiada para a área de transferência."
    );
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
      }}>
      {loading && <ActivityIndicator size={40} color="#0084ff" />}
      {emails.map((email) => (
        <CardEmails key={email._id}>
          <TitlesDiv>
            <Titles>Plataforma: {email.plataforma}</Titles>
          </TitlesDiv>

          <EmailInfo>
            <EmailDiv>
              <TitlesDiv>
                <Titles>Email:</Titles>
                <Button onPress={() => copyEmail(email.email)}>
                  <ButtonText>Copiar Email</ButtonText>
                  <CopyIcon name="content-copy" size={16} />
                </Button>
              </TitlesDiv>
              <Emails>{email.email}</Emails>
            </EmailDiv>
          </EmailInfo>

          <EmailInfo>
            <EmailDiv>
              <TitlesDiv>
                <Titles>Senha:</Titles>
                <Button onPress={() => copySenha(email.senha)}>
                  <ButtonText>Copiar Senha</ButtonText>
                  <CopyIcon name="content-copy" size={16} />
                </Button>
              </TitlesDiv>
              <Emails>{email.senha}</Emails>
            </EmailDiv>
          </EmailInfo>

          <EmailDiv>
            <Titles>Expiração:</Titles>
            <Emails>{email.expiracao}</Emails>
          </EmailDiv>
        </CardEmails>
      ))}
    </ScrollView>
  );
}
