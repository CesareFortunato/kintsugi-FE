import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Hero from "../sections/Hero";
import PromoSection from "../sections/PromoSection";
import Bio from "../sections/Bio";

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

            <Bio />


        </>
    );
}