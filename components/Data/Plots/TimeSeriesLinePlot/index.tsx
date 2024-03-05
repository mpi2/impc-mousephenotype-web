import React from "react";
import { area, curveMonotoneX } from "d3-shape";
import { Defs, linearGradientDef } from "@nivo/core";

import dynamic from "next/dynamic";

const ResponsiveLine = dynamic(
  () => import("@nivo/line").then((m) => m.ResponsiveLine),
  { ssr: false }
);

const AreaLayer = ({ series, xScale, yScale, innerHeight }) => {
  const areaGenerator = area()
    .x((d: any) => xScale(d.data.x))
    .y0((d: any) =>
      Math.min(innerHeight, yScale(d.data.y - d.data.standardDeviation))
    )
    .y1((d: any) => yScale(d.data.y + d.data.standardDeviation))
    .curve(curveMonotoneX);
  console.log("series", series);

  return (
    <>
      {series.map((s, i) => (
        <>
          <Defs
            defs={[
              {
                id: "pattern" + s.id,
                type: "patternDots",
                background: "transparent",
                color: s.color,
                size: 1,
                padding: 3,
                stagger: true,
              },
            ]}
          />
          <path
            key={i}
            d={areaGenerator(s.data)}
            fill={s.color}
            fillOpacity={0.2}
            stroke={s.color}
            strokeWidth={0.5}
          />
        </>
      ))}
    </>
  );
};

const LineChart = ({ data }) => {
  console.log(data);

  return (
    <div style={{ height: 400 }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 150, bottom: 60, left: 80 }}
        animate={true}
        enableSlices="x"
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        xScale={{ type: "linear", tickValues: 10, min: "auto", max: "auto" }}
        lineWidth={2}
        curve="linear"
        enableGridX={false}
        enablePoints={false}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Time in hours relative to lights out",
          legendOffset: 36,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "m/h/animal",
          legendOffset: -40,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        layers={[
          "grid",
          "markers",
          "areas",
          AreaLayer,
          "lines",
          "slices",
          "axes",
          "points",
          "legends",
        ]}
        theme={{
          crosshair: {
            line: {
              strokeWidth: 2,
              stroke: "#774dd7",
              strokeOpacity: 1,
            },
          },
        }}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default LineChart;
