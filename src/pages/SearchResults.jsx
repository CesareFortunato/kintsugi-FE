import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import ProductPrice from "../components/ProductPrice";
import { addToCart } from "../utils/cart";
import { useCompare } from "../context/CompareContext";

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

  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  useEffect(() => {
    setLoading(true);
    axios
      .get(endpoint, {
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
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [name, sortBy, minPrice, maxPrice, family, noteName, noteType]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);

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

    if (value) newParams.set(key, value);
    else newParams.delete(key);

    setSearchParams(newParams);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleCompareClick = (product) => {
    if (isInCompare(product.id)) removeFromCompare(product.id);
    else addToCompare(product);
  };

  return (
    <div className="container my-5">

      {/* Link torni alla Home */}
      <div className="mb-3">
        <Link
          to="/"
          style={{
            color: "#d4af37",
            fontWeight: "bold",
            textDecoration: "none",
            fontSize: "1rem",
          }}
        >
          ← Torna alla Home
        </Link>
      </div>

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
            min="0"
            className="form-control"
            value={minPrice}
            onChange={(e) => updateFilter("min_price", e.target.value)}
          />
        </div>

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
        <div className="d-flex flex-column gap-2">
          {products.map((product) => (
            <div key={product.id} className="card px-3 py-2">
              <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
                <Link
                  to={`/products/${product.public_slug}`}
                  className="text-dark text-decoration-none fw-semibold"
                >
                  {product.name}
                </Link>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <ProductPrice product={product} />
                  <button
                    className="btn btn-sm btn-dark"
                    onClick={() => handleAddToCart(product)}
                  >
                    Aggiungi
                  </button>
                  <button
                    className={`btn btn-sm ${
                      isInCompare(product.id) ? "btn-outline-danger" : "btn-outline-dark"
                    }`}
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