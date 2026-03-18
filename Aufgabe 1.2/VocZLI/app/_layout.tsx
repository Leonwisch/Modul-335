import { VociProvider } from '../context/vociContext';
import { Stack, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

export default function RootLayout() {
  const router = useRouter();

  return (
    <VociProvider>
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
            headerRight: () => (
              <Pressable 
                onPress={() => router.push('/addVoci')}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.5 : 1,
                  marginRight: 10,
                })}
              >
                <Ionicons name="add" size={28} color="white" />
              </Pressable>
            ),
          }}
        />
      <Stack.Screen
        name="learn"
        options={{
          title: "Vokabeln lernen",
        }}
      />
      <Stack.Screen
        name="addVoci"
        options={{
          title: "Neue Vokabel hinzufügen",
          presentation: 'modal', 
        }}
      />
    </Stack>
    </VociProvider>
  );
}