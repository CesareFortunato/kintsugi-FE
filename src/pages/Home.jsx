import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Hero from "../sections/Hero";
import PromoSection from "../sections/PromoSection";

const endpoint = "http://localhost:3000/parfumes";

export default function Home() {

const [products, setProducts] = useState([]);

const fetchProducts = () => {
    axios
        .get(endpoint)
        .then((res) => {
            setProducts(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
};

useEffect(() => {
    fetchProducts();
}, []);

return (
<>
    
<Hero />

<PromoSection />

<div className="container my-5">

<h2 className="mb-4">Our Fragrances</h2>

<div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">

{products.map((product) => (
<div className="col" key={product.id}>
<ProductCard product={product} />
</div>
))}

</div>

</div>

</>
);
}