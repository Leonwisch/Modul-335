import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import Voci from "../app/models/voci";
import { Ionicons } from '@expo/vector-icons'; 

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
        <View style={styles.imageContainer}>
          {voci.imageUri ? (
            <Image source={{ uri: voci.imageUri }} style={styles.thumbnail} />
          ) : (
            <View style={[styles.thumbnail, styles.placeholder]}>
              <Ionicons name="image-outline" size={30} color="#bbb" />
            </View>
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.term}>{voci.term}</Text>
          <Text style={styles.translation}>{voci.translation}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', // Wichtig für Bild links, Text rechts
    backgroundColor: "#fff",
    padding: 12, // Etwas weniger Padding, damit es kompakter wirkt
    marginBottom: 12,
    marginHorizontal: 16, // Damit die Karten nicht am Rand kleben
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center', // Zentriert Bild und Text vertikal
  },
  imageContainer: {
    marginRight: 16,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  placeholder: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  textContainer: {
    flex: 1, // Nutzt den restlichen Platz rechts vom Bild
  },
  term: {
    fontSize: 18, // Etwas kleiner, damit es neben das Bild passt
    fontWeight: "bold",
    marginBottom: 2,
    color: "#333",
  },
  translation: {
    fontSize: 15,
    color: "#666",
  },
});