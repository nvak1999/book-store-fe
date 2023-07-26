import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";
import { cloudinaryUpload } from "../../utils/cloudinary";

const initialState = {
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: "post",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const createBook = (data) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const imageUrl = await cloudinaryUpload(data.img);
    await apiService.post("/books", {
      author: data.author,
      name: data.name,
      price: data.price,
      publicationDate: data.publicationDate,
      img: imageUrl,
    });
    toast.success("Book created successfully");
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export default slice.reducer;
