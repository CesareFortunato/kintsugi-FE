import { useWishlist } from "../context/WishlistContext";
import { Link } from "react-router-dom";
import { addToCart } from "../utils/cart";
import { useCompare } from "../context/CompareContext";
import ProductPrice from "../components/ProductPrice";
import { getDiscountPercent, hasDiscount } from "../utils/pricing";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const handleAddToCart = (product, e) => {
    e.stopPropagation(); // evita che il click apra il Link
    addToCart(product);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleCompareClick = (product, e) => {
    e.stopPropagation();
    if (isInCompare(product.id)) removeFromCompare(product.id);
    else addToCompare(product);
  };

  return (
    <div className="container py-5">
      <h4 className="text-center my-4">La tua wishlist</h4>

      {wishlist.length === 0 ? (
        <p className="text-center text-muted">Non hai ancora aggiunto prodotti ai preferiti.</p>
      ) : (
        <div className="row g-4">
          {wishlist.map((product) => {
            const discounted = hasDiscount(product);
            const discountPercent = getDiscountPercent(product);

            return (
              <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <Link
                    to={`/products/${product.public_slug}`}
                    className="text-decoration-none text-dark"
                  >
                    <div className="position-relative">
                      {discounted && (
                        <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                          -{discountPercent}%
                        </span>
                      )}
                      <img
                        src={product.product_image_url}
                        className="card-img-top p-3"
                        alt={product.name}
                      />
                    </div>

                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text text-muted small">{product.description}</p>
                    </div>
                  </Link>

                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <ProductPrice
                        product={product}
                        finalPriceClassName="fw-bold text-danger"
                        originalPriceClassName="text-muted text-decoration-line-through small"
                        showBadge={false}
                      />
                    </li>
                    <li className="list-group-item small">Formato: {product.size_ml} ml</li>
                  </ul>

                  <div className="card-body d-flex flex-wrap gap-2 justify-content-between">
                    <Link
                      to={`/products/${product.public_slug}`}
                      className="btn btn-dark btn-sm"
                    >
                      Dettaglio
                    </Link>

                    <button
                      className="btn btn-dark btn-sm"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      Aggiungi al carrello
                    </button>

                    <button
                      className={`btn btn-sm w-100 ${
                        isInCompare(product.id) ? "btn-outline-danger" : "btn-outline-secondary"
                      }`}
                      onClick={(e) => handleCompareClick(product, e)}
                    >
                      {isInCompare(product.id) ? "Rimuovi confronto" : "Confronta"}
                    </button>

                    <button
                      className="btn btn-outline-danger btn-sm w-100 mt-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(product.id);
                      }}
                    >
                      Rimuovi dai preferiti
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}