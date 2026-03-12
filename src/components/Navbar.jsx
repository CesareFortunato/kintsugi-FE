

import { Link } from "react-router-dom";

export default function Navbar() {

    return (

        <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">

            <div className="container">

                <Link className="navbar-brand" to="/">
                    Kintsugi Essence
                </Link>

                <button
                    className="navbar-toggler"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >

                    <span className="navbar-toggler-icon"></span>

                </button>

                <div className="collapse navbar-collapse" id="navbarNav">

                    <ul className="navbar-nav ms-auto">

                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/Products">Prodotti</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/Wishlist">Preferiti</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/Cart">Carrello</Link>
                        </li>

                    </ul>

                </div>

            </div>

        </nav>

    );

}