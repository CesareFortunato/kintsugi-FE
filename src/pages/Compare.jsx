// importiamo Link per i collegamenti interni
import { Link } from "react-router-dom";

// hook personalizzato del context confronto
import { useCompare } from "../context/CompareContext";

// utility per aggiungere un prodotto al carrello
import { addToCart } from "../utils/cart";

// componente per mostrare il prezzo con eventuale sconto
import ProductPrice from "../components/ProductPrice";

// modale di conferma riutilizzabile
import ConfirmModal from "../components/ConfirmModal";

export default function Compare() {
    // prendiamo dal context i prodotti da confrontare e le funzioni utili
    const { compareItems, removeFromCompare, clearCompare } = useCompare();

    // funzione che aggiunge un prodotto al carrello
    const handleAddToCart = (product) => {
        addToCart(product);
        alert("Prodotto aggiunto al carrello");
    };

    return (
        <div className="container my-5">
            {/* intestazione pagina + bottone per svuotare il confronto */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Confronta prodotti</h1>

                {/* mostriamo il bottone solo se c'è almeno un prodotto nel confronto */}
                {compareItems.length > 0 && (
                    <button
                        className="btn btn-outline-dark"
                        data-bs-toggle="modal"
                        data-bs-target="#clearCompareModal"
                    >
                        Svuota confronto
                    </button>
                )}
            </div>

            {/* stato vuoto: nessun prodotto aggiunto */}
            {compareItems.length === 0 && (
                <div className="text-center py-5 border rounded bg-light">
                    <h3 className="mb-3">Nessun prodotto da confrontare</h3>
                    <p className="text-muted mb-4">
                        Aggiungi fino a 5 prodotti per confrontarli qui.
                    </p>

                    <Link to="/products" className="btn btn-dark">
                        Vai ai prodotti
                    </Link>
                </div>
            )}

            {/* stato intermedio: un solo prodotto aggiunto */}
            {compareItems.length === 1 && (
                <div className="mb-4">
                    <div className="alert alert-secondary mb-4">
                        Hai aggiunto solo un prodotto. Aggiungine almeno un altro per confrontarlo.
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered align-middle text-center">
                            <thead>
                                <tr>
                                    {/* colonna con il nome della caratteristica */}
                                    <th>Caratteristica</th>

                                    {/* unica colonna prodotto */}
                                    {compareItems.map((item) => (
                                        <th key={item.id}>
                                            <div className="d-flex flex-column align-items-center gap-2">
                                                {/* immagine del prodotto */}
                                                <img
                                                    src={item.product_image_url}
                                                    alt={item.name}
                                                    style={{
                                                        width: "120px",
                                                        height: "120px",
                                                        objectFit: "cover",
                                                    }}
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
                                        <td key={item.id}>
                                            <ProductPrice
                                                product={item}
                                                className="justify-content-center"
                                                finalPriceClassName="fw-bold text-danger"
                                                originalPriceClassName="text-muted text-decoration-line-through small"
                                                showBadge={true}
                                            />
                                        </td>
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
            )}

            {/* tabella completa: la mostriamo da 2 prodotti in su */}
            {compareItems.length >= 2 && (
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
                                                style={{
                                                    width: "120px",
                                                    height: "120px",
                                                    objectFit: "cover",
                                                }}
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
                                    <td key={item.id}>
                                        <ProductPrice
                                            product={item}
                                            className="justify-content-center"
                                            finalPriceClassName="fw-bold text-danger"
                                            originalPriceClassName="text-muted text-decoration-line-through small"
                                            showBadge={true}
                                        />
                                    </td>
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
            )}

            {/* modale conferma svuotamento confronto */}
            <ConfirmModal
                id="clearCompareModal"
                title="Svuotare il confronto?"
                message="Tutti i prodotti verranno rimossi dalla lista di confronto."
                confirmText="Svuota"
                cancelText="Annulla"
                onConfirm={clearCompare}
                confirmButtonClass="btn-danger"
            />
        </div>
    );
}