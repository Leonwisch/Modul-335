import { Text, View, StyleSheet, Pressable, Alert, Animated, Image } from "react-native";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { useVoci } from '../context/vociContext';

export default function LearnScreen() {
    const { vociList } = useVoci();
    const router = useRouter();
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showTranslation, setShowTranslation] = useState(false);
    
    const [scoreCorrect, setScoreCorrect] = useState(0);
    const [scoreWrong, setScoreWrong] = useState(0);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Aktuelle Vokabel basierend auf dem Index
    const currentVoci = vociList[currentIndex];

    // Animation steuern: Wenn Übersetzung gezeigt wird, fadet sie ein
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
        let newScoreCorrect = scoreCorrect;
        let newScoreWrong = scoreWrong;

        if (wasCorrect) {
            newScoreCorrect += 1;
            setScoreCorrect(newScoreCorrect);
        } else {
            newScoreWrong += 1;
            setScoreWrong(newScoreWrong);
        }

        // Prüfen, ob noch Vokabeln übrig sind
        if (currentIndex < vociList.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setShowTranslation(false);
        } else {
            // Ende der Liste erreicht
            Alert.alert(
                "Lernen beendet!", 
                `Ergebnis:\nRichtig: ${newScoreCorrect}\nFalsch: ${newScoreWrong}`,
                [{ text: "Fertig", onPress: () => router.back() }]
            );
        }
    };

    // Falls die Liste leer ist (Sicherheitscheck)
    if (!currentVoci) {
        return (
            <View style={styles.container}>
                <Text>Keine Vokabeln zum Lernen vorhanden.</Text>
                <Pressable style={styles.showButton} onPress={() => router.back()}>
                    <Text style={styles.buttonTextWhite}>Zurück</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Statistiken oben */}
            <View style={styles.statsRow}>
                <Text style={[styles.statsText, { color: '#4CAF50' }]}>Richtig: {scoreCorrect}</Text>
                <Text style={styles.statsDivider}>|</Text>
                <Text style={[styles.statsText, { color: '#F44336' }]}>Falsch: {scoreWrong}</Text>
            </View>

            {/* Fortschrittsanzeige */}
            <Text style={styles.progressText}>{currentIndex + 1} / {vociList.length}</Text>

            <View style={styles.card}>
                {/* AUFGABE 5: Bildanzeige (prominent oben in der Karte) */}
                {currentVoci.imageUri && (
                    <Image 
                        source={{ uri: currentVoci.imageUri }} 
                        style={styles.learnImage} 
                        resizeMode="cover" 
                    />
                )}

                <Text style={styles.vociTerm}>{currentVoci.term}</Text>
                
                <View style={styles.divider} />

                {/* Übersetzung mit Fade-In Animation */}
                <View style={styles.translationContainer}>
                    {showTranslation && (
                        <Animated.View style={{ opacity: fadeAnim }}>
                            <Text style={styles.vociTranslation}>{currentVoci.translation}</Text>
                        </Animated.View>
                    )}
                </View>

                {/* Buttons: Entweder "Zeigen" oder "Gewusst/Nicht gewusst" */}
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
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5', 
        alignItems: "center", 
        padding: 24, 
        paddingTop: 60 
    },
    statsRow: { 
        flexDirection: 'row', 
        marginBottom: 10, 
        alignItems: 'center' 
    },
    statsText: { 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    statsDivider: { 
        marginHorizontal: 10, 
        color: '#ccc' 
    },
    progressText: { 
        fontSize: 14, 
        color: '#888', 
        marginBottom: 20 
    },
    card: { 
        backgroundColor: '#fff', 
        width: '100%', 
        minHeight: 480, 
        borderRadius: 25, 
        alignItems: 'center', 
        padding: 20, 
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        overflow: 'hidden'
    },
    learnImage: {
        width: '100%',
        height: 220,
        borderRadius: 15,
        marginBottom: 20,
    },
    vociTerm: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        color: '#25292e',
        textAlign: 'center'
    },
    divider: { 
        height: 1, 
        backgroundColor: '#eee', 
        width: '90%', 
        marginVertical: 25 
    },
    translationContainer: {
        height: 80, // Fester Platzhalter, damit die Buttons nicht springen
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    vociTranslation: { 
        fontSize: 28, 
        color: '#2dd2bc', 
        fontWeight: 'bold', 
        textAlign: 'center' 
    },
    showButton: { 
        backgroundColor: '#25292e', 
        paddingVertical: 15, 
        paddingHorizontal: 40, 
        borderRadius: 15,
        marginTop: 10
    },
    buttonGroup: { 
        flexDirection: 'row', 
        gap: 15,
        marginTop: 10
    },
    actionButton: { 
        paddingVertical: 15, 
        paddingHorizontal: 20, 
        borderRadius: 15, 
        minWidth: 140, 
        alignItems: 'center' 
    },
    correctButton: { backgroundColor: '#4CAF50' },
    wrongButton: { backgroundColor: '#F44336' },
    buttonTextWhite: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 16 
    },
});