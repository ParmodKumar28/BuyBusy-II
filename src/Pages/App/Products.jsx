// Imports
import styles from "./Products.module.css";
import Search from "../../Components/Search/Search";
import ProductsList from "../../Components/Products List/ProductsList";
import { useProductContext } from "../../Context/productsContext";
import Loader from "../../Components/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataAsync, productsSelector } from "../../Redux/Reducer/productsReducer";
import { useEffect } from "react";

// Page for the products
export default function Products(){
    const dispatch = useDispatch();
    // Using context
    const {handleSearchProductByName} = useProductContext();

    // State from products reducer here
    const { productLoading } = useSelector(productsSelector);

    // Dispatching side fetchDataAsync thunk here
    useEffect(() => {
        dispatch(fetchDataAsync());
    }, []);

    // Returning Jsx
    return(
        <>
        {/* Showing loader while products loads */}
        { productLoading ? (
            <Loader/>
            ) : (
            <>
        {/* Search Bar */}
        <div className={styles.searchBarContainer}>
        <input type="search" placeholder="Search By Name" className={styles.searchBar} onChange={(event) => handleSearchProductByName(event)}/>
        </div>

        {/* Search and filter Conatiner */}
        <div className={styles.searchFilterContainer}>
            <Search/>
        </div>

        {/* All products container */}
        <div className={styles.productsContainer}>
            <ProductsList/>
        </div>
            </>
        )}
        </>
    )
}