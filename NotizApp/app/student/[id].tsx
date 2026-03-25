import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useStudents } from '../../context/studentContext';
import { Ionicons } from '@expo/vector-icons';

export default function StudentDetailScreen() {
    const { id } = useLocalSearchParams();
    const { students, updateGeneralNotes, addDailyNote } = useStudents();
    const router = useRouter();

    const student = students.find(s => s.id === id);

    const [modalVisible, setModalVisible] = useState(false);
    const [newNoteContent, setNewNoteContent] = useState('');

    if (!student) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Schüler nicht gefunden.</Text>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/')}>
                    <Text style={styles.backBtnText}>Zurück zur Liste</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleSaveDailyNote = async () => {
        if (newNoteContent.trim() === '') return;

        await addDailyNote(student.id, newNoteContent);
        setNewNoteContent('');
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: `${student.firstName} ${student.lastName}` }} />

            <ScrollView contentContainerStyle={styles.scrollContent}>

                <Text style={styles.sectionTitle}>Allgemeine Notizen</Text>
                <View style={styles.generalNotesCard}>
                    <TextInput
                        multiline
                        placeholder="Besondere Merkmale, Förderziele, Diagnosen..."
                        style={styles.textInput}
                        value={student.generalNotes}
                        onChangeText={(text) => updateGeneralNotes(student.id, text)}
                        scrollEnabled={false}
                    />
                </View>

                <View style={styles.separator} />

                <View style={styles.headerRow}>
                    <Text style={styles.sectionTitle}>Tagesverlauf</Text>
                </View>

                {student.dailyNotes.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-text-outline" size={50} color="#eee" />
                        <Text style={styles.emptyText}>Noch keine Tagesnotizen vorhanden.</Text>
                        <Text style={styles.emptySubText}>Tippe auf das '+', um die erste Notiz zu schreiben.</Text>
                    </View>
                ) : (
                    student.dailyNotes.map((note) => (
                        <TouchableOpacity
                            key={note.id}
                            style={styles.noteItem}
                            // HIER ist die wichtige Ergänzung:
                            onPress={() => router.push(`/student/editNode/${student.id}/${note.id}`)}
                        >
                            <View style={styles.noteContentWrapper}>
                                <View style={styles.noteHeader}>
                                    <Text style={styles.noteDate}>{note.date}</Text>
                                </View>
                                <Text numberOfLines={3} style={styles.notePreview}>{note.content}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>
                    ))
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={30} color="#333" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Neue Notiz für heute</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            multiline
                            autoFocus={true}
                            placeholder="Was ist heute passiert? Fortschritte, Herausforderungen..."
                            style={styles.modalInput}
                            value={newNoteContent}
                            onChangeText={setNewNoteContent}
                        />

                        <TouchableOpacity
                            style={styles.modalSaveBtn}
                            onPress={handleSaveDailyNote}
                        >
                            <Text style={styles.modalSaveBtnText}>Notiz speichern</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    errorText: { fontSize: 18, color: '#666', marginBottom: 20 },
    backBtn: { backgroundColor: '#333', padding: 12, borderRadius: 10 },
    backBtnText: { color: '#fff', fontWeight: 'bold' },
    scrollContent: { padding: 20 },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    generalNotesCard: {
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 15,
        padding: 15,
        minHeight: 150,
        backgroundColor: '#fbfbfb',
    },
    textInput: { fontSize: 16, lineHeight: 24, textAlignVertical: 'top' },
    separator: { height: 1, backgroundColor: '#eee', marginVertical: 30 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    noteItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 15,
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    noteContentWrapper: { flex: 1, marginRight: 10 },
    noteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    noteDate: { fontSize: 12, fontWeight: '600', color: '#999', textTransform: 'uppercase' },
    notePreview: { fontSize: 16, color: '#333', lineHeight: 22 },
    emptyContainer: { alignItems: 'center', marginTop: 30, padding: 20 },
    emptyText: { fontSize: 16, fontWeight: 'bold', color: '#bbb', marginTop: 15, textAlign: 'center' },
    emptySubText: { fontSize: 14, color: '#ccc', marginTop: 5, textAlign: 'center' },
    fab: {
        position: 'absolute',
        right: 25,
        bottom: 25,
        backgroundColor: '#b2fab4',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        borderWidth: 1,
        borderColor: '#333',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 25,
        minHeight: '50%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    modalInput: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
        textAlignVertical: 'top',
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
    },
    modalSaveBtn: {
        backgroundColor: '#b2fab4',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        marginBottom: 10,
    },
    modalSaveBtnText: { fontWeight: 'bold', fontSize: 16, color: '#333' },
});