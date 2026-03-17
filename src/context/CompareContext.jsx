import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CompareContext = createContext();

export function CompareProvider({ children }) {

    //creiamo var di stato li prodotti
    const endpoint = "http://localhost:3000/parfumes";


    const [products, setProducts] = useState([]);
    //var di stato gestire i preferiti 
    const [favorites, setFavorite] = useState([]);
    //funzioni di gestione dei preferiti
    const addFavorite = (productId) => {
        setFavorite(prev => prev.includes(productId) ? prev : [...prev, productId])
    };
    const removeFavorite = (productId)=>{
       setFavorite (prev=>prev.filter(id => id !== productId))
    };
      
    const isFavorite =(productId)=>{
        return favorites.includes(productId)
    };  
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
        fetchProducts();
    }, []);
    const [compareItems, setCompareItems] = useState([]);

    const addToCompare = (product) => {
        const alreadyInCompare = compareItems.some((item) => item.id === product.id);

        if (alreadyInCompare) {
            return "already-added";
        }

        if (compareItems.length >= 3) {
            return "max-reached";
        }

        setCompareItems([...compareItems, product]);
        return "added";
    };

    const removeFromCompare = (productId) => {
        setCompareItems(compareItems.filter((item) => item.id !== productId));
    };

    const isInCompare = (productId) => {
        return compareItems.some((item) => item.id === productId);
    };

    const clearCompare = () => {
        setCompareItems([]);
    };

    return (
        <CompareContext.Provider
            value={{
                favorites,
                products,
                compareItems,
                addFavorite,
                removeFavorite,
                isFavorite,
                addToCompare,
                removeFromCompare,
                isInCompare,
                clearCompare,
            }}
        >
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    return useContext(CompareContext);
}