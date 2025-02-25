import "./App.css";
import { DynamicChart } from "./chart";
import { Recharts } from "./chart-old";
import ShortLinePieHideCollisions from "./chart-old/types/pie";
import { DATA_POINT_LABEL_POSITION } from "./chart/constants";
// import { Recharts } from "./chart-old";

function App() {
  const generateLargeData = (num) => {
    const data = [];
    for (let i = 1; i <= num; i++) {
      data.push({
        id: i.toString(),
        name: "Page " + String.fromCharCode((i % 26) + 65),
        uv: Math.floor(Math.random() * 10000),
        pv: Math.floor(Math.random() * 10000),
        amt: Math.floor(Math.random() * 10000),
        // uv1: Math.floor(Math.random() * 10000),
        // pv1: Math.floor(Math.random() * 10000),
        // amt1: Math.floor(Math.random() * 10000),

        // pv2: Math.floor(Math.random() * 10000),
        // amt2: Math.floor(Math.random() * 10000),

        // pv3: Math.floor(Math.random() * 10000),
        // amt3: Math.floor(Math.random() * 10000),
        // uv4: Math.floor(Math.random() * 10000),
        // pv4: Math.floor(Math.random() * 10000),
        // amt4: Math.floor(Math.random() * 10000),
        // uv5: Math.floor(Math.random() * 10000),
        // pv5: Math.floor(Math.random() * 10000),
        // amt5: Math.floor(Math.random() * 10000),
      });
    }

    return data;
  };

  let dataCount = 100;

  return (
    <>
      {/* <h1 style={{ textAlign: "center", fontWeight: 300, marginTop: "50px" }}>
        Bar
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gridTemplateRows: "1fr",
          height: "100vh",
        }}
      >
        <DynamicChart
          type="bar"
          barRadius={8}
          data={[
            {
              name: "india",
              id: "country_4sz",
              laptop: 1200,
            },
            {
              name: "usa",
              id: "pop_9xy",
              pendrive: 5000,
            },
            {
              name: "chinna",
              id: "gdp_2ab",
              mouse: 21400,
            },
            {
              name: "america",
              id: "country_4sz",
              keybord: 1200,
            },
            {
              name: "africa",
              id: "pop_9xy",
              ssd: 140,
            },
            {
              name: "france",
              id: "gdp_2ab",
              hdd: 21400,
            },
          ]}
          enableDataPointLabel={true}
          dataPointLabelPosition={DATA_POINT_LABEL_POSITION.INSIDE_TOP}
        />

        <div style={{ background: "red" }}>builder</div>
      </div>
      <div style={{ width: "100%", height: "400px" }}>
        <DynamicChart type="bar" data={generateLargeData(dataCount)} />
      </div>

      <h1 style={{ textAlign: "center", fontWeight: 300, marginTop: "50px" }}>
        StactedBar
      </h1>
      <div style={{ width: "100%", height: "400px" }}>
        <DynamicChart
          type="bar"
          data={generateLargeData(dataCount)}
          enableStacked={true}
          enableDataPointLabel={true}
          dataPointLabelPosition={DATA_POINT_LABEL_POSITION.OUTSIDE_TOP}
        />
      </div>

      <h1 style={{ textAlign: "center", fontWeight: 300, marginTop: "50px" }}>
        100% StactedBar
      </h1>
      <div style={{ width: "100%", height: "400px" }}>
        <DynamicChart
          type="bar"
          data={generateLargeData(dataCount)}
          enableStacked={true}
          enablePercentage={true}
        />
      </div> */}

      <ShortLinePieHideCollisions />
    </>
  );
}

export default App;
