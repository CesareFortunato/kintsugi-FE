import { Navigate, Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext";
import { addToCart } from "../utils/cart";

export default function Compare() {
    const { compareItems, removeFromCompare, clearCompare } = useCompare();
    const handleAddToCart = (product) => {
        addToCart(product);
        alert("Prodotto aggiunto al carrello");
    };

    if (compareItems.length < 2) {
        return <Navigate to="/products" />;
    }

    return (
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Confronta prodotti</h1>

                <button className="btn btn-outline-dark" onClick={clearCompare}>
                    Svuota confronto
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered align-middle text-center">
                    <thead>
                        <tr>
                            <th>Caratteristica</th>
                            {compareItems.map((item) => (
                                <th key={item.id}>
                                    <div className="d-flex flex-column align-items-center gap-2">
                                        <img
                                            src={item.product_image_url}
                                            alt={item.name}
                                            style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                            className="rounded"
                                        />
                                        <Link
                                            to={`/products/${item.public_slug}`}
                                            className="text-decoration-none fw-semibold"
                                        >
                                            {item.name}
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => removeFromCompare(item.id)}
                                        >
                                            Rimuovi
                                        </button>

                                        <button
                                            className="btn btn-sm btn-dark"
                                            onClick={() => handleAddToCart(item)}
                                        >
                                            Aggiungi al carrello
                                        </button>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <th>Prezzo</th>
                            {compareItems.map((item) => (
                                <td key={item.id}>€{item.price}</td>
                            ))}
                        </tr>

                        <tr>
                            <th>Formato</th>
                            {compareItems.map((item) => (
                                <td key={item.id}>{item.size_ml} ml</td>
                            ))}
                        </tr>

                        <tr>
                            <th>Descrizione</th>
                            {compareItems.map((item) => (
                                <td key={item.id}>{item.description}</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}