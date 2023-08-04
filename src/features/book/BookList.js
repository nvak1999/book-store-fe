import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
import {
  getBooks,
  handleChangePage,
  getCategories,
  handleChangeCategory,
  getSingleCategory,
  handleChangKeyword,
  handleChangInputKeyword,
} from "./bookSlice";
import BookCard from "./BookCard";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import SearchIcon from "@mui/icons-material/Search";
import LoadingScreen from "../../components/LoadingScreen";

function BookList() {
  const {
    books,
    page,
    categories,
    category,
    search,
    searchInput,
    isLoading,
    totalPages,
  } = useSelector((state) => state.book);
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const location = useLocation();

  // useEffect(() => {
  //   // Parse query parameters from the URL and update the state accordingly
  //   const params = new URLSearchParams(location.search);
  //   const categoryParam = params.get("category");
  //   const searchParam = params.get("search");
  //   const pageParam = parseInt(params.get("page") || "1", 10); // Default to 1 if no page parameter is found

  //   // Dispatch actions to update category, search input, and page state
  //   if (categoryParam) {
  //     dispatch(handleChangeCategory(categoryParam));
  //   }
  //   if (searchParam) {
  //     dispatch(handleChangInputKeyword(searchParam));
  //   }
  //   dispatch(handleChangePage(pageParam));

  //   // Fetch categories and books
  //   dispatch(getCategories());
  // }, [dispatch, location.search]);

  // useEffect(() => {
  //   // Fetch books whenever category, search input, or page changes
  //   if (category !== "") {
  //     dispatch(getSingleCategory(category, page, search));
  //   } else {
  //     dispatch(getBooks(page, search));
  //   }

  //   // Update the URL with the new page as a query parameter

  //   navigate(`?page=${page}&category=${category}&search=${search}`);
  // }, [dispatch, category, page, search, navigate]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (category !== "") {
      dispatch(getSingleCategory(category, page, search));
    } else {
      dispatch(getBooks(page, search));
    }
  }, [dispatch, category, page, search]);

  const handleChange_page = (event, value) => {
    dispatch(handleChangePage(value));
  };

  const handleChange_Category = (event) => {
    dispatch(handleChangeCategory(event.target.value));
  };

  const handleChang_InputKeyword = (event) => {
    dispatch(handleChangInputKeyword(event.target.value));
  };

  const handleChang_Keyword = (input) => {
    dispatch(handleChangKeyword(input));
  };

  const bookGird = (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <Grid container wrap="wrap">
          {books &&
            books.map((book) => (
              <Grid
                item
                justifyContent="center"
                lg={4}
                md={6}
                xs={12}
                key={book._id}
              >
                <Link
                  to={`book/${book._id}`}
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <BookCard book={book} />
                </Link>
              </Grid>
            ))}
        </Grid>
      </Box>
    </>
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          m: 2,
          mt: 3,
        }}
      >
        <FormControl sx={{ width: 300 }}>
          <InputLabel id="demo-simple-select-label">Category</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={category}
            label="Category"
            onChange={handleChange_Category}
          >
            <MenuItem key="category" value="">
              All category
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ m: 2 }}>
          <TextField
            sx={{ height: 50, width: 180 }}
            id="outlined-basic"
            label="Search"
            variant="outlined"
            value={searchInput}
            onChange={(event) => handleChang_InputKeyword(event)}
          />
          <Button
            sx={{ height: 55, ml: 1 }}
            variant="contained"
            onClick={() => handleChang_Keyword(searchInput)}
          >
            <SearchIcon />
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <Box
          sx={{
            m: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <LoadingScreen />
        </Box>
      ) : books.length > 0 ? (
        bookGird
      ) : (
        <>
          <Box>
            <Typography variant="h5" component="div" gutterBottom>
              Book not found !
            </Typography>
          </Box>
        </>
      )}

      <Pagination
        page={page}
        size="small"
        count={totalPages}
        color="primary"
        sx={{ alignSelf: "center", m: 2 }}
        onChange={handleChange_page}
      />
    </Box>
  );
}

export default BookList;
