import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useStudents } from '../../../../context/studentContext';
import { Ionicons } from '@expo/vector-icons';

export default function EditNoteScreen() {
    const { studentId, noteId } = useLocalSearchParams();
    const { students, updateDailyNote, deleteDailyNote, toggleFavoriteNote } = useStudents();
    const router = useRouter();

    const student = students.find(s => s.id === studentId);
    const note = student?.dailyNotes.find(n => n.id === noteId);

    const [title, setTitle] = useState(note?.title || '');
    const [content, setContent] = useState(note?.content || '');

    useEffect(() => {
        if (note) {
            setTitle(note.title || '');
            setContent(note.content || '');
        }
    }, [note]);

    if (!student || !note) {
        return (
            <View style={styles.center}>
                <Text>Notiz nicht gefunden.</Text>
            </View>
        );
    }

    const handleSave = async () => {
        if (content.trim() === '') {
            Alert.alert("Fehler", "Der Inhalt darf nicht leer sein.");
            return;
        }
        await updateDailyNote(student.id, note.id, content, title);
        router.back();
    };

    const handleDelete = () => {
        Alert.alert(
            "Löschen",
            "Möchtest du diese Notiz wirklich löschen?",
            [
                { text: "Abbrechen", style: "cancel" },
                { 
                    text: "Löschen", 
                    style: "destructive", 
                    onPress: async () => {
                        await deleteDailyNote(student.id, note.id);
                        router.back();
                    } 
                }
            ]
        );
    };

    const handleToggleFavorite = async () => {
        await toggleFavoriteNote(student.id, note.id);
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100}
        >
            <Stack.Screen options={{ 
                title: "Notiz bearbeiten",
                headerRight: () => (
                    <TouchableOpacity onPress={handleToggleFavorite} style={{ marginRight: 15 }}>
                        <Ionicons 
                            name={note.isFavorite ? "star" : "star-outline"} 
                            size={24} 
                            color={note.isFavorite ? "#FFD700" : "#333"} 
                        />
                    </TouchableOpacity>
                )
            }} />

            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <Text style={styles.label}>Titel</Text>
                <TextInput
                    style={styles.titleInput}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Titel der Notiz..."
                />

                <Text style={styles.label}>Inhalt</Text>
                <TextInput
                    style={styles.contentInput}
                    value={content}
                    onChangeText={setContent}
                    placeholder="Was ist heute passiert?"
                    multiline
                    textAlignVertical="top"
                />

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                        <Text style={styles.deleteBtnText}>Löschen</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        <Text style={styles.saveBtnText}>Speichern</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { padding: 20 },
    label: {
        fontSize: 12,
        color: '#999',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 5,
        marginLeft: 5
    },
    titleInput: {
        fontSize: 20,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 25,
        paddingVertical: 8,
        paddingHorizontal: 5,
        color: '#333'
    },
    contentInput: {
        fontSize: 16,
        minHeight: 250,
        backgroundColor: '#f9f9f9',
        borderRadius: 15,
        padding: 15,
        lineHeight: 24,
        color: '#444',
        borderWidth: 1,
        borderColor: '#f0f0f0'
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        gap: 15 
    },

    deleteBtn: {
        flex: 1,
        backgroundColor: '#ff6666',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
        alignItems: 'center',
        elevation: 2
    },
    deleteBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333' 
    },

    saveBtn: {
        flex: 1, 
        backgroundColor: '#b2fab4',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
        alignItems: 'center',
        elevation: 2
    },
    saveBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    }
});