import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const endpoint = "http://localhost:3000/parfumes";

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const [products, setProducts] = useState([]);
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("");
    const [selectedNote, setSelectedNote] = useState("");
    const [priceOrder, setPriceOrder] = useState("");

    useEffect(() => {
        axios
            .get(endpoint)
            .then((res) => {
                setProducts(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const filteredProducts = useMemo(() => {
        let results = [...products];

        // filtro base da searchbar
        results = results.filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );

        // filtro per nota
        if (selectedNote) {
            results = results.filter((product) =>
                product.notes?.some((note) =>
                    note.name?.toLowerCase() === selectedNote.toLowerCase()
                )
            );
        }

        // ordinamento
        if (sortBy === "name-asc") {
            results.sort((a, b) => a.name.localeCompare(b.name));
        }

        if (sortBy === "name-desc") {
            results.sort((a, b) => b.name.localeCompare(a.name));
        }

        if (sortBy === "price-asc") {
            results.sort((a, b) => Number(a.price) - Number(b.price));
        }

        if (sortBy === "price-desc") {
            results.sort((a, b) => Number(b.price) - Number(a.price));
        }

        return results;
    }, [products, query, selectedNote, sortBy]);

    return (
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Risultati per: "{query}"</h1>

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
                <div className="col-md-4">
                    <label className="form-label">Ordina per</label>
                    <select
                        className="form-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="">Seleziona</option>
                        <option value="name-asc">Nome A-Z</option>
                        <option value="name-desc">Nome Z-A</option>
                        <option value="price-asc">Prezzo crescente</option>
                        <option value="price-desc">Prezzo decrescente</option>
                    </select>
                </div>
            </div>

            {viewMode === "grid" ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {filteredProducts.map((product) => (
                        <div className="col" key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="card p-3">
                            <div className="d-flex gap-3 align-items-center">
                                <img
                                    src={product.product_image_url}
                                    alt={product.name}
                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                />
                                <div>
                                    <h5>{product.name}</h5>
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