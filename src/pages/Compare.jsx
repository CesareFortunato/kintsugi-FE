// importiamo Navigate per reindirizzare l'utente e Link per i link interni
import { Navigate, Link } from "react-router-dom";

// hook personalizzato del context confronto
import { useCompare } from "../context/CompareContext";

// funzione utility per aggiungere un prodotto al carrello
import { addToCart } from "../utils/cart";

export default function Compare() {

    // prendiamo dal context i prodotti da confrontare e le funzioni utili
    const { compareItems, removeFromCompare, clearCompare } = useCompare();

    // funzione che aggiunge un prodotto al carrello
    const handleAddToCart = (product) => {
        addToCart(product);
        alert("Prodotto aggiunto al carrello");
    };

    // se ci sono meno di 2 prodotti, rimandiamo alla pagina prodotti
    if (compareItems.length < 2) {
        return <Navigate to="/products" />;
    }

    return (
        <div className="container my-5">

            {/* intestazione pagina + bottone per svuotare il confronto */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Confronta prodotti</h1>

                <button className="btn btn-outline-dark" onClick={clearCompare}>
                    Svuota confronto
                </button>
            </div>

            {/* tabella responsive per il confronto */}
            <div className="table-responsive">
                <table className="table table-bordered align-middle text-center">

                    <thead>
                        <tr>
                            {/* colonna con il nome della caratteristica */}
                            <th>Caratteristica</th>

                            {/* una colonna per ogni prodotto da confrontare */}
                            {compareItems.map((item) => (
                                <th key={item.id}>
                                    <div className="d-flex flex-column align-items-center gap-2">

                                        {/* immagine del prodotto */}
                                        <img
                                            src={item.product_image_url}
                                            alt={item.name}
                                            style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                            className="rounded"
                                        />

                                        {/* link alla pagina dettaglio prodotto */}
                                        <Link
                                            to={`/products/${item.public_slug}`}
                                            className="text-decoration-none fw-semibold"
                                        >
                                            {item.name}
                                        </Link>

                                        {/* bottone per rimuovere il prodotto dal confronto */}
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => removeFromCompare(item.id)}
                                        >
                                            Rimuovi
                                        </button>

                                        {/* bottone per aggiungere il prodotto al carrello */}
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
                        {/* riga prezzo */}
                        <tr>
                            <th>Prezzo</th>
                            {compareItems.map((item) => (
                                <td key={item.id}>€{item.price}</td>
                            ))}
                        </tr>

                        {/* riga formato */}
                        <tr>
                            <th>Formato</th>
                            {compareItems.map((item) => (
                                <td key={item.id}>{item.size_ml} ml</td>
                            ))}
                        </tr>

                        {/* riga descrizione */}
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