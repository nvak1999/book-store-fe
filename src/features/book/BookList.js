import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBooks,
  handleChangePage,
  getCategories,
  handleChangeCategory,
  getSingleCategory,
  handleChangKeyword,
  handleChangInputKeyword,
  changePrice,
} from "./bookSlice";
import BookCard from "./BookCard";
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import LoadingScreen from "../../components/LoadingScreen";
import PricingFilter from "./PricingFilter";
import { SearchOutlined } from "@mui/icons-material";

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
    minPrice,
    maxPrice,
  } = useSelector((state) => state.book);
  const dispatch = useDispatch();
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (category !== "") {
      dispatch(getSingleCategory(category, page, search, minPrice, maxPrice));
    } else {
      dispatch(getBooks(page, search, minPrice, maxPrice));
    }
  }, [dispatch, category, page, search, minPrice, maxPrice]);

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

  const priceOptions = [];
  for (let price = 19.99; price <= 39.99; price += 1) {
    priceOptions.push(price.toFixed(2));
  }

  const applyFilter = async (minPrice, maxPrice) => {
    await dispatch(changePrice(priceRange[0], priceRange[1]));
    await setPriceRange([minPrice, maxPrice]);
    if (category !== "") {
      dispatch(getSingleCategory(category, page, search, minPrice, maxPrice));
    } else {
      dispatch(getBooks(page, search, minPrice, maxPrice));
    }
  };

  const clearFilter = async () => {
    await dispatch(changePrice(19, 40));
    await setPriceRange([19, 40]);
    if (category !== "") {
      dispatch(getSingleCategory(category, page, search, 19, 40));
    } else {
      dispatch(getBooks(page, search, 19, 40));
    }
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

          flexWrap: "wrap",
          m: 2,
          mt: 3,
        }}
      >
        <FormControl sx={{ width: 250, m: 1 }}>
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
        <Box>
          <PricingFilter
            applyFilter={applyFilter}
            clearFilter={clearFilter}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </Box>

        <TextField
          sx={{ m: 1, height: 50, width: 250 }}
          id="outlined-basic"
          label="Search"
          variant="outlined"
          value={searchInput}
          onChange={(event) => handleChang_InputKeyword(event)}
          onKeyDown={(event) => {
            if (event.keyCode === 13) {
              handleChang_Keyword(searchInput);
            }
          }}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={(event) => {
                  handleChang_Keyword(searchInput);
                }}
              >
                <SearchOutlined />
              </IconButton>
            ),
          }}
        />
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
