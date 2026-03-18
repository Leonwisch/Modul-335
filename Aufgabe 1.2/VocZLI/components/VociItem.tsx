import { Text, View, StyleSheet, FlatList } from 'react-native';
import Voci from '../app/models/voci';

export default function VociItem({ item }: { item: Voci }) {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.termText}>{item.term}</Text>
      <Text style={styles.translationText}>{item.translation}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  termText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  translationText: {
    color: '#aaa',
    fontSize: 14,
  },
});