import { Link } from "react-router-dom";
import { addToCart } from "../utils/cart";

function ProductCard({ product }) {
    const { name, description, price, size_ml, product_image_url, public_slug } = product;

    const handleAddToCart = () => {
        addToCart(product);
        alert("Prodotto aggiunto al carrello");
    };

    return (
        <div className="card product-card h-100" style={{ width: "18rem" }}>
            <img
                src={product_image_url}
                className="card-img-top"
                alt={name}
            />

            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{description}</p>
            </div>

            <ul className="list-group list-group-flush">
                <li className="list-group-item">Prezzo: €{price}</li>
                <li className="list-group-item">Formato: {size_ml} ml</li>
            </ul>

            <div className="card-body">
                <Link to={`/products/${public_slug}`} className="btn btn-dark">
                    Vai al dettaglio
                </Link>

                <button className="btn btn-dark" onClick={handleAddToCart}>
                    Add to Cart
                </button>
            </div>
        </div>
    );
}

export default ProductCard;