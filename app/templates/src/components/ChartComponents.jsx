import React from 'react';

// BarChart Component
export const BarChart = ({ data }) => {
  const barHeight = (data / 100) * 100; // Scale data to fit within 100px height
  return (
    <svg width="100" height="100">
      <rect x="10" y={100 - barHeight} width="30" height={barHeight} fill="#4f46e5" />
      <text x="25" y="95" fontSize="12" fill="#000" textAnchor="middle">
        {data}%
      </text>
    </svg>
  );
};

// PieChart Component
export const PieChart = ({ data }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(data / 100) * circumference} ${circumference}`;

  return (
    <svg width="100" height="100">
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="transparent"
        stroke="#e5e7eb"
        strokeWidth="10"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="transparent"
        stroke="#4f46e5"
        strokeWidth="10"
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="55" fontSize="16" fill="#000" textAnchor="middle">
        {data}%
      </text>
    </svg>
  );
};

// LineChart Component
export const LineChart = ({ data }) => {
  const points = [
    { x: 10, y: 90 },
    { x: 30, y: 70 },
    { x: 50, y: 50 },
    { x: 70, y: 30 },
    { x: 90, y: 10 },
  ];

  return (
    <svg width="100" height="100">
      <polyline
        points={points.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke="#4f46e5"
        strokeWidth="2"
      />
      <text x="50" y="95" fontSize="12" fill="#000" textAnchor="middle">
        {data}%
      </text>
    </svg>
  );
};

// DoughnutChart Component
export const DoughnutChart = ({ data }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(data / 100) * circumference} ${circumference}`;

  return (
    <svg width="100" height="100">
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="transparent"
        stroke="#e5e7eb"
        strokeWidth="10"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="transparent"
        stroke="#4f46e5"
        strokeWidth="10"
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="55" fontSize="16" fill="#000" textAnchor="middle">
        {data}%
      </text>
    </svg>
  );
};