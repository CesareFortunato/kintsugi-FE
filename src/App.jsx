import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Products from "./pages/Products"
import ProductPage from "./pages/ProductPage"
import Wishlist from "./pages/Wishlist"
import Cart from "./pages/Cart"

function App() {

return (

<BrowserRouter>

<Routes>

<Route path="/" element={<Home />} />

<Route path="/products" element={<Products />} />

<Route path="/products/:id" element={<ProductPage />} />

<Route path="/wishlist" element={<Wishlist />} />

<Route path="/cart" element={<Cart />} />

</Routes>

</BrowserRouter>

)

}

export default App