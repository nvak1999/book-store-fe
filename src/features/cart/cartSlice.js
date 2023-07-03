import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";

const initialState = {
  cart: [],
  isLoading: false,
  errors: null,
};

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.errors = action.payload;
    },
    getCartSuccess(state, action) {
      state.isLoading = false;
      state.errors = null;
      state.cart = action.payload;
    },
    updateCart(state, action) {
      state.cart = action.payload;
    },
  },
});

export const getCart = (userId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.get(`/carts/${userId}`);
    const updatedCart = await fetchBookNames(response.data);
    dispatch(slice.actions.getCartSuccess(updatedCart));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const addToCart =
  (userId, bookId, quantity = 1, price, isBookNotInCart) =>
  async (dispatch) => {
    if (isBookNotInCart) {
      toast.error("Book allready in cart");
    } else {
      try {
        const bookData = {
          bookId: bookId,
          quantity: quantity,
          price: price,
        };

        if (quantity > 0) {
          await apiService.post(`/carts/${userId}`, bookData);
          toast.success("Book added to the cart successfully");
        } else {
          toast.error("Invalid quantity");
        }
      } catch (error) {
        dispatch(slice.actions.hasError(error));
        toast.error(error.message);
      }
    }
  };

const fetchBookNames = async (cartItems) => {
  const updatedCart = await Promise.all(
    cartItems.map(async (item) => {
      try {
        const bookResponse = await apiService.get(`/books/${item.bookId}`);
        const bookName = bookResponse.data.name;
        return {
          ...item,
          bookName,
        };
      } catch (error) {
        console.error(error);
        return item;
      }
    })
  );
  return updatedCart;
};

export const increaseQuantity =
  (userId, bookId, quantity, price) => async (dispatch) => {
    quantity = quantity + 1;
    try {
      const bookData = {
        bookId: bookId,
        quantity: quantity,
        price: price,
      };
      await apiService.post(`/carts/${userId}`, bookData);
      const response = await apiService.get(`/carts/${userId}`);
      const updatedCart = await fetchBookNames(response.data);
      dispatch(slice.actions.updateCart(updatedCart));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error.message);
    }
  };

export const decreaseQuantity =
  (userId, bookId, quantity, price) => async (dispatch) => {
    if (quantity >= 0) {
      quantity = quantity - 1;
      try {
        const bookData = {
          bookId: bookId,
          quantity: quantity,
          price: price,
        };
        await apiService.post(`/carts/${userId}`, bookData);
        const response = await apiService.get(`/carts/${userId}`);
        const updatedCart = await fetchBookNames(response.data);
        dispatch(slice.actions.updateCart(updatedCart));
        if (quantity === 0)
          toast.success("Book removed from the cart successfully");
      } catch (error) {
        dispatch(slice.actions.hasError(error));
        toast.error(error.message);
      }
    }
  };

export const toggleCheckbox = (number) => async (dispatch) => {};

export default slice.reducer;
