// Imports
import { filterProducts, handleCategoryChange, handlePriceChange, productsSelector } from "../../Redux/Reducer/productsReducer";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Search.module.css";

// Functional component for the search and filter
export default function Search() {
    // Fetching state from products reducer
    const {selectedPrice} = useSelector(productsSelector);
    const dispatch = useDispatch();

    // Returning JSX
    return (
        <div className={styles.searchFilterContainer}>
            <form onChange={dispatch(filterProducts())}>
                <div className={styles.filterSection}>
                    <p className={styles.heading}>Filter</p>
                    <div className={styles.priceRange}>
                        {/* Price range slider */}
                        <span>Price: {selectedPrice}</span>
                        <input type="range" min="0" max="100000" onChange={(event) => dispatch(handlePriceChange(event.target.value))} />
                    </div>
                </div>
                <div className={styles.categorySection}>
                    <p className={styles.heading}>Category</p>
                    {/* Category checkboxes */}
                    <label>
                        <input type="checkbox" value="men's clothing" onChange={(event) => dispatch(handleCategoryChange(event.target.value))} />
                        Men's Clothing
                    </label>
                    <label>
                        <input type="checkbox" value="women's clothing" onChange={(event) => dispatch(handleCategoryChange(event.target.value))} />
                        Women's Clothing
                    </label>
                    <label>
                        <input type="checkbox" value="jewelery" onChange={(event) => dispatch(handleCategoryChange(event.target.value))} />
                        Jewelry
                    </label>
                    <label>
                        <input type="checkbox" value="electronics" onChange={(event) => dispatch(handleCategoryChange(event.target.value))} />
                        Electronics
                    </label>
                </div>
            </form>
        </div>
    )
}
