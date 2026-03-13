import { Link } from "react-router-dom";
import { addToCart } from "../utils/cart";
import { useCompare } from "../context/CompareContext";

function ProductCard({ product }) {
  const {
    id,
    name,
    description,
    price,
    size_ml,
    product_image_url,
    public_slug,
    discount_value,
  } = product;

  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const discountPercent = parseFloat(discount_value) || 0;
  const hasDiscount = discountPercent > 0;
  const finalPrice = hasDiscount
    ? (parseFloat(price) * (1 - discountPercent / 100)).toFixed(2)
    : parseFloat(price).toFixed(2);

  const handleAddToCart = () => {
    addToCart({ ...product, finalPrice });
    alert("Prodotto aggiunto al carrello");
  };

  const handleCompareClick = () => {
    if (isInCompare(id)) {
      removeFromCompare(id);
      return;
    }
    const result = addToCompare(product);
    if (result === "max-reached")
      alert("Puoi confrontare al massimo 3 prodotti");
    if (result === "already-added") alert("Prodotto già aggiunto al confronto");
  };

  return (
    <div
      className="card product-card h-100 shadow-sm"
      style={{ width: "18rem" }}
    >
      <img src={product_image_url} className="card-img-top p-3" alt={name} />

      <div className="card-body">
        <h5 className="card-title fw-bold">{name}</h5>
        <p className="card-text text-muted small">{description}</p>
      </div>

      <ul className="list-group list-group-flush">
        {/* --- Visualizzazione Prezzo --- */}
        <li className="list-group-item">
          {hasDiscount ? (
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold text-danger">€{finalPrice}</span>
              <span className="text-muted text-decoration-line-through small">
                €{price}
              </span>
            </div>
          ) : (
            <span className="fw-bold">€{price}</span>
          )}
        </li>
        <li className="list-group-item small">Formato: {size_ml} ml</li>
      </ul>

      <div className="card-body d-flex flex-wrap gap-2 justify-content-between">
        <Link to={`/products/${public_slug}`} className="btn btn-dark btn-sm">
          Dettaglio
        </Link>

        <button className="btn btn-dark btn-sm" onClick={handleAddToCart}>
          Aggiungi al carrello
        </button>

        <button
          className={`btn btn-sm w-100 ${isInCompare(id) ? "btn-outline-danger" : "btn-outline-secondary"}`}
          onClick={handleCompareClick}
        >
          {isInCompare(id) ? "Rimuovi confronto" : "Confronta"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
