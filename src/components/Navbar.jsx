import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  );
}