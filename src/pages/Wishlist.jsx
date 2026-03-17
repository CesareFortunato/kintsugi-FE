import { useCompare } from "../context/CompareContext"
import ProductCard from "../components/ProductCard"

export default function Wishlist(){
const {favorites,products} = useCompare();
//creiamo versione filtrata solo personaggi preferiti 
const favoriteProducts = products.filter (product =>{
    return favorites.includes(product.id)
})
return(
    <>
<h1>I tuoi prodotti preferiti</h1>
<div className="products d-flex flex-wrap gap-4">
{favoriteProducts.map(product => (
  <ProductCard key={product.id} product={product} />
))}
</div>
</>
)

}