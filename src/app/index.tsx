import React from "react";
import { View, Text } from "react-native";
import { Link } from "expo-router";

import styled from "styled-components/native";

export default function Home() {
  return (
    <View>
      <Text>Home</Text>
      <Link href={"/login"}>Ir para login </Link>
      <Link href={"/user"}>Ir para user</Link>
      <Link href={"/user/profile"}>Ir para user profile</Link>
      <Link href={"/passwods/mypass"}>Ir para minhas senhas</Link>
    </View>
  );
}
