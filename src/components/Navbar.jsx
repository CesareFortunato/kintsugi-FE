import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useState, useEffect } from "react";
import FreeShippingBanner from "./FreeShippingBanner";
import { BsHeart, BsCart } from "react-icons/bs";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { wishlist } = useWishlist();

  const trimmedSearch = searchTerm.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trimmedSearch) return;
    navigate(trimmedSearch ? `/search?name=${encodeURIComponent(trimmedSearch)}` : `/search`);
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  // badge carrello aggiornato
  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };
    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  return (
    <header className="sticky-top">
      <FreeShippingBanner />

      <nav className="navbar navbar-expand-lg navbar-light navbar-solid">
        <div className="container">
          {/* BRAND */}
          <Link className="navbar-brand fw-bold" to="/" onClick={closeMenu}>
            Kintsugi Essence
          </Link>

          {/* ICONICHE MOBILE */}
          <div className="d-lg-none d-flex ms-auto align-items-center gap-3 me-2">
            <Link to="/Wishlist" className="text-gold position-relative">
              <BsHeart size={22} />
              {wishlist.length > 0 && (
                <span className="cart-badge">{wishlist.length}</span>
              )}
            </Link>
            <Link to="/Cart" className="text-gold position-relative">
              <BsCart size={22} />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>

            {/* HAMBURGER DOPO LE ICONE */}
            <button
              className="navbar-toggler"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          {/* MENU A TENDA */}
          <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item">
                <Link className="nav-link luxury-link" to="/" onClick={closeMenu}>Home</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link luxury-link" to="/Products" onClick={closeMenu}>Prodotti</Link>
              </li>

              {/* Preferiti desktop */}
              <li className="nav-item position-relative d-none d-lg-block">
                <Link className="nav-link luxury-link" to="/Wishlist" onClick={closeMenu}>
                  Preferiti
                  {wishlist.length > 0 && (
                    <span className="cart-badge">{wishlist.length}</span>
                  )}
                </Link>
              </li>

              {/* Carrello desktop */}
              <li className="nav-item position-relative d-none d-lg-block">
                <Link className="nav-link luxury-link" to="/Cart" onClick={closeMenu}>
                  Carrello
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </Link>
              </li>

              <li className="nav-item">
                <form onSubmit={handleSubmit} className="d-flex ms-lg-3 mt-3 mt-lg-0">
                  <input
                    type="text"
                    className="form-control luxury-input"
                    placeholder="Cerca un profumo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="btn luxury-btn ms-2">Vai</button>
                </form>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}