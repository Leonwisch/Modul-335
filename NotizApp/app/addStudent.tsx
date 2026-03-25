import { View, StyleSheet } from 'react-native';
import { useStudents } from '../context/studentContext';
import { StudentForm } from '../components/studentForm'; 
import { useRouter, Stack } from 'expo-router';

export default function AddStudentScreen() {
  const { addStudent } = useStudents();
  const router = useRouter();

  const handleSave = async (firstName: string, lastName: string) => {
    if (firstName.trim() === '' || lastName.trim() === '') return;
    
    await addStudent(firstName, lastName);
    router.back(); 
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Neuer Schüler' }} />
      <StudentForm 
        onSave={handleSave} 
        buttonTitle="Schüler anlegen" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});