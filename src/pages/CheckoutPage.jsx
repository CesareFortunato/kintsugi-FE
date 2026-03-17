import { useMemo, useRef, useState } from "react";
import axios from "axios";
import { getCart, clearCart } from "../utils/cart";
import { useNavigate } from "react-router-dom";
import { validateCheckout } from "../utils/validation";
import { getFinalPrice } from "../utils/pricing";

export default function Checkout() {
  // Recupera gli articoli dal carrello salvato
  const cartItems = getCart();

  // Hook per navigare alla pagina di conferma ordine
  const navigate = useNavigate();

  // Stato del form checkout
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

  //stato per gestire il loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Se true, l'indirizzo di fatturazione coincide con quello di spedizione
  const [sameAsShipping, setSameAsShipping] = useState(false);

  // Contiene gli errori dei singoli campi
  const [errors, setErrors] = useState({});

  // Serve per capire se il form è già stato inviato almeno una volta
  const [submitted, setSubmitted] = useState(false);

  // Errore generale restituito dal backend
  const [backendError, setBackendError] = useState("");

  // Riferimenti ai campi per fare scroll/focus sul primo errore
  const fieldRefs = useRef({});

  // Calcola il subtotale solo quando cambia il carrello
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      return acc + getFinalPrice(item) * item.quantity;
    }, 0);
  }, [cartItems]);

  // Spedizione mostrata a video nel frontend
  const shipping = subtotal < 200 ? 10 : 0;

  // Totale mostrato a video nel frontend
  const total = subtotal + shipping;

  // Salva il ref del singolo input dentro fieldRefs
  const setFieldRef = (name) => (el) => {
    if (el) {
      fieldRefs.current[name] = el;
    }
  };

  // Fa scroll e focus sul primo campo che contiene un errore
  const scrollToFirstError = (validationErrors) => {
    const fieldOrder = [
      "firstName",
      "lastName",
      "email",
      "shippingCountry",
      "shippingCity",
      "shippingZip",
      "shippingAddress",
      "billingCountry",
      "billingCity",
      "billingZip",
      "billingAddress",
      "billingVat",
    ];

    const firstErrorField = fieldOrder.find((field) => validationErrors[field]);

    if (firstErrorField && fieldRefs.current[firstErrorField]) {
      fieldRefs.current[firstErrorField].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setTimeout(() => {
        fieldRefs.current[firstErrorField]?.focus();
      }, 250);
    }
  };

  // Aggiorna il valore del campo modificato
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Se l'utente sta correggendo un campo, rimuove l'errore di quel campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Quando l'utente modifica il form, azzera l'errore generale del backend
    if (backendError) {
      setBackendError("");
    }
  };

  // Restituisce la classe giusta per evidenziare i campi non validi
  const getFieldClass = (fieldName) => {
    return errors[fieldName] && submitted
      ? "form-control is-invalid shake"
      : "form-control";
  };

  // Gestisce l'invio del checkout
  const handleCheckout = async (e) => {
    e.preventDefault();

    // Segna che l'utente ha provato a inviare il form
    setSubmitted(true);

    // Pulisce eventuali errori backend precedenti
    setBackendError("");

    // Valida i dati del form lato frontend
    const validationErrors = validateCheckout(formData, sameAsShipping);
    setErrors(validationErrors);

    // Se ci sono errori, ferma l'invio e scrolla al primo campo errato
    if (Object.keys(validationErrors).length > 0) {
      scrollToFirstError(validationErrors);
      return;
    }


    setIsSubmitting(true); // inizio submit


    // Se billing = shipping, copia i dati di spedizione nella fatturazione
    const billingData = sameAsShipping
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

    // Payload ridotto: il backend dovrà ricalcolare prezzi e totale
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
      billing: billingData,
      items: cartItems.map((item) => ({
        id: item.id,
        qty: item.quantity,
      })),
    };

    try {
      // Invia l'ordine al backend
      const res = await axios.post("http://localhost:3000/orders", payload);

      // Recupera l'id dell'ordine dalla risposta
      const orderId = res.data.orderId;

      // Svuota il carrello dopo il successo
      clearCart();

      // Reindirizza alla pagina di conferma ordine
      navigate("/ordine-confermato", {
        state: {
          orderId,
          total, // usato solo per mostrare il riepilogo lato frontend
        },
      });
    } catch (err) {
      console.log("Errore completo:", err);
      console.log("Risposta backend:", err.response?.data);
      console.log("Status:", err.response?.status);

      // Messaggio inline visibile sopra il pulsante
      setBackendError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Errore durante il checkout. Riprova."
      );
    } finally {
      setIsSubmitting(false); // fine submit
    }
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">Checkout</h1>

      <div className="row g-4 align-items-start">
        {/* COLONNA SINISTRA: FORM */}
        <div className="col-12 col-lg-8">
          <form onSubmit={handleCheckout} noValidate>
            <div className="p-4 border rounded bg-white shadow-sm">
              <h3 className="mb-3">Dati cliente</h3>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Nome</label>
                  <input
                    ref={setFieldRef("firstName")}
                    type="text"
                    className={getFieldClass("firstName")}
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && (
                    <div className="invalid-feedback d-block">
                      {errors.firstName}
                    </div>
                  )}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Cognome</label>
                  <input
                    ref={setFieldRef("lastName")}
                    type="text"
                    className={getFieldClass("lastName")}
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && (
                    <div className="invalid-feedback d-block">
                      {errors.lastName}
                    </div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label">Email</label>
                  <input
                    ref={setFieldRef("email")}
                    type="email"
                    className={getFieldClass("email")}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback d-block">
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              <hr className="my-4" />

              <h3 className="mb-3">Indirizzo di spedizione</h3>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Paese</label>
                  <input
                    ref={setFieldRef("shippingCountry")}
                    type="text"
                    className={getFieldClass("shippingCountry")}
                    name="shippingCountry"
                    value={formData.shippingCountry}
                    onChange={handleChange}
                  />
                  {errors.shippingCountry && (
                    <div className="invalid-feedback d-block">
                      {errors.shippingCountry}
                    </div>
                  )}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Città</label>
                  <input
                    ref={setFieldRef("shippingCity")}
                    type="text"
                    className={getFieldClass("shippingCity")}
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleChange}
                  />
                  {errors.shippingCity && (
                    <div className="invalid-feedback d-block">
                      {errors.shippingCity}
                    </div>
                  )}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">CAP</label>
                  <input
                    ref={setFieldRef("shippingZip")}
                    type="text"
                    className={getFieldClass("shippingZip")}
                    name="shippingZip"
                    value={formData.shippingZip}
                    onChange={handleChange}
                  />
                  {errors.shippingZip && (
                    <div className="invalid-feedback d-block">
                      {errors.shippingZip}
                    </div>
                  )}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Indirizzo</label>
                  <input
                    ref={setFieldRef("shippingAddress")}
                    type="text"
                    className={getFieldClass("shippingAddress")}
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                  />
                  {errors.shippingAddress && (
                    <div className="invalid-feedback d-block">
                      {errors.shippingAddress}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-check my-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="sameAsShipping"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="sameAsShipping">
                  L&apos;indirizzo di fatturazione è uguale a quello di
                  spedizione
                </label>
              </div>

              {/* I campi billing vengono mostrati solo se diversi dalla spedizione */}
              {!sameAsShipping && (
                <>
                  <hr className="my-4" />

                  <h3 className="mb-3">Indirizzo di fatturazione</h3>

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Paese</label>
                      <input
                        ref={setFieldRef("billingCountry")}
                        type="text"
                        className={getFieldClass("billingCountry")}
                        name="billingCountry"
                        value={formData.billingCountry}
                        onChange={handleChange}
                      />
                      {errors.billingCountry && (
                        <div className="invalid-feedback d-block">
                          {errors.billingCountry}
                        </div>
                      )}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Città</label>
                      <input
                        ref={setFieldRef("billingCity")}
                        type="text"
                        className={getFieldClass("billingCity")}
                        name="billingCity"
                        value={formData.billingCity}
                        onChange={handleChange}
                      />
                      {errors.billingCity && (
                        <div className="invalid-feedback d-block">
                          {errors.billingCity}
                        </div>
                      )}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">CAP</label>
                      <input
                        ref={setFieldRef("billingZip")}
                        type="text"
                        className={getFieldClass("billingZip")}
                        name="billingZip"
                        value={formData.billingZip}
                        onChange={handleChange}
                      />
                      {errors.billingZip && (
                        <div className="invalid-feedback d-block">
                          {errors.billingZip}
                        </div>
                      )}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Indirizzo</label>
                      <input
                        ref={setFieldRef("billingAddress")}
                        type="text"
                        className={getFieldClass("billingAddress")}
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleChange}
                      />
                      {errors.billingAddress && (
                        <div className="invalid-feedback d-block">
                          {errors.billingAddress}
                        </div>
                      )}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Partita IVA</label>
                      <input
                        ref={setFieldRef("billingVat")}
                        type="text"
                        className={getFieldClass("billingVat")}
                        name="billingVat"
                        value={formData.billingVat}
                        onChange={handleChange}
                      />
                      {errors.billingVat && (
                        <div className="invalid-feedback d-block">
                          {errors.billingVat}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Errore generale backend mostrato inline */}
              {backendError && (
                <div className="alert alert-danger mt-4 mb-0" role="alert">
                  {backendError}
                </div>
              )}

              <button className="btn btn-dark mt-4" type="submit" disabled={isSubmitting}>
                Conferma ordine
                {isSubmitting ? "Invio in corso..." : "Conferma ordine"}
              </button>
            </div>
          </form>
        </div>

        {/* COLONNA DESTRA: RIEPILOGO ORDINE STICKY */}
        <div className="col-12 col-lg-4">
          <div className="checkout-summary-sticky">
            <div className="p-4 border rounded bg-light shadow-sm">
              <h4 className="mb-3">Riepilogo ordine</h4>

              {/* Mini elenco prodotti presenti nel carrello */}
              <div className="mb-4">
                {cartItems.length === 0 ? (
                  <p className="text-muted mb-0">Il carrello è vuoto.</p>
                ) : (
                  cartItems.map((item) => {
                    const itemTotal = getFinalPrice(item) * item.quantity;

                    return (
                      <div
                        key={item.id}
                        className="d-flex justify-content-between align-items-start py-2 border-bottom small"
                      >
                        <div className="me-3">
                          <div className="fw-semibold">{item.name}</div>
                          <div className="text-muted">
                            Qtà: {item.quantity}
                            {item.size_ml ? ` • ${item.size_ml} ml` : ""}
                          </div>
                        </div>

                        <div className="text-end fw-semibold">
                          €{itemTotal.toFixed(2)}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Riepilogo economico mostrato lato frontend */}
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotale</span>
                <strong>€{subtotal.toFixed(2)}</strong>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Spedizione</span>
                <strong>{shipping > 0 ? `€${shipping.toFixed(2)}` : "Gratis"}</strong>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-3">
                <span className="fw-bold">Totale</span>
                <strong className="fs-5">€{total.toFixed(2)}</strong>
              </div>

              {subtotal < 200 ? (
                <p className="text-success mb-0">
                  Ti mancano €{(200 - subtotal).toFixed(2)} per la spedizione
                  gratuita
                </p>
              ) : (
                <p className="text-success fw-bold mb-0">
                  Hai ottenuto la spedizione gratuita!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}