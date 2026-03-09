import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav style={{textAlign:"center"}}>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/wishlist">Wishlist</Link>
      <Link to="/cart">Cart</Link>
    </nav>
  )
}