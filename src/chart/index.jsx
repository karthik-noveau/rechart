import { BarChartView } from "./config/chart-types/bar";

export const DynamicChart = ({
  type,
  data,
  enablePercentage,
  enableStacked,
  barRadius,
  isStacked,
}) => {
  const renderChartType = () => {
    switch (type) {
      case "bar":
        return (
          <BarChartView
            data={data}
            barRadius={barRadius}
            isStacked={isStacked}
            enablePercentage={enablePercentage}
            enableStacked={enableStacked}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>{renderChartType()}</div>
  );
};
