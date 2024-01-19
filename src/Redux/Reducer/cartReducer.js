// Imports
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../../Database/firebaseConfig";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";

// Creating async thunks here for asynchronous functions
export const fetchCartDataAsync = createAsyncThunk("cart/fetchData", async (signedUser) => {
    let cartItems = [];
    let totalPrice = 0;

    if (signedUser) {
        // Querying the user's cart items
        const cartQuery = query(
            collection(db, "cart"),
            where("user", "==", signedUser)
        );

        const querySnapshot = await getDocs(cartQuery);

        // Mapping the cart items
        cartItems = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Calculating total
        totalPrice = cartItems.reduce((total, item) => total + item.qty * item.product.price, 0);
    }

    return { cartItems, totalPrice };
});

// Add to cart async thunk
export const handleAddToCart = createAsyncThunk("cart/add", async ({ product, signedUser }, { getState }) => {
    // Adding to the database
    try {
        const state = getState(); // Accessing the state directly
        const cartItems = state.cartReducer.cartItems; 
        // Checking if it's existing item then updating quantity
        const existingItemIndex = cartItems.findIndex(
            (item) => item.product.id === product.id && item.user.id === signedUser.id
        );
        if (existingItemIndex !== -1) {
            const existingItem = cartItems[existingItemIndex];
            const updatedQty = existingItem.qty + 1;
            const itemRef = doc(collection(db, "cart"), existingItem.id);
            // Updating item quantity in database
            await updateDoc(itemRef, {
                qty: updatedQty,
            });
            toast.success("Quantity increased for the item!");
        } else {
            await addDoc(collection(db, "cart"), {
                user: signedUser,
                product: product,
                qty: 1,
            });
            toast.success("Product added to cart successfully!");
        }
    } catch (error) {
        console.log(error);
        toast.error("Something went wrong!");
    }
});



  // Handle remove an item from cart
export const handleRemoveFromCart = createAsyncThunk("cart/remove", async (cartItemId) => {
    // Removing from database
    try {
      const docRef = doc(collection(db, "cart"), cartItemId);
      await deleteDoc(docRef);
      toast.success("Item removed successufully from cart!");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  });

    // Handle increase quantity for a product
   export const handleIncreaseQty = createAsyncThunk("cart/increaseQty", async (cartItemId) => {
        try {
          const itemRef = doc(collection(db, "cart"), cartItemId);
          // Fetch the current item data
          const itemSnapshot = await getDoc(itemRef);
          const currentItem = itemSnapshot.data();
    
          // Increment the quantity
          const updatedQty = currentItem.qty + 1;
    
          // Updating item quantity in database
          await updateDoc(itemRef, {
            qty: updatedQty,
          });
          toast.success("Quantity increased for the item!");
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong!");
        }
      });
    
      // Handle decrease quantity for a product
      export const handleDecreaseQty = createAsyncThunk("cart/decreaseQty", async (cartItemId, {dispatch}) => {
        try {
          const itemRef = doc(collection(db, "cart"), cartItemId);
    
          // Current item
          const itemSnapshot = await getDoc(itemRef);
          const currentItem = itemSnapshot.data();
    
          // Decreasing quantity
          const updatedQty = currentItem.qty - 1;
    
          if (updatedQty > 0) {
            // Updating item quantity in the database
            await updateDoc(itemRef, {
              qty: updatedQty,
            });
            toast.success("Quantity decreased for the item!");
          } else {
            dispatch(handleRemoveFromCart(cartItemId));
          }
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong!");
        }
      });



// State
const INITIAL_STATE = {
    cartItems: [],
    total: 0,
    cartLoading: true,
}

// Creating Slice
export const cartSlice = createSlice({
    name: "Cart",
    initialState: INITIAL_STATE,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchCartDataAsync.fulfilled, (state, action) => {
            state.cartItems = action.payload.cartItems;
            state.total = action.payload.totalPrice;
            state.cartLoading = false;
        });
    }
});

// Extracting reducer from the slice
export const cartReducer = cartSlice.reducer;

// Extracting actions

// Extracting state
export const cartSelector = (state) => state.cartReducer;