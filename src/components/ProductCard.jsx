import { Link } from "react-router-dom";
import { addToCart } from "../utils/cart";
import { useCompare } from "../context/CompareContext";
import { useState } from "react";
import ProductPrice from "./ProductPrice";
import { getDiscountPercent, hasDiscount } from "../utils/pricing";

function ProductCard({ product }) {
  // stato toast con visibilità, messaggio e tipo
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const {
    id,
    name,
    description,
    size_ml,
    product_image_url,
    public_slug,
  } = product;

  // funzioni del compare context
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const discounted = hasDiscount(product);
  const discountPercent = getDiscountPercent(product);

  // mostra il toast e lo nasconde dopo qualche secondo
  const showToastMessage = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 2500);
  };

  // aggiunge il prodotto al carrello e mostra il messaggio
  const handleAddToCart = () => {
    addToCart(product);
    window.dispatchEvent(new Event("cartUpdated"));

    showToastMessage("Prodotto aggiunto al carrello", "success");
  };

  // aggiunge o rimuove il prodotto dal confronto e mostra il messaggio corretto
  const handleCompareClick = () => {
    // se è già nel confronto lo rimuoviamo
    if (isInCompare(id)) {
      const result = removeFromCompare(id);
      showToastMessage(result.message, result.type);
      return;
    }

    // proviamo ad aggiungerlo al confronto
    const result = addToCompare(product);

    // mostriamo il messaggio in base all'esito restituito dal context
    showToastMessage(result.message, result.type);
  };

  return (
    <>
      {/* toast riutilizzato per carrello e confronto */}
      {toast.show && (
        <div
          className={`alert position-fixed top-0 end-0 m-4 shadow ${toast.type === "error" ? "alert-danger" : "alert-success"
            }`}
          style={{ zIndex: 9999 }}
        >
          {toast.message}
        </div>
      )}

      <div
        className="card product-card h-100 shadow-sm"
        style={{ width: "18rem" }}
      >
        <div className="position-relative">
          {/* badge sconto */}
          {discounted && (
            <span
              className="badge bg-danger position-absolute top-0 end-0 m-2"
              style={{ zIndex: 2 }}
            >
              -{discountPercent}%
            </span>
          )}

          {/* immagine prodotto */}
          <img
            src={product_image_url}
            className="card-img-top p-3"
            alt={name}
          />
        </div>

        <div className="card-body">
          {/* nome prodotto */}
          <h5 className="card-title fw-bold">{name}</h5>

          {/* descrizione breve */}
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
          {/* link al dettaglio */}
          <Link
            to={`/products/${public_slug}`}
            className="btn btn-dark btn-sm"
          >
            Dettaglio
          </Link>

          {/* bottone aggiunta al carrello */}
          <button
            className="btn btn-dark btn-sm"
            onClick={handleAddToCart}
          >
            Aggiungi al carrello
          </button>

          {/* bottone confronto */}
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