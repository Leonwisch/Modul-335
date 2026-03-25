// app/index.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, FlatList, Text } from 'react-native';
import { useStudents } from '../context/studentContext';
import { StudentCard } from '../components/studentCard'; 
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function IndexScreen() {
  const { students, loading } = useStudents();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredStudents = students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <View style={styles.center}><Text>Lädt...</Text></View>;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Suche..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StudentCard 
            item={item} 
            onPress={(id) => router.push(`./student/${id}`)} 
            onEditPress={(id) => router.push(`./changeStudent/${id}`)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('./addStudent')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchBar: {
    height: 45,
    margin: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
  },
  fab: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    backgroundColor: '#333',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  }
});