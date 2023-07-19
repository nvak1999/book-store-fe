import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";

const initialState = {
  isLoading: false,
  orders: [],
  errors: null,
};

const slice = createSlice({
  name: "order",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.errors = action.payload;
    },
    getOrderSuccess(state, action) {
      state.isLoading = false;
      state.orders = action.payload;
    },
  },
});

export const getOrder = (userId) => async (dispatch) => {
  try {
    const response = await apiService.get(`/orders/${userId}`);
    dispatch(slice.actions.getOrderSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export default slice.reducer;
