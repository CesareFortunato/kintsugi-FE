import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Carousel } from "bootstrap";
import axios from "axios";
import Page404 from "./Page404";
import { addToCart } from "../utils/cart";
import { useCompare } from "../context/CompareContext";
import { useWishlist } from "../context/WishlistContext";
import ProductPrice from "../components/ProductPrice";

export default function DetailPage() {
  const { public_slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(false);
  const [bannerMessage, setBannerMessage] = useState(""); // banner globale
  const carouselRef = useRef(null);

  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const favorite = product ? wishlist.some((p) => p.id === product.id) : false;

  const toggleFavorite = () => {
    if (!product) return;
    if (favorite) {
      removeFromWishlist(product.id);
      showBanner("Rimosso dai preferiti");
    } else {
      addToWishlist(product);
      showBanner("Aggiunto ai preferiti");
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    window.dispatchEvent(new Event("cartUpdated"));
    showBanner("Aggiunto al carrello");
  };

  const showBanner = (message) => {
    setBannerMessage(message);
    setTimeout(() => setBannerMessage(""), 2000);
  };

  const handleCompareClick = () => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      return;
    }
    const result = addToCompare(product);
    if (result.code === "max-reached" || result.code === "already-added") {
      alert(result.message);
    }
  };

  useEffect(() => {
    setError(false);
    setProduct(null);

    axios
      .get(`http://localhost:3000/parfumes/${public_slug}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError(true));

    axios
      .get(`http://localhost:3000/parfumes/${public_slug}/related`)
      .then((res) => setRelatedProducts(res.data))
      .catch(() => {});
  }, [public_slug]);

  useEffect(() => {
    if (carouselRef.current && product) new Carousel(carouselRef.current);
  }, [product]);

  if (error) return <Page404 />;
  if (!product) return <p className="text-center my-5">Loading...</p>;

  const carouselImages = [
    ...(product.product_image_url
      ? [{ id: "main", url: product.product_image_url, alt: product.name }]
      : []),
    ...(product.images || []).map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt || product.name,
    })),
  ].filter((image, index, arr) => index === arr.findIndex((i) => i.url === image.url));

  const finalCarouselImages =
    carouselImages.length > 0
      ? carouselImages
      : [{ id: "placeholder", url: "/images/profumo-placeholder1.jpg", alt: "Placeholder prodotto" }];

  const topNotes = product.notes?.filter((n) => n.note_type.toLowerCase() === "testa") || [];
  const heartNotes = product.notes?.filter((n) => n.note_type.toLowerCase() === "cuore") || [];
  const baseNotes = product.notes?.filter((n) => n.note_type.toLowerCase() === "base") || [];

  return (
    <div className="container my-5 position-relative">

      {/* BANNER VERDE IN ALTO */}
      {bannerMessage && (
        <div className="global-banner">
          {bannerMessage}
        </div>
      )}

      <div className="row">
        {/* CAROUSEL */}
        <div className="col-md-6">
          <div id="productCarousel" className="carousel slide" ref={carouselRef}>
            <div className="carousel-inner">
              {finalCarouselImages.map((image, index) => (
                <div key={image.id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                  <img src={image.url} className="d-block w-50 mx-auto" alt={image.alt} />
                </div>
              ))}
            </div>

            {finalCarouselImages.length > 1 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon bg-dark rounded-circle"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon bg-dark rounded-circle"></span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* INFO PRODOTTO */}
        <div className="col-md-6">
          <h1 className="mb-3">{product.name}</h1>

          {/* TASTO PREFERITI LUXORY ORO */}
          <div className="position-relative mb-3">
            <button className={`luxory-btn ${favorite ? "active" : ""}`} onClick={toggleFavorite}>
              {favorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
            </button>
          </div>

        

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
            {topNotes.length > 0 && <p><strong>Note di Testa:</strong> {topNotes.map((n) => n.name).join(", ")}</p>}
            {heartNotes.length > 0 && <p><strong>Note di Cuore:</strong> {heartNotes.map((n) => n.name).join(", ")}</p>}
            {baseNotes.length > 0 && <p><strong>Note di Fondo:</strong> {baseNotes.map((n) => n.name).join(", ")}</p>}
          </div>

          {/* TASTO CARRELLO - NON SPOSTATO */}
          <div className="mb-4">
            <button className="btn btn-dark" onClick={handleAddToCart}>
              Aggiungi al carrello
            </button>
          </div>

          <div className="d-flex gap-3">
            <button
              className={`btn ${isInCompare(product.id) ? "btn-outline-danger" : "btn-outline-secondary"}`}
              onClick={handleCompareClick}
            >
              {isInCompare(product.id) ? "Rimuovi dal confronto" : "Confronta"}
            </button>
          </div>
        </div>
      </div>

      {/* STORIA */}
      <div className="row mt-5">
        <div className="col-md-10">
          <h3 className="mb-3">The Story</h3>
          <p>{product.story}</p>
        </div>
      </div>

      {/* CORRELATI */}
      <div className="row mt-5">
        <div className="col-12">
          <h3 className="mb-4">Fragranze correlate</h3>
          <div className="row">
            {relatedProducts.map((item) => (
              <div key={item.id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm border-0">
                  <img src={item.product_image_url} className="card-img-top" alt={item.name} />
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
                    <Link to={`/products/${item.public_slug}`} className="btn btn-outline-dark mt-auto">
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