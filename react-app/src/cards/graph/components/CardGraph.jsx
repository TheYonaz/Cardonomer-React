import React from "react";
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js";
import {
  CategoryScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LinearScale,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const CardGraph = ({ card }) => {
  if (!card || !card.cardmarket || !card.cardmarket.prices) {
    return <p>Error loading graph data.</p>;
  }
  const options = {
    scales: {
      y: {
        ticks: {
          callback: function (value, index, values) {
            return "$" + value;
          },
        },
      },
    },
  };
  const prices = card.cardmarket.prices;
  // Get all keys but exclude the last five
  const keys = Object.keys(prices).slice(0, -5);

  // Mock data spread over 5 years
  const generateData = (key) => {
    const base = prices[key];
    return Array.from(
      { length: 60 },
      (_, i) => base + base * (Math.random() - 0.5) * 0.2
    );
  };

  const data = {
    labels: Array.from({ length: 60 }, (_, i) =>
      new Date(
        new Date().getFullYear() - 5 + Math.floor(i / 12),
        i % 12
      ).toLocaleDateString("default", { year: "numeric", month: "short" })
    ),
    datasets: keys.map((key) => ({
      label: key,
      data: generateData(key),
      borderColor: "#" + Math.floor(Math.random() * 16777215).toString(16), // Random color
      fill: false,
    })),
  };

  return <Line data={data} options={options} />;
};

export default CardGraph;
