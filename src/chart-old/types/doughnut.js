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

const data = [
  { id: 1, name: "Group A", value: 400, color: "#4084F4" },
  { id: 2, name: "Group B", value: 300, color: "#FDBB05" },
  { id: 3, name: "Group C", value: 300, color: "#32A953" },
];

export default function DoughnutChartRender() {
  const [activeKeys, setActiveKeys] = useState(data.map((item) => item.id));

  const onMouseMove = (data, index, event) => {
    const target = event?.nativeEvent?.target;
    if (
      target?.parentElement?.attributes?.class?.nodeValue ===
      "recharts-layer recharts-pie-sector"
    ) {
      target.setAttribute("stroke", "#EBEDF1");
      target.setAttribute("stroke-width", "5");
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
            innerRadius={90}
            // paddingAngle={10}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            label
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
          {/* <Legend
            onClick={handleLegendClick}
            verticalAlign="top"
            wrapperStyle={{ lineHeight: "40px" }}
            content={
              <CustomLegend
                activeKeys={activeKeys}
                onClick={handleLegendClick}
              />
            }
          /> */}
        </PieChart>
      </ResponsiveContainer>
    </Wrapper>
  );
}

export const CustomLegend = ({ payload, onClick, activeKeys }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {payload.map((entry, index) => {
        const key = entry.payload.id;
        const isActive = activeKeys.includes(key);

        return (
          <label key={`legend-item-${index}`} style={{ marginRight: 20 }}>
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => onClick(entry)}
            />
            <span
              style={{
                marginLeft: 4,
                textDecoration: isActive ? "none" : "line-through",
                color: entry.color,
              }}
            >
              {entry.value}
            </span>
          </label>
        );
      })}
    </div>
  );
};
