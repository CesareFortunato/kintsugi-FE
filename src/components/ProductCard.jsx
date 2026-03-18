import { useNavigate, Link } from "react-router-dom";
import { addToCart } from "../utils/cart";
import { useCompare } from "../context/CompareContext";
import { useWishlist } from "../context/WishlistContext";
import { useState } from "react";
import ProductPrice from "./ProductPrice";
import { getDiscountPercent, hasDiscount } from "../utils/pricing";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const { id, name, description, size_ml, product_image_url, public_slug } =
    product;
  const favorite = wishlist.some((p) => p.id === id);

  const showToastMessage = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      2500,
    );
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (favorite) {
      removeFromWishlist(id);
      showToastMessage("Rimosso dai preferiti!", "success");
    } else {
      addToWishlist(product);
      showToastMessage("Aggiunto ai preferiti!", "success");
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    window.dispatchEvent(new Event("cartUpdated"));
    showToastMessage("Prodotto aggiunto al carrello", "success");
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    if (isInCompare(id)) {
      const result = removeFromCompare(id);
      showToastMessage(result.message, result.type);
      return;
    }
    const result = addToCompare(product);
    showToastMessage(result.message, result.type);
  };

  // navigazione cliccando sulla card ma **escludendo i bottoni**
  const handleCardClick = (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (tag === "button" || tag === "a" || tag === "span") return;
    navigate(`/products/${public_slug}`);
  };

  const discounted = hasDiscount(product);
  const discountPercent = getDiscountPercent(product);

  return (
    <>
      {toast.show && (
        <div
          className={`alert position-fixed top-0 end-0 m-4 shadow ${
            toast.type === "error" ? "alert-danger" : "alert-success"
          }`}
          style={{ zIndex: 9999 }}
        >
          {toast.message}
        </div>
      )}

      <div
        className="card product-card h-100 shadow-sm"
        style={{ width: "14rem", cursor: "pointer" }}
        onClick={handleCardClick}
      >
        <div className="position-relative">
          {discounted && (
            <span className="badge bg-danger position-absolute top-0 end-0 m-2">
              -{discountPercent}%
            </span>
          )}

          <span
            onClick={toggleFavorite}
            className="position-absolute top-0 start-0 m-2 px-2 py-1"
            style={{
              background: favorite
                ? "linear-gradient(135deg, #d4af37, #f5e6a8)"
                : "#d4af37",
              color: favorite ? "#000" : "#fff",
              fontSize: "0.75rem",
              fontWeight: "bold",
              borderRadius: "4px",
              zIndex: 2,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            {favorite ? "✓ Salvato" : "+ Salva"}
          </span>

          <img
            src={product_image_url}
            className="card-img-top p-3"
            alt={name}
          />
        </div>

        <div className="card-body">
          <h5 className="card-title fw-bold">{name}</h5>
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
          <li className="list-group-item small">Formato: {size_ml} ml</li>
        </ul>

        <div className="card-body d-flex flex-wrap gap-2 justify-content-between">
          <Link
            to={`/products/${public_slug}`}
            className="btn btn-dark btn-sm"
            onClick={(e) => e.stopPropagation()}
          >
            Dettaglio
          </Link>
          <button className="btn btn-dark btn-sm" onClick={handleAddToCart}>
            Aggiungi al carrello
          </button>
          <button
            className={`btn btn-sm w-100 ${
              isInCompare(id) ? "btn-outline-danger" : "btn-outline-secondary"
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
