import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { Wrapper } from "../wrapper";

function generateLargeData(num = 1000) {
  const baseData = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  ];

  const data = [];
  for (let i = 0; i < num; i++) {
    const pageIndex = i % baseData.length; // To cycle through the base data
    const baseEntry = baseData[pageIndex];
    data.push({
      name: `${baseEntry.name} ${i + 1}`, // Unique name for each entry
      uv: baseEntry.uv + Math.floor(Math.random() * 500), // Randomized uv
      pv: baseEntry.pv + Math.floor(Math.random() * 2000), // Randomized pv
      amt: baseEntry.amt + Math.floor(Math.random() * 1000), // Randomized amt
    });
  }
  return data;
}

// Generate 1000 data points
const largeData = generateLargeData(1000);
export const AreaChartRender = () => {
  const CustomActiveDot = (props) => {
    const { cx, cy, r = 4 } = props;
    const outerRadius = r;
    const innerRadius = r / 2;

    return (
      <g>
        {/* Outer gray stroke with 0.1 opacity */}
        <circle
          cx={cx}
          cy={cy}
          r={outerRadius}
          fill="none"
          stroke="gray"
          strokeWidth={3}
          strokeOpacity={0.1}
        />
        {/* Innermost circle = white fill */}
        <circle cx={cx} cy={cy} r={innerRadius} fill="white" />
      </g>
    );
  };

  return (
    <Wrapper>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={largeData }
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="uv"
            stroke="#4084F4"
            strokeWidth={2}
            fill="#4084F4"
            dot={{
              fill: "white",
              stroke: "#4084F4",
              strokeWidth: 2,
            }}
            activeDot={<CustomActiveDot stroke="#82ca9d" />}
          />
          <Brush dataKey="name" height={20} stroke="#4084F4" />
        </AreaChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};
