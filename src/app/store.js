import { configureStore, combineReducers } from "@reduxjs/toolkit";
import bookReducer from "../features/book/bookSlice";
import cartReducer from "../features/cart/cartSlice";
import userReducer from "../features/user/userSlice";
import orderReducer from "../features/order/orderSlice";

const rootReducer = combineReducers({
  book: bookReducer,
  cart: cartReducer,
  user: userReducer,
  order: orderReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
