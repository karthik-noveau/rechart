export function darkenColor(hex, factor = 0.2) {
  let c = hex.replace(/^#/, "");
  if (c.length === 3) {
    c = c
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  let r = parseInt(c.substring(0, 2), 16);
  let g = parseInt(c.substring(2, 4), 16);
  let b = parseInt(c.substring(4, 6), 16);

  r = Math.floor(r * (1 - factor));
  g = Math.floor(g * (1 - factor));
  b = Math.floor(b * (1 - factor));

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export const getCustomSvgDefsPattern = (color) => {
  // Compute a darker version of the input color
  const darkColor = darkenColor(color, 0.2);

  const svgNS = "http://www.w3.org/2000/svg";

  // Create <defs> element
  const defs = document.createElementNS(svgNS, "defs");

  // Create <pattern> element with attributes
  const pattern = document.createElementNS(svgNS, "pattern");
  pattern.setAttribute("id", "custom-pattern");
  pattern.setAttribute("x", "0");
  pattern.setAttribute("y", "0");
  pattern.setAttribute("width", "10");
  pattern.setAttribute("height", "7");
  pattern.setAttribute("patternUnits", "userSpaceOnUse");
  pattern.setAttribute(
    "patternTransform",
    "translate(8, 8) rotate(135) skewX(0)"
  );

  // Create <svg> element inside the pattern
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "6");
  svg.setAttribute("height", "10");
  svg.setAttribute("viewBox", "0 0 100 100");

  // Create <g> element with fill attribute
  const g = document.createElementNS(svgNS, "g");
  g.setAttribute("fill", darkColor);

  // Create <path> element with attributes
  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("d", "M0,60 L0,160 L20,160 L20,60 Z");
  path.setAttribute("transform", "rotate(-90 0 60)");

  // Assemble the structure
  g.appendChild(path); // Append <path> to <g>
  svg.appendChild(g); // Append <g> to <svg>
  pattern.appendChild(svg); // Append <svg> to <pattern>
  defs.appendChild(pattern); // Append <pattern> to <defs>
  defs.setAttribute("id", "custom-pattern-defs");

  return defs;
};
