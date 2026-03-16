import {
  getDiscountPercent,
  getFinalPrice,
  getOriginalPrice,
  hasDiscount,
} from "../utils/pricing";

export default function ProductPrice({
  product,
  className = "",
  finalPriceClassName = "fw-bold",
  originalPriceClassName = "text-muted text-decoration-line-through",
  showBadge = true,
}) {
  const discounted = hasDiscount(product);
  const originalPrice = getOriginalPrice(product);
  const finalPrice = getFinalPrice(product);
  const discountPercent = getDiscountPercent(product);

  return (
    <div className={`d-flex align-items-center gap-2 flex-wrap ${className}`}>
      {discounted ? (
        <>
          <span className={finalPriceClassName}>
            €{finalPrice.toFixed(2)}
          </span>

          <span className={originalPriceClassName}>
            €{originalPrice.toFixed(2)}
          </span>

          {showBadge && (
            <span className="badge bg-danger">
              -{discountPercent}%
            </span>
          )}
        </>
      ) : (
        <span className={finalPriceClassName}>
          €{originalPrice.toFixed(2)}
        </span>
      )}
    </div>
  );
}