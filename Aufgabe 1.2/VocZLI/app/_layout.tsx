import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2dd2bc',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Meine Vokabeln",
        }}
      />
      <Stack.Screen
        name="learn"
        options={{
          title: "Vokabeln lernen",
        }}
      />
    </Stack>
  );
}