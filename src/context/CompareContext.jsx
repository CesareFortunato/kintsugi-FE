import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const COMPARE_STORAGE_KEY = "compare_items";
const FAVORITES_STORAGE_KEY = "favorites";
const MAX_COMPARE_ITEMS = 5;

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const endpoint = "http://localhost:3000/parfumes";

  const [products, setProducts] = useState([]);

  // Salva interi prodotti nei preferiti
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [compareItems, setCompareItems] = useState(() => {
    const saved = localStorage.getItem(COMPARE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Recupera prodotti dal backend
  useEffect(() => {
    axios
      .get(endpoint)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Aggiorna localStorage
  useEffect(() => {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareItems));
  }, [compareItems]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // ---- PREFERITI ----
  const addFavorite = (product) => {
    if (!favorites.find((p) => p.id === product.id)) {
      setFavorites([...favorites, product]);
    }
  };

  const removeFavorite = (productId) => {
    setFavorites(favorites.filter((p) => p.id !== productId));
  };

  const isFavorite = (productId) => favorites.some((p) => p.id === productId);

  // ---- CONFRONTO ----
  const isInCompare = (productId) =>
    compareItems.some((p) => p.id === productId);

  const addToCompare = (product) => {
    if (isInCompare(product.id)) {
      return { success: false, code: "already-added", message: "Prodotto già aggiunto" };
    }
    if (compareItems.length >= MAX_COMPARE_ITEMS) {
      return { success: false, code: "max-reached", message: `Max ${MAX_COMPARE_ITEMS} prodotti` };
    }
    setCompareItems([...compareItems, product]);
    return { success: true, code: "added", message: "Prodotto aggiunto al confronto" };
  };

  const removeFromCompare = (productId) => {
    setCompareItems(compareItems.filter((p) => p.id !== productId));
    return { success: true, code: "removed", message: "Prodotto rimosso" };
  };

  const clearCompare = () => {
    setCompareItems([]);
    return { success: true, code: "cleared", message: "Confronto svuotato" };
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

export function useCompare() {
  return useContext(CompareContext);
}