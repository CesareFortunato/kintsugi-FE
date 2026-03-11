import { useLocation } from "react-router-dom";

export default function OrderConfirmation() {

    const location = useLocation();

    const orderNumber = location.state?.orderNumber;
    const total = location.state?.total;

    return (

        <div className="container my-5">

            <div className="card shadow p-5 text-center">

                <h1 className="text-success mb-3">
                    Ordine confermato
                </h1>

                <p className="lead">
                    Grazie per il tuo acquisto
                </p>

                <hr/>

                <h4>Numero ordine</h4>

                <h2 className="fw-bold">
                   25465845 {orderNumber}
                </h2>

                <p className="mt-3">
                    Totale pagato: <strong>€{total?.toFixed(2)}</strong>
                </p>

                <a href="/" className="btn btn-dark mt-4">
                    Torna alla Home
                </a>

            </div>

        </div>

    );
}