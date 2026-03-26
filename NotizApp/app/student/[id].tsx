import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, Modal, KeyboardAvoidingView,
    Platform, Pressable
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useStudents } from '../../context/studentContext';
import { Ionicons } from '@expo/vector-icons';

export default function StudentDetailScreen() {
    const { id } = useLocalSearchParams();
    const { students, updateGeneralNotes, addDailyNote } = useStudents();
    const router = useRouter();
    const student = students.find(s => s.id === id);
    const [modalVisible, setModalVisible] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState(''); 
    const [newNoteContent, setNewNoteContent] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); 

    const [localGeneralNotes, setLocalGeneralNotes] = useState(student?.generalNotes || '');

    useEffect(() => {
        if (student) {
            setLocalGeneralNotes(student.generalNotes);
        }
    }, [student?.id]);

    if (!student) return null;

    const handleGeneralNotesChange = (text: string) => {
        setLocalGeneralNotes(text);
        updateGeneralNotes(student.id, text); 
    };

    const filteredAndSortedNotes = [...student.dailyNotes]
        .filter(note => {
            const searchLower = searchQuery.toLowerCase();
            return (
                note.title?.toLowerCase().includes(searchLower) ||
                note.content.toLowerCase().includes(searchLower)
            );
        })
        .sort((a, b) => {
            if (a.isFavorite === b.isFavorite) return 0;
            return a.isFavorite ? -1 : 1;
        });

    const handleSaveDailyNote = async () => {
        if (newNoteContent.trim() === '') return;
        await addDailyNote(student.id, newNoteContent, newNoteTitle); 
        setNewNoteContent('');
        setNewNoteTitle('');
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: `${student.firstName} ${student.lastName}` }} />

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled" 
            >
                <Text style={styles.sectionTitle}>Allgemeine Notizen</Text>
                <View style={styles.generalNotesCard}>
                    <TextInput
                        multiline
                        placeholder="Besondere Merkmale..."
                        style={styles.textInput}
                        value={localGeneralNotes} 
                        onChangeText={handleGeneralNotesChange}
                        scrollEnabled={false} 
                        textAlignVertical="top" 
                    />
                </View>

                <View style={styles.separator} />

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Notizen durchsuchen..."
                        style={styles.searchBar}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        clearButtonMode="while-editing"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#ccc" />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.headerRow}>
                    <Text style={styles.sectionTitle}>Tagesverlauf</Text>
                </View>

                {filteredAndSortedNotes.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Keine Notizen gefunden.</Text>
                    </View>
                ) : (
                    filteredAndSortedNotes.map((note) => (
                        <TouchableOpacity
                            key={note.id}
                            style={[styles.noteItem, note.isFavorite && styles.favoriteNoteItem]}
                            onPress={() => router.push(`/student/editNode/${student.id}/${note.id}`)}
                        >
                            <View style={styles.noteContentWrapper}>
                                <View style={styles.noteHeader}>
                                    <Text style={styles.noteDate}>{note.date}</Text>
                                    {note.isFavorite && (
                                        <Ionicons name="star" size={16} color="#FFD700" style={{ marginLeft: 5 }} />
                                    )}
                                </View>
                                {note.title ? <Text style={styles.noteTitleDisplay}>{note.title}</Text> : null}
                                <Text numberOfLines={2} style={styles.notePreview}>{note.content}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>
                    ))
                )}
                <View style={{ height: 100 }} />
            </ScrollView>

            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <Ionicons name="add" size={30} color="#333" />
            </TouchableOpacity>

            <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <Pressable style={{ flex: 1 }} onPress={() => setModalVisible(false)} />
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                        <View style={styles.modalWhiteWrapper}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Neuer Eintrag</Text>
                                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                                        <Ionicons name="close" size={24} color="#333" />
                                    </TouchableOpacity>
                                </View>

                                <TextInput
                                    placeholder="Titel"
                                    style={styles.modalTitleInput}
                                    value={newNoteTitle}
                                    onChangeText={setNewNoteTitle}
                                />

                                <TextInput
                                    multiline
                                    placeholder="Inhalt..."
                                    style={styles.modalInput}
                                    value={newNoteContent}
                                    onChangeText={setNewNoteContent}
                                />

                                <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveDailyNote}>
                                    <Text style={styles.modalSaveBtnText}>Notiz speichern</Text>
                                </TouchableOpacity>
                                <View style={{ height: 30 }} />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    scrollContent: { padding: 20 },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    generalNotesCard: { 
        borderWidth: 1, 
        borderColor: '#333', 
        borderRadius: 15, 
        padding: 15, 
        backgroundColor: '#fbfbfb',
        minHeight: 120 
    },
    textInput: { 
        fontSize: 16, 
        lineHeight: 24,
        paddingTop: 0 
    },
    separator: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        paddingHorizontal: 10,
        marginBottom: 20,
        height: 45,
    },
    searchIcon: { marginRight: 8 },
    searchBar: { flex: 1, fontSize: 16 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    noteItem: { flexDirection: 'row', padding: 18, borderWidth: 1, borderColor: '#eee', borderRadius: 15, marginBottom: 12, backgroundColor: '#fff', alignItems: 'center' },
    favoriteNoteItem: { borderColor: '#FFD700', backgroundColor: '#FFFDF0', borderWidth: 1.5 },
    noteContentWrapper: { flex: 1, marginRight: 10 },
    noteHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    noteDate: { fontSize: 11, color: '#999', fontWeight: 'bold' },
    noteTitleDisplay: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 3 }, 
    notePreview: { fontSize: 14, color: '#666' },
    emptyContainer: { alignItems: 'center', marginTop: 20 },
    emptyText: { color: '#bbb' },
    fab: { position: 'absolute', right: 25, bottom: 40, backgroundColor: '#b2fab4', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5, borderWidth: 1, borderColor: '#333' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalWhiteWrapper: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25 },
    modalContent: { padding: 25 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    modalTitle: { fontSize: 18, fontWeight: 'bold' },
    modalTitleInput: { fontSize: 18, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 15, paddingVertical: 5 },
    modalInput: { fontSize: 16, minHeight: 120, textAlignVertical: 'top', marginBottom: 20 },
    modalSaveBtn: { backgroundColor: '#b2fab4', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
    modalSaveBtnText: { fontWeight: 'bold', fontSize: 16 },
});