// importiamo Link per il collegamento alla pagina confronto
import { Link } from "react-router-dom";

// hook personalizzato del context confronto
import { useCompare } from "../context/CompareContext";

// modale di conferma riutilizzabile
import ConfirmModal from "../components/ConfirmModal";

function CompareBar() {
    // prendiamo dal context i prodotti confrontati e le funzioni utili
    const { compareItems, removeFromCompare, clearCompare } = useCompare();

    // se non ci sono prodotti nel confronto, non mostriamo la barra
    if (compareItems.length === 0) {
        return null;
    }

    return (
        <>
            <div className="compare-bar shadow-lg">
                <div className="container py-3">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            {/* titolo barra con numero prodotti attualmente nel confronto */}
                            <h6 className="mb-2">
                                Confronto prodotti ({compareItems.length}/5)
                            </h6>

                            {/* elenco rapido dei prodotti presenti nel confronto */}
                            <div className="d-flex flex-wrap gap-2">
                                {compareItems.map((item) => (
                                    <span
                                        key={item.id}
                                        className="badge text-bg-light d-flex align-items-center gap-2 p-2"
                                    >
                                        {item.name}

                                        {/* bottone per rimuovere il singolo prodotto dal confronto */}
                                        <button
                                            className="btn btn-sm btn-close"
                                            onClick={() => removeFromCompare(item.id)}
                                            aria-label={`Rimuovi ${item.name} dal confronto`}
                                        ></button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            {/* bottone che apre la modale di conferma per svuotare il confronto */}
                            <button
                                className="btn btn-outline-light"
                                data-bs-toggle="modal"
                                data-bs-target="#clearCompareBarModal"
                            >
                                Svuota
                            </button>

                            {/* link alla pagina confronto; resta disabilitato se c'è meno di 2 prodotti */}
                            <Link
                                to="/compare"
                                className={`btn ${compareItems.length < 2 ? "btn-secondary disabled" : "btn-light"}`}
                            >
                                Vai al confronto
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* modale conferma svuotamento confronto dalla barra */}
            <ConfirmModal
                id="clearCompareBarModal"
                title="Svuotare il confronto?"
                message="Tutti i prodotti verranno rimossi dalla barra di confronto."
                confirmText="Svuota"
                cancelText="Annulla"
                onConfirm={clearCompare}
                confirmButtonClass="btn-danger"
            />
        </>
    );
}

export default CompareBar;