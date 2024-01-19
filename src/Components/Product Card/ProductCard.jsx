// Imports
import styles from "./ProductCard.module.css";
import { useProductContext } from "../../Context/productsContext";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelector } from "../../Redux/Reducer/userReducer";

// Functional component for the ProductCard
export default function ProductsCard({id, title, price, description, image}){
    // Consuming state from reducers here.
    const {signedUser} = useSelector(userSelector);
    const {handleAddToCart} = useProductContext();
    const navigate = useNavigate();

    // Returning JSX
    return(
        <div className={styles.productCardContainer}>
            <div className={styles.imageContainer}>
            <img src={image} alt={title} className={styles.productImage}/>
            </div>
            <div className={styles.productTitleContainer}>
            <p className={styles.productTitle}>{title}</p>
            </div>
            <p className={styles.productPrice}>{`₹ ${price}`}</p>
            <button className={styles.addToCartBtn}
                onClick={() => signedUser ? handleAddToCart({id, title, price, description, image}, signedUser) : navigate("/signIn")}>
                Add To Cart
                </button>
        </div>
    )
}