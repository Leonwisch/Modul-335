import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import Voci from '../app/models/voci';

interface VociDetailProps {
  onSave: (voci: Voci) => void;
}

export default function VociDetail({ onSave }: VociDetailProps) {
  const [term, setTerm] = useState('');
  const [translation, setTranslation] = useState('');

  const handleSave = () => {
    if (term.trim() === '' || translation.trim() === '') {
      Alert.alert("Fehler", "Bitte fülle beide Felder aus.");
      return;
    }

    const newVoci: Voci = {
      term: term.trim(),
      translation: translation.trim(),
    };

    onSave(newVoci);

    setTerm('');
    setTranslation('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Begriff (Englisch)</Text>
      <TextInput
        style={styles.input}
        placeholder="z.B. Tree"
        value={term}
        onChangeText={setTerm}
      />

      <Text style={styles.label}>Übersetzung (Deutsch)</Text>
      <TextInput
        style={styles.input}
        placeholder="z.B. Baum"
        value={translation}
        onChangeText={setTranslation}
      />

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Vokabel speichern</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    backgroundColor: '#25292e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});