import { BarChartView } from "./config/chart-types/bar";

export const DynamicChart = ({
  type,
  data,
  enablePercentage,
  enableStacked,
  enableDataPointLabel,
  dataPointLabelPosition,
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
            enableDataPointLabel={enableDataPointLabel}
            dataPointLabelPosition={dataPointLabelPosition}
            isStacked={isStacked}
            enablePercentage={enablePercentage}
            enableStacked={enableStacked}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderChartType()}</>;
};
