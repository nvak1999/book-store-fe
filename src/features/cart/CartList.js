import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  increaseQuantity,
  decreaseQuantity,
  toggleCheckbox,
  orderCart,
  changeQuantity,
} from "./cartSlice";
import LoadingScreen from "../../components/LoadingScreen";
import { useParams } from "react-router-dom";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Divider,
  Modal,
  TextField,
} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { toast } from "react-toastify";
import { getUser } from "../user/userSlice";
import { useNavigate } from "react-router-dom";
import PayPal from "./PayPal";

function CartList() {
  const { cart, isLoading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { userId } = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));

  useEffect(() => {
    dispatch(getUser(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(getCart(userId));
  }, [dispatch, userId]);

  const handleIncreaseQuantity = (bookId, quantity, price) => {
    dispatch(increaseQuantity(userId, bookId, quantity, price));
  };

  const handleDecreaseQuantity = (bookId, quantity, price) => {
    dispatch(decreaseQuantity(userId, bookId, quantity, price));
  };

  const handleChangQuantity = (bookId, quantity, price) => {
    dispatch(changeQuantity(userId, bookId, quantity, price));
  };

  const handleToggleCheckbox = (bookId) => {
    dispatch(toggleCheckbox(bookId));
  };
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");

  const handleModalOpen = () => {
    setModalOpen(true);
    const address = user.address || "";
    const city = user.city || "";
    const state = user.state || "";
    const zipcode = user.zipcode || "";
    setShippingAddress(`${address}, ${city}, ${state}, ${zipcode}`);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleOrder = () => {
    const checkedBooks = cart.filter((item) => item.checked);

    if (cart.length === 0) {
      toast.error(
        "Your cart is empty. Please add books to your cart before placing an order."
      );
    } else if (checkedBooks.length === 0) {
      toast.error("Please select at least one book to order.");
    } else {
      handleModalOpen();
    }
  };

  const handlePlaceOrder = async () => {
    const checkedBooks = cart.filter((item) => item.checked);
    if (!shippingAddress.trim()) {
      toast.error("Please enter a valid shipping address.");
      return;
    }

    if (cart.length === 0) {
      toast.error(
        "Your cart is empty. Please add books to your cart before placing an order."
      );
    } else if (checkedBooks.length === 0) {
      toast.error("Please select at least one book to order.");
    } else {
      await dispatch(orderCart(userId, checkedBooks, shippingAddress));
      handleModalClose();
      await navigate(`/order/${user._id}`);
    }
  };

  return (
    <div>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Box sx={{ overflow: "auto", mt: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}
          >
            Booktify Cart
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>
                  <Typography
                    fontWeight="bold"
                    variant="subtitle1"
                    sx={{ fontSize: isExtraSmallScreen ? "0.8rem" : "1rem" }}
                  >
                    Book Name
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    fontWeight="bold"
                    variant="subtitle1"
                    sx={{ fontSize: isExtraSmallScreen ? "0.8rem" : "1rem" }}
                  >
                    Price
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    fontWeight="bold"
                    variant="subtitle1"
                    sx={{ fontSize: isExtraSmallScreen ? "0.8rem" : "1rem" }}
                  >
                    Quantity
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    fontWeight="bold"
                    variant="subtitle1"
                    sx={{ fontSize: isExtraSmallScreen ? "0.8rem" : "1rem" }}
                  >
                    Amount
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.bookId}>
                  <TableCell>
                    <Checkbox
                      checked={item.checked}
                      onChange={() => handleToggleCheckbox(item.bookId)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{ fontSize: isExtraSmallScreen ? "0.8rem" : "1rem" }}
                    >
                      {item.bookName}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      sx={{ fontSize: isExtraSmallScreen ? "0.8rem" : "1rem" }}
                    >
                      ${item.price}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleDecreaseQuantity(
                            item.bookId,
                            item.quantity,
                            item.price
                          )
                        }
                      >
                        <KeyboardArrowLeftIcon />
                      </IconButton>

                      <TextField
                        value={item.quantity}
                        InputProps={{
                          min: 1,
                          max: 100,
                          disableUnderline: true,
                          sx: {
                            fontSize: isExtraSmallScreen ? "0.8rem" : "1rem",
                            width: 55,
                            input: { textAlign: "center" },
                          },
                        }}
                        onChange={(e) => {
                          const newQuantity = e.target.value;
                          handleChangQuantity(
                            item.bookId,
                            newQuantity,
                            item.price
                          );
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleIncreaseQuantity(
                            item.bookId,
                            item.quantity,
                            item.price
                          )
                        }
                      >
                        <KeyboardArrowRightIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      sx={{ fontSize: isExtraSmallScreen ? "0.8rem" : "1rem" }}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 2,
              m: 5,
              fontSize: isExtraSmallScreen ? "0.8rem" : "1rem",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ width: 150 }}
              onClick={handleOrder}
            >
              Order
            </Button>
          </Box>
          <PayPal />
        </Box>
      )}

      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Box
            sx={{
              width: "80%",
              maxWidth: 500,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 0,
            }}
          >
            <Typography variant="h6" id="modal-title" gutterBottom>
              <Box sx={{ textAlign: "center" }}>
                <b> CHECK OUT</b>
              </Box>
            </Typography>
            <Typography gutterBottom>
              <strong>Name:</strong> {user.name}
            </Typography>
            <Typography gutterBottom>
              <strong>Checked Books:</strong>
            </Typography>
            {cart
              .filter((item) => item.checked)
              .map((book) => (
                <Typography key={book.bookId}>
                  <b>{book.bookName} </b>, <b> price:</b> {book.price} ,
                  <b> quantity:</b> {book.quantity}
                </Typography>
              ))}
            <Typography gutterBottom sx={{ mt: 1 }}>
              <strong>Shipping Address:</strong>
            </Typography>
            <TextField
              multiline
              rows={2}
              fullWidth
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button onClick={handleModalClose} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default CartList;
