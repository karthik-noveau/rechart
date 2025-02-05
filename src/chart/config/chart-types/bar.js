import React, { useState, useRef, useMemo } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Label,
  Legend,
  ReferenceLine,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import styles from "../styles.module.css";
import { CHART_SIZE, CHART_COLORS } from "../../constants";
import { CustomLegend, CustomTooltip } from "../utils";

export const BarChartView = ({
  data,
  isStacked,
  enableStacked,
  enablePercentage,
}) => {
  const allkeys = Object.keys(data[0]).filter(
    (key) => key !== "name" && key !== "id"
  );
  const [brushIndex, setBrushIndex] = useState([0, 20]);

  const [activeKeys, setActiveKeys] = useState(allkeys); // Track active bars
  const [hoveredLegend, setHoveredLegend] = useState(null); // Track hovered legend
  const tooltipRef = useRef({ data: null });
  const legendRef = useRef();

  const onMouseMove = (chartData, event) => {
    const target = event?.nativeEvent?.target;
    tooltipRef.current.data = target;
  };

  const transformDataToPercentage = (data) => {
    return data.map((item) => {
      const total = Object.keys(item).reduce((sum, key) => {
        if (key !== "name" && key !== "id") {
          return sum + (item[key] || 0);
        }
        return sum;
      }, 0);

      const newItem = { ...item };
      Object.keys(newItem).forEach((key) => {
        if (key !== "name" && key !== "id") {
          const percentage = total === 0 ? 0 : (newItem[key] / total) * 100;
          newItem[key] = Math.round(percentage * 10) / 10;
        }
      });

      return newItem;
    });
  };

  const transformedData = useMemo(() => {
    if (enablePercentage) {
      return transformDataToPercentage(data);
    }
    return data;
  }, [data, enablePercentage]);

  // Bar shape with hover opacity logic
  const BarShape = (props) => {
    const { fill, dataKey, x, y, width, height } = props;

    let isHoveredKey = hoveredLegend === dataKey;
    let opacity = 1;

    if (hoveredLegend) {
      opacity = isHoveredKey ? 1 : 0.3;
    }

    return (
      <>
        {/* <path
          d={`M${x},${y}h${width}v${height}h${-width}Z`}
          fill={fill}
          opacity={opacity}
          dataKey={dataKey}
          cursor="pointer"
          borderRadius={10}
        /> */}

        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          // rx={10}
          ry={6}
          fill={fill}
          opacity={opacity}
          dataKey={dataKey}
          cursor="pointer"
        />
      </>
    );
  };

  // Toggle visibility of bars based on legend click
  const handleLegendClick = (key) => {
    let list = activeKeys.includes(key)
      ? activeKeys.filter((k) => k !== key)
      : [...activeKeys, key];
    setActiveKeys(list);
    setHoveredLegend(null);
  };

  // Set hovered legend
  const handleLegendHover = (key) => {
    setHoveredLegend(key);
  };

  const CustomCursor = ({ x, y, width, height }) => {
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="rgba(0, 0, 0, 0.02)" // Custom background color with transparency
      />
    );
  };

  return (
    <ResponsiveContainer
      minWidth={CHART_SIZE.MIN_WIDTH}
      minHeight={CHART_SIZE.MIN_HEIGHT}
    >
      <BarChart
        data={transformedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
        onMouseMove={onMouseMove}
        animationDuration={5000}
      >
        <XAxis dataKey="name" height={75} tickLine={{ stroke: "#e6e6e6" }}>
          <Label
            value="Pages of my website"
            offset={20}
            position="insideBottom"
          />
        </XAxis>
        <YAxis offset={0} tickLine={{ stroke: "#e6e6e6" }} />
        <Tooltip
          wrapperClassName={styles.toolTipWrapper}
          animationEasing="linear"
          // isAnimationActive={false}
          animationDuration={300}
          content={(props) => {
            const { payload, label } = props;
            return (
              <CustomTooltip
                payload={payload}
                enablePercentage={enablePercentage}
                label={label}
              />
            );
          }}
          cursor={<CustomCursor />}
        />
        <Legend
          verticalAlign="top"
          wrapperStyle={{ lineHeight: "150px" }}
          content={
            <CustomLegend
              allkeys={allkeys}
              legendRef={legendRef}
              activeKeys={activeKeys}
              onClick={handleLegendClick}
              onHover={handleLegendHover}
            />
          }
        />
        <ReferenceLine y={0} stroke="#000" />
        <CartesianGrid stroke="#e6e6e6" />

        {Object.keys(data[0])
          .filter((key) => key !== "name" && key !== "id")
          .map((key, index) => {
            // Only render the active bars based on legend

            const color = CHART_COLORS[index % CHART_COLORS.length];
            return (
              <Bar
                radius={10}
                key={key}
                id={key}
                dataKey={key}
                strokeWidth={5}
                fill={color}
                hide={!activeKeys.includes(key)}
                // label={{ position: "top" }}
                shape={<BarShape opacity={1} />}
                {...(enableStacked && { stackId: "stacked-bar-chart" })}
              />
            );
          })}
      </BarChart>
    </ResponsiveContainer>
  );
};
