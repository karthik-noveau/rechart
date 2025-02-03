import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Wrapper } from "../wrapper";

const data = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
];

export const ScatterChartRender = () => {
  const CustomActiveShape = (props) => {
    const { cx, cy, width, fill } = props;
    let r = width / 2;
    const circlePath = `
      M${cx - r},${cy}
      a${r},${r} 0 1,0 ${2 * r},0
      a${r},${r} 0 1,0 -${2 * r},0
    `;
    return (
      <path
        d={circlePath}
        fill={fill}
        stroke="#0082ff"
        strokeWidth={5}
        strokeOpacity={0.1}
      />
    );
  };

  return (
    <Wrapper>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name="stature" unit="cm" />
          <YAxis type="number" dataKey="y" name="weight" unit="kg" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter
            name="A school"
            data={data}
            fill="#32A953"
            activeShape={CustomActiveShape}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};
