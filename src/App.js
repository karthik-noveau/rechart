import "./App.css";
import { DynamicChart } from "./chart";
import { Recharts } from "./chart-old";
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

  return (
    <>
      <h1 style={{ textAlign: "center", fontWeight: 300, marginTop: "50px" }}>
        Bar
      </h1>
      <div style={{ width: "100%", height: "400px" }}>
        <DynamicChart type="bar" data={generateLargeData(2)} />
      </div>

      <h1 style={{ textAlign: "center", fontWeight: 300, marginTop: "50px" }}>
        StactedBar
      </h1>
      <div style={{ width: "100%", height: "400px" }}>
        <DynamicChart
          type="bar"
          data={generateLargeData(10)}
          enableStacked={true}
        />
      </div>

      <h1 style={{ textAlign: "center", fontWeight: 300, marginTop: "50px" }}>
        100% StactedBar
      </h1>
      <div style={{ width: "100%", height: "400px" }}>
        <DynamicChart
          type="bar"
          data={generateLargeData(10)}
          enableStacked={true}
          enablePercentage={true}
        />
      </div>

      {/* <Recharts /> */}
    </>
  );
}

export default App;
