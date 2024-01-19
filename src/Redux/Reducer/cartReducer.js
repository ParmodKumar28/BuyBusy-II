// Imports
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../../Database/firebaseConfig";
import { collection, onSnapshot, where } from "firebase/firestore";

// Creating async thunks here for asynchronous functions
export const fetchCartData = createAsyncThunk("carts/fetchData", async () => {

})

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

    }
});

// Extracting reducer from the slice
export const cartReducer = cartSlice.reducer;

// Extracting actions

// Extracting state
export const cartSelector = (state) => state.cartReducer;