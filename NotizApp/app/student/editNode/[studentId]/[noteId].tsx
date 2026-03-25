import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useStudents } from '../../../../context/studentContext';

export default function EditNoteScreen() {
  const { studentId, noteId } = useLocalSearchParams();
  const { students, updateDailyNote, deleteDailyNote } = useStudents();
  const router = useRouter();

  const student = students.find(s => String(s.id) === String(studentId));
  const note = student?.dailyNotes.find(n => String(n.id) === String(noteId));

  const [content, setContent] = useState(note?.content || '');

  useEffect(() => {
    if (note) {
      setContent(note.content);
    }
  }, [note]);

  if (!student || !note) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Notiz konnte nicht geladen werden.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Zurück</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSave = async () => {
    if (content.trim() === '') return;
    await updateDailyNote(student.id, note.id, content);
    router.back();
  };

  const handleDelete = () => {
    Alert.alert("Löschen", "Soll dieser Eintrag wirklich entfernt werden?", [
      { text: "Abbrechen", style: "cancel" },
      {
        text: "Löschen",
        style: "destructive",
        onPress: async () => {
          await deleteDailyNote(student.id, note.id);
          router.back();
        }
      }
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'android' ? 30 : 0}
    >
      <Stack.Screen options={{ title: "Eintrag bearbeiten" }} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerInfo}>
          <Text style={styles.dateLabel}>Eintrag vom {note.date}</Text>
          <Text style={styles.studentName}>{student.firstName} {student.lastName}</Text>
        </View>

        <TextInput
          multiline
          style={styles.input}
          value={content}
          onChangeText={setContent}
          placeholder="Notizinhalt..."
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Änderungen speichern</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Eintrag löschen</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContent: {
    padding: 20
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerInfo: {
    marginBottom: 15
  },
  dateLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  input: {
    minHeight: 200,
    fontSize: 16,
    lineHeight: 24,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
    color: '#333'
  },
  saveButton: {
    backgroundColor: '#b2fab4', 
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 12,
    elevation: 2 
  },
  deleteButton: {
    backgroundColor: '#ffaaaa', 
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    elevation: 2
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333'
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20
  },
  backBtn: {
    padding: 10
  },
  backBtnText: {
    color: '#007AFF',
    fontWeight: 'bold'
  }
});