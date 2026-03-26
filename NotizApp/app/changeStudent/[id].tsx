import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useStudents } from '../../context/studentContext';
import { StudentForm } from '../../components/studentForm';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';

export default function EditStudentScreen() {
  const { id } = useLocalSearchParams();
  const { students, updateStudent, deleteStudent } = useStudents();
  const router = useRouter();

  const student = students.find(s => s.id === id);

  const [selectedImage, setSelectedImage] = useState<string | undefined>(student?.avatarUri);

  if (!student) {
    return (
      <View style={styles.center}>
        <Text>Schüler wurde nicht gefunden.</Text>
      </View>
    );
  }

  const pickImage = async () => {
    Alert.alert(
      "Profilbild ändern",
      "Möchtest du ein Foto aufnehmen oder eines aus der Galerie wählen?",
      [
        { text: "Kamera", onPress: openCamera },
        { text: "Galerie", onPress: openLibrary },
        { text: "Bild entfernen", style: "destructive", onPress: () => setSelectedImage(undefined) },
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
    if (!result.canceled) setSelectedImage(result.assets[0].uri);
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
    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };


  const handleUpdate = async (firstName: string, lastName: string) => {
    await updateStudent(student.id, firstName, lastName, selectedImage);
    router.back(); 
  };

  const handleDelete = async () => {
    Alert.alert("Löschen", "Soll dieser Schüler wirklich gelöscht werden?", [
      { text: "Abbrechen", style: "cancel" },
      { text: "Löschen", style: "destructive", onPress: async () => {
          await deleteStudent(student.id);
          router.replace('/');
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `${student.firstName} bearbeiten` }} />
      
      <StudentForm 
        initialFirstName={student.firstName} 
        initialLastName={student.lastName}
        selectedImage={selectedImage} 
        onPickImage={pickImage}       
        onDelete={handleDelete}
        onSave={handleUpdate}
        buttonTitle="Änderungen speichern"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});