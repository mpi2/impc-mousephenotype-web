import { useEffect, useMemo, useState } from "react";
import { scaleLinear, scaleQuantize } from "@visx/scale";
import { LateAdultData } from "@/models";
import { Group } from "@visx/group";
import { HeatmapRect } from "@visx/heatmap";

type Props = {
  width: number;
  data: any
}

const LateAdultHeatmap = (props: Props) => {
  const {
    width,
    data
  } = props;

  const numOfCols = data.columns.length;
  const binWidth = width / numOfCols;
  const [heatmapHeight, setHeatmapHeight] = useState<number>(undefined);

  useEffect(() => {
    if (data) {
      const maxHeigth = data.numOfRows * 9.75;
      if (heatmapHeight !== maxHeigth) {
        setHeatmapHeight(maxHeigth);
      }
    }
  }, [data.data, heatmapHeight]);

  const xScale = useMemo(() =>
    scaleLinear<number>({
      domain: [0, data.columns.length],
      range: [0, width],
    }), [data, width]);

  const yScale = useMemo(() =>
    scaleLinear<number>({
      domain: [0, data.numOfRows],
      range: [0, heatmapHeight],
    }),[data, heatmapHeight]);

  const colorScale = useMemo(() =>
    scaleQuantize({
      domain: [0, 2],
      range: ["#dedede8f", "#15a2b88f", "#ed7b25c4"]
    }),[]);

  return (
    <svg width={width} height={heatmapHeight}>
      <Group top={0} left={0}>
        <HeatmapRect
          data={data.data}
          xScale={d => xScale(d) ?? 0}
          yScale={d => yScale(d) ?? 0}
          colorScale={colorScale}
          binWidth={binWidth}
          binHeight={11.75}
          gap={2}
        >
          {heatmap => {
            console.log({heatmap});
            return heatmap.map(heatmapBins =>
              heatmapBins.map(bin => (
                <rect
                  key={`heatmap-rect-${bin.row}-${bin.column}`}
                  className="visx-heatmap-rect"
                  width={bin.width}
                  height={bin.height}
                  x={bin.x}
                  y={bin.y}
                  fill={bin.color}
                />
              ))
            )
          }}
        </HeatmapRect>
      </Group>
    </svg>
  )
};

export default LateAdultHeatmap;