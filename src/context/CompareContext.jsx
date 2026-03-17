import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// chiave usata per salvare i prodotti del confronto nel localStorage
const COMPARE_STORAGE_KEY = "compare_items";

// chiave usata per salvare i preferiti nel localStorage
const FAVORITES_STORAGE_KEY = "favorites";

// numero massimo di prodotti confrontabili
const MAX_COMPARE_ITEMS = 5;

// creiamo il context
const CompareContext = createContext();

// provider del context confronto / preferiti
export function CompareProvider({ children }) {
    // endpoint per recuperare i prodotti
    const endpoint = "http://localhost:3000/parfumes";

    // stato con la lista completa prodotti
    const [products, setProducts] = useState([]);

    // stato dei preferiti inizializzato dal localStorage
    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    // stato del confronto inizializzato dal localStorage
    const [compareItems, setCompareItems] = useState(() => {
        const savedItems = localStorage.getItem(COMPARE_STORAGE_KEY);
        return savedItems ? JSON.parse(savedItems) : [];
    });

    // funzione per recuperare tutti i prodotti dal backend
    const fetchProducts = () => {
        axios
            .get(endpoint)
            .then((res) => {
                setProducts(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        // carichiamo i prodotti al montaggio del provider
        fetchProducts();
    }, []);

    useEffect(() => {
        // salviamo il confronto nel localStorage ad ogni aggiornamento
        localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareItems));
    }, [compareItems]);

    useEffect(() => {
        // salviamo i preferiti nel localStorage ad ogni aggiornamento
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }, [favorites]);

    // aggiunge un prodotto ai preferiti evitando duplicati
    const addFavorite = (productId) => {
        setFavorites((prev) =>
            prev.includes(productId) ? prev : [...prev, productId],
        );
    };

    // rimuove un prodotto dai preferiti
    const removeFavorite = (productId) => {
        setFavorites((prev) => prev.filter((id) => id !== productId));
    };

    // controlla se un prodotto è presente nei preferiti
    const isFavorite = (productId) => {
        return favorites.includes(productId);
    };

    // controlla se un prodotto è già nel confronto
    const isInCompare = (productId) => {
        return compareItems.some((item) => item.id === productId);
    };

    // aggiunge un prodotto al confronto e restituisce l'esito dell'operazione
    const addToCompare = (product) => {
        // evitiamo duplicati
        if (isInCompare(product.id)) {
            return {
                success: false,
                type: "error",
                code: "already-added",
                message: "Prodotto già aggiunto al confronto",
            };
        }

        // blocchiamo oltre il numero massimo di prodotti confrontabili
        if (compareItems.length >= MAX_COMPARE_ITEMS) {
            return {
                success: false,
                type: "error",
                code: "max-reached",
                message: `Puoi confrontare al massimo ${MAX_COMPARE_ITEMS} prodotti`,
            };
        }

        setCompareItems((prev) => [...prev, product]);

        return {
            success: true,
            type: "success",
            code: "added",
            message: "Prodotto aggiunto al confronto",
        };
    };

    // rimuove un prodotto dal confronto e restituisce l'esito
    const removeFromCompare = (productId) => {
        setCompareItems((prev) => prev.filter((item) => item.id !== productId));

        return {
            success: true,
            type: "success",
            code: "removed",
            message: "Prodotto rimosso dal confronto",
        };
    };

    // svuota completamente il confronto
    const clearCompare = () => {
        setCompareItems([]);

        return {
            success: true,
            type: "success",
            code: "cleared",
            message: "Confronto svuotato",
        };
    };

    return (
        <CompareContext.Provider
            value={{
                products,
                favorites,
                compareItems,
                addFavorite,
                removeFavorite,
                isFavorite,
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