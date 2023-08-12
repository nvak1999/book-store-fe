import React, { useState } from "react";
import { TextField } from "@mui/material";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function PayPal() {
  const [amount, setAmount] = useState(1);

  const handleAmountChange = (event) => {
    const newAmount = Math.min(Math.max(event.target.value, 1), 10);
    setAmount(newAmount);
  };

  const initialOptions = {
    clientId:
      "Aby_MmrMmoO3tWOj4yjpwq_nZ2CdKFe6QlJ6vALgVSEtpBIhHCq99F58ovR-iP57u8EPf1jn_qOmt21T",
    currency: "USD",
    intent: "capture",
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount,
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture();
  };

  return (
    <div>
      <h1>PayPal Payment</h1>
      <TextField
        type="number"
        label="Amount ($1 - $10)"
        value={amount}
        onChange={handleAmountChange}
        inputProps={{ min: 1, max: 10 }}
        variant="outlined"
        margin="normal"
      />
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{ layout: "horizontal" }}
          createOrder={createOrder}
          onApprove={onApprove}
        />
      </PayPalScriptProvider>
    </div>
  );
}

export default PayPal;
