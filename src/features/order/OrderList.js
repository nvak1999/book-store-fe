import React, { useEffect } from "react";
import { getOrder, cancelOrder } from "./orderSlice";
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
    return format(new Date(dateTime), "EEEE, MMMM-d-yyyy, HH:mm:ss");
  };

  const handleCancel = (orderId) => {
    dispatch(cancelOrder(userId, orderId));
    dispatch(getOrder(userId));
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
              <Box key={order._id} sx={{ m: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <TableContainer
                    component={Paper}
                    sx={{ width: "100%", maxWidth: 700, margin: "0 auto" }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.books.map((book) => (
                          <TableRow key={book._id}>
                            <TableCell>{book.name || ""}</TableCell>
                            <TableCell>{book.quantity}</TableCell>
                            <TableCell> $ {book.price}</TableCell>
                            <TableCell>$ {book.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      width: "100%",
                      maxWidth: 700,
                      margin: "0 auto",
                    }}
                  >
                    <Box sx={{}}>
                      <p>
                        <b>Status:</b>{" "}
                        <span
                          style={{
                            color:
                              order.status === "Processing" ||
                              order.status === "Shipped"
                                ? "green"
                                : "red",
                          }}
                        >
                          {order.status}
                        </span>
                      </p>

                      <p>
                        <b>Total Amount:</b> $ {order.totalAmount}
                      </p>
                      <p>
                        <b>Shipping Address:</b> {order.shippingAddress}
                      </p>
                      <p>
                        <b>Created at:</b> {formatDateTime(order.createdAt)}
                      </p>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ width: 150, height: 40 }}
                        onClick={() => handleCancel(order._id)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                </Box>
                <hr style={{ marginTop: "16px", marginBottom: "16px" }} />
              </Box>
            ))}
          </Box>
        </div>
      )}
    </div>
  );
}

export default OrderList;
