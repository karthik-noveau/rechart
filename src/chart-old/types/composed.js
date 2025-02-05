import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  Brush,
  ReferenceLine,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Label,
  CartesianGrid,
  ComposedChart,
  Line,
} from "recharts";
import { Wrapper } from "../wrapper";
import { darkenColor, getCustomSvgDefsPattern } from "../utils/pattern";

import styles from "./styles.module.css";
import { CustomTick, measureVisibleLabels } from "./measure.labels";
import { CustomLegend } from "../utils";

// Sample data with colors for each bar
const data = [
  { id: "1", name: "Page A", uv: 4000, pv: 2400, amt: 2400, color: "#8884d8" },
  { id: "2", name: "Page B", uv: 3000, pv: 1398, amt: 2210, color: "#82ca9d" },
  { id: "3", name: "Page C", uv: 2000, pv: 9800, amt: 2290, color: "#ffc658" },
  { id: "4", name: "Page D", uv: 2780, pv: 3908, amt: 2000, color: "#d0ed57" },
  { id: "5", name: "Page E", uv: 1890, pv: 4800, amt: 2181, color: "#a4de6c" },
  { id: "6", name: "Page F", uv: 2390, pv: 3800, amt: 2500, color: "#8dd1e1" },
  { id: "7", name: "Page G", uv: 3490, pv: 4300, amt: 2100, color: "#82a6d8" },
  { id: "8", name: "Page A", uv: 4000, pv: 2400, amt: 2400, color: "#8884d8" },
  { id: "9", name: "Page B", uv: 3000, pv: 1398, amt: 2210, color: "#82ca9d" },
  { id: "10", name: "Page C", uv: 2000, pv: 9800, amt: 2290, color: "#ffc658" },
  { id: "11", name: "Page D", uv: 2780, pv: 3908, amt: 2000, color: "#d0ed57" },
  { id: "12", name: "Page E", uv: 1890, pv: 4800, amt: 2181, color: "#a4de6c" },
  { id: "13", name: "Page F", uv: 2390, pv: 3800, amt: 2500, color: "#8dd1e1" },
  { id: "14", name: "Page G", uv: 3490, pv: 4300, amt: 2100, color: "#82a6d8" },
  { id: "15", name: "Page A", uv: 4000, pv: 2400, amt: 2400, color: "#8884d8" },
  { id: "16", name: "Page B", uv: 3000, pv: 1398, amt: 2210, color: "#82ca9d" },
  { id: "17", name: "Page C", uv: 2000, pv: 9800, amt: 2290, color: "#ffc658" },
  { id: "18", name: "Page D", uv: 2780, pv: 3908, amt: 2000, color: "#d0ed57" },
  { id: "19", name: "Page E", uv: 1890, pv: 4800, amt: 2181, color: "#a4de6c" },
  { id: "20", name: "Page F", uv: 2390, pv: 3800, amt: 2500, color: "#8dd1e1" },
  {
    name: "Page GPage GPage GPage G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
    color: "#82a6d8",
  },
];

function generateLargeData(num) {
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
  console.log("dataset :: ", data);
  return data;
}

let largeData = [
  {
    name: "Page GPage GPage GPage G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
    color: "#82a6d8",
  },
  ...generateLargeData(10),
];

