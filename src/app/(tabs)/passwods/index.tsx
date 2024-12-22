import {
  createPasswd,
  deletePasswd,
  getAllPasswd,
  updatePasswd,
} from "@/src/service/passwds";
import React, { useEffect, useState } from "react";
import {
  Text,
  ScrollView,
  View,
  ActivityIndicator,
  TextInput,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import styled from "styled-components/native";
import * as Clipboard from "expo-clipboard";
import { FontAwesome } from "@expo/vector-icons";

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

export const ModalContent = styled(View)`
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  align-self: center;
`;

export const ModalTitle = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const ModalButton = styled(TouchableOpacity)`
  background-color: #e74c3c;
  padding: 10px 15px;
  border-radius: 5px;
  margin-top: 20px;
  align-items: center;
`;

export const ModalButtonText = styled(Text)`
  color: white;
  font-weight: bold;
`;

export const ContentButton = styled.View`
  flex-direction: row;
  gap: 10px;
`;

export default function MyPasswd() {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [passwds, setPasswds] = useState<IPasswd[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [selectedPasswd, setSelectedPasswd] = useState<IPasswd | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editPassword, setEditPassword] = useState<string>("");

  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [createName, setCreateName] = useState<string>("");
  const [createPassword, setCreatePassword] = useState<string>("");

  const handleCreatePassword = async () => {
    try {
      const newPassword = await createPasswd(createName, createPassword);

      if (newPassword?.status === 400) {
        return alert(newPassword?.data);
      }

      getAllPasswds();
      closeCreateModal();
    } catch (error) {
      console.error(error);
    }
  };

  const closeCreateModal = () => {
    setCreateModalVisible(false);
    setCreateName("");
    setCreatePassword("");
  };

  async function getAllPasswds() {
    setLoading(true);
    try {
      const obj = await getAllPasswd();

      const sortedPasswds = obj.sort(
        (
          a: { createdAt: string | number | Date },
          b: { createdAt: string | number | Date }
        ) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
      );

      setPasswds(sortedPasswds);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllPasswds();
  }, []);

  const filteredUsers = passwds.filter((passwd) =>
    passwd.name.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (passwd: IPasswd) => {
    setSelectedPasswd(passwd);
    setModalVisible(true);
  };

  const openEditModal = (passwd: IPasswd) => {
    setSelectedPasswd(passwd);
    setEditName(passwd.name);
    setEditPassword(passwd.password);
    setEditModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPasswd(null);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setSelectedPasswd(null);
  };

  const handleBackdropPress = () => {
    closeModal();
    closeEditModal();
    closeCreateModal();
    Keyboard.dismiss();
  };

  const handleSaveEdit = async () => {
    try {
      const updated = await updatePasswd(
        String(selectedPasswd?._id),
        editName,
        editPassword
      );

      if (updated?.status === 200) {
        getAllPasswds();
        closeEditModal();
      }

      return alert(
        "Ocorreu um erro por favor entre em contato com o administrador"
      );
    } catch (error) {
      console.error(error);
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
              const a = await deletePasswd(String(id));
              console.log(a);
              getAllPasswds();
              closeModal();
            } catch (error) {
              console.error("Erro ao apagar a senha", error);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1, padding: 15, backgroundColor: "white" }}>
      <InputContainer
        style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <InputField
          placeholder="Buscar por nome ou senha"
          value={search}
          onChangeText={setSearch}
        />
        <PressableButton onPress={() => setCreateModalVisible(true)}>
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
            <PressableButton onPress={() => openModal(passwd)}>
              <ButtonText>Ver</ButtonText>
            </PressableButton>
          </ContentButton>
        </CardPasswords>
      ))}

      {/* Modal de Visualização */}
      {modalVisible && selectedPasswd && (
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={closeModal}>
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}>
              <TouchableWithoutFeedback>
                <ModalContent>
                  <ModalTitle>Detalhes da Senha</ModalTitle>
                  <Titles>Nome: {selectedPasswd.name}</Titles>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Titles style={{ marginRight: 10 }}>
                      Senha: {selectedPasswd.password}
                    </Titles>
                    <TouchableOpacity
                      onPress={() => {
                        Clipboard.setStringAsync(selectedPasswd.password);
                        alert("Senha copiada para a área de transferência!");
                      }}>
                      <FontAwesome name="clipboard" size={20} color="black" />
                    </TouchableOpacity>
                  </View>

                  <ModalButton onPress={closeModal}>
                    <ModalButtonText>Fechar</ModalButtonText>
                  </ModalButton>

                  <ModalButton
                    onPress={() => handleDeletePassword(selectedPasswd._id)}>
                    <ModalButtonText>Apagar Senha</ModalButtonText>
                  </ModalButton>
                </ModalContent>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
      {editModalVisible && selectedPasswd && (
        <Modal
          transparent={true}
          visible={editModalVisible}
          animationType="slide"
          onRequestClose={closeEditModal}>
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}>
              <TouchableWithoutFeedback>
                <ModalContent>
                  <ModalTitle>Editar Senha</ModalTitle>
                  <TextInput
                    placeholder="Nome"
                    value={editName}
                    onChangeText={setEditName}
                    style={{
                      height: 40,
                      borderColor: "#ccc",
                      borderWidth: 1,
                      paddingLeft: 10,
                      borderRadius: 8,
                      marginBottom: 10,
                    }}
                  />
                  <TextInput
                    placeholder="Senha"
                    value={editPassword}
                    onChangeText={setEditPassword}
                    style={{
                      height: 40,
                      borderColor: "#ccc",
                      borderWidth: 1,
                      paddingLeft: 10,
                      borderRadius: 8,
                      marginBottom: 10,
                    }}
                  />

                  <ContentButton>
                    <PressableButton onPress={handleSaveEdit}>
                      <ButtonText>Salvar</ButtonText>
                    </PressableButton>
                    <PressableButton onPress={closeEditModal}>
                      <ButtonText>Cancelar</ButtonText>
                    </PressableButton>
                  </ContentButton>
                </ModalContent>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      {createModalVisible && (
        <Modal
          transparent={true}
          visible={createModalVisible}
          animationType="slide"
          onRequestClose={closeCreateModal}>
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}>
              <TouchableWithoutFeedback>
                <ModalContent>
                  <ModalTitle>Criar Nova Senha</ModalTitle>
                  <TextInput
                    placeholder="Nome da Plataforma"
                    value={createName}
                    onChangeText={setCreateName}
                    style={{
                      height: 40,
                      borderColor: "#ccc",
                      borderWidth: 1,
                      paddingLeft: 10,
                      borderRadius: 8,
                      marginBottom: 10,
                    }}
                  />
                  <TextInput
                    placeholder="Senha"
                    value={createPassword}
                    onChangeText={setCreatePassword}
                    style={{
                      height: 40,
                      borderColor: "#ccc",
                      borderWidth: 1,
                      paddingLeft: 10,
                      borderRadius: 8,
                      marginBottom: 10,
                    }}
                  />

                  <ContentButton>
                    <PressableButton onPress={handleCreatePassword}>
                      <ButtonText>Salvar</ButtonText>
                    </PressableButton>
                    <PressableButton onPress={closeCreateModal}>
                      <ButtonText>Cancelar</ButtonText>
                    </PressableButton>
                  </ContentButton>
                </ModalContent>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </ScrollView>
  );
}
