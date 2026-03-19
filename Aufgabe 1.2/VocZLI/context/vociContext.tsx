import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Voci from "../app/models/voci";

interface VociContextType {
  vociList: Voci[];
  isLoading: boolean;
  addVoci: (voci: Voci) => void;
  updateVoci: (term: string, updatedVoci: Voci) => void;
  removeVoci: (term: string) => void;
}

const VociContext = createContext<VociContextType | undefined>(undefined);

export function VociProvider({ children }: { children: ReactNode }) {
  const [vociList, setVociList] = useState<Voci[]>([
    { term: "apple", translation: "Apfel" },
    { term: "house", translation: "Haus" },
    { term: "car", translation: "Auto" },
    { term: "book", translation: "Buch" },
    { term: "water", translation: "Wasser" },
    { term: "tree", translation: "Baum" },
    { term: "sun", translation: "Sonne" },
    { term: "moon", translation: "Mond" },
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const isInitialMount = useRef(true);

  const addVoci = (voci: Voci) => {
    setVociList([...vociList, voci]);
  };

  const updateVoci = (term: string, updatedVoci: Voci) => {
    setVociList(vociList.map((v) => (v.term === term ? updatedVoci : v)));
  };

  const removeVoci = (term: string) => {
    setVociList(vociList.filter((v) => v.term !== term));
  };

  useEffect(() => {
    const loadVocis = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("vocis");
        if (jsonValue !== null) {
          const loadedVocis = JSON.parse(jsonValue);
          setVociList(loadedVocis);
          console.log("Daten aus AsyncStorage geladen");
        }
      } catch (error) {
        console.error("Fehler beim Laden:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVocis();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const saveVocis = async () => {
      try {
        const jsonValue = JSON.stringify(vociList);
        await AsyncStorage.setItem("vocis", jsonValue);
        console.log("Änderungen im Hintergrund gespeichert");
      } catch (error) {
        console.error("Fehler beim Speichern:", error);
      }
    };

    saveVocis();
  }, [vociList]);

  return (
    <VociContext.Provider value={{ vociList, isLoading, addVoci, updateVoci, removeVoci }}>
      {children}
    </VociContext.Provider>
  );
}

export function useVoci() {
  const context = useContext(VociContext);
  if (!context) throw new Error("useVoci muss innerhalb von VociProvider verwendet werden");
  return context;
}