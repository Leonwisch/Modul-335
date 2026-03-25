import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Student } from '../context/studentContext'; 

interface StudentCardProps {
  item: Student;               
  onPress: (id: string) => void; 
}

export const StudentCard: React.FC<StudentCardProps> = ({ item, onPress }) => {
  const hasAvatar = item.avatarUri && item.avatarUri.length > 0;

  return (
    <Pressable 
      onPress={() => onPress(item.id)} 
      style={({ pressed }) => [
        styles.cardContainer,
        { backgroundColor: pressed ? '#f0f0f0' : '#fff' } 
      ]}
    >
      <View style={styles.avatarContainer}>
        {hasAvatar ? (
          <Image 
            source={{ uri: item.avatarUri }} 
            style={styles.avatarImage} 
          />
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
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    borderWidth: 1, 
    borderColor: '#333',
    borderRadius: 15, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, 
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