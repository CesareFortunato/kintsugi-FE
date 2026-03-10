import { BrowserRouter, Route, Routes } from "react-router-dom";

import DefaultLayout from "./layout/DefaultLayout";

import Home from "./pages/Home";
import Products from "./pages/Products";
import DetailPage from "./pages/DetailPage";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import './App.css';



function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<DefaultLayout />}>

          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:public_slug" element={<DetailPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;