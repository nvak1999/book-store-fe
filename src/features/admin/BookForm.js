import React, { useCallback, useEffect } from "react";
import {
  Box,
  Card,
  alpha,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { FormProvider, FTextField, FUploadImage } from "../../components/form";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { createBook, getCategories, updateBook } from "./adminSlice";
import { getSingleBook } from "../book/bookSlice";
import { LoadingButton } from "@mui/lab";
import useAuth from "../../hooks/useAuth";
import { format } from "date-fns";

const yupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  author: Yup.string().required("Author is required"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number")
    .nullable(),
  publicationDate: Yup.date().required("Publication date is required"),
  img: Yup.mixed().required("Image is required"),
  categories: Yup.array().min(1, "At least one category must be selected"),
});

function BookForm({ book, isUpdate, handleCloseModal }) {
  let formattedDate = "";
  if (book.publicationDate) {
    formattedDate = format(new Date(book.publicationDate), "yyyy-MM-dd");
  }

  const defaultValues = {
    name: book.name ? book.name : "",
    author: book.author || "",
    price: book.price ? book.price : "",
    publicationDate: formattedDate,
    img: book.img ? book.img : "",
    categories: book.categories ? book.categories : [],
  };

  const { isLoading, categories } = useSelector((state) => state.admin);
  const { user } = useAuth();
  const methods = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;
  const dispatch = useDispatch();

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        if (file.type.startsWith("image/")) {
          setValue(
            "img",
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          );
        } else {
          console.error("Invalid file type. Please upload an image.");
        }
      }
    },
    [setValue]
  );

  const onSubmit = async (data) => {
    const selectedCategoryNames = data.categories;
    const selectedCategories = categories.filter((category) =>
      selectedCategoryNames.includes(category.categoryName)
    );
    const categoryIds = selectedCategories.map((category) => category._id);
    data.categories = categoryIds;

    if (!isUpdate) {
      await dispatch(createBook(data)).then(() => reset());
    } else {
      await dispatch(updateBook(data, book._id));
      await dispatch(getSingleBook(book._id, user._id));
      await handleCloseModal();
    }
  };

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                width: 500,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                flexDirection: "column",
              }}
            >
              <FTextField
                name="name"
                placeholder="Book Name"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                  m: 1,
                  width: 350,
                }}
              />
              <FTextField
                name="author"
                placeholder="Author"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                  m: 1,
                  width: 350,
                }}
              />
              <FTextField
                name="price"
                type="number"
                placeholder="Price"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                  m: 1,
                  width: 350,
                }}
              />
              <FTextField
                name="publicationDate"
                type="date"
                placeholder="Publication Date"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                  m: 1,
                  width: 350,
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  m: 1,
                  flexWrap: "wrap",
                  width: 350,
                }}
              >
                {categories &&
                  categories.map((category) => (
                    <FormControlLabel
                      key={category._id}
                      control={
                        <Checkbox
                          name="categories"
                          value={category.categoryName}
                          checked={methods
                            .watch("categories")
                            .includes(category.categoryName)}
                          onChange={(event) => {
                            const { value, checked } = event.target;
                            const currentValues = methods.watch("categories");
                            if (checked) {
                              setValue("categories", [...currentValues, value]);
                            } else {
                              setValue(
                                "categories",
                                currentValues.filter((val) => val !== value)
                              );
                            }
                          }}
                        />
                      }
                      label={category.categoryName}
                    />
                  ))}
              </Box>
            </Box>
            <FUploadImage
              name="img"
              accept={{
                "image/png": [".png"],
                "image/jpeg": [".jpg", ".jpeg"],
                "image/webp": [".webp"],
              }}
              maxSize={3145728}
              onDrop={handleDrop}
              sx={{ width: 350, height: 500, pt: 2.5 }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              size="medium"
              loading={isSubmitting || isLoading}
            >
              {isUpdate ? "Update Book" : "Upload Book"}
            </LoadingButton>
          </Box>
        </Stack>
      </FormProvider>
    </Card>
  );
}

export default BookForm;
