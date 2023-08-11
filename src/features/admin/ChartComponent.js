import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function ChartComponent({ orders }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (orders) {
      const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      const ctx = chartRef.current.getContext("2d");

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(statusCounts),
          datasets: [
            {
              label: "Number of orders",
              data: Object.values(statusCounts),
              backgroundColor: "rgba(252, 174, 174, 0.6)",
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

export default ChartComponent;
