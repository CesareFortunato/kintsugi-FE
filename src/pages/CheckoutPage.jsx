import { useMemo, useState } from "react";
import axios from "axios";
import { getCart, clearCart } from "../utils/cart";
import { useNavigate } from "react-router-dom";
import { validateCheckout } from "../utils/validation";
import { getFinalPrice } from "../utils/pricing";

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

  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [errors, setErrors] = useState({});

  //useMemo per ricalcolare solo quando cambia cartItems. reduce per trasformare un array in un singolo valore
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      return acc + getFinalPrice(item) * item.quantity;
    }, 0);
  }, [cartItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckout = (e) => {
    e.preventDefault();

    //chiamo la funzione per validare form
    const validationErrors = validateCheckout(formData, sameAsShipping);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const errorMessages = Object.values(validationErrors).join("\n");
      alert(errorMessages);
      return;
    }

    const isSameAsShipping = sameAsShipping
      ? {
          country: formData.shippingCountry,
          city: formData.shippingCity,
          zip: formData.shippingZip,
          address: formData.shippingAddress,
          vat: "",
        }
      : {
          country: formData.billingCountry,
          city: formData.billingCity,
          zip: formData.billingZip,
          address: formData.billingAddress,
          vat: formData.billingVat,
        };

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
      billing: isSameAsShipping,
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.quantity,
        discount_value: item.discount_value || 0,
      })),
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
            total: total,
          },
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

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="sameAsShipping"
            checked={sameAsShipping}
            onChange={(e) => setSameAsShipping(e.target.checked)}
          />
        </div>
        <label className="form-check-label" htmlFor="sameAsShipping">
          L'indirizzo di fatturazione è uguale a quello di spedizione
        </label>

        {!sameAsShipping && (
          <>
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
          </>
        )}

        {}

        <hr />

        <h4>Totale: €{subtotal.toFixed(2)}</h4>

        {subtotal < 200 && (
          <p className="text-success">
            Ti mancano €{(200 - subtotal).toFixed(2)} per la spedizione gratuita
          </p>
        )}

        {subtotal >= 200 && (
          <p className="text-success fw-bold">
            Hai ottenuto la spedizione gratuita!
          </p>
        )}

        <button className="btn btn-dark" type="submit">
          Conferma ordine
        </button>
      </form>
    </div>
  );
}
