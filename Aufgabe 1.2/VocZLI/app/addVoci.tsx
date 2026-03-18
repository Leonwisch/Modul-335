import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useVoci } from '../context/vociContext';
import VociDetail from '../components/VociDetail';
import Voci from './models/voci';

export default function AddVociScreen() {
  const router = useRouter();
  const { addVoci } = useVoci();
  const handleAdd = (newVoci: Voci) => {

    addVoci(newVoci);

    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Neue Vokabel</Text>
      
      <VociDetail onSave={handleAdd} />
      
      <Text style={styles.infoText}>
        Die Vokabel wird automatisch deiner Liste hinzugefügt.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#25292e',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
  },
});