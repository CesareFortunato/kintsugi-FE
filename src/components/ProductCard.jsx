import { Link } from "react-router-dom"

function ProductCard(props) {
    const { id, name, description, price, size_ml, product_image_url } = props.product
    return (
    
        <div className="card" style="width: 18rem;">
            <img src={product_image_url} className={name} alt="..."/>
                <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                    <p className="card-text">{description}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li className="list-group-item">{price}</li>
                    <li className="list-group-item">{size_ml}</li>
                </ul>
                <div className="card-body">
                    <Link to={`products/${id}`}></Link>
                </div>
        </div>

    )

}

export default ProductCard