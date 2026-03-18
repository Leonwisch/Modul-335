import { Text, View, StyleSheet, Pressable, Alert, Animated } from "react-native";
import Voci from '../app/models/voci';
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";

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

export default function LearnScreen() {
    const router = useRouter();
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showTranslation, setShowTranslation] = useState(false);
    
    const [scoreCorrect, setScoreCorrect] = useState(0);
    const [scoreWrong, setScoreWrong] = useState(0);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const currentVoci = vociList[currentIndex];

    useEffect(() => {
        if (showTranslation) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            fadeAnim.setValue(0); 
        }
    }, [showTranslation]);

    const handleNext = (wasCorrect: boolean) => {
        if (wasCorrect) {
            setScoreCorrect(scoreCorrect + 1);
        } else {
            setScoreWrong(scoreWrong + 1);
        }

        if (currentIndex < vociList.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setShowTranslation(false);
        } else {
            Alert.alert(
                "Lernen beendet!", 
                `Ergebnis:\nRichtig: ${wasCorrect ? scoreCorrect + 1 : scoreCorrect}\nFalsch: ${!wasCorrect ? scoreWrong + 1 : scoreWrong}`,
                [{ text: "Fertig", onPress: () => router.back() }]
            );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.statsRow}>
                <Text style={[styles.statsText, { color: '#4CAF50' }]}>Richtig: {scoreCorrect}</Text>
                <Text style={styles.statsDivider}>|</Text>
                <Text style={[styles.statsText, { color: '#F44336' }]}>Falsch: {scoreWrong}</Text>
            </View>

            <Text style={styles.progressText}>{currentIndex + 1} / {vociList.length}</Text>

            <View style={styles.card}>
                <Text style={styles.vociTerm}>{currentVoci.term}</Text>
                
                <View style={styles.divider} />

                {showTranslation && (
                    <Animated.View style={{ opacity: fadeAnim }}>
                        <Text style={styles.vociTranslation}>{currentVoci.translation}</Text>
                    </Animated.View>
                )}

                {!showTranslation ? (
                    <Pressable style={styles.showButton} onPress={() => setShowTranslation(true)}>
                        <Text style={styles.buttonTextWhite}>Übersetzung zeigen</Text>
                    </Pressable>
                ) : (
                    <View style={styles.buttonGroup}>
                        <Pressable 
                            style={[styles.actionButton, styles.wrongButton]} 
                            onPress={() => handleNext(false)}
                        >
                            <Text style={styles.buttonTextWhite}>Nicht gewusst</Text>
                        </Pressable>

                        <Pressable 
                            style={[styles.actionButton, styles.correctButton]} 
                            onPress={() => handleNext(true)}
                        >
                            <Text style={styles.buttonTextWhite}>Gewusst</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', alignItems: "center", padding: 24, paddingTop: 60 },
    statsRow: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
    statsText: { fontSize: 16, fontWeight: 'bold' },
    statsDivider: { marginHorizontal: 10, color: '#ccc' },
    progressText: { fontSize: 14, color: '#888', marginBottom: 20 },
    card: { backgroundColor: '#fff', width: '100%', minHeight: 350, borderRadius: 20, justifyContent: 'center', alignItems: 'center', padding: 20, elevation: 5 },
    vociTerm: { fontSize: 36, fontWeight: 'bold', color: '#25292e' },
    divider: { height: 1, backgroundColor: '#eee', width: '80%', marginVertical: 30 },
    vociTranslation: { fontSize: 30, color: '#25292e', fontWeight: '600', marginBottom: 30, textAlign: 'center' },
    showButton: { backgroundColor: '#25292e', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 12 },
    buttonGroup: { flexDirection: 'row', gap: 10 },
    actionButton: { paddingVertical: 15, paddingHorizontal: 20, borderRadius: 12, minWidth: 130, alignItems: 'center' },
    correctButton: { backgroundColor: '#4CAF50' },
    wrongButton: { backgroundColor: '#F44336' },
    buttonTextWhite: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});