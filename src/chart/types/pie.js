import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
// import { getCustomSvgDefsPattern } from "../utils/pattern";

import styles from "./styles.module.css";
import { Wrapper } from "../wrapper";
import { darkenColor } from "../utils/pattern";

const data1 = [
  { id: 1, name: "Group A", value: 400, color: "#4084F4" },
  { id: 2, name: "Group B", value: 300, color: "#FDBB05" },
  { id: 3, name: "Group C", value: 300, color: "#32A953" },
  { id: 11, name: "Group A", value: 400, color: "#4084F4" },
  { id: 12, name: "Group B", value: 300, color: "#FDBB05" },
  { id: 31, name: "Group C", value: 300, color: "#32A953" },
];

function generateData(num) {
  const groups = [
    { id: 1, name: "Group A", color: "#4084F4" },
    { id: 2, name: "Group B", color: "#FDBB05" },
    { id: 3, name: "Group C", color: "#32A953" },
  ];

  const data = [];

  for (let i = 1; i <= num; i++) {
    const group = groups[i % groups.length]; // Cycle through the groups
    const value = Math.floor(Math.random() * 500) + 100; // Random value between 100 and 600

    data.push({
      id: i,
      name: group.name,
      value: value,
      color: group.color,
    });
  }

  return data;
}

let data = generateData(100);

export const PieChartRender = () => {
  const [activeKeys, setActiveKeys] = useState(data.map((item) => item.id));

  const onMouseMove = (data, index, event) => {
    const target = event?.nativeEvent?.target;
    if (
      target?.parentElement?.attributes?.class?.nodeValue ===
      "recharts-layer recharts-pie-sector"
    ) {
      target.setAttribute("stroke", "#EBEDF1");
      target.setAttribute("stroke-width", "4");
      target.setAttribute("cursor", "pointer");
    }
  };

  const onClick = (data, index, event) => {
    const target = event?.nativeEvent?.target;
    if (
      target?.parentElement?.attributes?.class?.nodeValue ===
      "recharts-layer recharts-pie-sector"
    ) {
      console.log(target?.parentElement?.attributes);
      target.setAttribute("stroke", "#EBEDF1");
      target.setAttribute("stroke-width", "4");
      target.setAttribute("cursor", "pointer");
      target.setAttribute(
        "fill",
        darkenColor(target?.attributes.fill.nodeValue, 0.2)
      );
    }
  };

  const onMouseLeave = (a, b, event) => {
    const target = event?.nativeEvent?.target;
    if (
      target?.parentElement?.attributes?.class?.nodeValue ===
      "recharts-layer recharts-pie-sector"
    ) {
      target.setAttribute("stroke", "#fff");
      target.removeAttribute("stroke-width");
      target.removeAttribute("stroke-opacity");
    }
  };

  const handleLegendClick = (e) => {
    const key = e.payload.id;
    setActiveKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <Wrapper>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            dataKey="value"
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={130}
            cornerRadius={0}
            // paddingAngle={10}
            animationDuration={1500}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              startAngle,
              endAngle,
              fill,
              payload,
              percent,
              value,
            }) => {
              const RADIAN = Math.PI / 180;
              const sin = Math.sin(-RADIAN * midAngle);
              const cos = Math.cos(-RADIAN * midAngle);
              const sx = cx + (outerRadius + 10) * cos;
              const sy = cy + (outerRadius + 10) * sin;
              const mx = cx + (outerRadius + 30) * cos;
              const my = cy + (outerRadius + 30) * sin;
              const ex = mx + (cos >= 0 ? 1 : -1) * 22;
              const ey = my;
              const textAnchor = cos >= 0 ? "start" : "end";

              return (
                <g>
                  {/* <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                    {payload.name}
                  </text> */}
                  {/* <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                  /> */}
                  {/* <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                  /> */}
                  <path
                    d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
                    stroke={fill}
                    fill="none"
                  />
                  {/* <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" /> */}
                  <text
                    x={ex + (cos >= 0 ? 1 : -1) * 12}
                    y={ey + 5}
                    textAnchor={textAnchor}
                    fill="#333"
                    style={{
                      fontSize: "14px", // Set the font size
                      fontWeight: "400", // Optional: Adjust font weight
                    }}
                  >{`${value}`}</text>
                  {/* <text
                    x={ex + (cos >= 0 ? 1 : -1) * 12}
                    y={ey}
                    dy={18}
                    textAnchor={textAnchor}
                    fill="#999"
                  >
                    {`(Rate ${(percent * 100).toFixed(2)}%)`}
                  </text> */}
                </g>
              );
            }}
          >
            {data.map((entry, index) =>
              activeKeys.includes(entry.id) ? (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className={styles.pieCell}
                />
              ) : (
                <Cell key={`cell-${index}`} fill="transparent" />
              )
            )}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};
