import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";

const initialState = {
  user: [],
  errors: null,
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setError: (state, action) => {
      state.errors = action.payload;
    },
  },
});

export const { setUser, setError } = slice.actions;

export default slice.reducer;
