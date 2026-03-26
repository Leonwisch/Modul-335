import React, { useState } from 'react';
import { 
    View, TextInput, TouchableOpacity, Text, 
    Image, StyleSheet, ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StudentFormProps {
    onSave: (firstName: string, lastName: string) => void;
    onDelete?: () => void; 
    buttonTitle: string;
    selectedImage?: string;
    onPickImage: () => void;
    initialFirstName?: string;
    initialLastName?: string;
}

export const StudentForm: React.FC<StudentFormProps> = ({ 
    onSave, 
    onDelete,
    buttonTitle, 
    selectedImage, 
    onPickImage, 
    initialFirstName = '', 
    initialLastName = '' 
}) => {
    const [firstName, setFirstName] = useState(initialFirstName);
    const [lastName, setLastName] = useState(initialLastName);

    return (
        <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
            <TouchableOpacity onPress={onPickImage} style={styles.imageSelector}>
                {selectedImage ? (
                    <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Ionicons name="camera-outline" size={40} color="#999" />
                        <Text style={styles.imageText}>Foto hinzufügen</Text>
                    </View>
                )}
                <View style={styles.editIconBadge}>
                    <Ionicons name="pencil" size={14} color="white" />
                </View>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Vorname</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="z.B. Max" 
                    value={firstName} 
                    onChangeText={setFirstName} 
                />

                <Text style={styles.label}>Nachname</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="z.B. Mustermann" 
                    value={lastName} 
                    onChangeText={setLastName} 
                />
            </View>

            <TouchableOpacity 
                style={styles.saveBtn} 
                onPress={() => onSave(firstName, lastName)}
            >
                <Text style={styles.saveBtnText}>{buttonTitle}</Text>
            </TouchableOpacity>

            {onDelete && (
                <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
                    <Ionicons name="trash-outline" size={20} color="#ff4444" />
                    <Text style={styles.deleteBtnText}>Schüler löschen</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    formContainer: { 
        padding: 25, 
        alignItems: 'center' 
    },
    imageSelector: { 
        marginBottom: 30,
        position: 'relative'
    },
    imagePlaceholder: {
        width: 120, 
        height: 120, 
        borderRadius: 60,
        backgroundColor: '#f8f8f8', 
        justifyContent: 'center',
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#ddd', 
        borderStyle: 'dashed'
    },
    previewImage: { 
        width: 120, 
        height: 120, 
        borderRadius: 60, 
        borderWidth: 2, 
        borderColor: '#333' 
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#333',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff'
    },
    imageText: { 
        fontSize: 12, 
        color: '#999', 
        marginTop: 5 
    },
    inputGroup: {
        width: '100%',
        marginBottom: 20
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#999',
        marginBottom: 5,
        marginLeft: 5,
        textTransform: 'uppercase'
    },
    input: {
        width: '100%', 
        height: 55, 
        borderWidth: 1, 
        borderColor: '#eee',
        backgroundColor: '#fdfdfd',
        borderRadius: 12, 
        paddingHorizontal: 15, 
        marginBottom: 20, 
        fontSize: 16,
        color: '#333'
    },
    saveBtn: {
        backgroundColor: '#b2fab4', 
        padding: 16, 
        borderRadius: 12,
        width: '100%', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#333',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    saveBtnText: { 
        fontWeight: 'bold', 
        fontSize: 16,
        color: '#333'
    },
    deleteBtn: {
        marginTop: 25,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    deleteBtnText: {
        color: '#ff4444',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 14
    }
});