// importiamo hook di React
import { useEffect, useState } from "react";

// hook di react-router per leggere e modificare i parametri nella URL
import { useSearchParams, Link } from "react-router-dom";

// axios per fare chiamate HTTP al backend
import axios from "axios";

// componente che renderizza la card del prodotto
import ProductCard from "../components/ProductCard";

// endpoint del backend per la ricerca dei profumi
const endpoint = "http://localhost:3000/parfumes/search";

export default function SearchResults() {

    // hook che permette di leggere e modificare i parametri della query nella URL
    const [searchParams, setSearchParams] = useSearchParams();

    // recuperiamo i parametri dalla URL (se non esistono mettiamo stringa vuota)
    const name = searchParams.get("name") || "";
    const sortBy = searchParams.get("sortBy") || "";
    const minPrice = searchParams.get("min_price") || "";
    const maxPrice = searchParams.get("max_price") || "";
    const family = searchParams.get("family") || "";
    const noteName = searchParams.get("note_name") || "";
    const noteType = searchParams.get("note_type") || "";

    // stato che contiene i prodotti restituiti dal backend
    const [products, setProducts] = useState([]);

    // stato per cambiare visualizzazione (griglia o lista)
    const [viewMode, setViewMode] = useState("grid");

    // stato per gestire il caricamento dei risultati
    const [loading, setLoading] = useState(false);

    // useEffect che si attiva ogni volta che cambia un filtro
    useEffect(() => {

        // attiviamo lo stato di loading
        setLoading(true);

        // chiamata GET al backend con i filtri come parametri
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
                // salviamo i prodotti ricevuti nello stato
                setProducts(res.data);
            })
            .catch((err) => {
                // stampiamo eventuali errori
                console.log(err);
            })
            .finally(() => {
                // disattiviamo il loading
                setLoading(false);
            });

        // il useEffect si riesegue quando cambia uno dei filtri
    }, [name, sortBy, minPrice, maxPrice, family, noteName, noteType]);


    // funzione che aggiorna i parametri della URL quando cambiamo un filtro
    const updateFilter = (key, value) => {

        // cloniamo i parametri attuali
        const newParams = new URLSearchParams(searchParams);

        // se il valore esiste lo impostiamo
        if (value) {
            newParams.set(key, value);
        } else {
            // altrimenti lo rimuoviamo
            newParams.delete(key);
        }

        // aggiorniamo la URL
        setSearchParams(newParams);
    };


    return (
        <div className="container my-5">

            {/* intestazione della pagina */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">Risultati di ricerca</h1>

                    {/* testo dinamico basato sul nome cercato */}
                    <p className="text-muted mb-0">
                        {name ? `Risultati per "${name}"` : "Filtra i prodotti con i criteri che preferisci"}
                    </p>
                </div>

                {/* bottoni per cambiare visualizzazione */}
                <div className="d-flex gap-2">

                    {/* modalità griglia */}
                    <button
                        className={`btn ${viewMode === "grid" ? "btn-dark" : "btn-outline-dark"}`}
                        onClick={() => setViewMode("grid")}
                    >
                        Griglia
                    </button>

                    {/* modalità lista */}
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

                {/* filtro tipo di nota */}
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


            {/* gestione degli stati: loading / nessun risultato / risultati */}

            {loading ? (
                // messaggio di caricamento
                <p>Caricamento...</p>

            ) : products.length === 0 ? (
                // nessun prodotto trovato
                <p>Nessun risultato trovato.</p>

            ) : viewMode === "grid" ? (

                // visualizzazione a griglia
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {products.map((product) => (
                        <div className="col" key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

            ) : (

                // visualizzazione a lista
                <div className="d-flex flex-column gap-3">
                    {products.map((product) => (
                        <div key={product.id} className="card p-3">
                            <div className="d-flex gap-3 align-items-center">

                                {/* immagine prodotto */}
                                <Link to={`/products/${product.public_slug}`}>
                                    <img
                                        src={product.product_image_url}
                                        alt={product.name}
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
                                </Link>

                                {/* info prodotto */}
                                <div>
                                    <Link
                                        to={`/products/${product.public_slug}`}
                                        className="text-dark text-decoration-none"
                                    >
                                        <h5>{product.name}</h5>
                                    </Link>

                                    <p className="mb-1">{product.description}</p>
                                    <p className="mb-0">€ {product.price}</p>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

            )}
        </div>
    );
}