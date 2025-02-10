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
  Brush,
} from "recharts";

import styles from "../styles.module.css";
import { CHART_SIZE, CHART_COLORS } from "../../constants";
import { CustomLegend, CustomTooltip } from "../utils";

export const BarChartView = ({
  data,
  barRadius = null,
  enableStacked,
  enablePercentage,
}) => {
  const allkeys = Object.keys(data[0]).filter(
    (key) => key !== "name" && key !== "id"
  );
  const [brushIndex, setBrushIndex] = useState([0, 1]);

  const [activeKeys, setActiveKeys] = useState(allkeys);
  const [hoveredLegend, setHoveredLegend] = useState(null);

  const tooltipRef = useRef({ data: null });
  const legendRef = useRef();
  const barRef = useRef();

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

  const BarShape = (props, f, d) => {
    const { fill, dataKey, x, y, width, height, index, totalBars, payload } =
      props;

    let isHoveredKey = hoveredLegend === dataKey;
    let opacity = 1;

    let stackedBarGap = 2;

    if (hoveredLegend) {
      opacity = isHoveredKey ? 1 : 0.2;
    }

    const borderRadius = barRadius ? Math.min(barRadius, width / 2) : 5;

    const shouldApplyBorderRadius =
      !enableStacked || (enableStacked && index === totalBars - 1);

    const adjustedY = shouldApplyBorderRadius ? y - borderRadius : y;
    const adjustedHeight = shouldApplyBorderRadius
      ? height + borderRadius
      : height;

    // SVG path for the bar with rounded top corners
    const path = `
        M${x},${adjustedY + (shouldApplyBorderRadius ? borderRadius : 0)} 
        Q${x},${adjustedY} ${
      x + (shouldApplyBorderRadius ? borderRadius : 0)
    },${adjustedY} 
        L${
          x + width - (shouldApplyBorderRadius ? borderRadius : 0)
        },${adjustedY} 
        Q${x + width},${adjustedY} ${x + width},${
      adjustedY + (shouldApplyBorderRadius ? borderRadius : 0)
    } 
        L${x + width},${adjustedY + adjustedHeight - stackedBarGap} 
        L${x},${adjustedY + adjustedHeight - stackedBarGap} 
        Z
      `;

    return (
      <>
        <path
          onClick={() => {
            alert(`${dataKey} :  ${payload[dataKey]}`);
          }}
          d={path}
          fill={fill}
          opacity={opacity}
          dataKey={dataKey}
          cursor="pointer"
          strokeWidth={barRef?.dataKey === dataKey ? 4 : 0}
          stroke="#E4E7EC"
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
        fill="rgba(15, 22, 36, 0.03)" // Custom background color with transparency
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
        // barGap="20%"
        // barCategoryGap="20%"
        // outerRadius="10px"
      >
        <XAxis
          dataKey="name"
          height={75}
          dy={10}
          tickLine={{ stroke: "#e6e6e6" }}
          offset={20}
          fontSize={14}
          fontWeight={400}
          color="#374458"
        >
          <Label
            value="Pages of my website"
            offset={20}
            position="insideBottom"
            color="#545C6B"
            fontSize={14}
            fontWeight={400}
          />
        </XAxis>
        <YAxis
          dx={-8}
          tickLine={{ stroke: "#e6e6e6" }}
          fontSize={14}
          width={100}
          fontWeight={400}
          color="#374458"
        />
        <Tooltip
          wrapperClassName={styles.toolTipWrapper}
          animationEasing="linear"
          animationDuration={200}
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
                key={key}
                id={key}
                dataKey={key}
                radius={1.9}
                strokeWidth={5}
                fill={color}
                hide={!activeKeys.includes(key)}
                label={{ position: "top" }}
                shape={
                  <BarShape
                    opacity={1}
                    enableStacked={enableStacked}
                    index={index}
                    totalBars={allkeys.length}
                  />
                }
                {...(enableStacked && { stackId: "stacked-bar-chart" })}
              />
            );
          })}
        <Brush startIndex={0} endIndex={1} />
      </BarChart>
    </ResponsiveContainer>
  );
};
