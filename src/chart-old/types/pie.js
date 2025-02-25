// import React from "react";
// import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

// function generateData(num) {
//   const groups = [
//     { id: 1, name: "Group A", color: "#4084F4" },
//     { id: 2, name: "Group B", color: "#FDBB05" },
//     { id: 3, name: "Group C", color: "#32A953" },
//   ];

//   const data = [];

//   for (let i = 1; i <= num; i++) {
//     const group = groups[i % groups.length]; // Cycle through the groups
//     const value = Math.floor(Math.random() * 500) + 100; // Random value between 100 and 600

//     data.push({
//       id: i,
//       name: group.name,
//       value: value,
//       color: group.color,
//     });
//   }

//   return data;
// }

// let data = generateData(120);

// export default function PieChartRender() {
//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "400px",
//         marginBottom: "50px",
//         border: "1.5px solid #2196f3ab",
//         background: "white",
//         borderRadius: "12px",
//       }}
//     >
//       <ResponsiveContainer>
//         <PieChart>
//           <Pie
//             dataKey="value"
//             data={data}
//             cx="50%"
//             cy="50%"
//             outerRadius={130}
//             cornerRadius={0}
//             animationDuration={1500}
//             label={({
//               cx,
//               cy,
//               midAngle,
//               innerRadius,
//               outerRadius,
//               startAngle,
//               endAngle,
//               fill,
//               payload,
//               percent,
//               value,
//             }) => {
//               const RADIAN = Math.PI / 180;
//               const sin = Math.sin(-RADIAN * midAngle);
//               const cos = Math.cos(-RADIAN * midAngle);
//               const sx = cx + (outerRadius + 10) * cos;
//               const sy = cy + (outerRadius + 10) * sin;
//               const mx = cx + (outerRadius + 30) * cos;
//               const my = cy + (outerRadius + 30) * sin;
//               const ex = mx + (cos >= 0 ? 1 : -1) * 22;
//               const ey = my;
//               const textAnchor = cos >= 0 ? "start" : "end";

//               return (
//                 <g>
//                   <path
//                     d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
//                     stroke={fill}
//                     fill="none"
//                   />
//                   <text
//                     x={ex + (cos >= 0 ? 1 : -1) * 12}
//                     y={ey + 5}
//                     textAnchor={textAnchor}
//                     fill="#333"
//                     style={{
//                       fontSize: "14px",
//                       fontWeight: "400",
//                     }}
//                   >{`${value}`}</text>
//                 </g>
//               );
//             }}
//           >
//             {data.map((entry, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={entry.color}
//               />
//             ))}
//           </Pie>
//           <Tooltip />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// import React, { useMemo } from "react";
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
// import { PIE_DATA } from "./data";

// /** Example data generator: returns all slices without merging */
// function generateData(numSlices) {
//   const categories = [
//     { name: "Direct", color: "#4084F4" },
//     { name: "Email", color: "#FDBB05" },
//     { name: "Union Ads", color: "#32A953" },
//     { name: "Video Ads", color: "#FF8042" },
//     { name: "Search Engine", color: "#8884d8" },
//   ];
//   const data = [];
//   for (let i = 0; i < numSlices; i++) {
//     const cat = categories[i % categories.length];
//     const value = 50 + Math.floor(Math.random() * 500);
//     data.push({
//       id: i + 1,
//       name: cat.name,
//       value,
//       color: cat.color,
//     });
//   }
//   return data;
// }

// /**
//  * Builds a two‐segment “eCharts‐like” label layout for each slice:
//  *  - An angled line from the pie edge
//  *  - Then a horizontal line for the label
//  *  - Basic collision detection: if two labels on the same side overlap,
//  *    we push one’s horizontal line outward
//  */
// function buildEchartsLikeLayout(pieData, cx, cy, outerRadius, chartHeight) {
//   const total = pieData.reduce((sum, d) => sum + d.value, 0);
//   let currentAngle = 0;

//   // 1) Convert each slice into geometry: midAngle, side, line segments
//   const slices = pieData.map((slice) => {
//     const sliceAngle = (slice.value / total) * 360;
//     const midAngle = currentAngle + sliceAngle / 2;
//     currentAngle += sliceAngle;

//     // negative for standard math orientation
//     const rad = (-midAngle * Math.PI) / 180;
//     const cos = Math.cos(rad);
//     const sin = Math.sin(rad);

//     const side = cos >= 0 ? "right" : "left";

//     // The angled segment from pie edge:
//     const line1Length = 15; // angled segment
//     const startX = cx + outerRadius * cos;
//     const startY = cy + outerRadius * sin;
//     const midX = startX + line1Length * cos;
//     const midY = startY + line1Length * sin;

//     // The horizontal segment:
//     const line2Length = 30; // initial guess
//     const finalX = side === "right" ? midX + line2Length : midX - line2Length;
//     const finalY = midY; // same Y

//     return {
//       id: slice.id,
//       name: slice.name,
//       value: slice.value,
//       color: slice.color,
//       side,
//       midAngle,
//       startX,
//       startY,
//       midX,
//       midY,
//       finalX,
//       finalY,
//     };
//   });

