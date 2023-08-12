import React, { useEffect, useState } from "react";
import { getOrder, cancelOrder, deleteOrder } from "./orderSlice";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingScreen from "../../components/LoadingScreen";
import { format } from "date-fns";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
  Modal,
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

  const handleOpenModal = (orderId, type) => {
    setSelectedOrderId(orderId);
    setActionType(type);
    setModalOpen(true);
  };

  const handleCancel = (orderId) => {
    handleOpenModal(orderId, "cancel");
  };

  const handleDelete = (orderId) => {
    handleOpenModal(orderId, "delete");
  };

  const handleConfirmAction = () => {
    if (actionType === "cancel") {
      dispatch(cancelOrder(userId, selectedOrderId));
    } else if (actionType === "delete") {
      dispatch(deleteOrder(userId, selectedOrderId));
    }
    dispatch(getOrder(userId));
    setModalOpen(false);
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [actionType, setActionType] = useState(null);

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
                      <p>
                        <b>Payment methods:</b>{" "}
                        {!order.paymentMethods
                          ? "After recieve"
                          : order.paymentMethods}
                      </p>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: isSmallScreen ? "row" : "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ width: 145, height: 40, m: 1 }}
                        onClick={() => handleCancel(order._id)}
                        disabled={order.status === "Processing" ? false : true}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={order.status === "Processing" ? true : false}
                        variant="contained"
                        color="primary"
                        sx={{ width: 145, height: 40, m: 1 }}
                        onClick={() => handleDelete(order._id)}
                      >
                        Delete
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

      <Modal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
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
              borderRadius: 1,
            }}
          >
            <Typography variant="h6" id="modal-title" gutterBottom>
              {actionType === "cancel" ? "Cancel Order" : "Delete Order"}
            </Typography>
            <Typography variant="body1" id="modal-description" gutterBottom>
              Are you sure you want to{" "}
              {actionType === "cancel" ? "cancel" : "delete"} this order?
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button onClick={() => setModalOpen(false)} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmAction}
              >
                {actionType === "cancel" ? "Cancel" : "Delete"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default OrderList;
