const onlyLetters = /^[A-Za-zÀ-ÖØ-öø-ÿ\s']+$/;
const onlyNumbers = /^\d+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCheckout(formData, sameAsShipping) {
    const errors = {};

    if (!formData.firstName.trim()) {
        errors.firstName = "Il nome è obbligatorio";
    } else if (!onlyLetters.test(formData.firstName.trim())) {
        errors.firstName = "Il nome deve contenere solo lettere";
    }

    if (!formData.lastName.trim()) {
        errors.lastName = "Il cognome è obbligatorio";
    } else if (!onlyLetters.test(formData.lastName.trim())) {
        errors.lastName = "Il cognome deve contenere solo lettere";
    }

    if (!formData.email.trim()) {
        errors.email = "L'email è obbligatoria";
    } else if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Inserisci un'email valida";
    }

    if (!formData.shippingCity.trim()) {
        errors.shippingCity = "La città è obbligatoria";
    } else if (!onlyLetters.test(formData.shippingCity.trim())) {
        errors.shippingCity = "La città deve contenere solo lettere";
    }

    if (!formData.shippingZip.trim()) {
        errors.shippingZip = "Il CAP è obbligatorio";
    } else if (!onlyNumbers.test(formData.shippingZip.trim())) {
        errors.shippingZip = "Il CAP deve contenere solo numeri";
    }

    if (!formData.shippingAddress.trim()) {
        errors.shippingAddress = "L'indirizzo è obbligatorio";
    }

    if (!sameAsShipping) {
        if (!formData.billingCity.trim()) {
            errors.billingCity = "La città di fatturazione è obbligatoria";
        } else if (!onlyLetters.test(formData.billingCity.trim())) {
            errors.billingCity = "La città di fatturazione deve contenere solo lettere";
        }

        if (!formData.billingZip.trim()) {
            errors.billingZip = "Il CAP di fatturazione è obbligatorio";
        } else if (!onlyNumbers.test(formData.billingZip.trim())) {
            errors.billingZip = "Il CAP di fatturazione deve contenere solo numeri";
        }

        if (!formData.billingAddress.trim()) {
            errors.billingAddress = "L'indirizzo di fatturazione è obbligatorio";
        }

        if (formData.billingVat && !onlyNumbers.test(formData.billingVat.trim())) {
            errors.billingVat = "La partita IVA deve contenere solo numeri";
        }
    }

    return errors;
}