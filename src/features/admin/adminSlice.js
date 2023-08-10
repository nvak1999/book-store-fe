import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";
import { cloudinaryUpload } from "../../utils/cloudinary";
import { booksData } from "./data/booksData";

const initialState = {
  isLoading: false,
  error: null,
  categories: null,
  order: null,
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
    getAllOrder(state, action) {
      state.isLoading = false;
      state.errors = null;
      state.order = action.payload;
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
      description: data.description,
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

export const updateBook = (data, bookId) => async (dispatch) => {
  try {
    const imageUrl = await cloudinaryUpload(data.img);
    await apiService.put(`/books/${bookId}`, {
      author: data.author,
      name: data.name,
      price: data.price,
      publicationDate: data.publicationDate,
      img: imageUrl,
    });
    await apiService.put(`/bookCategory/${bookId}`, {
      categoryIds: data.categories,
    });
    toast.success("Book update successfully");
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

export const getAllOrder = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const orderResponse = await apiService.get(`/orders`);
    const userResponse = await apiService.get(`/users`);

    const usersById = userResponse.data.reduce((acc, user) => {
      acc[user._id] = user;
      return acc;
    }, {});

    const ordersWithUserName = orderResponse.data.map((order) => ({
      ...order,
      userName: usersById[order.userId]?.name || "Unknown User",
    }));

    dispatch(slice.actions.getAllOrder(ordersWithUserName));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const updateOrderStatus = (orderId, status) => async (dispatch) => {
  try {
    await apiService.put(`/orders/${orderId}`, {
      status: status,
    });
    toast.success("Order status updated successfully");
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const importBooks = (number, categories) => async (dispatch) => {
  const getRandomCategories = (num) => {
    const randomCategories = [];
    const categoryCount = categories.length;

    const selectedCategoryIds = new Set();

    while (
      randomCategories.length < num &&
      selectedCategoryIds.size < categoryCount
    ) {
      const randomIndex = Math.floor(Math.random() * categoryCount);
      const randomCategoryId = categories[randomIndex]._id;

      if (!selectedCategoryIds.has(randomCategoryId)) {
        randomCategories.push(randomCategoryId);
        selectedCategoryIds.add(randomCategoryId);
      }
    }

    return randomCategories;
  };

  try {
    for (let i = 0; i < number; i++) {
      const book = booksData[i];
      const imageUrl = book.img;

      const response = await apiService.post("/books", {
        author: book.author,
        name: book.name,
        price: book.price,
        publicationDate: book.publicationDate,
        img: imageUrl,
        description: book.description,
      });

      const categoryList = getRandomCategories(
        Math.floor(Math.random() * 4) + 1
      );
      console.log(categoryList);
      await apiService.post("/bookCategory", {
        bookId: response.data._id,
        categoryIds: categoryList,
      });
    }
    toast.success("import book successfully");
  } catch (error) {
    console.error("Error importing books:", error);
  }
};
export default slice.reducer;
