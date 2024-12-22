import React from "react";
import styled from "styled-components/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";
import { RelativePathString, useRouter } from "expo-router";

export interface ConfigurationLinksProps {
  title: string;
  description: string;
  icon: string;
  iconLib: string;
  routePath: string;
  idUser?: string;
}

const ConfigurationLinks: React.FC<ConfigurationLinksProps> = ({
  title,
  description,
  icon,
  iconLib,
  routePath,
  idUser,
}) => {
  const router = useRouter();

  const renderIcon = () => {
    switch (iconLib) {
      case "MaterialCommunityIcons":
        return <MaterialCommunityIcons name={icon} size={25} color="black" />;
      case "FontAwesome5":
        return <FontAwesome5 name={icon} size={20} color="black" />;
      case "Feather":
        return <Feather name={icon} size={25} color="black" />;
      default:
        return null;
    }
  };

  const convertPath = (routePath: string): RelativePathString => {
    if (routePath.startsWith("/")) {
      return routePath.slice(1) as RelativePathString;
    }

    return routePath as RelativePathString;
  };

  return (
    <PressableContent
      onPress={() => {
        if (idUser && routePath === "/(tabs)/configuration/profile") {
          return router.push(convertPath(`/(tabs)/configuration/profile/${idUser}`));
        }
        router.push(convertPath(routePath));
      }}
      style={({ pressed }) => ({
        backgroundColor: pressed ? "#f0f0f0" : "white",
      })}>
      <ViewOptionsIcon>
        {renderIcon()}
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
