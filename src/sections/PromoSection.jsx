import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const endpoint = "http://localhost:3000/parfumes";

export default function PromoSection(){

const [products,setProducts] = useState([]);

useEffect(()=>{

axios.get(endpoint)
.then(res=>{

const promo = res.data.filter(
product => product.discount_value !== null
)

setProducts(promo)

})

},[])

return(

<section className="container  my-5">

<h2 className="mb-4 text-center">Promozioni</h2>

<div className="row g-4 justify-content-center">

{products.map(product =>(

<div className="col" key={product.id}>
<ProductCard product={product}/>
</div>

))}

</div>

</section>

)

}