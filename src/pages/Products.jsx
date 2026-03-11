import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import axios from "axios";

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

                <h2 className="mb-4 text-center">Products</h2>

                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">

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