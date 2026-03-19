import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { File, Paths } from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

interface ImagePickerButtonProps {
  imageUri?: string;
  onImageSelected: (uri: string) => void;
}

// Hilfsfunktion: Bild komprimieren und in permanentes App-Directory kopieren
const copyImageToAppDirectory = async (imageUri: string): Promise<string> => {
  try {
    // 1. Bild komprimieren mit neuem API
    const context = ImageManipulator.manipulate(imageUri)
      .resize({ width: 800 }); // Max. 800px Breite

    const imageRef = await context.renderAsync();
    const manipulatedImage = await imageRef.saveAsync({
      compress: 0.7, // Quality: 0.7
      format: SaveFormat.JPEG,
    });

    // 2. Komprimiertes Bild ins permanente Directory kopieren
    const filename = `${Date.now()}.jpg`;
    const sourceFile = new File(manipulatedImage.uri);
    const destinationFile = new File(Paths.document, filename);
    sourceFile.copy(destinationFile);

    console.log("Bild komprimiert und kopiert nach:", destinationFile.uri);
    return destinationFile.uri;
  } catch (error) {
    console.error("Fehler beim Kopieren des Bildes:", error);
    throw error;
  }
};

// Hilfsfunktion: Altes Bild löschen
const deleteImageFromAppDirectory = async (imageUri: string): Promise<void> => {
  try {
    // Nur löschen wenn es im documentDirectory ist (nicht Cache)
    if (imageUri.startsWith(Paths.document.uri)) {
      const file = new File(imageUri);
      file.delete();
      console.log("Bild gelöscht:", imageUri);
    }
  } catch (error) {
    console.error("Fehler beim Löschen des Bildes:", error);
  }
};

export default function ImagePickerButton({ imageUri, onImageSelected }: ImagePickerButtonProps) {
  const handlePress = () => {
    if (Platform.OS === "web") {
      // Im Web: Direkt Galerie öffnen (Kamera in Browser komplizierter)
      pickFromGallery();
    } else {
      // Native: Alert mit Optionen anzeigen (dynamisch je nach imageUri)
      const buttons: any[] = [
        {
          text: "Foto aufnehmen",
          onPress: takePhoto,
        },
        {
          text: "Aus Galerie wählen",
          onPress: pickFromGallery,
        },
      ];

      // Wenn Bild vorhanden, "Bild entfernen" Option hinzufügen
      if (imageUri) {
        buttons.push({
          text: "Bild entfernen",
          style: "destructive",
          onPress: async () => {
            await deleteImageFromAppDirectory(imageUri);
            onImageSelected("");
          },
        });
      }

      buttons.push({
        text: "Abbrechen",
        style: "cancel",
      });

      Alert.alert("Bild auswählen", "Woher möchten Sie das Bild nehmen?", buttons);
    }
  };

  const takePhoto = async () => {
    try {
      // Kamera-Permission anfragen
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Fehler", "Kamera-Zugriff benötigt!");
        return;
      }

      // Kamera öffnen
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // Altes Bild löschen wenn vorhanden
        if (imageUri) {
          await deleteImageFromAppDirectory(imageUri);
        }

        // Neues Bild in permanentes Directory kopieren
        const permanentUri = await copyImageToAppDirectory(result.assets[0].uri);
        onImageSelected(permanentUri);
      }
    } catch (error) {
      console.error("Fehler beim Foto aufnehmen:", error);
      Alert.alert("Fehler", "Foto konnte nicht aufgenommen werden.");
    }
  };

  const pickFromGallery = async () => {
    try {
      // Galerie-Permission anfragen
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Fehler", "Galerie-Zugriff benötigt!");
        return;
      }

      // Galerie öffnen
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // Altes Bild löschen wenn vorhanden
        if (imageUri) {
          await deleteImageFromAppDirectory(imageUri);
        }

        // Neues Bild in permanentes Directory kopieren
        const permanentUri = await copyImageToAppDirectory(result.assets[0].uri);
        onImageSelected(permanentUri);
      }
    } catch (error) {
      console.error("Fehler beim Bild auswählen:", error);
      Alert.alert("Fehler", "Bild konnte nicht ausgewählt werden.");
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Bild hinzufügen</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
  },
});
