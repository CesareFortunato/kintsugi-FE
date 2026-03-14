import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {

  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedSearch = searchTerm.trim();

    if (trimmedSearch) {
      navigate(`/search?name=${encodeURIComponent(trimmedSearch)}`);
    } else {
      navigate(`/search`);
    }
  };

  // aggiorna numero carrello
  useEffect(() => {

    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };

    updateCart();

    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };

  }, []);

  return (

    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">

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
              <Link className="nav-link" to="/">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/Products">Prodotti</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/Wishlist">Preferiti</Link>
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
              <button type="submit" className="btn btn-dark ms-2">
                Vai
              </button>
            </form>

          </ul>

        </div>

      </div>

    </nav>

  );
}