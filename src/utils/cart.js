const CART_KEY = "cart";

export function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product) {
  const cart = getCart();
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      public_slug: product.public_slug,
      name: product.name,
      price: Number(product.price),
      discount_value: Number(product.discount_value) || 0,
      product_image_url:
        product.product_image_url || "/images/profumo-placeholder1.jpg",
      quantity: 1,
    });
  }

  saveCart(cart);
}

export function increaseQuantity(productId) {
  const cart = getCart();
  const product = cart.find((item) => item.id === productId);

  if (product) {
    product.quantity += 1;
    saveCart(cart);
  }
}

export function decreaseQuantity(productId) {
  const cart = getCart();
  const product = cart.find((item) => item.id === productId);

  if (product) {
    product.quantity -= 1;

    const updatedCart = cart.filter((item) =>
      item.id === productId ? item.quantity > 0 : true
    );

    saveCart(updatedCart);
  }
}

export function removeFromCart(productId) {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.id !== productId);
  saveCart(updatedCart);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}