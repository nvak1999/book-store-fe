import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Button,
  Modal,
  Backdrop,
  Fade,
  Box,
} from "@mui/material";
import { getAllOrder, updateOrderStatus } from "./adminSlice";
import LoadingScreen from "../../components/LoadingScreen";

function ManagerOrder() {
  const { isLoading, order } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const statusColors = {
    Processing: "#fca903",
    Shipped: "#23cf5f",
    Delivered: "#3498db",
    Returned: "#e74c3c",
    Cancelled: "#bdc3c7",
  };

  useEffect(() => {
    dispatch(getAllOrder());
  }, [dispatch]);

  const [selectedStatusMap, setSelectedStatusMap] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleStatusChange = (event, orderId) => {
    const newStatus = event.target.value;
    setSelectedStatusMap((prevStatusMap) => ({
      ...prevStatusMap,
      [orderId]: newStatus,
    }));

    // Check if the new status is different from the current status
    if (
      order.find((orderItem) => orderItem._id === orderId)?.status !== newStatus
    ) {
      setSelectedOrder(orderId);
      setModalOpen(true);
    } else {
      // If status is the same, reset selectedOrder and close the modal
      setSelectedOrder(null);
      setModalOpen(false);
    }

    console.log("Current Status:", newStatus);
    console.log("Order ID:", orderId);
  };

  const handleCloseModal = () => {
    setSelectedStatusMap({});
    setSelectedOrder(null);
    setModalOpen(false);
  };

  const handleConfirmUpdate = async () => {
    if (selectedOrder) {
      await dispatch(
        updateOrderStatus(selectedOrder, selectedStatusMap[selectedOrder])
      );
    }
    await dispatch(getAllOrder());
    setSelectedOrder(null);
    setModalOpen(false);
  };

  const formatNumber = (number) => {
    const roundedNumber = Math.round(number * 100) / 100;
    return roundedNumber.toFixed(2);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Box flexGrow={1}></Box>
        <LoadingScreen />
      </Box>
    );
  }

  return (
    <div>
      <TableContainer component={Paper} fullWidth>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>User Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                Books
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total Amount</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Shipping Address
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order && order.length > 0 ? (
              order.map((orderItem) => (
                <TableRow key={orderItem._id}>
                  <TableCell>{orderItem.userName}</TableCell>
                  <TableCell>
                    <ul>
                      {orderItem.books.map((book) => (
                        <li key={book._id}>
                          <span style={{ fontWeight: "bold" }}>
                            {book.name}
                          </span>{" "}
                          -{" "}
                          <span style={{ fontWeight: "bold" }}>Quantity:</span>{" "}
                          {book.quantity} -{" "}
                          <span style={{ fontWeight: "bold" }}>Total:</span> $
                          {formatNumber(book.total)}
                        </li>
                      ))}
                    </ul>
                  </TableCell>

                  <TableCell>${formatNumber(orderItem.totalAmount)}</TableCell>
                  <TableCell>{orderItem.shippingAddress}</TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <Select
                        disabled={orderItem.status === "Cancelled"}
                        value={
                          selectedOrder === orderItem._id
                            ? selectedStatusMap[orderItem._id]
                            : orderItem.status
                        }
                        onChange={(event) =>
                          handleStatusChange(event, orderItem._id)
                        }
                        sx={{
                          "& .MuiInputBase-input": {
                            color: statusColors[orderItem.status],
                          },
                          "& .MuiMenuItem-root": {
                            color: statusColors[orderItem.status],
                          },
                          "& .MuiSelect-icon": {
                            color: statusColors[orderItem.status],
                          },
                        }}
                      >
                        <MenuItem
                          value="Processing"
                          style={{ color: statusColors.Processing }}
                        >
                          Processing
                        </MenuItem>
                        <MenuItem
                          value="Shipped"
                          style={{ color: statusColors.Shipped }}
                        >
                          Shipped
                        </MenuItem>
                        <MenuItem
                          value="Delivered"
                          style={{ color: statusColors.Delivered }}
                        >
                          Delivered
                        </MenuItem>
                        <MenuItem
                          value="Returned"
                          style={{ color: statusColors.Returned }}
                        >
                          Returned
                        </MenuItem>
                        <MenuItem
                          value="Cancelled"
                          style={{ color: statusColors.Cancelled }}
                        >
                          Cancelled
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No orders found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={isModalOpen && selectedOrder !== null} // Modal opens only when selectedOrder is not null
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isModalOpen}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 5,
            }}
          >
            <h2>Confirm Update Order</h2>
            <p>Are you sure you want to update this order?</p>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmUpdate}
              >
                Confirm
              </Button>
              <Button variant="outlined" onClick={handleCloseModal}>
                Cancel
              </Button>
            </Box>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default ManagerOrder;
