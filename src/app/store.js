import { configureStore, combineReducers } from "@reduxjs/toolkit";
import bookReducer from "../features/book/bookSlice";
import cartRudecer from "../features/cart/cartSlice";

const rootReducer = combineReducers({
  book: bookReducer,
  cart: cartRudecer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
