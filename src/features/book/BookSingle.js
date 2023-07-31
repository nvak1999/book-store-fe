import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import {
  getSingleBook,
  setiIsBookNotInCart,
  getSingleBookAgain,
  handleChangeReview,
  sendReview,
} from "./bookSlice";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import LoadingScreen from "../../components/LoadingScreen";
import { addToCart } from "../cart/cartSlice";
import useAuth from "../../hooks/useAuth";

function BookSingle() {
  const { book, isLoading, isBookNotInCart, cart, review } = useSelector(
    (state) => state.book
  );
  const dispatch = useDispatch();
  const { bookId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    dispatch(getSingleBook(bookId, user._id));
  }, [dispatch, bookId, user]);

  useEffect(() => {
    const checkBook = cart.some((cartBook) => cartBook.bookId === bookId);
    dispatch(setiIsBookNotInCart(checkBook));
  }, [dispatch, cart, bookId, isBookNotInCart, review]);

  const handleAddToCart = () => {
    dispatch(addToCart(user._id, bookId, 1, book.price, isBookNotInCart));
    dispatch(getSingleBookAgain(bookId, user._id));
  };

  const handleTextareaChange = (event) => {
    dispatch(handleChangeReview(event.target.value));
  };

  const handleSendButtonClick = async () => {
    await dispatch(sendReview(user._id, user.name, bookId, review));
    await dispatch(getSingleBookAgain(bookId, user._id));
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 10,
          }}
        >
          <Grid container spacing={2} sx={{ width: 800 }}>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Card
                sx={{
                  width: 350,
                  height: 530,
                }}
              >
                <CardMedia
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  component="img"
                  image={book.img}
                  alt="Book Cover"
                />
              </Card>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Card
                sx={{
                  width: 350,
                  height: 530,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div" gutterBottom>
                    {book.name}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Box sx={{ display: "flex", ml: 0.5, flexWrap: "wrap" }}>
                      <Typography
                        variant="subtitle1"
                        component="div"
                        gutterBottom
                        sx={{ marginRight: 0.5, marginBottom: 0.5 }}
                      >
                        Categories:
                      </Typography>
                      {book.categories?.map((category, index) => (
                        <Chip
                          key={index}
                          sx={{ marginRight: 0.5, marginBottom: 0.5 }}
                          label={category}
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                    </Box>
                  </Box>
                  <Typography variant="subtitle1" component="div" gutterBottom>
                    Author: {book.author}
                  </Typography>
                  <Typography variant="subtitle1" component="div" gutterBottom>
                    Publication date: {book.publicationDate}
                  </Typography>
                  <Typography variant="subtitle1" component="div" gutterBottom>
                    Price: {book.price} $
                  </Typography>

                  <div
                    style={{
                      overflowY: "scroll",
                      height: "155px",
                      border: "1px solid rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {book.reviews && book.reviews.length > 0 && (
                      <Paper elevation={0} sx={{ p: 0.5, opacity: 0.8 }}>
                        {book.reviews.map((review, index) => (
                          <Box
                            key={index}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              padding: "5px",
                            }}
                          >
                            <Box sx={{}}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  component="div"
                                  style={{ fontSize: "12px" }}
                                >
                                  {review.name}
                                </Typography>
                                <Typography
                                  variant="subtitle2"
                                  component="div"
                                  style={{ fontSize: "12px" }}
                                >
                                  {formatDistanceToNow(
                                    new Date(review.createdAt),
                                    {
                                      addSuffix: true,
                                      includeSeconds: true,
                                    }
                                  ).replace("about ", "")}
                                </Typography>
                              </Box>

                              <Typography
                                variant="subtitle2"
                                component="div"
                                style={{ fontSize: "12px" }}
                              >
                                {review.comment}
                              </Typography>
                              <Divider sx={{ mb: 2 }} />
                            </Box>
                          </Box>
                        ))}
                      </Paper>
                    )}
                  </div>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <textarea
                      style={{
                        width: "100%",
                        marginRight: "5px",
                        fontFamily: "Arial, sans-serif",
                      }}
                      value={review}
                      onChange={handleTextareaChange}
                    ></textarea>
                    <Button
                      onClick={handleSendButtonClick}
                      variant="outlined"
                      color="primary"
                    >
                      send
                    </Button>
                  </Box>
                </CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    pb: 3,
                  }}
                >
                  <Button
                    disabled={isBookNotInCart}
                    variant="contained"
                    color="primary"
                    onClick={handleAddToCart}
                  >
                    Add to cart
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
}

export default BookSingle;
