export function getDiscountPercent(product) {
    return parseFloat(product.discount_value) || 0;
}

export function hasDiscount(product) {
    return getDiscountPercent(product) > 0;
}

export function getOriginalPrice(product) {
    return parseFloat(product.price) || 0;
}

export function getFinalPrice(product) {
    const originalPrice = getOriginalPrice(product);
    const discountPercent = getDiscountPercent(product);

    if (discountPercent <= 0) return originalPrice;

    return originalPrice * (1 - discountPercent / 100);
}