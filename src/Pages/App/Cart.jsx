// Imports
import styles from "./Cart.module.css";
import Loader from "../../Components/Loader/Loader";
import CartItem from "../../Components/Cart Item/CartItem";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { cartSelector, fetchCartDataAsync } from "../../Redux/Reducer/cartReducer";
import { userSelector } from "../../Redux/Reducer/userReducer";
import { handleOrder, paymentFailure, paymentSuccess } from "../../Redux/Reducer/OrderReducer";
import axios from "axios";
import base_url from "../../Redux/services";
import { toast } from "react-hot-toast";


// Cart page to show items in the user's cart
export default function CartPage() {
    // Consuming reducers
    const { signedUser } = useSelector(userSelector);
    const { cartLoading, cartItems, total } = useSelector(cartSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("base_url", base_url);
    }, []);

    const initiatePayment = async (amount) => {
        try {
            const { data } = await axios.post(`${base_url}/create-order`, {
                amount,
            });
            const options = {
                key: process.env.REACT_APP_RAZOR_TEST_KEY_ID,
                amount: data.amount,
                currency: "INR",
                order_id: data.id,
                handler: async (response) => {
                    try {
                        console.log(response, "response");
                        const verifyRes = await axios.post(
                            `${base_url}/verify-payment`,
                            response
                        );
                        console.log(verifyRes, "verifyRes");
                        if (verifyRes.data.success) {
                            dispatch(paymentSuccess());
                            toast.success("Payment successful!");
                            dispatch(handleOrder({ signedUser, cartItems, total, paymentStatus: "success" }));
                        } else {
                            dispatch(paymentFailure());
                            toast.error("Payment verification failed!");
                        }
                    } catch (err) {
                        dispatch(paymentFailure());
                        toast.error("Error verifying payment!");   
                    }
                },
                modal: {
                    ondismiss: () => {
                        toast("Payment popup closed.");
                    }
                }
            };

            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.open();
        } catch (error) {
            console.error(error);
            toast.error("Error initiating payment!", error.message);
        }
    }


    // Dispatching action to fetch cart data
    useEffect(() => {
        dispatch(fetchCartDataAsync(signedUser));
    }, [signedUser, cartItems, dispatch]);

    // Returning JSX
    return (
        <>
            {cartLoading ? (
                <Loader />
            ) : (
                cartItems.length === 0 ? (
                    <>
                        <h1 className={styles.noItemsHeading}>No items in the cart!</h1>
                    </>
                ) : (
                    <>
                        {/* Total Price */}
                        <div className={styles.cartTotalContainer}>
                            {/* Display total price or other relevant information */}
                            <div className={styles.wrapper}>
                                <p className={styles.heading}>{`TotalPrice:- ₹${total}/-`}</p>
                                <button className={styles.purchaseButton} onClick={() => initiatePayment(total)}>Purchase</button>
                            </div>
                        </div>

                        {/* Cart Products List */}
                        <div className={styles.cartItemsContainer}>
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.id}
                                    cartItemId={item.id}
                                    title={item.product.title}
                                    price={item.product.price}
                                    image={item.product.image}
                                    qty={item.qty}
                                />
                            ))}
                        </div>
                    </>
                )
            )}
        </>
    );
}