export const Composed = () => {
  const allKeys = Object.keys(largeData[0]);
  const [activeKeys, setActiveKeys] = useState(allKeys);

  const onMouseMove = (chartData, event) => {
    const target = event?.nativeEvent?.target;
    // If too many bars, skip heavy DOM ops
    if (largeData.length > 500) return;

    // Ensure it's a bar shape
    if (
      target?.parentElement?.attributes?.class?.nodeValue ===
        "recharts-layer recharts-bar-rectangle" &&
      target.attributes?.fill?.nodeValue
    ) {
      console.log(event);

      let fill = target.attributes.fill.nodeValue;

      let isCurtomPath = target.parentNode.querySelector("#custom-pattern");
      let isDef = target.parentNode.getElementsByTagName("defs");
      if (!isCurtomPath && isDef.length === 0) {
        target.parentNode.appendChild(getCustomSvgDefsPattern(fill));

        const pathElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        pathElement.setAttribute("d", target.attributes.d.nodeValue);
        // pathElement.setAttribute("fill", "url(#custom-pattern)");
        pathElement.setAttribute("fill", fill);
        pathElement.setAttribute("id", "custom-pattern");

        pathElement.setAttribute("stroke", "#EBEDF1");
        pathElement.setAttribute("stroke-width", "4");

        target.parentNode.appendChild(pathElement);
      }
    }

    // // Use the single pattern
  };

  const onMouseLeave = (chartData, index, event) => {
    const target = event?.nativeEvent?.target;
    if (
      target?.parentElement?.attributes?.class?.nodeValue ===
        "recharts-layer recharts-bar-rectangle" &&
      target.attributes?.fill?.nodeValue
    ) {
      console.log(event);

      let customPathNodes = document.querySelectorAll("#custom-pattern");
      let defsNodes = document.querySelectorAll("#custom-pattern-defs");
      if (customPathNodes.length > 0 && defsNodes.length > 0) {
        customPathNodes.forEach((path) => {
          path.remove();
        });
        defsNodes.forEach((defs) => {
          defs.remove();
        });
      }
    }

    target.removeAttribute("stroke");
    target.removeAttribute("stroke-width");
    target.removeAttribute("stroke-opacity");
  };

  const getPath = (x, y, width, height, borderRadius = 6) => {
    const r = Math.min(borderRadius, width / 2); // Ensure radius doesn't exceed half the width
    return `
      M${x + r},${y}
      h${width - 2 * r}
      a${r},${r} 0 0 1 ${r},${r}
      v${height - r}
      h${-width}
      v${-height + r}
      a${r},${r} 0 0 1 ${r},${-r}
      Z
    `;
  };

  const BarShape = (props) => {
    const { fill, x, y, width, height } = props;

    return <path d={getPath(x, y, width, height)} fill={fill} />;
  };

  const CustomCursor = (props) => {
    return null;
  };

  const handleBrushChange = (e) => {
    if (e && e.startIndex !== undefined && e.endIndex !== undefined) {
    }
  };

  const handleLegendClick = (e) => {
    const key = e.dataKey;
    setActiveKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  console.log("rendered");

  const renderTraveller = ({ x, y, width, height }) => {
    return (
      <path
        d={`M${x + width / 2},${y}L${x + width},${y + height / 2}L${
          x + width / 2
        },${y + height}L${x},${y + height / 2}Z`}
        fill="red"
        stroke="none"
      />
    );
  };

  return (
    <Wrapper>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={largeData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 0,
          }}
          isAnimationActive={true}
          // animationBegin={500}
          // animationDuration={2000}
          animationEasing="ease-out"
          // barSize={50}
          barGap={15}
          barCategoryGap="20%"
          onMouseMove={onMouseMove}
        >
          <XAxis
            height={75} // Provide extra space for rotated labels
            dataKey="name"
            tickLine={{
              stroke: "#e6e6e6",
            }}
            // tick={(e) => {
            //   return (
            //     <CustomTick
            //       x={e.payload.coordinate}
            //       y={e.y}
            //       payload={e.payload}
            //     />
            //   );
            // }}
            // <tspan x="201.13636363636363" dy="0.71em">Page C</tspan>
          >
            <Label
              value="Pages of my website"
              offset={20}
              position="insideBottom"
            />
          </XAxis>
          <YAxis
            offset={0}
            tickLine={{
              stroke: "#e6e6e6",
            }}
            // scale="log"
            // domain={["auto", "auto"]}
          >
            <Label
              value="pv of page"
              angle={-90}
              offset={10}
              position="left"
              textAnchor="middle"
            />
          </YAxis>

          <Tooltip
            content={({ label }) => {
              return <div className={styles.tooltip}>{label}</div>;
            }}
            cursor={<CustomCursor />}
          />
          <Legend
            onClick={handleLegendClick}
            verticalAlign="top"
            wrapperStyle={{ lineHeight: "150px" }}
            content={
              <CustomLegend
                activeKeys={activeKeys}
                onClick={handleLegendClick}
              />
            }
          />
          <ReferenceLine y={0} stroke="#000" />
          <Brush
            // x={100}
            // y={50}
            // width={400}
            dataKey="name"
            height={20}
            stroke="#4084F4"
            onChange={handleBrushChange}
            // traveller={renderTraveller}
          />
          <CartesianGrid stroke="#e6e6e6" />

          <Bar
            dataKey="uv"
            hide={!activeKeys.includes("uv")}
            onMouseLeave={onMouseLeave}
            shape={<BarShape />}
            strokeWidth={5}
            id="bar-bar"
            fill="#32A953"
            label={{ position: "top" }}
            stackId="a"
          ></Bar>

          <Line type="monotone" dataKey="uv" stroke="#4084F4" />
        </ComposedChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};
