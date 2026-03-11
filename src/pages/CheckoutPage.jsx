import { useMemo, useState } from "react";
import axios from "axios";
import { getCart, clearCart } from "../utils/cart";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
    const cartItems = getCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",

        shippingCountry: "Italy",
        shippingCity: "",
        shippingZip: "",
        shippingAddress: "",

        billingCountry: "Italy",
        billingCity: "",
        billingZip: "",
        billingAddress: "",
        billingVat: "",
    });

    const shippingCost = 5;
    //useMemo per ricalcolare solo quando cambia cartItems. reduce per trasformare un array in un singolo valore
    const subtotal = useMemo(() => {
        return cartItems.reduce((acc, item) => {
            return acc + item.price * item.quantity;
        }, 0);
    }, [cartItems]);

    const total = subtotal + shippingCost;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckout = (e) => {
        e.preventDefault();

        //obj da spedire al BE
        const payload = {
            customer: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
            },
            shipping: {
                country: formData.shippingCountry,
                city: formData.shippingCity,
                zip: formData.shippingZip,
                address: formData.shippingAddress,
            },
            billing: {
                country: formData.billingCountry,
                city: formData.billingCity,
                zip: formData.billingZip,
                address: formData.billingAddress,
                vat: formData.billingVat,
            },
            totals: {
                subtotal: subtotal,
                total: total,
            },
        };

        console.log("PAYLOAD CHE INVIO:", payload);

        axios
            .post("http://localhost:3000/orders", payload)
            .then((res) => {

                console.log("Ordine creato:", res.data);

                const orderId = res.data.orderId;

                clearCart();

                navigate("/ordine-confermato", {
                    state: {
                        orderId: orderId,
                        total: total
                    }
                });

            })
            .catch((err) => {
                console.log("Errore completo:", err);
                console.log("Risposta backend:", err.response?.data);
                console.log("Status:", err.response?.status);
                alert("Errore durante il checkout");
            });
    };

    return (
        <div className="container my-5">
            <h1 className="mb-4">Checkout</h1>

            <form onSubmit={handleCheckout}>
                <h3 className="mb-3">Dati cliente</h3>

                <div className="mb-3">
                    <label className="form-label">Nome</label>
                    <input
                        type="text"
                        className="form-control"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Cognome</label>
                    <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <h3 className="mb-3 mt-4">Indirizzo di spedizione</h3>

                <div className="mb-3">
                    <label className="form-label">Paese</label>
                    <input
                        type="text"
                        className="form-control"
                        name="shippingCountry"
                        value={formData.shippingCountry}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Città</label>
                    <input
                        type="text"
                        className="form-control"
                        name="shippingCity"
                        value={formData.shippingCity}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">CAP</label>
                    <input
                        type="text"
                        className="form-control"
                        name="shippingZip"
                        value={formData.shippingZip}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Indirizzo</label>
                    <input
                        type="text"
                        className="form-control"
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleChange}
                    />
                </div>

                <h3 className="mb-3 mt-4">Indirizzo di fatturazione</h3>

                <div className="mb-3">
                    <label className="form-label">Paese</label>
                    <input
                        type="text"
                        className="form-control"
                        name="billingCountry"
                        value={formData.billingCountry}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Città</label>
                    <input
                        type="text"
                        className="form-control"
                        name="billingCity"
                        value={formData.billingCity}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">CAP</label>
                    <input
                        type="text"
                        className="form-control"
                        name="billingZip"
                        value={formData.billingZip}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Indirizzo</label>
                    <input
                        type="text"
                        className="form-control"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Partita IVA</label>
                    <input
                        type="text"
                        className="form-control"
                        name="billingVat"
                        value={formData.billingVat}
                        onChange={handleChange}
                    />
                </div>

                <hr />

                <p>Subtotale: €{subtotal.toFixed(2)}</p>
                <p>Spedizione: €{shippingCost.toFixed(2)}</p>
                <p><strong>Totale: €{total.toFixed(2)}</strong></p>

                <button className="btn btn-dark" type="submit">
                    Conferma ordine
                </button>
            </form>
        </div>
    );
}