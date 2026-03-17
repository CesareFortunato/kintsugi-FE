// importiamo Link e navigate per la navigazione
import { Link, useNavigate } from "react-router-dom";

// importiamo gli hook di React
import { useState, useEffect } from "react";

// banner spedizione gratuita
import FreeShippingBanner from "./FreeShippingBanner";

export default function Navbar() {
  // stato del testo cercato
  const [searchTerm, setSearchTerm] = useState("");

  // stato del contatore prodotti nel carrello
  const [cartCount, setCartCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // versione pulita del testo cercato
  const trimmedSearch = searchTerm.trim();

  // submit della barra di ricerca
  const handleSubmit = (e) => {
    e.preventDefault();

    // se il campo è vuoto non facciamo nulla
    if (!trimmedSearch) return;

    if (trimmedSearch) {
      navigate(`/search?name=${encodeURIComponent(trimmedSearch)}`);
    } else {
      navigate(`/search`);
    }

    setIsOpen(false); // chiude menu
  };

  // aggiorniamo il badge del carrello leggendo il localStorage
  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };

    // primo aggiornamento al mount
    updateCart();

    // ascoltiamo gli aggiornamenti del carrello
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky-top">
      <FreeShippingBanner />

      <nav className="navbar navbar-expand-lg navbar-light navbar-solid">
        <div className="container">
          
          <Link className="navbar-brand fw-bold" to="/" onClick={closeMenu}>
            Kintsugi Essence
          </Link>

          <button
            className="navbar-toggler"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
            <ul className="navbar-nav ms-auto align-items-lg-center">

              <li className="nav-item">
                <Link className="nav-link luxury-link" to="/" onClick={closeMenu}>
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link luxury-link" to="/Products" onClick={closeMenu}>
                  Prodotti
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link luxury-link" to="/Wishlist" onClick={closeMenu}>
                  Preferiti
                </Link>
              </li>

              <li className="nav-item position-relative">
                <Link className="nav-link luxury-link" to="/Cart" onClick={closeMenu}>
                  Carrello
                  {cartCount > 0 && (
                    <span className="cart-badge">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>

              <li className="nav-item">
                <form
                  onSubmit={handleSubmit}
                  className="d-flex ms-lg-3 mt-3 mt-lg-0"
                >
                  <input
                    type="text"
                    className="form-control luxury-input"
                    placeholder="Cerca un profumo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  <button type="submit" className="btn luxury-btn ms-2">
                    Vai
                  </button>
                </form>
              </li>

            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}