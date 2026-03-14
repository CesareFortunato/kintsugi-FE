import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../utils/cart";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  const loadCart = () => {
    const cart = getCart();
    setCartItems(cart);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleIncrease = (productId) => {
    increaseQuantity(productId);
    loadCart();
    window.dispatchEvent(new Event("cartUpdated")); // aggiorna badge
  };

  const handleDecrease = (productId) => {
    decreaseQuantity(productId);
    loadCart();
    window.dispatchEvent(new Event("cartUpdated")); // aggiorna badge
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
    loadCart();
    window.dispatchEvent(new Event("cartUpdated")); // aggiorna badge
  };

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const shipping = subtotal >= 200 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <div className="container my-5">
      <h1 className="mb-4">Carrello</h1>

      {cartItems.length === 0 ? (
        <p>Il carrello è vuoto.</p>
      ) : (
        <>
          <div className="row g-4">
            {cartItems.map((item) => (
              <div className="col-12" key={item.id}>
                <div className="card p-3">
                  <div className="row align-items-center">
                    {/* Immagine cliccabile */}
                    <div className="col-md-2">
                      <Link to={`/products/${item.public_slug}`}>
                        <img
                          src={
                            (
                              item.product_image_url ||
                              item.image_url ||
                              item.image
                            )?.startsWith("http")
                              ? item.product_image_url ||
                                item.image_url ||
                                item.image
                              : `http://localhost:3000/img/${
                                  item.product_image_url ||
                                  item.image_url ||
                                  item.image
                                }`
                          }
                          alt={item.name}
                          className="img-fluid rounded"
                          style={{ maxHeight: "100px", objectFit: "contain" }}
                          onError={(e) => {
                            console.error("Fallimento totale immagine per:", item.name);
                            e.target.src = "https://via.placeholder.com";
                          }}
                        />
                      </Link>
                    </div>

                    {/* Nome cliccabile */}
                    <div className="col-md-4">
                      <Link
                        to={`/detail/${item.public_slug}`}
                        className="text-decoration-none text-dark"
                      >
                        <h5>{item.name}</h5>
                      </Link>
                      <p className="mb-0">€{item.price}</p>
                    </div>

                    {/* Quantità */}
                    <div className="col-md-3 d-flex align-items-center gap-2">
                      <button
                        className="btn btn-outline-dark"
                        onClick={() => handleDecrease(item.id)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-outline-dark"
                        onClick={() => handleIncrease(item.id)}
                      >
                        +
                      </button>
                    </div>

                    {/* Totale prodotto */}
                    <div className="col-md-2">
                      <strong>€{(item.price * item.quantity).toFixed(2)}</strong>
                    </div>

                    {/* Rimuovi prodotto */}
                    <div className="col-md-1">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleRemove(item.id)}
                      >
                        X
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Riepilogo ordine */}
          <div className="mt-4 text-end">
            <h4>Subtotal: €{subtotal.toFixed(2)}</h4>

            <h5>
              Spedizione:{" "}
              {shipping === 0 ? (
                <span className="text-success fw-bold"> Gratis</span>
              ) : (
                `€${shipping}`
              )}
            </h5>

            <h4>Totale: €{total.toFixed(2)}</h4>

            {subtotal < 200 && (
              <p className="text-success">
                Ti mancano €{(200 - subtotal).toFixed(2)} per la spedizione gratuita
              </p>
            )}

            {subtotal >= 200 && (
              <p className="text-success fw-bold">
                Hai ottenuto la spedizione gratuita!
              </p>
            )}

            {cartItems.length > 0 && (
              <Link to="/checkout" className="btn btn-dark mt-3">
                Passa al checkout
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}