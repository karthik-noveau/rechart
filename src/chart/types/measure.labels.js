// // measureVisibleLabels.js

// export function measureVisibleLabels(visibleData) {
//   if (!visibleData || visibleData.length === 0) {
//     return { rotateAll: false, truncatedMap: {} };
//   }

//   const THRESHOLD_UNROTATED = 80; // max width in px for unrotated
//   const THRESHOLD_ROTATED = 60; // max width in px for rotated text
//   const FONT_SIZE = 12; // match your chart's font
//   const FONT_FAMILY = "sans-serif";
//   const ROTATE_ANGLE = -45;

//   // Create hidden <svg> for measuring
//   const svgNS = "http://www.w3.org/2000/svg";
//   const hiddenSvg = document.createElementNS(svgNS, "svg");
//   hiddenSvg.setAttribute("width", "0");
//   hiddenSvg.setAttribute("height", "0");
//   hiddenSvg.style.position = "absolute";
//   hiddenSvg.style.left = "-9999px";
//   document.body.appendChild(hiddenSvg);

//   function measureTextWidth(textValue, rotate = false) {
//     const textNode = document.createElementNS(svgNS, "text");
//     textNode.setAttribute("font-size", FONT_SIZE);
//     textNode.setAttribute("font-family", FONT_FAMILY);
//     textNode.textContent = textValue;

//     if (rotate) {
//       // rotate around (0,0) - approximate
//       textNode.setAttribute("transform", `rotate(${ROTATE_ANGLE})`);
//     }

//     hiddenSvg.appendChild(textNode);
//     const { width } = textNode.getBBox();
//     hiddenSvg.removeChild(textNode);
//     return width;
//   }

//   // 1) Check unrotated widths
//   let rotateAll = false;
//   const widths = visibleData.map((item) => {
//     const label = `${item.name || ""}`;
//     const w = measureTextWidth(label, false);
//     if (w > THRESHOLD_UNROTATED) {
//       rotateAll = true;
//     }
//     return { label, unrotatedWidth: w };
//   });

//   // 2) If any label is too wide, we decide to rotate all
//   //    Then measure rotated widths & see if truncation is needed
//   const truncatedMap = {}; // label -> truncated text

//   if (rotateAll) {
//     widths.forEach((obj) => {
//       const rotatedW = measureTextWidth(obj.label, true);
//       if (rotatedW <= THRESHOLD_ROTATED) {
//         // fits after rotation, no truncation needed
//         truncatedMap[obj.label] = obj.label;
//       } else {
//         // Needs truncation
//         truncatedMap[obj.label] = truncateLabel(
//           obj.label,
//           measureTextWidth,
//           THRESHOLD_ROTATED
//         );
//       }
//     });
//   } else {
//     // No rotation; no truncation needed
//     widths.forEach((obj) => {
//       truncatedMap[obj.label] = obj.label;
//     });
//   }

//   // Cleanup
//   document.body.removeChild(hiddenSvg);

//   return { rotateAll, truncatedMap };
// }

// /**
//  * truncateLabel:
//  *  - remove characters from the end until the rotated version fits in the threshold
//  *  - append "..." once we remove anything
//  */
// function truncateLabel(label, measureFn, threshold) {
//   let current = label;
//   while (current.length > 1) {
//     current = current.slice(0, -1);
//     const attempt = current + "...";
//     const w = measureFn(attempt, true); // measure rotated text
//     if (w <= threshold) {
//       return attempt;
//     }
//   }
//   return label.slice(0, 1) + ".."; // fallback if it's still big
// }

// measure.labels.js

// 1) A global or module-level cache for label widths.
//    Key: label text, Value: { unrotated: number, rotated: number }
const measuredCache = {};

/**
 * measureVisibleLabels
 *  - Takes visibleData (array of objects { name, ... }).
 *  - Measures label widths (unrotated & rotated) from cache or by actual measurement.
 *  - Decides rotateAll and truncates if needed.
 *
 *  If you have a chunk-based approach, you can also break it up,
 *  but for brevity, we measure all at once here.
 */
export function measureVisibleLabels(visibleData) {
  let rotateAll = false;
  const truncatedMap = {};

  // Constants for threshold
  const THRESHOLD_UNROTATED = 80;
  const THRESHOLD_ROTATED = 60;

  // For demonstration, we do a naive measure function
  // In real code, you'd do canvas-based measure or offscreen <svg>/getBBox().
  function measureLabelWidth(label, rotated = false) {
    // If truly rotated, you might do something like approximate:
    //   approximateWidth = measureText(label) * Math.cos(45°) + lineHeight * Math.sin(45°)
    // For now, we'll just do a fake length-based approach for the example
    const baseWidth = label.length * 8; // approx 8px per char
    return rotated ? Math.floor(baseWidth * 0.75) : baseWidth;
  }

  for (const item of visibleData) {
    const label = item.name || "";
    if (!measuredCache[label]) {
      // not cached yet, measure & store
      measuredCache[label] = {
        unrotated: measureLabelWidth(label, false),
        rotated: measureLabelWidth(label, true),
      };
    }
    const { unrotated, rotated } = measuredCache[label];

    // If any label is too wide unrotated => rotateAll = true
    if (unrotated > THRESHOLD_UNROTATED) {
      rotateAll = true;
    }
  }

  // If rotateAll, we check if rotated widths still exceed threshold => then truncate
  if (rotateAll) {
    for (const item of visibleData) {
      const label = item.name || "";
      const { rotated } = measuredCache[label];
      if (rotated > THRESHOLD_ROTATED) {
        // Truncate until it fits
        truncatedMap[label] = truncateLabel(label, THRESHOLD_ROTATED);
      }
    }
  }

  return { rotateAll, truncatedMap };
}

function truncateLabel(label, threshold) {
  while (label.length > 1) {
    const attempt = label.slice(0, -1) + "...";
    const approxWidth = attempt.length * 8 * 0.75;
    if (approxWidth <= threshold) {
      return attempt;
    }
    label = label.slice(0, -1);
  }
  return label.slice(0, 1) + "...";
}

export const CustomTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text
        orientation="bottom"
        width="275"
        height="75"
        stroke="none"
        x={0} // Align the text horizontally based on the x value
        y={10} // Align the text vertically based on the y value
        className="recharts-text recharts-cartesian-axis-tick-value"
        textAnchor="middle"
        fill="#666" // Default font color
        style={{
          fontSize: "14px", // Set the font size
          fontWeight: "400", // Optional: Adjust font weight
        }}
      >
        <tspan x="0" dy="0.71em">
          {payload.value} {/* This will display the actual tick value */}
        </tspan>
      </text>
    </g>
  );
};
