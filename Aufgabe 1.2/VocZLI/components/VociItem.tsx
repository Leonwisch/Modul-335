import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Voci from "../app/models/voci";

interface VociItemProps {
  voci: Voci;
}

export default function VociItem({ voci }: VociItemProps) {
    const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push(`/editVoci?term=${encodeURIComponent(voci.term)}`)}
    >
      <View style={styles.card}>
        <Text style={styles.term}>{voci.term}</Text>
        <Text style={styles.translation}>{voci.translation}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  term: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  translation: {
    fontSize: 16,
    color: "#666",
  },
});