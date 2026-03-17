import { createContext, useContext, useEffect, useState } from "react";

// chiave usata per salvare il confronto nel localStorage
const COMPARE_STORAGE_KEY = "compare_items";

// numero massimo di prodotti confrontabili
const MAX_COMPARE_ITEMS = 5;

// creiamo il context
const CompareContext = createContext();

// provider del confronto
export function CompareProvider({ children }) {
    // inizializziamo lo state leggendo dal localStorage se presente
    const [compareItems, setCompareItems] = useState(() => {
        const savedItems = localStorage.getItem(COMPARE_STORAGE_KEY);
        return savedItems ? JSON.parse(savedItems) : [];
    });

    // salviamo il confronto nel localStorage ad ogni aggiornamento
    useEffect(() => {
        localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareItems));
    }, [compareItems]);

    // controlla se un prodotto è già nel confronto
    const isInCompare = (productId) => {
        return compareItems.some((item) => item.id === productId);
    };

    // aggiunge un prodotto al confronto
    const addToCompare = (product) => {
        // evitiamo duplicati
        if (isInCompare(product.id)) {
            alert("Questo prodotto è già nel confronto");
            return;
        }

        // blocchiamo oltre 5 prodotti
        if (compareItems.length >= MAX_COMPARE_ITEMS) {
            alert("Puoi confrontare al massimo 5 prodotti");
            return;
        }

        setCompareItems((prev) => [...prev, product]);
    };

    // rimuove un prodotto dal confronto
    const removeFromCompare = (productId) => {
        setCompareItems((prev) => prev.filter((item) => item.id !== productId));
    };

    // svuota completamente il confronto
    const clearCompare = () => {
        setCompareItems([]);
    };

    return (
        <CompareContext.Provider
            value={{
                compareItems,
                addToCompare,
                removeFromCompare,
                clearCompare,
                isInCompare,
                maxCompareItems: MAX_COMPARE_ITEMS,
            }}
        >
            {children}
        </CompareContext.Provider>
    );
}

// hook custom per usare il context più comodamente
export function useCompare() {
    return useContext(CompareContext);
}