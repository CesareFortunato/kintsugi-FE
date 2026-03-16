import { useEffect, useState } from "react";
import axios from "axios";
import Hero from "../sections/Hero";
import PromoSection from "../sections/PromoSection";
import Bio from "../sections/Bio";
import NoteSection from "../sections/NoteSection";
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
      <NoteSection
        noteId={2}
        title="Bergamotto di Calabria"
        subtitle="Vibrazioni agrumate e freschezza senza tempo. Scopri l'eleganza luminosa del Bergamotto autentico."
      />

      <Bio />
    </>
  );
}
