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
                        <Ionicons name="camera" size={40} color="#999" />
                        <Text style={styles.imageText}>Bild hinzufügen</Text>
                    </View>
                )}
            </TouchableOpacity>

            <TextInput 
                style={styles.input} 
                placeholder="Vorname" 
                value={firstName} 
                onChangeText={setFirstName} 
            />

            <TextInput 
                style={styles.input} 
                placeholder="Nachname" 
                value={lastName} 
                onChangeText={setLastName} 
            />
            <TouchableOpacity 
                style={styles.saveBtn} 
                onPress={() => onSave(firstName, lastName)}
            >
                <Text style={styles.btnText}>{buttonTitle}</Text>
            </TouchableOpacity>

            {onDelete && (
                <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
                    <Text style={styles.btnText}>Schüler löschen</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    formContainer: { 
        padding: 20, 
        alignItems: 'center' 
    },
    imageSelector: { 
        marginBottom: 20 
    },
    imagePlaceholder: {
        width: 120, 
        height: 120, 
        borderRadius: 60,
        backgroundColor: '#f0f0f0', 
        justifyContent: 'center',
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#333', 
        borderStyle: 'dashed'
    },
    previewImage: { 
        width: 120, 
        height: 120, 
        borderRadius: 60, 
        borderWidth: 1, 
        borderColor: '#333' 
    },
    imageText: { 
        fontSize: 12, 
        color: '#999' 
    },
    input: {
        width: '100%', 
        height: 50, 
        borderWidth: 1, 
        borderColor: '#333',
        borderRadius: 10, 
        paddingHorizontal: 15, 
        marginBottom: 15, 
        fontSize: 16
    },
    saveBtn: {
        backgroundColor: '#b2fab4', // Dein Grün
        padding: 15, 
        borderRadius: 10,
        width: '100%', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#333',
        marginBottom: 10
    },
    deleteBtn: {
        backgroundColor: '#ff6666', // Rot für Löschen
        padding: 15, 
        borderRadius: 10,
        width: '100%', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#333'
    },
    btnText: { 
        fontWeight: 'bold', 
        fontSize: 16,
        color: '#333' // Textfarbe Schwarz
    }
});