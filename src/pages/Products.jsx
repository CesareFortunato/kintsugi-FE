import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const endpoint = "http://localhost:3000/parfumes";

export default function Products() {

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
            <div className="container my-5">

                {/* Torna indietro */}
                <div className="mb-3">
                    <Link
                        to="/"
                        style={{
                            color: "#d4af37",
                            fontWeight: "bold",
                            textDecoration: "none",
                            fontSize: "1rem",
                        }}
                    >
                        ← Torna indietro
                    </Link>
                </div>

                <h2 className="mb-4 text-center">Prodotti</h2>

                <div className="row g-4">
                    {products.map((product) => (
                        <div className="col" key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

            </div>
        </>
    )
}