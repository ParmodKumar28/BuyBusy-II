// Imports
import styles from "./ProductCard.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../Redux/Reducer/userReducer";
import { handleAddToCart } from "../../Redux/Reducer/cartReducer"; // Import handleAddToCart

// Functional component for the ProductCard
export default function ProductsCard({id, title, price, description, image}) {
    const dispatch = useDispatch();
    // Consuming state from reducers here.
    const { signedUser } = useSelector(userSelector);
    const navigate = useNavigate();

    // Handler for adding to cart
    const addToCartHandler = () => {
        if (signedUser) {
            // Dispatch the handleAddToCart thunk
            dispatch(handleAddToCart({ product: { id, title, price, description, image }, signedUser }));
        } else {
            navigate("/signIn");
        }
    };

    // Returning JSX
    return (
        <div className={styles.productCardContainer}>
            <div className={styles.imageContainer}>
                <img src={image} alt={title} className={styles.productImage} />
            </div>
            <div className={styles.productTitleContainer}>
                <p className={styles.productTitle}>{title}</p>
            </div>
            <p className={styles.productPrice}>{`₹ ${price}`}</p>
            <button className={styles.addToCartBtn} onClick={() => addToCartHandler()}>
                Add To Cart
            </button>
        </div>
    );
}
