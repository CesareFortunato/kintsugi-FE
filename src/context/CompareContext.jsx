import { createContext, useContext, useState } from "react";

const CompareContext = createContext();

export function CompareProvider({ children }) {
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
                compareItems,
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