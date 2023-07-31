import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";
import { cloudinaryUpload } from "../../utils/cloudinary";

const initialState = {
  isLoading: false,
  error: null,
  categories: null,
};

const slice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getAllCategories(state, action) {
      state.isLoading = false;
      state.errors = null;
      state.categories = action.payload;
    },
  },
});

export const createBook = (data) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const imageUrl = await cloudinaryUpload(data.img);
    const response = await apiService.post("/books", {
      author: data.author,
      name: data.name,
      price: data.price,
      publicationDate: data.publicationDate,
      img: imageUrl,
    });
    await apiService.post("/bookCategory", {
      bookId: response.data._id,
      categoryIds: data.categories,
    });
    toast.success("Book created successfully");
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const getCategories = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.get(`/categories`);
    dispatch(slice.actions.getAllCategories(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export default slice.reducer;
