import { View, StyleSheet, Alert } from 'react-native';
import { useStudents } from '../context/studentContext';
import { StudentForm } from '../components/studentForm'; 
import { useRouter, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';

export default function AddStudentScreen() {
  const { addStudent } = useStudents();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const pickImage = async () => {
    Alert.alert(
      "Profilbild hinzufügen",
      "Möchtest du ein Foto aufnehmen oder eines aus der Galerie wählen?",
      [
        { text: "Kamera", onPress: openCamera },
        { text: "Galerie", onPress: openLibrary },
        { text: "Abbrechen", style: "cancel" }
      ]
    );
  };

  const openLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Zugriff auf Galerie verweigert!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Zugriff auf Kamera verweigert!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSave = async (firstName: string, lastName: string) => {
    if (firstName.trim() === '' || lastName.trim() === '') return;
    
    await addStudent(firstName, lastName, selectedImage);
    router.back(); 
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Neuer Schüler' }} />
      <StudentForm 
        onSave={handleSave} 
        buttonTitle="Schüler anlegen" 
        selectedImage={selectedImage}
        onPickImage={pickImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});