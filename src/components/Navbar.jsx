import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="navbar" style={{textAlign:"center", display:"flex", justifyContent:"space-around"}}>
      <Link to="/">Home</Link>
      <Link to="/products">Prodotti</Link>
      <Link to="/wishlist">Preferiti</Link>
      <Link to="/cart">Carrello</Link>
    </nav>
  )
}