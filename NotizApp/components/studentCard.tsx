import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import { Student } from '../context/studentContext'; 
import { Ionicons } from '@expo/vector-icons';

interface StudentCardProps {
  item: Student;               
  onPress: (id: string) => void; 
  onEditPress: (id: string) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ item, onPress, onEditPress }) => {
  const hasAvatar = item.avatarUri && item.avatarUri.length > 0;

  return (
    <View style={styles.cardContainer}> 
      <Pressable 
        onPress={() => onPress(item.id)} 
        style={({ pressed }) => [
          styles.pressableArea,
          { backgroundColor: pressed ? '#f0f0f0' : '#fff' } 
        ]}
      >
        <View style={styles.avatarContainer}>
          {hasAvatar ? (
            <Image source={{ uri: item.avatarUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.placeholderText}>
                {item.firstName[0]}{item.lastName[0]}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>
            {item.firstName} {item.lastName}
          </Text>
        </View>
      </Pressable>

      <TouchableOpacity 
        onPress={() => onEditPress(item.id)} 
        style={styles.editButton}
      >
        <Ionicons name="pencil" size={22} color="#666" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 8,
    borderWidth: 1, 
    borderColor: '#333',
    borderRadius: 15, 
    backgroundColor: '#fff',
    overflow: 'hidden', 
    elevation: 2, 
  },
  pressableArea: {
    flex: 1, 
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  editButton: {
    padding: 15, 
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1, 
    borderLeftColor: '#eee',
  },
  avatarContainer: {
    width: 60, 
    height: 60,
    borderRadius: 30, 
    overflow: 'hidden', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', 
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase', 
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15, 
  },
  nameText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
});