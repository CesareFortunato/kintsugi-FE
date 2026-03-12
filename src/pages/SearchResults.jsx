import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const endpoint = "http://localhost:3000/parfumes/search";

export default function SearchResults() {
    const [searchParams, setSearchParams] = useSearchParams();

    const query = searchParams.get("q") || "";
    const sortBy = searchParams.get("sortBy") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const note = searchParams.get("note") || "";

    const [products, setProducts] = useState([]);
    const [viewMode, setViewMode] = useState("grid");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        axios
            .get(endpoint, {
                params: {
                    q: query,
                    sortBy,
                    minPrice,
                    maxPrice,
                    note,
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
    }, [query, sortBy, minPrice, maxPrice, note]);

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
                        {query ? `Risultati per "${query}"` : "Tutti i prodotti"}
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
                    </select>
                </div>

                <div className="col-md-3">
                    <label className="form-label">Prezzo minimo</label>
                    <input
                        type="number"
                        className="form-control"
                        value={minPrice}
                        onChange={(e) => updateFilter("minPrice", e.target.value)}
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label">Prezzo massimo</label>
                    <input
                        type="number"
                        className="form-control"
                        value={maxPrice}
                        onChange={(e) => updateFilter("maxPrice", e.target.value)}
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label">Nota aromatica</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Es. vaniglia"
                        value={note}
                        onChange={(e) => updateFilter("note", e.target.value)}
                    />
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