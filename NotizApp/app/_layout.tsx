import { Stack } from "expo-router";
import { StudentProvider } from "../context/studentContext";

export default function RootLayout() {
  return (
    <StudentProvider>
      <Stack />
    </StudentProvider>
  );
}