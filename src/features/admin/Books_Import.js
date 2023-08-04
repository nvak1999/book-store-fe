import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "./adminSlice";
import { importBooks } from "./adminSlice";

function Books_Import() {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.admin);
  const [numBooks, setNumBooks] = useState(0);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleInputChange = (event) => {
    setNumBooks(Number(event.target.value));
  };

  const handleSubmit = () => {
    dispatch(importBooks(numBooks, categories));
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="80vh"
    >
      <TextField
        type="number"
        label="Enter a number between 1 and 100 to import books"
        inputProps={{
          min: 1,
          max: 100,
        }}
        onChange={handleInputChange}
        sx={{ width: 500, marginBottom: "16px" }}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ width: 500 }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Box>
  );
}

export default Books_Import;
