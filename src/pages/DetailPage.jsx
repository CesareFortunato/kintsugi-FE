import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Carousel } from "bootstrap";
import axios from "axios";
import Page404 from "./Page404";
import { addToCart } from "../utils/cart";
import { useCompare } from "../context/CompareContext";
import ProductPrice from "../components/ProductPrice";

export default function DetailPage() {
  // recuperiamo lo slug pubblico dalla rotta
  const { public_slug } = useParams();

  // stato del prodotto corrente
  const [product, setProduct] = useState(null);

  // stato dei prodotti correlati
  const [relatedProducts, setRelatedProducts] = useState([]);

  // stato di errore per mostrare la 404
  const [error, setError] = useState(false);

  // ref del carousel bootstrap
  const carouselRef = useRef(null);

  // funzioni del context per il confronto prodotti
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  useEffect(() => {
    // resettiamo stato errore e prodotto quando cambia slug
    setError(false);
    setProduct(null);

    // recuperiamo il dettaglio prodotto
    axios
      .get(`http://localhost:3000/parfumes/${public_slug}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.log(err);
        setError(true);
      });

    // recuperiamo i prodotti correlati
    axios
      .get(`http://localhost:3000/parfumes/${public_slug}/related`)
      .then((res) => setRelatedProducts(res.data))
      .catch((err) => console.log(err));
  }, [public_slug]);

  useEffect(() => {
    // inizializziamo il carousel bootstrap quando il prodotto è caricato
    if (carouselRef.current && product) {
      new Carousel(carouselRef.current);
    }
  }, [product]);

  // se il prodotto non esiste mostriamo la pagina 404
  if (error) return <Page404 />;

  // finché il prodotto non è stato caricato mostriamo il loading
  if (!product) return <p className="text-center my-5">Loading...</p>;

  // aggiungiamo il prodotto al carrello
  const handleAddToCart = () => {
    addToCart(product);
    alert("Prodotto aggiunto al carrello");
  };

  // aggiungiamo o rimuoviamo il prodotto dal confronto
  const handleCompareClick = () => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      return;
    }

    const result = addToCompare(product);

    if (result === "max-reached") {
      alert("Puoi confrontare al massimo 3 prodotti");
    }

    if (result === "already-added") {
      alert("Prodotto già aggiunto al confronto");
    }
  };

  // costruiamo l'array immagini del carousel:
  // prima immagine principale del prodotto, poi le immagini secondarie
  const images = [
    ...(product.product_image_url
      ? [
        {
          id: "main-image",
          url: product.product_image_url,
          alt: product.name,
        },
      ]
      : []),
    ...((product.images || []).map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt || product.name,
    })) || []),
  ];

  // se non ci sono immagini usiamo un placeholder
  const carouselImages =
    images.length > 0
      ? images
      : [
        {
          id: "placeholder",
          url: "/images/profumo-placeholder1.jpg",
          alt: "Placeholder prodotto",
        },
      ];

  // dividiamo le note per tipo per mostrarle in sezioni separate
  const topNotes =
    product.notes?.filter((n) => n.note_type.toLowerCase() === "testa") || [];

  const heartNotes =
    product.notes?.filter((n) => n.note_type.toLowerCase() === "cuore") || [];

  const baseNotes =
    product.notes?.filter((n) => n.note_type.toLowerCase() === "base") || [];

  return (
    <div className="container my-5">
      <div className="row">
        {/* carosello immagini prodotto */}
        <div className="col-md-6">
          <div
            id="productCarousel"
            className="carousel slide"
            ref={carouselRef}
          >
            <div className="carousel-inner">
              {carouselImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <img
                    src={image.url}
                    className="d-block w-50 mx-auto"
                    alt={image.alt}
                  />
                </div>
              ))}
            </div>

            {carouselImages.length > 1 && (
              <>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#productCarousel"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon bg-dark rounded-circle"></span>
                </button>

                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#productCarousel"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon bg-dark rounded-circle"></span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* informazioni principali prodotto */}
        <div className="col-md-6">
          <h1 className="mb-3">{product.name}</h1>

          <div className="mb-4">
            <ProductPrice
              product={product}
              finalPriceClassName="fw-bold fs-4"
              originalPriceClassName="text-muted text-decoration-line-through me-2"
              showBadge={true}
            />
          </div>

          <p className="mb-4">{product.description}</p>

          <div className="mb-4 small text-muted">
            {topNotes.length > 0 && (
              <p className="mb-1">
                <strong>Note di Testa:</strong>{" "}
                {topNotes.map((n) => n.name).join(", ")}
              </p>
            )}

            {heartNotes.length > 0 && (
              <p className="mb-1">
                <strong>Note di Cuore:</strong>{" "}
                {heartNotes.map((n) => n.name).join(", ")}
              </p>
            )}

            {baseNotes.length > 0 && (
              <p className="mb-1">
                <strong>Note di Fondo:</strong>{" "}
                {baseNotes.map((n) => n.name).join(", ")}
              </p>
            )}
          </div>

          {/* bottoni azione prodotto */}
          <div className="d-flex gap-3">
            <button className="btn btn-dark" onClick={handleAddToCart}>
              Add to Cart
            </button>

            <button
              className={`btn ${isInCompare(product.id)
                  ? "btn-outline-danger"
                  : "btn-outline-secondary"
                }`}
              onClick={handleCompareClick}
            >
              {isInCompare(product.id) ? "Rimuovi dal confronto" : "Confronta"}
            </button>
          </div>
        </div>
      </div>

      {/* sezione storia prodotto */}
      <div className="row mt-5">
        <div className="col-md-10">
          <h3 className="mb-3">The Story</h3>
          <p>{product.story}</p>
        </div>
      </div>

      {/* sezione prodotti correlati */}
      <div className="row mt-5">
        <div className="col-12">
          <h3 className="mb-4">Fragranze correlate</h3>

          <div className="row">
            {relatedProducts.map((item) => (
              <div key={item.id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm border-0">
                  <img
                    src={item.product_image_url}
                    className="card-img-top"
                    alt={item.name}
                  />

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{item.name}</h5>

                    <div className="mb-2">
                      <ProductPrice
                        product={item}
                        finalPriceClassName="fw-bold"
                        originalPriceClassName="text-muted text-decoration-line-through small"
                        showBadge={false}
                      />
                    </div>

                    <Link
                      to={`/products/${item.public_slug}`}
                      className="btn btn-outline-dark mt-auto"
                    >
                      Vai al prodotto
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}