import React, { useEffect } from "react";
import { getOrder } from "./orderSlice";
import { useParams } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function OrderList() {
  const dispatch = useDispatch();
  const { userId } = useParams();
  let { orders, isLoading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrder(userId));
  }, [dispatch, userId]);
  useEffect(() => {
    console.log(orders);
  }, [orders]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>User ID</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Shipping Address</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.userId}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.totalAmount}</TableCell>
              <TableCell>{order.shippingAddress}</TableCell>
              <TableCell>{order.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default OrderList;
