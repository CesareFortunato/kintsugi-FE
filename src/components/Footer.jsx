export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div>
          <h4>Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Prodotti</a></li>
            <li><a href="/wishlist">Wishlist</a></li>
            <li><a href="/cart">Carrello</a></li>
          </ul>
        </div>

        <div>
          <h4>Contatti</h4>
          <p>Email: info@kintsugi.com</p>
        </div>

      </div>

      <p className="copyright">
        © 2026 Kintsugi Perfumes
      </p>
    </footer>
  );
}