import React, { useCallback } from "react";
import { Box, Card, alpha, Stack } from "@mui/material";
import { FormProvider, FTextField, FUploadImage } from "../../components/form";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { createBook } from "./adminSlice";
import { LoadingButton } from "@mui/lab";

const yupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  author: Yup.string().required("Author is required"),
  price: Yup.number().required("Price is required"),
  publicationDate: Yup.date().required("Publication date is required"),
  img: Yup.mixed().required("Image is required"),
});

function BookForm() {
  const defaultValues = {
    name: "",
    author: "",
    price: "",
    publicationDate: "",
    img: "",
  };

  const { isLoading } = useSelector((state) => state.book);

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
    await dispatch(createBook(data)).then(() => reset());
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <FTextField
            name="name"
            fullWidth
            placeholder="Book Name"
            sx={{
              "& fieldset": {
                borderWidth: `1px !important`,
                borderColor: alpha("#919EAB", 0.32),
              },
            }}
          />
          <FTextField
            name="author"
            fullWidth
            placeholder="Author"
            sx={{
              "& fieldset": {
                borderWidth: `1px !important`,
                borderColor: alpha("#919EAB", 0.32),
              },
            }}
          />
          <FTextField
            name="price"
            fullWidth
            type="number"
            placeholder="Price"
            sx={{
              "& fieldset": {
                borderWidth: `1px !important`,
                borderColor: alpha("#919EAB", 0.32),
              },
            }}
          />
          <FTextField
            name="publicationDate"
            fullWidth
            type="date"
            placeholder="Publication Date"
            sx={{
              "& fieldset": {
                borderWidth: `1px !important`,
                borderColor: alpha("#919EAB", 0.32),
              },
            }}
          />
          <FUploadImage
            name="img"
            accept={{
              "image/png": [".png"],
              "image/jpeg": [".jpg", ".jpeg"],
            }}
            maxSize={3145728}
            onDrop={handleDrop}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
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
