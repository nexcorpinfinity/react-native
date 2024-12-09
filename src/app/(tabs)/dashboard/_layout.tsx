import { Stack } from "expo-router";
import { useState } from "react";

export default function Layout() {
  return (
    <Stack >
      <Stack.Screen name="index" options={{ title: "Dashboard" }} />
    </Stack>
  );
}
