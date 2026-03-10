import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "bootstrap";

export default function ProductDetail() {
    const carouselRef = useRef(null);

    const images = [
        "/images/profumo-placeholder1.jpg",
        "/images/profumo-placeholder2.jpg",
        "/images/profumo-placeholder3.jpg"
    ];

    useEffect(() => {
        if (carouselRef.current) {
            new Carousel(carouselRef.current);
        }
    }, []);

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
                                        className="d-block w-100"
                                        alt={`product-${index + 1}`}
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
                <div className="col-md-6">
                    <h1 className="mb-3">Amber Cedar</h1>
                    <h3 className="text-muted mb-4">€69</h3>

                    <p className="mb-4">
                        A warm and elegant fragrance blending cedarwood, amber and subtle
                        notes of spice. Designed for those who appreciate refined and
                        timeless scents.
                    </p>

                    <button className="btn btn-dark">
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Storia del profumo */}
            <div className="row mt-5">
                <div className="col-md-10">
                    <h3 className="mb-3">The Story</h3>

                    <p>
                        Inspired by ancient Japanese rituals and the philosophy of Kintsugi,
                        this fragrance celebrates imperfection and transformation. Amber
                        Cedar evokes warm wooden temples, golden light and quiet moments of
                        reflection.
                    </p>
                </div>
            </div>
        </div>
    );
}