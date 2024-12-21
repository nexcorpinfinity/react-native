import React from "react";
import styled from "styled-components/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface ConfigurationLinksProps {
  title: string;
  description: string;
}

const ConfigurationLinks: React.FC<ConfigurationLinksProps> = ({
  title,
  description,
}) => {
  return (
    <PressableContent
      onPress={() => {}}
      style={({ pressed }) => ({
        backgroundColor: pressed ? "#f0f0f0" : "white",
      })}>
      <ViewOptionsIcon>
        <MaterialCommunityIcons
          name="shield-account-outline"
          size={25}
          color="black"
        />
      </ViewOptionsIcon>
      <ViewOptionsText>
        <OptionsText>{title}</OptionsText>
        <OptionsTextDescription>{description}</OptionsTextDescription>
      </ViewOptionsText>
    </PressableContent>
  );
};

const PressableContent = styled.Pressable`
  border: 1px solid #ccc;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const ViewOptionsIcon = styled.View`
  padding: 0px 5px;
`;

const ViewOptionsText = styled.View``;

const OptionsText = styled.Text`
  font-size: 14px;
  font-weight: bold;
`;

const OptionsTextDescription = styled.Text`
  font-size: 12px;
  color: gray;
`;

export { ConfigurationLinks };
