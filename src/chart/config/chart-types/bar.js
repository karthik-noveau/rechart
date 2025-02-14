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
import {
  CHART_SIZE,
  CHART_COLORS,
  DATA_POINT_LABEL_POSITION,
} from "../../constants";
import { CustomLegend, CustomTooltip } from "../utils";

export const BarChartView = ({
  data,
  barRadius = 8,
  enableDataPointLabel = false,
  dataPointLabelPosition,
  enableStacked,
  enablePercentage,
}) => {
  const allkeys = Object.keys(data[0]).filter(
    (key) => key !== "name" && key !== "id"
  );

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
      for (const key of Object.keys(newItem)) {
        if (key !== "name" && key !== "id") {
          const percentage = total === 0 ? 0 : (newItem[key] / total) * 100;
          newItem[key] = Math.round(percentage * 10) / 10;
        }
      }

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
    let topGap = enableStacked
      ? enableStacked && index === totalBars - 1
        ? Math.min(barRadius, 8)
        : 0
      : Math.min(barRadius, 8);

    if (hoveredLegend) {
      opacity = isHoveredKey ? 1 : 0.2;
    }

    const borderRadius = barRadius ? Math.min(barRadius, width / 2) : 0;

    const shouldApplyBorderRadius =
      !enableStacked || (enableStacked && index === totalBars - 1);

    const adjustedY = shouldApplyBorderRadius
      ? y - borderRadius + topGap
      : y + topGap;
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
        L${x + width},${adjustedY + adjustedHeight - stackedBarGap - topGap} 
        L${x},${adjustedY + adjustedHeight - stackedBarGap - topGap} 
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
          // strokeWidth={barRef?.dataKey === dataKey ? 4 : 0}
          // stroke="#E4E7EC"
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

  let addDataPointLabelPosition = {
    ...(enablePercentage && { formatter: (value) => `${value}%` }),
  };

  switch (dataPointLabelPosition) {
    case DATA_POINT_LABEL_POSITION.INSIDE_TOP:
      addDataPointLabelPosition = {
        position: DATA_POINT_LABEL_POSITION.INSIDE_TOP,
        fill: "#fff",
      };
      break;
    case DATA_POINT_LABEL_POSITION.OUTSIDE_TOP:
      addDataPointLabelPosition = {
        position: DATA_POINT_LABEL_POSITION.OUTSIDE_TOP,
        fill: "#374458",
      };
      console.log(dataPointLabelPosition, addDataPointLabelPosition);
      break;
    default:
      addDataPointLabelPosition = null;
  }

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
          width={100}
          color="#545C6B"
          fontSize={14}
          fontWeight={400}
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
        <ReferenceLine y={0} x={0} stroke="#e6e6e6" />
        <CartesianGrid strokeDasharray="5 5" stroke="#e6e6e6" />

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
                {...(enableDataPointLabel && {
                  label: {
                    ...addDataPointLabelPosition,
                    fontSize: 14,
                    offset: 10,
                    fontWeight: 400,
                    zoomAndPan: true,
                  },
                })}
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
        <Brush
          startIndex={0}
          endIndex={4}
          height={20}
          fill="#D6E7FB"
          // y={-1}
          stroke="transparent"
          traveller={({ x, y, width, height }) => {
            const boxX_R = 12;
            const boxY_R = 30;
            const boxX = x + (width - boxX_R) / 2;
            const boxY = y + (height - boxY_R) / 2;

            const lineRightX_R = 0.5;
            const lineRightY_R = 15;
            const lineRightX = x + (width - lineRightX_R) / 2;
            const lineRightY = y + (height - lineRightY_R) / 2;

            const lineLeftX_R = 0.5;
            const lineLeftY_R = 15;
            const lineLeftX = x + (width - lineLeftX_R) / 2;
            const lineLeftY = y + (height - lineLeftY_R) / 2;

            const borderRadius = 2; // Border radius for the rounded corners

            // Path for a rounded rectangle
            const roundedBoxPath = `
              M${boxX + borderRadius},${boxY}
              h${boxX_R - 2 * borderRadius}
              a${borderRadius},${borderRadius} 0 0 1 ${borderRadius},${borderRadius}
              v${boxY_R - 2 * borderRadius}
              a${borderRadius},${borderRadius} 0 0 1 -${borderRadius},${borderRadius}
              h-${boxX_R - 2 * borderRadius}
              a${borderRadius},${borderRadius} 0 0 1 -${borderRadius},-${borderRadius}
              v-${boxY_R - 2 * borderRadius}
              a${borderRadius},${borderRadius} 0 0 1 ${borderRadius},-${borderRadius}
              Z
            `;

            return (
              <g>
                {/* box with rounded corners */}
                <path d={roundedBoxPath} fill="white" stroke="#bababa" />

                {/* line left */}
                <path
                  d={`M${
                    lineLeftX - 2
                  },${lineLeftY}h${lineLeftX_R}v${lineLeftY_R}h-${lineLeftX_R}Z`}
                  fill="white"
                  stroke="#bababa"
                />

                {/* line right */}
                <path
                  d={`M${
                    lineRightX + 2
                  },${lineRightY}h${lineRightX_R}v${lineRightY_R}h-${lineRightX_R}Z`}
                  fill="white"
                  stroke="#bababa"
                />
              </g>
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
