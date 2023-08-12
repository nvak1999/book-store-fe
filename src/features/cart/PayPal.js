import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { orderCart } from "./cartSlice";
const initialOptions = {
  clientId:
    "AdVBEDWzOY3ssDDZ7ATs_cmZftJQzzSFQXucE8GdObcEERSC2UFo-j2iaRQhSpP62b4pY8IK-fkfN3Ri",
  currency: "USD",
  intent: "capture",
};

function PayPal({ item, userId, shippingAddress, user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(item);
  const totalAmount = item
    .reduce((sum, book) => sum + book.quantity * book.price, 0)
    .toFixed(2);
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: totalAmount,
          },
        },
      ],
    });
  };

  const onApprove = async (data, actions) => {
    toast.success("Payment was successful!");
    await dispatch(orderCart(userId, item, shippingAddress, "PayPal"));
    await navigate(`/order/${user._id}`);
    return actions.braintree.tokenizePayment(data).then((payload) => {});
  };

  const onError = (error) => {
    toast.error("Payment failed. Please try again.");
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        createOrder={(data, actions) => createOrder(data, actions)}
        onApprove={onApprove}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
}

export default PayPal;
