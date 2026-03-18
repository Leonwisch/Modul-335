import { Text, View, StyleSheet } from 'react-native';
import Voci from './models/voci';

const vociList: Voci[] = [
    { term: 'fish', translation: 'Fisch' },
    { term: 'glass', translation: 'Glas' },
    { term: 'house', translation: 'Haus' },
    { term: 'apple', translation: 'Apfel' },
    { term: 'bread', translation: 'Brot' },
    { term: 'cat', translation: 'Katze' },
    { term: 'dog', translation: 'Hund' },
    { term: 'egg', translation: 'Ei' },
    
  ];

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>VocZLI</Text>
      <Text style={styles.subtitleText}>Meine Vokabel-Lern-App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: '#fff',
    fontSize: 36,           // Schön gross für den Titel
    fontWeight: 'bold',     // Fett gedruckt
    marginBottom: 8,        // Ein bisschen Abstand zum Untertitel
  },
  subtitleText: {
    color: '#ccc',          // Etwas helleres Grau für den Kontrast
    fontSize: 18,           // Etwas kleiner als der Titel
    fontStyle: 'italic',    // Kursiv sieht bei Untertiteln oft gut aus
  },
});