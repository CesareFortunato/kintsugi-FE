//import ProductCard from "../components/ProductCard"
import { useState,useEffect } from "react"
const endpoint = 'http://localhost:3000/'
import axios from "axios"

export default function Home(){
const [products,setProduct]= useState ([])
//funzione chiamata axios
const fetchProduct =()=>{
    axios.get(endpoint)
    .then (res=>{setProduct(res.data)})
    .catch(err=>{console.log('errore')})
}
//funzione di rendering li stato dei prodotti 
const renderProduct =()=>{
    return products.map (product=>{
        return (
            <div className="col" key={product.id}>
                <ProductCard product ={product}  />
            </div>
        )
    })
}
//richiamo funzione di fetch al montaggio della page
useEffect(fetchProduct,[])
return(
    <>
<h1>Home</h1>
<div className="row row-cols-3 mt-d">
       {renderProduct()}         
    </div>
    </>
)

}