import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';

interface Props {
    onSave: (firstName: string, lastName: string) => void;
    onDelete?: () => void;
    initialFirstName?: string;
    initialLastName?: string;
    buttonTitle?: string;
}

export const StudentForm = ({
    onSave,
    onDelete,
    initialFirstName = '',
    initialLastName = '',
    buttonTitle = 'Speichern'
}: Props) => {

    const [firstName, setFirstName] = useState(initialFirstName);
    const [lastName, setLastName] = useState(initialLastName);


    const handleDeletePress = () => {
        if (!onDelete) return;

        Alert.alert(
            "Schüler löschen",
            `Bist du sicher, dass du ${firstName} und alle Notizen unwiderruflich löschen möchtest?`,
            [
                { text: "Abbrechen", style: "cancel" },
                {
                    text: "Löschen",
                    style: "destructive",
                    onPress: () => onDelete()
                }
            ]
        );
    };

    return (
        <View style={styles.form}>
            <Text style={styles.label}>Vorname</Text>
            <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="z.B. Max"
            />

            <Text style={styles.label}>Nachname</Text>
            <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="z.B. Muster"
            />

            <TouchableOpacity
                style={styles.button}
                onPress={() => onSave(firstName, lastName)}
            >
                <Text style={styles.buttonText}>{buttonTitle}</Text>
            </TouchableOpacity>

            {onDelete && (
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeletePress}
                >
                    <Text style={styles.buttonText}>Schüler löschen</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    form: { padding: 20 },
    label: { fontSize: 16, marginBottom: 5, fontWeight: 'bold' },
    input: {
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 10,
        padding: 12,
        marginBottom: 20,
        fontSize: 16
    },
    button: {
        backgroundColor: '#b2fab4',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333'
    },

    buttonText: { fontWeight: 'bold', fontSize: 16, color: '#333' },

    deleteButton: {
        backgroundColor: '#ffaaaa',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        marginTop: 30,
    },
});