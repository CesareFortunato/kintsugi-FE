import { Link } from "react-router-dom";

export default function Hero(){

return(

<section className="hero bg-light py-5 text-center">

<div className="container">

<h1 className="display-4">
Kintsugi Essence
</h1>

<p className="lead">
Scopri rare fragranze artigianali ispirate da storie senza tempo.
</p>

<Link to="/products" className="btn btn-dark">
    Esplora
</Link>

</div>

</section>

)

}