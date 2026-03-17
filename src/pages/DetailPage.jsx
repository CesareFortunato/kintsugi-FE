import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Carousel } from "bootstrap";
import axios from "axios";
import Page404 from "./Page404";
import { addToCart } from "../utils/cart";
import { useCompare } from "../context/CompareContext";
import ProductPrice from "../components/ProductPrice";

export default function DetailPage() {
  const { public_slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(false);
  const carouselRef = useRef(null);

  const { addToCompare, removeFromCompare, isInCompare ,isFavorite , addFavorite, removeFavorite} = useCompare();
  const favorite = product ? isFavorite(product.id) : false;;
  //funzione stabilire l'azione
  const toggleFavorite = () => {
    if (favorite) {
      removeFavorite(product.id);
    }
    else {
      addFavorite(product.id)
    };
  }
  useEffect(() => {
    setError(false);
    setProduct(null);
    axios
      .get(`http://localhost:3000/parfumes/${public_slug}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.log(err);
        setError(true);
      });

    axios
      .get(`http://localhost:3000/parfumes/${public_slug}/related`)
      .then((res) => setRelatedProducts(res.data))
      .catch((err) => console.log(err));
  }, [public_slug]);

  useEffect(() => {
    if (carouselRef.current && product) {
      new Carousel(carouselRef.current);
    }
  }, [product]);

  if (error) return <Page404 />;
  if (!product) return <p className="text-center my-5">Loading...</p>;

  const handleAddToCart = () => {
    addToCart(product);
    alert("Prodotto aggiunto al carrello");
  };

  const handleCompareClick = () => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      return;
    }
    const result = addToCompare(product);
    if (result === "max-reached")
      alert("Puoi confrontare al massimo 3 prodotti");
    if (result === "already-added") alert("Prodotto già aggiunto al confronto");
  };
  const images =
    product?.images?.length > 0
      ? product.images.map((img) => `http://localhost:3000/${img.url}`)
      : ["/images/profumo-placeholder1.jpg"];


  const topNotes =
    product.notes?.filter((n) => n.note_type.toLowerCase() === "testa") || [];
  const heartNotes =
    product.notes?.filter((n) => n.note_type.toLowerCase() === "cuore") || [];
  const baseNotes =
    product.notes?.filter((n) => n.note_type.toLowerCase() === "base") || [];

  return (
    <div className="container my-5">
      <div className="row">
        {/* Carosello */}
        <div className="col-md-6">
          <div
            id="productCarousel"
            className="carousel slide"
            ref={carouselRef}
          >
            <div className="carousel-inner">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <img
                    src={img}
                    className="d-block w-50 mx-auto"
                    alt={product.name}
                  />
                </div>
              ))}
            </div>
            {images.length > 1 && (
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

        {/* Info prodotto */}
        <div className="col-md-6">
          <h1 className="mb-3">{product.name}
           <span className="heart-icon" onClick={toggleFavorite}>
              {isFavorite(product.id) ? "❤️" : "🤍"}
            </span>
          </h1>
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

          {/* BOTTONI AZIONE - AGGIORNATI */}
          <div className="d-flex gap-3">
            <button className="btn btn-dark" onClick={handleAddToCart}>
              Add to Cart
            </button>

            <button
              className={`btn ${isInCompare(product.id) ? "btn-outline-danger" : "btn-outline-secondary"}`}
              onClick={handleCompareClick}
            >
              {isInCompare(product.id) ? "Rimuovi dal confronto" : "Confronta"}
            </button>
          </div>
        </div>
      </div>

      {/* Storia */}
      <div className="row mt-5">
        <div className="col-md-10">
          <h3 className="mb-3">The Story</h3>
          <p>{product.story}</p>
        </div>
      </div>

      {/* Correlati */}
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
