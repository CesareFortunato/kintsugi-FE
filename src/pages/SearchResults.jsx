// importiamo hook di React
import { useEffect, useState } from "react";

// hook di react-router per leggere e modificare i parametri nella URL
import { useSearchParams, Link } from "react-router-dom";

// axios per fare chiamate HTTP al backend
import axios from "axios";

// componente card prodotto per la vista griglia
import ProductCard from "../components/ProductCard";

// componente prezzo per mostrare correttamente eventuali sconti
import ProductPrice from "../components/ProductPrice";

// utility carrello
import { addToCart } from "../utils/cart";

// context confronto prodotti
import { useCompare } from "../context/CompareContext";

// endpoint del backend per la ricerca dei profumi
const endpoint = "http://localhost:3000/parfumes/search";

export default function SearchResults() {
    // hook che permette di leggere e modificare i parametri della query nella URL
    const [searchParams, setSearchParams] = useSearchParams();

    // recuperiamo i parametri dalla URL
    const name = searchParams.get("name") || "";
    const sortBy = searchParams.get("sortBy") || "";
    const minPrice = searchParams.get("min_price") || "";
    const maxPrice = searchParams.get("max_price") || "";
    const family = searchParams.get("family") || "";
    const noteName = searchParams.get("note_name") || "";
    const noteType = searchParams.get("note_type") || "";

    // stato con i prodotti restituiti dal backend
    const [products, setProducts] = useState([]);

    // stato per cambiare visualizzazione tra griglia e lista
    const [viewMode, setViewMode] = useState("grid");

    // stato per gestire il caricamento
    const [loading, setLoading] = useState(false);

    // funzioni del context confronto
    const { addToCompare, removeFromCompare, isInCompare } = useCompare();

    // useEffect che parte ogni volta che cambia un filtro
    useEffect(() => {
        // attiviamo il loading
        setLoading(true);

        // chiamata GET al backend con tutti i filtri attivi
        axios.get(endpoint, {
            params: {
                name,
                sortBy,
                min_price: minPrice,
                max_price: maxPrice,
                family,
                note_name: noteName,
                note_type: noteType,
            },
        })
            .then((res) => {
                // salviamo i prodotti ricevuti
                setProducts(res.data);
            })
            .catch((err) => {
                // logghiamo eventuali errori
                console.log(err);
            })
            .finally(() => {
                // spegniamo il loading
                setLoading(false);
            });

        // rieseguiamo la fetch quando cambia un filtro
    }, [name, sortBy, minPrice, maxPrice, family, noteName, noteType]);

    // funzione che aggiorna i parametri nella URL
    const updateFilter = (key, value) => {
        // cloniamo i parametri attuali
        const newParams = new URLSearchParams(searchParams);

        // se il filtro è prezzo minimo o massimo, impediamo valori sotto zero
        if (key === "min_price" || key === "max_price") {
            if (value === "") {
                newParams.delete(key);
                setSearchParams(newParams);
                return;
            }

            const normalizedValue = Math.max(0, Number(value));
            newParams.set(key, normalizedValue.toString());
            setSearchParams(newParams);
            return;
        }

        // per gli altri filtri impostiamo o rimuoviamo il parametro
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }

        // aggiorniamo la URL
        setSearchParams(newParams);
    };

    // aggiunge un prodotto al carrello e aggiorna il badge
    const handleAddToCart = (product) => {
        addToCart(product);
        window.dispatchEvent(new Event("cartUpdated"));
    };

    // aggiunge o rimuove un prodotto dal confronto
    const handleCompareClick = (product) => {
        if (isInCompare(product.id)) {
            removeFromCompare(product.id);
        } else {
            addToCompare(product);
        }
    };

    return (
        <div className="container my-5">
            {/* intestazione pagina */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">Risultati di ricerca</h1>

                    {/* testo dinamico in base al nome cercato */}
                    <p className="text-muted mb-0">
                        {name ? `Risultati per "${name}"` : "Filtra i prodotti con i criteri che preferisci"}
                    </p>
                </div>

                {/* bottoni per cambiare vista */}
                <div className="d-flex gap-2">
                    <button
                        className={`btn ${viewMode === "grid" ? "btn-dark" : "btn-outline-dark"}`}
                        onClick={() => setViewMode("grid")}
                    >
                        Griglia
                    </button>

                    <button
                        className={`btn ${viewMode === "list" ? "btn-dark" : "btn-outline-dark"}`}
                        onClick={() => setViewMode("list")}
                    >
                        Lista
                    </button>
                </div>
            </div>

            {/* sezione filtri */}
            <div className="row mb-4">
                {/* ordinamento */}
                <div className="col-md-3">
                    <label className="form-label">Ordina per</label>
                    <select
                        className="form-select"
                        value={sortBy}
                        onChange={(e) => updateFilter("sortBy", e.target.value)}
                    >
                        <option value="">Seleziona</option>
                        <option value="name-asc">Nome A-Z</option>
                        <option value="name-desc">Nome Z-A</option>
                        <option value="price-asc">Prezzo crescente</option>
                        <option value="price-desc">Prezzo decrescente</option>
                        <option value="size-asc">Formato crescente</option>
                        <option value="size-desc">Formato decrescente</option>
                    </select>
                </div>

                {/* filtro prezzo minimo */}
                <div className="col-md-3">
                    <label className="form-label">Prezzo minimo</label>
                    <input
                        type="number"
                        min="0"
                        className="form-control"
                        value={minPrice}
                        onChange={(e) => updateFilter("min_price", e.target.value)}
                    />
                </div>

                {/* filtro prezzo massimo */}
                <div className="col-md-3">
                    <label className="form-label">Prezzo massimo</label>
                    <input
                        type="number"
                        min="0"
                        className="form-control"
                        value={maxPrice}
                        onChange={(e) => updateFilter("max_price", e.target.value)}
                    />
                </div>

                {/* filtro famiglia olfattiva */}
                <div className="col-md-3">
                    <label className="form-label">Famiglia olfattiva</label>
                    <select
                        className="form-select"
                        value={family}
                        onChange={(e) => updateFilter("family", e.target.value)}
                    >
                        <option value="">Tutte</option>
                        <option value="Legnosa">Legnosa</option>
                        <option value="Agrumata">Agrumata</option>
                        <option value="Fiorita">Fiorita</option>
                        <option value="Orientale">Orientale</option>
                        <option value="Speziata">Speziata</option>
                        <option value="Resinosa">Resinosa</option>
                        <option value="Acquatica">Acquatica</option>
                        <option value="Cuoiata">Cuoiata</option>
                        <option value="Muschiata">Muschiata</option>
                    </select>
                </div>

                {/* filtro nome essenza */}
                <div className="col-md-6 mt-3">
                    <label className="form-label">Nome essenza</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Es. Vaniglia, Neroli, Oud..."
                        value={noteName}
                        onChange={(e) => updateFilter("note_name", e.target.value)}
                    />
                </div>

                {/* filtro tipo nota */}
                <div className="col-md-6 mt-3">
                    <label className="form-label">Tipo nota</label>
                    <select
                        className="form-select"
                        value={noteType}
                        onChange={(e) => updateFilter("note_type", e.target.value)}
                    >
                        <option value="">Tutti</option>
                        <option value="testa">Testa</option>
                        <option value="cuore">Cuore</option>
                        <option value="base">Base</option>
                    </select>
                </div>
            </div>

            {/* stati pagina: loading, nessun risultato, risultati */}
            {loading ? (
                <p>Caricamento...</p>
            ) : products.length === 0 ? (
                <p>Nessun risultato trovato.</p>
            ) : viewMode === "grid" ? (
                // vista a griglia con card complete
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {products.map((product) => (
                        <div className="col" key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                // vista a lista più compatta per mostrare più prodotti
                <div className="d-flex flex-column gap-2">
                    {products.map((product) => (
                        <div key={product.id} className="card px-3 py-2">
                            <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
                                {/* nome prodotto */}
                                <Link
                                    to={`/products/${product.public_slug}`}
                                    className="text-dark text-decoration-none fw-semibold"
                                >
                                    {product.name}
                                </Link>

                                {/* prezzo e azioni rapide */}
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <ProductPrice product={product} />

                                    <button
                                        className="btn btn-sm btn-dark"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        Aggiungi
                                    </button>

                                    <button
                                        className={`btn btn-sm ${isInCompare(product.id) ? "btn-outline-danger" : "btn-outline-dark"}`}
                                        onClick={() => handleCompareClick(product)}
                                    >
                                        {isInCompare(product.id) ? "Rimuovi confronto" : "Confronta"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}