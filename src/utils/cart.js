const CART_KEY = "cart";

/* prendo il valore salvato con chiave "cart", lo trasformo in array(perchè localstorage salva solo stringhe), 
 se non esiste restituisco null */
export function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

/* da array a UNSAFE_getTurboStreamSingleFetchDataStrategy, poi salvo in localstorage */
export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}


export function addToCart(product) {
    //leggo il carrello
  const cart = getCart();
    //scorro gli elementi del carrello, trova quello che ha lo stesso id del prodotto che sto aggiungendo
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      public_slug: product.public_slug,
      name: product.name,
      price: Number(product.price),
      image: product.product_image_url || "/images/profumo-placeholder1.jpg",
      quantity: 1,
    });
  }

  saveCart(cart);
}


//funzione per il + del carrello
export function increaseQuantity(productId) {
  const cart = getCart();

  const product = cart.find((item) => item.id === productId);

  if (product) {
    product.quantity += 1;
    saveCart(cart);
  }
}

//funzione per il - del carrello

export function decreaseQuantity(productId) {
  const cart = getCart();

  const product = cart.find((item) => item.id === productId);

  if (product) {
    product.quantity -= 1;
    //se l'elemento è quello che sto modificando, lo tengo solo se la qnt è > 0 
    const updatedCart = cart.filter((item) =>
      item.id === productId ? item.quantity > 0 : true
    );

    saveCart(updatedCart);
  }
}

//funzione per eliminare del tutto il profumo dal carrello
export function removeFromCart(productId) {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.id !== productId);
  saveCart(updatedCart);
}

//per cancellare il carrello, come dopo il checkout
export function clearCart() {
  localStorage.removeItem(CART_KEY);
}