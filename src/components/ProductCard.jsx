import { Link } from "react-router-dom";
import { addToCart } from "../utils/cart";
import { useCompare } from "../context/CompareContext";
import { useState } from "react";
import ProductPrice from "./ProductPrice";
import { getDiscountPercent, hasDiscount } from "../utils/pricing";

function ProductCard({ product }) {

const { addToCompare, removeFromCompare, isInCompare, isFavorite, addFavorite, removeFavorite } = useCompare();
  

const [showToast, setShowToast] = useState(false);
  const {
    id,
    name,
    description,
    size_ml,
    product_image_url,
    public_slug,
  } = product;


  
  const favorite = isFavorite(id);
  //funzione stabilire l'azione
  const toggleFavorite = () => {
    if (favorite) {
      removeFavorite(id);
    }
    else {
      addFavorite(id)
    };
  }



  const discounted = hasDiscount(product);
  const discountPercent = getDiscountPercent(product);

  const handleAddToCart = () => {
    addToCart(product);
    window.dispatchEvent(new Event("cartUpdated"));

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleCompareClick = () => {
    if (isInCompare(id)) {
      removeFromCompare(id);
      return;
    }

    const result = addToCompare(product);

    if (result === "max-reached")
      alert("Puoi confrontare al massimo 3 prodotti");

    if (result === "already-added")
      alert("Prodotto già aggiunto al confronto");
  };

  return (
    <>
      {showToast && (
        <div
          className="alert alert-success position-fixed top-0 end-0 m-4 shadow"
          style={{ zIndex: 9999 }}
        >
          Prodotto aggiunto al carrello
        </div>
      )}

      <div
        className="card product-card h-100 shadow-sm"
        style={{ width: "18rem" }}
      >
        <div className="position-relative">
          {discounted && (
            <span
              className="badge bg-danger position-absolute top-0 end-0 m-2"
              style={{ zIndex: 2 }}
            >
              -{discountPercent}%
            </span>
          )}

          <img
            src={product_image_url}
            className="card-img-top p-3"
            alt={name}
          />
        </div>

        <div className="card-body">
          <h5 className="card-title fw-bold">{name}
            <span className="heart-icon" onClick={toggleFavorite}>
              {isFavorite(id) ? "❤️" : "🤍"}
            </span>

          </h5>
          <p className="card-text text-muted small">{description}</p>
        </div>

        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <ProductPrice
              product={product}
              finalPriceClassName="fw-bold text-danger"
              originalPriceClassName="text-muted text-decoration-line-through small"
              showBadge={false}
            />
          </li>

          <li className="list-group-item small">
            Formato: {size_ml} ml
          </li>
        </ul>

        <div className="card-body d-flex flex-wrap gap-2 justify-content-between">
          <Link
            to={`/products/${public_slug}`}
            className="btn btn-dark btn-sm"
          >
            Dettaglio
          </Link>

          <button
            className="btn btn-dark btn-sm"
            onClick={handleAddToCart}
          >
            Aggiungi al carrello
          </button>

          <button
            className={`btn btn-sm w-100 ${isInCompare(id)
              ? "btn-outline-danger"
              : "btn-outline-secondary"
              }`}
            onClick={handleCompareClick}
          >
            {isInCompare(id) ? "Rimuovi confronto" : "Confronta"}
          </button>
        </div>
      </div>
    </>
  );
}

export default ProductCard;