//   // 2) Separate left vs right, sort by finalY ascending
//   const left = slices
//     .filter((d) => d.side === "left")
//     .sort((a, b) => a.finalY - b.finalY);
//   const right = slices
//     .filter((d) => d.side === "right")
//     .sort((a, b) => a.finalY - b.finalY);

//   // 3) Basic collision pass: if two labels are too close vertically, push one’s horizontal line out
//   const passes = 10;
//   const minGap = 16; // minimal vertical gap

//   function fixCollisions(list) {
//     for (let pass = 0; pass < passes; pass++) {
//       let anyCollision = false;
//       for (let i = 0; i < list.length; i++) {
//         for (let j = i + 1; j < list.length; j++) {
//           const dy = list[j].finalY - list[i].finalY;
//           if (dy >= 0 && dy < minGap) {
//             anyCollision = true;
//             const overlap = (minGap - dy) / 2;
//             // push j outward horizontally
//             if (list[i].side === "right") {
//               list[j].finalX += overlap; // further right
//             } else {
//               list[j].finalX -= overlap; // further left
//             }
//             // also nudge j’s finalY a bit so they don’t remain stacked
//             list[j].finalY += overlap * 0.1;
//           }
//         }
//       }
//       if (!anyCollision) break;
//     }
//   }

//   fixCollisions(left);
//   fixCollisions(right);

//   // 4) Ensure labels stay within chart height
//   const minY = 20; // Minimum Y position (top padding)
//   const maxY = chartHeight - 20; // Maximum Y position (bottom padding)

//   const constrainedLabels = [...left, ...right].map((label) => {
//     return {
//       ...label,
//       finalY: Math.min(Math.max(label.finalY, minY), maxY),
//     };
//   });

//   return constrainedLabels;
// }

// export default function PieChartEchartsStyleAllSlices() {
//   // 1) Generate data with no merging
//   const data = useMemo(() => PIE_DATA, []);

//   // 2) Define geometry
//   const chartWidth = 900;
//   const chartHeight = 900;
//   const cx = chartWidth / 2; // 350
//   const cy = chartHeight / 2; // 200
//   const outerRadius = 100;

//   // 3) Build layout
//   const labelLayout = useMemo(() => {
//     return buildEchartsLikeLayout(data, cx, cy, outerRadius, chartHeight);
//   }, [cx, cy, data, chartHeight]);

//   return (
//     <div
//       style={{
//         width: chartWidth,
//         height: chartHeight,
//         border: "1px solid #999",
//       }}
//     >
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart>
//           <Pie
//             data={data}
//             dataKey="value"
//             cx={cx}
//             cy={cy}
//             outerRadius={outerRadius}
//             isAnimationActive={false}
//             isUpdateAnimationActive={true}
//             legendType="circle"
//             paddingAngle={1}
//             minAngle={1}
//             labelLine={({
//               cx,
//               cy,
//               midAngle,
//               innerRadius,
//               outerRadius,
//               value,
//               color,
//               startAngle,
//               endAngle,
//             }) => {
//               const RADIAN = Math.PI / 180;
//               const diffAngle = endAngle - startAngle;
//               const delta = (360 - diffAngle) / 15 - 1;
//               const radius = innerRadius + (outerRadius - innerRadius);
//               const x = cx + (radius + delta) * Math.cos(-midAngle * RADIAN);
//               const y =
//                 cy + (radius + delta * delta) * Math.sin(-midAngle * RADIAN);
//               return (
//                 <text
//                   x={x}
//                   y={y}
//                   fill={color}
//                   textAnchor={x > cx ? "start" : "end"}
//                   dominantBaseline="central"
//                   fontWeight="normal"
//                 >
//                   {value}
//                 </text>
//               );
//             }}
//             label={(props) => {
//               let {
//                 cx,
//                 cy,
//                 midAngle,
//                 innerRadius,
//                 outerRadius,
//                 color,
//                 startAngle,
//                 endAngle,
//               } = props;
//               const RADIAN = Math.PI / 180;
//               const diffAngle = endAngle - startAngle;
//               const radius = innerRadius + (outerRadius - innerRadius);
//               let path = "";
//               for (let i = 0; i < (360 - diffAngle) / 15; i++) {
//                 path += `${cx + (radius + i) * Math.cos(-midAngle * RADIAN)},${
//                   cy + (radius + i * i) * Math.sin(-midAngle * RADIAN)
//                 } `;
//               }
//               return <polyline points={path} stroke={color} fill="none" />;
//             }}
//           >
//             {data.map((slice, idx) => (
//               <Cell key={idx} fill={slice.color} />
//             ))}
//           </Pie>
//           <Tooltip
//             formatter={(val, name, entry) => {
//               return `${entry.payload.name} : ${val}`;
//             }}
//           />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

