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

  // stato del prodotto corrente
  const [product, setProduct] = useState(null);

  // stato toast riutilizzato come nelle card
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // stato dei prodotti correlati
  const [relatedProducts, setRelatedProducts] = useState([]);

  // stato errore pagina
  const [error, setError] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const carouselRef = useRef(null);

  // context confronto
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  // context wishlist
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // controlla se il prodotto è nei preferiti
  const favorite = product
    ? wishlist.some((p) => p.id === product.id)
    : false;

  // mostra il toast temporaneo
  const showToastMessage = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 2500);
  };

  // aggiunge o rimuove dai preferiti
  const toggleFavorite = () => {
    if (!product) return;

    if (favorite) {
      removeFromWishlist(product.id);
      showToastMessage("Rimosso dai preferiti!", "success");
    } else {
      addToWishlist(product);
      showToastMessage("Aggiunto ai preferiti!", "success");
    }
  };

  // aggiunge il prodotto al carrello
  const handleAddToCart = () => {
    addToCart(product);
    window.dispatchEvent(new Event("cartUpdated"));
    showToastMessage("Prodotto aggiunto al carrello", "success");
  };

  // aggiunge o rimuove il prodotto principale dal confronto
  const handleCompareClick = () => {
    if (isInCompare(product.id)) {
      const result = removeFromCompare(product.id);
      showToastMessage(result.message, result.type);
      return;
    }

    const result = addToCompare(product);
    showToastMessage(result.message, result.type);
  };

  // aggiunge o rimuove un correlato dal confronto
  const handleCompareClickRelated = (item) => {
    if (isInCompare(item.id)) {
      const result = removeFromCompare(item.id);
      showToastMessage(result.message, result.type);
      return;
    }

    const result = addToCompare(item);
    showToastMessage(result.message, result.type);
  };

  // recupera dettaglio prodotto e correlati quando cambia lo slug
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
      .catch(() => { });
  }, [public_slug]);

  // inizializza il carousel quando il prodotto è pronto
  useEffect(() => {
    if (carouselRef.current && product) {
      new Carousel(carouselRef.current);
    }
  }, [product]);

  // se il prodotto non esiste mostriamo la 404
  if (error) return <Page404 />;

  // mentre i dati si caricano mostriamo il loading
  if (!product) return <p className="text-center my-5">Loading...</p>;

  // costruiamo l'array immagini evitando duplicati
  const carouselImages = [
    ...(product.product_image_url
      ? [{ id: "main", url: product.product_image_url, alt: product.name }]
      : []),
    ...(product.images || []).map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt || product.name,
    })),
  ].filter(
    (image, index, arr) =>
      index === arr.findIndex((item) => item.url === image.url)
  );

  // fallback se non ci sono immagini
  const finalCarouselImages =
    carouselImages.length > 0
      ? carouselImages
      : [
        {
          id: "placeholder",
          url: "/images/profumo-placeholder1.jpg",
          alt: "Placeholder prodotto",
        },
      ];

  // dividiamo le note per tipo
  const topNotes =
    product.notes?.filter((n) => n.note_type.toLowerCase() === "testa") || [];
  const heartNotes =
    product.notes?.filter((n) => n.note_type.toLowerCase() === "cuore") || [];
  const baseNotes =
    product.notes?.filter((n) => n.note_type.toLowerCase() === "base") || [];

  return (
    <div className="container my-5 position-relative">

      {/* BANNER VERDE IN ALTO */}
      {bannerMessage && <div className="global-banner">{bannerMessage}</div>}

      {/* LINK TORNA ALLA HOME */}
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

      <div className="row">
        {/* colonna carousel */}
        <div className="col-md-6">
          <div id="productCarousel" className="carousel slide" ref={carouselRef}>
            <div className="carousel-inner">
              {finalCarouselImages.map((image, index) => (
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
            {finalCarouselImages.length > 1 && (
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

        {/* colonna info prodotto */}
        <div className="col-md-6">
          <h1 className="mb-3">{product.name}</h1>

          {/* TASTO PREFERITI ORO */}
          <div className="position-relative mb-3">
            <button
              className={`luxory-btn ${favorite ? "active" : ""}`}
              onClick={toggleFavorite}
            >
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
            {topNotes.length > 0 && (
              <p>
                <strong>Note di Testa:</strong> {topNotes.map((n) => n.name).join(", ")}
              </p>
            )}
            {heartNotes.length > 0 && (
              <p>
                <strong>Note di Cuore:</strong> {heartNotes.map((n) => n.name).join(", ")}
              </p>
            )}
            {baseNotes.length > 0 && (
              <p>
                <strong>Note di Fondo:</strong> {baseNotes.map((n) => n.name).join(", ")}
              </p>
            )}
          </div>

          <div className="mb-4">
            <button className="btn btn-dark" onClick={handleAddToCart}>
              Aggiungi al carrello
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

      {/* sezione storia */}
      <div className="row mt-5">
        <div className="col-md-10">
          <h3 className="mb-3">La Storia</h3>
          <p>{product.story}</p>
        </div>
      </div>

      {/* sezione correlati */}
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

                    <div className="d-flex flex-column gap-2 mt-auto">
                      <Link
                        to={`/products/${item.public_slug}`}
                        className="btn btn-outline-dark"
                      >
                        Vai al prodotto
                      </Link>

                      <button
                        className={`btn btn-sm ${isInCompare(item.id)
                            ? "btn-outline-danger"
                            : "btn-outline-secondary"
                          }`}
                        onClick={() => handleCompareClickRelated(item)}
                      >
                        {isInCompare(item.id)
                          ? "Rimuovi confronto"
                          : "Confronta"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* toast globale */}
      {toast.show && (
        <div
          className={`alert position-fixed top-0 end-0 m-4 shadow ${toast.type === "error" ? "alert-danger" : "alert-success"
            }`}
          style={{ zIndex: 9999 }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}