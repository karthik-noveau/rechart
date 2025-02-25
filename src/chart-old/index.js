import { AreaChartRender } from "./types/area";
import { BarChartRender as BarLengend } from "./types/bar";
import { Composed } from "./types/composed";
import DoughnutChartRender from "./types/doughnut";
import { LineChartRender } from "./types/line";
// import { PieChartRender } from "./types/pie";
import { ScatterChartRender } from "./types/scatter";
import { StackedBar } from "./types/stacked.bar";

export const Recharts = () => {
  return (
    <>
      {/* <PieChartRender /> */}
      <DoughnutChartRender />
      <BarLengend />
      <StackedBar />
      <Composed />
      <AreaChartRender />
      <LineChartRender />
      <ScatterChartRender />
    </>
  );
};
