import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Carousel } from "bootstrap";
import axios from "axios";

export default function DetailPage() {
    const { public_slug } = useParams();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const carouselRef = useRef(null);

    const images = [
        "/images/profumo-placeholder1.jpg",
        "/images/profumo-placeholder2.jpg",
        "/images/profumo-placeholder3.jpg"
    ];

    useEffect(() => {
        axios
            .get(`http://localhost:3000/parfumes/${public_slug}`)
            .then((res) => {
                setProduct(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

        axios
            .get(`http://localhost:3000/parfumes/${public_slug}/related`)
            .then((res) => {
                setRelatedProducts(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [public_slug]);

    useEffect(() => {
        if (carouselRef.current) {
            new Carousel(carouselRef.current);
        }
    }, []);

    if (!product) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container my-5">
            <div className="row">
                {/* Carosello immagini */}
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
                                        className="d-block w-50"
                                        alt={product.name}
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target="#productCarousel"
                            data-bs-slide="prev"
                        >
                            <span className="carousel-control-prev-icon"></span>
                        </button>

                        <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#productCarousel"
                            data-bs-slide="next"
                        >
                            <span className="carousel-control-next-icon"></span>
                        </button>
                    </div>
                </div>

                {/* Info prodotto */}
                <div className=" col-md-6">
                    <h1 className="mb-3">{product.name}</h1>
                    <h3 className="text-muted mb-4">€ {product.price}</h3>

                    <p className="mb-4">{product.description}</p>

                    <button className="btn btn-dark">
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Storia del profumo */}
            <div className="row mt-5">
                <div className="col-md-10">
                    <h3 className="mb-3">The Story</h3>
                    <p>{product.story}</p>
                </div>
            </div>

            {/* Prodotti correlati */}
            <div className="row mt-5">
                <div className="col-12">
                    <h3 className="mb-4">Prodotti correlati</h3>

                    <div className="row">
                        {relatedProducts.length > 0 ? (
                            relatedProducts.map((item) => (
                                <div key={item.id} className="col-md-4 mb-4">
                                    <div className="card h-100 shadow-sm">
                                        <img
                                            src={item.product_image_url}
                                            className="card-img-top"
                                            alt={item.name}
                                        />

                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">{item.name}</h5>
                                            <p className="card-text text-muted mb-2">
                                                € {item.price}
                                            </p>

                                            <Link
                                                to={`/products/${item.public_slug}`}
                                                className="btn btn-outline-dark mt-auto"
                                            >
                                                Vai al prodotto
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Nessun prodotto correlato trovato.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}