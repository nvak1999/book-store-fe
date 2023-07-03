import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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

  useEffect(() => {
    dispatch(getBooks(page, search));
    dispatch(getCategories());
  }, [dispatch, page, search]);

  useEffect(() => {
    if (category !== "") {
      dispatch(getSingleCategory(category));
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
          width: 1000,
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
                  style={{ textDecoration: "none" }}
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
