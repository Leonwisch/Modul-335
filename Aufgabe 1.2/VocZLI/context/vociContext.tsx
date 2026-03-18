import { createContext, useContext, useState, ReactNode } from 'react';
import Voci from '../app/models/voci';

interface VociContextType {
  vociList: Voci[];
  addVoci: (voci: Voci) => void;
  updateVoci: (term: string, updatedVoci: Voci) => void;
  removeVoci: (term: string) => void;
}

const VociContext = createContext<VociContextType | undefined>(undefined);

export function VociProvider({ children }: { children: ReactNode }) {
  const [vociList, setVociList] = useState<Voci[]>([
    { term: 'fish', translation: 'Fisch' },
    { term: 'glass', translation: 'Glas' },
    { term: 'house', translation: 'Haus' },
    { term: 'apple', translation: 'Apfel' },
    { term: 'bread', translation: 'Brot' },
    { term: 'cat', translation: 'Katze' },
    { term: 'dog', translation: 'Hund' },
    { term: 'egg', translation: 'Ei' },
  ]);

    const addVoci = (voci: Voci) => {
    setVociList([...vociList, voci]);
  };

    const updateVoci = (term: string, updatedVoci: Voci) => {
    setVociList(vociList.map((v) => (v.term === term ? updatedVoci : v)));
  };

    const removeVoci = (term: string) => {
    setVociList(vociList.filter((v) => v.term !== term));
  };

  return (
    <VociContext.Provider value={{ vociList, addVoci, updateVoci, removeVoci }}>
      {children}
    </VociContext.Provider>
  );
}

export function useVoci() {
  const context = useContext(VociContext);
  if (!context) {
    throw new Error('useVoci muss innerhalb von VociProvider verwendet werden');
  }
  return context;
}