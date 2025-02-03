import React, { useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

const generateLargeData = (num) => {
  const colors = [
    "#4CAF50",
    "#FF9800",
    "#2196F3",
    "#FF5722",
    "#9C27B0",
    "#3F51B5",
  ];
  return Array.from({ length: num }, (_, i) => ({
    label: `${String.fromCharCode(65 + (i % 26))} Groupzsdfasdfasfasfas `,
    value: Math.floor(Math.random() * 1000),
    color: colors[i % colors.length],
  }));
};

const data = generateLargeData(1000000);

export default function NivoBarChart() {
  const [range, setRange] = useState([0, 10000]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleZoomChange = (event) => {
    const start = Number(event.target.value);
    setRange([start, start + 10]);
  };

  const CustomTooltip = ({ id, value, color }) => (
    <div
      style={{
        padding: "8px",
        backgroundColor: "white",
        border: `1px solid ${color}`,
        borderRadius: "4px",
        boxShadow: "0px 0px 4px rgba(0,0,0,0.2)",
      }}
    >
      <strong>{id}</strong>: {value}
    </div>
  );

  const CustomBar = (props) => {
    const {
      bar: { x, y, width, height, color, index },
    } = props;

    const patternId = `pattern-${index}`;

    const isHovered = hoveredIndex === index;

    return (
      <g>
        {isHovered && (
          <defs>
            <pattern
              id={patternId}
              width={10}
              height={10}
              patternUnits="userSpaceOnUse"
            >
              <rect width="10" height="10" fill="gray" opacity="0.2" />
              <circle cx="5" cy="5" r="3" fill={color} />
            </pattern>
          </defs>
        )}

        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={isHovered ? `url(#${patternId})` : color}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        />
      </g>
    );
  };

  const getSkippedLabels = (labels) => {
    const totalVisible = range[1] - range[0];
    const skipFactor = Math.ceil(totalVisible / 10); // Show a maximum of 10 labels
    return labels.map((label, index) =>
      index % skipFactor === 0 ? label : ""
    );
  };

  const currentLabels = data.slice(range[0], range[1]).map((d) => d.label);
  const skippedLabels = getSkippedLabels(currentLabels);

  return (
    <div style={{ height: 500 }}>
      <ResponsiveBar
        animate={true}
        data={data.slice(range[0], range[1])}
        keys={["value"]}
        indexBy="label"
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        padding={0.3}
        colors={({ data }) => data.color}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          //   tickRotation: -45,
          legend: "Categories",
          legendPosition: "middle",
          legendOffset: 40,

          format: (_, index) => skippedLabels[index],
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Values",
          legendPosition: "middle",
          legendOffset: -50,
        }}
        enableLabel={false}
        tooltip={CustomTooltip}
        barComponent={CustomBar}
        legends={[
          {
            dataFrom: "keys",
            anchor: "top-right",
            direction: "row",
            itemsSpacing: 5,
            itemWidth: 100,
            itemHeight: 20,
            symbolSize: 20,
          },
        ]}
      />

      <div style={{ marginTop: 20 }}>
        <label>Zoom:</label>
        <input
          type="range"
          min="0"
          max={data.length - 10}
          value={range[0]}
          onChange={handleZoomChange}
        />
      </div>
    </div>
  );
}
