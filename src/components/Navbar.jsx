

import { Link } from "react-router-dom";

export default function Navbar() {

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch) return;

    navigate(`/search?q=${encodeURIComponent(trimmedSearch)}`);
  };

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

            <li className="nav-item">
              <Link className="nav-link" to="/Cart">Carrello</Link>
            </li>
            <form onSubmit={handleSubmit} className="d-flex">
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";