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

<section className="container my-5">

<h2 className="mb-4 text-center">Promotions</h2>

<div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">

{products.map(product =>(

<div className="col" key={product.id}>
<ProductCard product={product}/>
</div>

))}

</div>

</section>

)

}