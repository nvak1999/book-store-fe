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
import { createBook, getCategories } from "./adminSlice";
import { LoadingButton } from "@mui/lab";

const yupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  author: Yup.string().required("Author is required"),
  price: Yup.number().required("Price is required"),
  publicationDate: Yup.date().required("Publication date is required"),
  img: Yup.mixed().required("Image is required"),
  categories: Yup.array().min(1, "At least one category must be selected"),
});

function BookForm() {
  const defaultValues = {
    name: "",
    author: "",
    price: "",
    publicationDate: "",
    img: "",
    categories: [],
  };

  const { isLoading, categories } = useSelector((state) => state.admin);

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

    await dispatch(createBook(data)).then(() => reset());
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
                  width: 450,
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
                  width: 450,
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
                  width: 450,
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
                  width: 450,
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  m: 1,
                  flexWrap: "wrap",
                  width: 450,
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
              }}
              maxSize={3145728}
              onDrop={handleDrop}
              sx={{ width: 450, height: 300, m: 0, pt: 2 }}
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
              size="small"
              loading={isSubmitting || isLoading}
            >
              Upload Book
            </LoadingButton>
          </Box>
        </Stack>
      </FormProvider>
    </Card>
  );
}

export default BookForm;
