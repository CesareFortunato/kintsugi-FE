import { Link } from "react-router-dom";

export default function Page404() {
  return (
    <div className="container my-5 py-5 text-center">
      <h1 className="display-1 fw-bold">404</h1>
      <h2 className="mb-4">Fragranza non trovata</h2>
      <Link to="/" className="btn btn-dark btn-lg">
        Torna alla Home
      </Link>
    </div>
  );
}
