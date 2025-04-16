// GraphChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
} from 'chart.js';

ChartJS.register(LineElement, LinearScale, PointElement, CategoryScale);

const GraphChart = ({ graphData }) => {
  const data = {
    labels: graphData.x,
    datasets: [
      {
        label: 'Graph',
        data: graphData.y,
        fill: false,
        borderColor: '#646cff',
        tension: 0.3,
      },
    ],
  };

  return (
    <div>
      <Line data={data} />
    </div>
  );
};

export default GraphChart;
