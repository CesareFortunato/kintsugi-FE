import { Link } from "react-router-dom";

export default function Navbar({ search, setSearch }) {
  // funzione per resettare la barra di ricerca
  function clearForm(event) {
    event.preventDefault();
    setSearch("");
  }

  return (
    <nav className="navbar d-flex justify-content-around align-items-center p-3">
      <Link to="/">Home</Link>
      <Link to="/products">Prodotti</Link>
      <Link to="/wishlist">Preferiti</Link>
      <Link to="/cart">Carrello</Link>

      <form onSubmit={clearForm} className="d-flex align-items-center">
        <input
          className="form-control border-success rounded me-2 bg-transparent"
          type="text"
          placeholder="Cerca viaggiatore"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="btn btn-outline-success"
          type="submit"
        >
          All
        </button>
      </form>
    </nav>
  );
}
