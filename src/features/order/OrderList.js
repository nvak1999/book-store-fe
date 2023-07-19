import React, { useEffect } from "react";
import { getOrder } from "./orderSlice";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingScreen from "../../components/LoadingScreen";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
} from "@mui/material";

function OrderList() {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { orders, isLoading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrder(userId));
  }, [dispatch, userId]);

  const formatDateTime = (dateTime) => {
    return format(new Date(dateTime), "EEEE, MMMM/ d/ yyyy, HH:mm:ss");
  };

  return (
    <div>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", m: 4, textAlign: "center" }}
            >
              Booktify Order
            </Typography>
            {orders.map((order) => (
              <Box key={order._id} sx={{ ml: 3, mr: 3 }}>
                <div>
                  <TableContainer
                    component={Paper}
                    style={{ marginBottom: "16px" }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Book ID</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.books.map((book) => (
                          <TableRow key={book._id}>
                            <TableCell>{book.bookId}</TableCell>
                            <TableCell>{book.quantity}</TableCell>
                            <TableCell>{book.price}</TableCell>
                            <TableCell>{book.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ m: 2, mb: 5 }}>
                    <p>
                      <b>Status:</b> {order.status}
                    </p>
                    <p>
                      <b>Total Amount:</b> {order.totalAmount}
                    </p>
                    <p>
                      <b>Shipping Address:</b> {order.shippingAddress}
                    </p>
                    <p>
                      <b>Created at:</b> {formatDateTime(order.createdAt)}
                    </p>
                  </Box>
                  <Box sx={{ flexGrow: 1 }} />
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ width: 150 }}
                    >
                      Cancel
                    </Button>
                  </Box>

                  <hr style={{ marginTop: "16px", marginBottom: "16px" }} />
                </div>
              </Box>
            ))}
          </Box>
        </div>
      )}
    </div>
  );
}

export default OrderList;
