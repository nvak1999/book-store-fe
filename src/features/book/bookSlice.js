import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";

const initialState = {
  isLoading: false,
  isBookNotInCart: false,
  errors: null,
  cart: [],
  books: [],
  categories: [],
  book: "",
  category: "",
  selectedBook: null,
  page: 1,
  limit: 9,
  search: "",
  searchInput: "",
  review: "",
  totalPages: 0,
  disableButtonSend: false,
  minPrice: 19,
  maxPrice: 40,
};
const slice = createSlice({
  name: "book",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
      state.books = [];
      state.book = "";
    },
    endLoading(state) {
      state.isLoading = false;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.errors = action.payload;
    },
    getBooksSuccess(state, action) {
      state.errors = null;
      state.books = action.payload.books;
      state.totalPages = action.payload.totalPages;
    },
    getSingleBooksSuccess(state, action) {
      state.isLoading = false;
      state.errors = null;
      state.book = action.payload;
    },
    getSingleBooksAgain(state, action) {
      state.errors = null;
      state.book = action.payload;
    },
    changePage(state, action) {
      state.page = action.payload;
    },
    changeCategory(state, action) {
      state.category = action.payload;
      state.page = 1;
    },
    getAllCategories(state, action) {
      state.isLoading = false;
      state.errors = null;
      state.categories = action.payload;
    },
    getCategoryById(state, action) {
      state.isLoading = false;
      state.errors = null;
      state.books = action.payload.books;
      state.totalPages = action.payload.totalPages;
    },
    changeSearchInput(state, action) {
      state.isLoading = false;
      state.searchInput = action.payload;
    },
    changeKeyword(state, action) {
      state.isLoading = false;
      state.search = action.payload;
      state.page = 1;
    },
    changeisBookNotInCart(state, action) {
      state.isBookNotInCart = action.payload;
    },
    getCart(state, dispatch) {
      state.cart = dispatch.payload;
    },
    changeReview(state, action) {
      state.review = action.payload;
    },
    setButtonSendTrue(state) {
      state.disableButtonSend = true;
    },
    setButtonSendFalse(state) {
      state.disableButtonSend = false;
    },
    changePriceSearch(state, action) {
      state.priceSearch = action.payload;
    },
    changeMinPrice(state, action) {
      state.minPrice = action.payload;
    },
    changeMaxPrice(state, action) {
      state.maxPrice = action.payload;
    },
  },
});

export const changePrice = (min, max) => (dispatch) => {
  dispatch(slice.actions.changeMinPrice(min));
  dispatch(slice.actions.changeMaxPrice(max));
};

export const getBooks =
  (page, search, minPrice, maxPrice) => async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.get(
        `/books?page=${page}&limit=${initialState.limit}&search=${search}&minPrice=${minPrice}&maxPrice=${maxPrice}`
      );
      await dispatch(slice.actions.getBooksSuccess(response.data));
      await dispatch(slice.actions.endLoading());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error.message);
    }
  };

export const setiIsBookNotInCart = (value) => (dispatch) => {
  dispatch(slice.actions.changeisBookNotInCart(value));
};

export const getSingleBook = (id, userId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.get(`/books/${id}`);
    const responseCart = await apiService.get(`/carts/${userId}`);
    dispatch(slice.actions.getCart(responseCart.data));
    dispatch(slice.actions.getSingleBooksSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const getSingleBookAgain = (id, userId) => async (dispatch) => {
  try {
    const response = await apiService.get(`/books/${id}`);
    const responseCart = await apiService.get(`/carts/${userId}`);
    dispatch(slice.actions.getCart(responseCart.data));
    dispatch(slice.actions.getSingleBooksAgain(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const handleChangePage = (value) => async (dispatch) => {
  dispatch(slice.actions.changePage(value));
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

export const getSingleCategory =
  (id, page, search, minPrice, maxPrice) => async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.get(
        `/categories/${id}?page=${page}&limit=${initialState.limit}&search=${search}&minPrice=${minPrice}&maxPrice=${maxPrice}`
      );
      dispatch(slice.actions.getCategoryById(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error.message);
    }
  };

export const deleteBook = (bookId) => async (dispatch) => {
  try {
    await apiService.delete(`/books/${bookId}`);
    toast.success("Deleted book sucssess");
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const handleChangeCategory = (categoryId) => async (dispatch) => {
  dispatch(slice.actions.changeCategory(categoryId));
};

export const handleChangInputKeyword = (keyword) => async (dispatch) => {
  dispatch(slice.actions.changeSearchInput(keyword));
};

export const handleChangKeyword = (keyword) => async (dispatch) => {
  dispatch(slice.actions.changeKeyword(keyword));
};

export const handleChangeReview = (value) => (dispatch) => {
  dispatch(slice.actions.changeReview(value));
};

export const sendReview =
  (userId, name, bookId, review) => async (dispatch) => {
    dispatch(slice.actions.setButtonSendTrue());
    if (!review) {
      toast.error("Review is null. Please enter a valid review.");
      await dispatch(slice.actions.setButtonSendFalse());
    } else {
      try {
        const reviewData = {
          name,
          bookId,
          comment: review,
        };
        await apiService.post(`/reviews/${userId}`, reviewData);
        await dispatch(slice.actions.changeReview(""));
        await dispatch(slice.actions.setButtonSendFalse());
        toast.success("Leave a review successfully");
      } catch (error) {
        dispatch(slice.actions.hasError(error));
        toast.error(error.message);
      }
    }
  };

export const updateReview = (userId, data) => async (dispatch) => {
  try {
    const response = await apiService.put(`/reviews/${userId}`, data);
    toast.success(response.message);
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const deleteReview = (userId, reviewId) => async (dispatch) => {
  try {
    const response = await apiService.delete(`/reviews/${userId}/${reviewId}`);
    toast.success(response.message);
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const handleChangPriceSearch = (price) => (dispatch) => {
  dispatch(slice.actions.changePriceSearch(price));
};

export default slice.reducer;
