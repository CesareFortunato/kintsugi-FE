import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FreeShippingBanner from "./FreeShippingBanner";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedSearch = searchTerm.trim();

    if (trimmedSearch) {
      navigate(`/search?name=${encodeURIComponent(trimmedSearch)}`);
    } else {
      navigate(`/search`);
    }

    setIsOpen(false); // chiude menu
  };

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };

    updateCart();

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