import React, { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

/** For demonstration, generate random slices with different colors */
function generateData(numSlices) {
  const categories = [
    { name: "Direct", color: "#4084F4" },
    { name: "Email", color: "#FDBB05" },
    { name: "Union Ads", color: "#32A953" },
    { name: "Video Ads", color: "#FF8042" },
    { name: "Search Engine", color: "#8884d8" },
  ];
  const data = [];
  for (let i = 0; i < numSlices; i++) {
    const cat = categories[i % categories.length];
    const value = 30 + Math.floor(Math.random() * 300);
    data.push({
      id: i + 1,
      name: cat.name,
      value,
      color: cat.color,
    });
  }
  return data;
}

/**
 * A short two‐segment label line:
 *  - Segment1: short angled line from pie edge
 *  - Segment2: short horizontal line for label
 */
function buildShortLinesLayout(slices, cx, cy, outerRadius) {
  const total = slices.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;

  return slices.map((slice) => {
    const sliceAngle = (slice.value / total) * 360;
    const midAngle = currentAngle + sliceAngle / 2;
    currentAngle += sliceAngle;

    const rad = (-midAngle * Math.PI) / 180; // Recharts rotates clockwise
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // segment1: angled line
    const line1Len = 20;
    const startX = cx + outerRadius * cos;
    const startY = cy + outerRadius * sin;
    const midX = startX + line1Len * cos;
    const midY = startY + line1Len * sin;

    // segment2: short horizontal line
    const line2Len = 30;
    // if cos>=0 => right side, else left
    const finalX = cos >= 0 ? midX + line2Len : midX - line2Len;
    const finalY = midY;

    return {
      id: slice.id,
      name: slice.name,
      value: slice.value,
      color: slice.color,
      // geometry
      startX,
      startY,
      midX,
      midY,
      position: cos >= 0 ? "right" : "left",
      finalX,
      finalY,
    };
  });
}

/**
 * Detect collisions: if two label texts overlap, we hide one.
 * We'll store bounding boxes around the label text to check.
 */
function hideCollidingLabels(labels, fontSize = 12) {
  const hidden = new Set();

  // A small helper to get bounding box around label text
  // We'll approximate the text width from `label.name.length * 6` or so
  function getBBox(label) {
    const textWidth = label.name.length * (fontSize * 0.6);
    const x1 = Math.min(label.finalX, label.finalX + textWidth);
    const x2 = Math.max(label.finalX, label.finalX + textWidth);
    const y1 = label.finalY - fontSize; // approx top
    const y2 = label.finalY; // bottom
    return { x1, y1, x2, y2 };
  }

  // A helper to see if two bounding boxes overlap
  function boxesOverlap(a, b) {
    return !(b.x1 > a.x2 || b.x2 < a.x1 || b.y1 > a.y2 || b.y2 < a.y1);
  }

  // We'll do a simple pass: for each pair, if they collide, hide the second
  for (let i = 0; i < labels.length; i++) {
    const A = labels[i];
    if (hidden.has(A.id)) continue;

    const boxA = getBBox(A);
    for (let j = i + 1; j < labels.length; j++) {
      const B = labels[j];
      if (hidden.has(B.id)) continue;

      const boxB = getBBox(B);
      if (boxesOverlap(boxA, boxB)) {
        // Hide B
        hidden.add(B.id);
      }
    }
  }
  return hidden;
}

export default function ShortLinePieHideCollisions() {
  // Generate random data
  const [data] = useState(() => generateData(100));

  // Chart geometry
  const chartWidth = 900;
  const chartHeight = 900;
  const cx = chartWidth / 2;
  const cy = chartHeight / 2;
  const outerRadius = 200;

  // Build geometry for label lines
  const labelLayout = useMemo(() => {
    return buildShortLinesLayout(data, cx, cy, outerRadius);
  }, [data]);

  // Figure out which labels collide and should be hidden
  const hiddenIDs = useMemo(() => {
    return hideCollidingLabels(labelLayout);
  }, [labelLayout]);

  return (
    <div
      style={{
        width: chartWidth,
        height: chartHeight,
        border: "1px solid #ccc",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={outerRadius}
            isAnimationActive={true}
            animationDuration={500}
            animationEasing="linear"
            labelLine={false}
            label={(pieProps) => {
              const lbl = labelLayout.find((d) => d.id === pieProps.payload.id);
              if (!lbl) return null;

              // If this label was hidden due to collision, skip rendering
              if (hiddenIDs.has(lbl.id)) {
                return null;
              }

              // Draw the path
              const path = `M${lbl.startX},${lbl.startY}
                            L${lbl.midX + 2},${lbl.midY}
                            L${lbl.finalX},${lbl.finalY}`;

              // Decide text anchor
              const anchor = lbl.finalX > cx ? "start" : "end";

              return (
                <g>
                  <path d={path} stroke={lbl.color} fill="none" />
                  <text
                    x={
                      lbl.position === "left" ? lbl.finalX - 5 : lbl.finalX + 5
                    }
                    y={lbl.finalY}
                    textAnchor={anchor}
                    fontSize={12}
                    fill="#333"
                    dy={4}
                  >
                    {lbl.name}
                  </text>
                </g>
              );
            }}
          >
            {data.map((slice, idx) => (
              <Cell key={idx} fill={slice.color} />
            ))}
          </Pie>

          <Tooltip
            formatter={(val, name, entry) => `${entry.payload.name}: ${val}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
