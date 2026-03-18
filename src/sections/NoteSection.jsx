import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function NoteSection({ noteId, title, subtitle }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/parfumes/note/${noteId}`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.error("Errore recupero nota:", err));
  }, [noteId]);

  if (products.length === 0) return null;

  return (
    <section className="container my-5 py-4">
      <div className="text-center mb-5">
        <h2 className="mb-2">{title}</h2>{" "}
        <p className="text-muted small">{subtitle}</p>
      </div>
      <div className="row g-4">
        {products.map((product) => (
          <div className="col" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="text-center mt-5">
        <hr className="w-25 mx-auto" style={{ opacity: "0.1" }} />
      </div>
    </section>
  );
}
