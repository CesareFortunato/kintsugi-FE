import { Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext";

function CompareBar() {
    const { compareItems, removeFromCompare, clearCompare } = useCompare();

    if (compareItems.length === 0) {
        return null;
    }

    return (
        <div className="compare-bar shadow-lg">
            <div className="container py-3">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                        <h6 className="mb-2">Confronto prodotti ({compareItems.length}/3)</h6>

                        <div className="d-flex flex-wrap gap-2">
                            {compareItems.map((item) => (
                                <span
                                    key={item.id}
                                    className="badge text-bg-light d-flex align-items-center gap-2 p-2"
                                >
                                    {item.name}
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
                        <button
                            className="btn btn-outline-light"
                            onClick={clearCompare}
                        >
                            Svuota
                        </button>

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
    );
}

export default CompareBar;