import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useStudents } from '../../context/studentContext';
import { StudentForm } from '../../components/studentForm';

export default function EditStudentScreen() {
  const { id } = useLocalSearchParams();
  const { students, updateStudent, deleteStudent } = useStudents();
  const router = useRouter();

  const student = students.find(s => s.id === id);

  if (!student) {
    return (
      <View style={styles.container}>
        <Text>Schüler wurde nicht gefunden.</Text>
      </View>
    );
  }

  const handleUpdate = async (firstName: string, lastName: string) => {
    await updateStudent(student.id, firstName, lastName);
    router.back(); 
  };

  const handleDelete = async () => {
    await deleteStudent(student.id);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `${student.firstName} bearbeiten` }} />
      
      <StudentForm 
        initialFirstName={student.firstName} 
        initialLastName={student.lastName}
        onDelete={handleDelete}
        onSave={handleUpdate}
        buttonTitle="Änderungen speichern"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});