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

  // hook per navigare via codice
  const navigate = useNavigate();

  // versione pulita del testo cercato
  const trimmedSearch = searchTerm.trim();

  // submit della barra di ricerca
  const handleSubmit = (e) => {
    e.preventDefault();

    // se il campo è vuoto non facciamo nulla
    if (!trimmedSearch) return;

    // navighiamo verso la pagina risultati con il nome cercato
    navigate(`/search?name=${encodeURIComponent(trimmedSearch)}`);
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

    // pulizia listener in unmount
    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  return (
    <header className="sticky-top">
      <FreeShippingBanner />

      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Kintsugi Essence
          </Link>

          <button
            className="navbar-toggler"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/Products">
                  Prodotti
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/Wishlist">
                  Preferiti
                </Link>
              </li>

              <li className="nav-item position-relative">
                <Link className="nav-link" to="/Cart">
                  Carrello
                  {cartCount > 0 && (
                    <span
                      className="position-absolute badge rounded-pill bg-danger"
                      style={{
                        top: "1px",
                        right: "-10px",
                        fontSize: "0.6rem",
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>

              <form onSubmit={handleSubmit} className="d-flex ms-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cerca un profumo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <button
                  type="submit"
                  className="btn btn-dark ms-2"
                  disabled={!trimmedSearch}
                >
                  Vai
                </button>
              </form>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}