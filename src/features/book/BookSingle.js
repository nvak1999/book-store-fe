import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import {
  getSingleBook,
  setiIsBookNotInCart,
  getSingleBookAgain,
  handleChangeReview,
  sendReview,
  deleteBook,
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
  Modal,
} from "@mui/material";
import LoadingScreen from "../../components/LoadingScreen";
import { addToCart } from "../cart/cartSlice";
import useAuth from "../../hooks/useAuth";
import EditIcon from "@mui/icons-material/Edit";
import BookForm from "../admin/BookForm";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

function BookSingle() {
  const { book, isLoading, isBookNotInCart, cart, review } = useSelector(
    (state) => state.book
  );
  let formattedDate = "";
  if (book.publicationDate) {
    formattedDate = format(new Date(book.publicationDate), "dd-MM-yyyy");
  }
  const dispatch = useDispatch();
  const { bookId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

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
  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    await dispatch(deleteBook(bookId));
    await navigate(`/`);
  };

  const handleTextareaChange = (event) => {
    dispatch(handleChangeReview(event.target.value));
  };

  const handleSendButtonClick = async () => {
    await dispatch(sendReview(user._id, user.name, bookId, review));
    await dispatch(getSingleBookAgain(bookId, user._id));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      mb: 1,
                    }}
                  >
                    <Typography variant="h5" component="div" gutterBottom>
                      {book.name}
                    </Typography>
                    {user.role === "admin" && (
                      <Button variant="text" onClick={handleOpenModal}>
                        <EditIcon />
                      </Button>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      <Typography
                        variant="subtitle1"
                        component="div"
                        gutterBottom
                        sx={{ marginBottom: 0.5, mr: 0.5 }}
                      >
                        Categories:
                      </Typography>
                      {book.categories?.map((category, index) => (
                        <Chip
                          key={index}
                          sx={{ marginRight: 0.5, marginBottom: 0.5 }}
                          label={category}
                          size="small"
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
                    Publication date: {formattedDate}
                  </Typography>
                  <Typography variant="subtitle1" component="div" gutterBottom>
                    Price: {book.price} $
                  </Typography>
                  {user.role !== "admin" && (
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
                  )}
                  {user.role !== "admin" && (
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
                        disabled={user.role === "admin" ? true : false}
                      >
                        send
                      </Button>
                    </Box>
                  )}
                </CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    pb: 3,
                  }}
                >
                  {user.role !== "admin" && (
                    <Button
                      disabled={isBookNotInCart}
                      variant="contained"
                      color="primary"
                      onClick={handleAddToCart}
                    >
                      Add to cart
                    </Button>
                  )}
                  {user.role === "admin" && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleDelete}
                    >
                      Delete Book
                    </Button>
                  )}
                </Box>
                <Modal
                  open={isDeleteModalOpen}
                  onClose={handleCloseDeleteModal}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      bgcolor: "#fff",
                      p: 4,
                      borderRadius: 1,
                      width: 300,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Are you sure you want to delete this book?
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleCloseDeleteModal}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleConfirmDelete}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </Modal>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* The Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 700,
            bgcolor: "#fff",
            boxShadow: 24,
            overflow: "auto",
          }}
        >
          <BookForm
            book={book}
            isUpdate={true}
            handleCloseModal={handleCloseModal}
          />
        </Box>
      </Modal>
    </>
  );
}

export default BookSingle;
