import React, { useState } from "react";
import {
  BarChart,
  Bar,
  Brush,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Label,
} from "recharts";
import { Wrapper } from "../wrapper";
import styles from "./styles.module.css";

// Sample data generation
const generateLargeData = (num) => {
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#d0ed57",
    "#a4de6c",
    "#8dd1e1",
    "#82a6d8",
  ];

  const data = [];
  for (let i = 1; i <= num; i++) {
    data.push({
      id: i.toString(),
      name: "Page " + String.fromCharCode((i % 26) + 65),
      uv: Math.floor(Math.random() * 10000),
      pv: Math.floor(Math.random() * 10000),
      amt: Math.floor(Math.random() * 10000),
      color: colors[i % colors.length],
    });
  }
  return data;
};

// Generate data
const largeData = [
  {
    name: "Page GPage GPage GPage G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
    color: "#82a6d8",
  },
  ...generateLargeData(10000),
];

export const BarChartRender = () => {
  const [brushIndex, setBrushIndex] = useState([0, 20]);

  // Handle brush change
  const handleBrushChange = (e) => {
    if (e && e.startIndex !== undefined && e.endIndex !== undefined) {
      // Fixed brush size: Ensuring the brush size is always 10 data points
      const range = 20;
      const startIndex = Math.max(0, e.startIndex);
      const endIndex = Math.min(startIndex + range, largeData.length);

      console.log([startIndex, endIndex]);
      // Update brush start and end indices to move the brush while keeping size fixed
      setBrushIndex([startIndex, endIndex]);
    }
  };

  // Custom shape for bars
  const BarShape = (props) => {
    const { fill, x, y, width, height, opacity } = props;
    return (
      <path
        d={`M${x},${y}h${width}v${height}h${-width}Z`}
        fill={fill}
        opacity={opacity}
        cursor="pointer"
      />
    );
  };

  const CustomCursor = (props) => {
    return null;
  };

  return (
    <Wrapper>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={largeData}
          margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
        >
          <XAxis dataKey="name" height={75} tickLine={{ stroke: "#e6e6e6" }}>
            <Label
              value="Pages of my website"
              offset={20}
              position="insideBottom"
            />
          </XAxis>
          <YAxis offset={0} tickLine={{ stroke: "#e6e6e6" }} />
          <Tooltip cursor={<CustomCursor />} />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
          <Brush
            className={styles.brush}
            dataKey="name"
            height={30}
            stroke="#4084F4"
            onChange={handleBrushChange}
            startIndex={brushIndex[0]}
            endIndex={brushIndex[1]}
            travellerWidth={5} // Control the width of the moving brush area
            minWidth={20} // Ensure the brush cannot shrink
            maxWidth={20} // Keep the brush size fixed at 20
            // tickFormatter={() => {
            //   return null;
            // }}
            traveller={({ x, y, width, height }) => {
              const bgRectX = x + (width - 7) / 2;
              const bgRectY = y + (height - 40) / 2;

              const lineRectX = x + (width - 1) / 2;
              const lineRectY = y + (height - 30) / 2;

              const boxRectX = x + (width - 4) / 2;
              const boxRectY = y + (height - 12) / 2;

              return (
                <g>
                  {/* <path
                    d={`M${lineRectX},${lineRectY}h1v30h-1Z`}
                    fill="rgb(172,184,209)"
                    stroke="none"
                  /> */}
                  <path
                    d={`M${bgRectX},${bgRectY}h7v40h-7Z`}
                    fill="white"
                    stroke="#4084F4"
                  />

                  {/* <path
                    d={`M${boxRectX},${boxRectY}h4v12h-4Z`}
                    fill="white"
                    strokeWidth={0.5}
                    stroke="rgb(172,184,209)"
                  /> */}
                </g>
              );
            }}
          />
          <CartesianGrid stroke="#e6e6e6" />
          <Bar
            dataKey="uv"
            strokeWidth={5}
            fill="#4084F4"
            label={{ position: "top" }}
            shape={<BarShape opacity={1} />}
          />
          <Bar
            dataKey="pv"
            strokeWidth={5}
            fill="#32A953"
            label={{ position: "insideTop" }}
            shape={<BarShape opacity={1} />}
          />
        </BarChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};
