import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {

  // stato che contiene il testo scritto nella barra di ricerca
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // funzione che si attiva quando si invia il form
  const handleSubmit = (e) => {

    // impedisce il refresh della pagina
    e.preventDefault();

    // rimuove eventuali spazi all'inizio e alla fine della ricerca
    const trimmedSearch = searchTerm.trim();

    // se esiste un termine di ricerca
    if (trimmedSearch) {

      // naviga alla pagina search passando il nome come query parameter
      navigate(`/search?name=${encodeURIComponent(trimmedSearch)}`);

    } else {

      // se il campo è vuoto naviga comunque alla pagina search
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

    // navbar bootstrap fissata in alto
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">

      <div className="container">

        {/* logo / titolo del sito che porta alla home */}
        <Link className="navbar-brand" to="/">
          Kintsugi Essence
        </Link>

        {/* bottone hamburger per mobile */}
        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* contenitore delle voci della navbar */}
        <div className="collapse navbar-collapse" id="navbarNav">

          {/* lista dei link di navigazione */}
          <ul className="navbar-nav ms-auto">

            {/* link home */}
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            {/* link pagina prodotti */}
            <li className="nav-item">
              <Link className="nav-link" to="/Products">Prodotti</Link>
            </li>

            {/* link pagina wishlist */}
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

              {/* bottone che invia la ricerca */}
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