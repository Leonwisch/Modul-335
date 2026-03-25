import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DailyNote {
    id: string;
    date: string;
    content: string;
    audioPath?: string;
}

export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    avatarUri?: string;
    generalNotes: string;
    dailyNotes: DailyNote[];
}

interface StudentContextType {
    students: Student[];
    loading: boolean;
    deleteStudent: (id: string) => Promise<void>;
    addStudent: (firstName: string, lastName: string) => Promise<void>;
    updateStudent: (id: string, firstName: string, lastName: string) => Promise<void>;
    updateGeneralNotes: (studentId: string, text: string) => Promise<void>;
    addDailyNote: (studentId: string, content: string) => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFromStorage = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('@heilpaed_data');
                if (jsonValue != null) {
                    setStudents(JSON.parse(jsonValue));
                }
            } catch (e) {
                console.error("Fehler beim Laden der Daten vom Handy:", e);
            } finally {
                setLoading(false);
            }
        };
        loadFromStorage();
    }, []);

    const persistData = async (newList: Student[]) => {
        try {
            await AsyncStorage.setItem('@heilpaed_data', JSON.stringify(newList));
            setStudents(newList);
        } catch (e) {
            console.error("Fehler beim dauerhaften Speichern:", e);
        }
    };

    const addStudent = async (firstName: string, lastName: string) => {
        const newStudent: Student = {
            id: Date.now().toString(),
            firstName,
            lastName,
            generalNotes: "",
            dailyNotes: []
        };
        await persistData([...students, newStudent]);
    };

    const updateStudent = async (id: string, firstName: string, lastName: string) => {
        const updatedList = students.map(s =>
            s.id === id ? { ...s, firstName, lastName } : s
        );
        await persistData(updatedList);
    };

    const deleteStudent = async (id: string) => {
    const newList = students.filter(s => s.id !== id);
    await persistData(newList);
};

    const updateGeneralNotes = async (studentId: string, text: string) => {
        const updatedList = students.map(s => {
            if (s.id === studentId) {
                return { ...s, generalNotes: text };
            }
            return s;
        });
        await persistData(updatedList);
    };

    const addDailyNote = async (studentId: string, content: string) => {
        const updatedList = students.map(s => {
            if (s.id === studentId) {
                const newNote: DailyNote = {
                    id: Date.now().toString(),
                    date: new Date().toLocaleDateString('de-DE'),
                    content
                };
                return { ...s, dailyNotes: [newNote, ...s.dailyNotes] };
            }
            return s;
        });
        await persistData(updatedList);
    };

    return (
        <StudentContext.Provider value={{ students, loading, addStudent, updateGeneralNotes, addDailyNote, updateStudent, deleteStudent }}>
            {children}
        </StudentContext.Provider>
    );
};

export const useStudents = () => {
    const context = useContext(StudentContext);
    if (!context) {
        throw new Error("useStudents muss innerhalb eines StudentProviders verwendet werden!");
    }
    return context;
};