import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  increaseQuantity,
  decreaseQuantity,
  toggleCheckbox,
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
} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

function CartList() {
  const { cart, isLoading } = useSelector((state) => state.cart);
  const { userId } = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));

  useEffect(() => {
    dispatch(getCart(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  const handleIncreaseQuantity = (bookId, quantity, price) => {
    dispatch(increaseQuantity(userId, bookId, quantity, price));
  };

  const handleDecreaseQuantity = (bookId, quantity, price) => {
    dispatch(decreaseQuantity(userId, bookId, quantity, price));
  };

  const handleToggleCheckbox = (bookId) => {
    dispatch(toggleCheckbox(bookId));
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
                      <Typography
                        sx={{
                          fontSize: isExtraSmallScreen ? "0.8rem" : "1rem",
                        }}
                      >
                        {item.quantity}
                      </Typography>
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
            <Button variant="contained" color="primary" sx={{ width: 150 }}>
              Order
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
}

export default CartList;
