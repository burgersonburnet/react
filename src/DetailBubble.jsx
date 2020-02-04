import React from 'react';

const SVG_VIEWBOX_WIDTH = 272;
const SVG_VIEWBOX_HEIGHT = 792;
const svgRatio = SVG_VIEWBOX_WIDTH / SVG_VIEWBOX_HEIGHT;
const windowRatio = window.innerWidth / window.innerHeight;

export default function DefaultBubble(props) {
  let bubbleX = props.x - 107 - getLeftOffset(props.x, props.y);
  let bubbleY = props.y + (props.y > 175 ? -160 : 45);

  return (
    <g>
      <path
        className="map-popup"
        d={ getBubbleLocation(props.x, props.y) }
        id="info-bubble"
        fill="white"
        stroke="black"
        strokeWidth="1"
      />
        <text
          x={bubbleX}
          y={bubbleY}
        >
          <tspan x={bubbleX} dy=".6em">{props.restaurant.restaurant_name}</tspan>
          <tspan x={bubbleX} dy="1.2em">"{props.restaurant.description}"</tspan>
          <tspan x={bubbleX} dy="1.2em">Rating: {props.restaurant.rating === null ? 'TBD' : props.restaurant.rating}</tspan>
        </text>
    </g>
  )
}

function getLeftOffset(x, y) {
  let svgToWindowUnitDiff = 1; // in a perfect world
  if (windowRatio > svgRatio) { // width is bound by the height
    svgToWindowUnitDiff = 1 + ((window.innerHeight - SVG_VIEWBOX_HEIGHT) / SVG_VIEWBOX_HEIGHT);
  } else if (svgRatio > windowRatio) { // width is bounding
    svgToWindowUnitDiff = (window.innerWidth - SVG_VIEWBOX_WIDTH) / SVG_VIEWBOX_WIDTH;
  }

  let leftOffset = 0;
  if (windowRatio >= svgRatio) {
    const extraPixels = (window.innerWidth - (272 * svgToWindowUnitDiff)) / 2;
    const distFromEdge = extraPixels + (x * svgToWindowUnitDiff) + 8;
    const bubbleWidth = 135 * svgToWindowUnitDiff;
    if (bubbleWidth > distFromEdge) {
      leftOffset = bubbleWidth - distFromEdge;
    } else if (bubbleWidth > window.innerWidth - distFromEdge) {
      leftOffset = bubbleWidth - (window.innerWidth - distFromEdge);
    }
  }

  if (leftOffset !== 0) {
    leftOffset += 5;
  }

  return leftOffset;
}

function getBubbleLocation(x, y) {
  const leftOffset = getLeftOffset(x, y);
  let pathDescriptors;

  if (y > 175) { // we can display it upwards
    pathDescriptors = `M ${x + 8},
              ${y}
              c0,-15 -15,-15 -15,-15
              l-${100 - leftOffset},0
              c0,0 -20,0 -20,-80
              c0,-80 20,-80 20,-80
              l230,0
              c0,0 20,0 20,80
              c0,80 -20,80 -20,80
              l-${100 + leftOffset},0
              c0,0 -15,0 -15,15
              Z`;
  } else { // display it down
    pathDescriptors = `M ${(true ? x + 8 : 0)},`
    pathDescriptors += `${(true ? y + 16 : 0)} `
    pathDescriptors +=
      `c0,15 -15,15 -15,15
      l-${100 + leftOffset},0
      c0,0 -20,0 -20,80
      c0,80 20,80 20,80
      l230,0
      c0,0 20,0 20,-80
      c0,-80 -20,-80 -20,-80
      l-${100 - leftOffset},0
      c0,0 -15,0 -15,-15
      Z`;
  }

  return pathDescriptors;
}
