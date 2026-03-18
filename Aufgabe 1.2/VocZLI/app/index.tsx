import { Text, View, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import VociItem from '../components/VociItem';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { useVoci } from '../context/vociContext';

export default function Index() {
  const { vociList } = useVoci();
  const router = useRouter();

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="book" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Noch keine Vokabeln vorhanden</Text>
      <Text style={styles.emptySubtext}>Füge deine ersten Vokabeln hinzu!</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VocZLI</Text>
      <Text style={styles.subtitle}>Meine Vokabel-Lern-App</Text>

      <FlatList
        data={vociList}
        keyExtractor={(item) => item.term}
        renderItem={({ item }) => <VociItem voci={item} />}
        ListEmptyComponent={renderEmptyComponent}
      />

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] },
        ]}
        onPress={() => router.push("/learn")}
      >
        <Ionicons name="play" size={28} color="#fff" />
      </Pressable>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 8,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#005380",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
