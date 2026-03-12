import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const endpoint = "http://localhost:3000/parfumes/search";

export default function SearchResults() {
    const [searchParams, setSearchParams] = useSearchParams();

    const name = searchParams.get("name") || "";
    const sortBy = searchParams.get("sortBy") || "";
    const minPrice = searchParams.get("min_price") || "";
    const maxPrice = searchParams.get("max_price") || "";
    const family = searchParams.get("family") || "";
    const noteName = searchParams.get("note_name") || "";
    const noteType = searchParams.get("note_type") || "";

    const [products, setProducts] = useState([]);
    const [viewMode, setViewMode] = useState("grid");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

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
                setProducts(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [name, sortBy, minPrice, maxPrice, family, noteName, noteType]);

    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);

        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }

        setSearchParams(newParams);
    };

    return (
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">Risultati di ricerca</h1>
                    <p className="text-muted mb-0">
                        {name ? `Risultati per "${name}"` : "Filtra i prodotti con i criteri che preferisci"}
                    </p>
                </div>

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

            <div className="row mb-4">
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

                <div className="col-md-3">
                    <label className="form-label">Prezzo minimo</label>
                    <input
                        type="number"
                        className="form-control"
                        value={minPrice}
                        onChange={(e) => updateFilter("min_price", e.target.value)}
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label">Prezzo massimo</label>
                    <input
                        type="number"
                        className="form-control"
                        value={maxPrice}
                        onChange={(e) => updateFilter("max_price", e.target.value)}
                    />
                </div>

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

            {loading ? (
                <p>Caricamento...</p>
            ) : products.length === 0 ? (
                <p>Nessun risultato trovato.</p>
            ) : viewMode === "grid" ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {products.map((product) => (
                        <div className="col" key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {products.map((product) => (
                        <div key={product.id} className="card p-3">
                            <div className="d-flex gap-3 align-items-center">
                                <Link to={`/products/${product.public_slug}`}>
                                    <img
                                        src={product.product_image_url}
                                        alt={product.name}
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
                                </Link>

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