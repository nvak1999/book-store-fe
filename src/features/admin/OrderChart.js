import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrder } from "./adminSlice";
import ChartComponent from "./ChartComponent";
import LoadingScreen from "../../components/LoadingScreen";
import { Box, Typography } from "@mui/material";
import MonthlyOrdersChart from "./MonthlyOrdersChart";

function OrderChart() {
  const { isLoading, order } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrder());
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isLoading ? (
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
      ) : (
        <Box
          sx={{
            width: "750px",
          }}
        >
          <Box textAlign="center" marginTop="50px">
            <Typography
              sx={{ m: 2, fontSize: "24px" }}
              variant="subtitle1"
              component="div"
            >
              ORDER STATUS
            </Typography>
            <ChartComponent orders={order} />
          </Box>
          <Box textAlign="center" marginTop="50px" marginBottom={5}>
            <Typography
              sx={{ m: 2, fontSize: "24px" }}
              variant="subtitle1"
              component="div"
            >
              NUMBER OF ORDER IN THE YEAR
            </Typography>
            <MonthlyOrdersChart orders={order} />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default OrderChart;
