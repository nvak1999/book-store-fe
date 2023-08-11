// MonthlyOrdersChart.js
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function MonthlyOrdersChart({ orders }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (orders) {
      const monthlyOrderCounts = {};

      orders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const monthYear = orderDate.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
        });

        if (!monthlyOrderCounts[monthYear]) {
          monthlyOrderCounts[monthYear] = 0;
        }

        monthlyOrderCounts[monthYear]++;
      });

      const ctx = chartRef.current.getContext("2d");

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(monthlyOrderCounts),
          datasets: [
            {
              label: "Number of Orders",
              data: Object.values(monthlyOrderCounts),
              backgroundColor: "rgba(255, 137, 137, 0.6)",
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => value.toString(),
              },
            },
          },
        },
      });
    }
  }, [orders]);

  return <canvas ref={chartRef} width="150" height="75"></canvas>;
}

export default MonthlyOrdersChart;
