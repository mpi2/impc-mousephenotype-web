import { CSSProperties, memo, useEffect, useMemo, useState } from "react";
import { scaleLinear, scaleQuantize } from "@visx/scale";
import { LateAdultDataParsed } from "@/models";
import { Group } from "@visx/group";
import { HeatmapRect } from "@visx/heatmap";
import { AxisLeft } from "@visx/axis";
import { Text } from '@visx/text';


const binHeight = 11.75;
const binGap = 2;

type CellData = {
  x: number;
  y: number;
  geneSymbol: string;
}

type Props = {
  width: number;
  data: LateAdultDataParsed
}
type HeatMapProps = {
  data: LateAdultDataParsed;
  xScale;
  yScale;
  colorScale;
  binWidth: number;
  setSelectedCell: (data: CellData) => void;
};

const HeatMap = memo((props: HeatMapProps) => {
  const {
    data,
    xScale,
    yScale,
    colorScale,
    binWidth,
    setSelectedCell
  } = props;
  return (
    <HeatmapRect
      data={data.data}
      xScale={d => xScale(d) ?? 0}
      yScale={d => yScale(d) ?? 0}
      colorScale={colorScale}
      binWidth={binWidth}
      binHeight={binHeight}
      gap={binGap}
    >
      {heatmap =>
        heatmap.map(heatmapBins =>
          heatmapBins.map(bin => (
            <rect
              key={`heatmap-rect-${bin.row}-${bin.column}`}
              className="visx-heatmap-rect"
              width={bin.width}
              height={bin.height}
              x={bin.x}
              y={bin.y}
              fill={bin.color}
              onMouseOver={() => {
                setSelectedCell({ x: bin.x, y: bin.y, geneSymbol: data.rows[bin.row].markerSymbol })
              }}
            />
          ))
        )
      }
    </HeatmapRect>
  )
})

const LateAdultHeatmap = (props: Props) => {
  const {
    width,
    data
  } = props;

  const numOfCols = data.columns.length;
  const binWidth = width / numOfCols;
  const maxWidth = width - 50;
  const [heatmapHeight, setHeatmapHeight] = useState<number>(undefined);
  const [selectedCell, setSelectedCell] = useState<CellData>(undefined);

  useEffect(() => {
    if (data) {
      const maxHeigth = data.numOfRows * binHeight;
      if (heatmapHeight !== maxHeigth) {
        setHeatmapHeight(maxHeigth);
      }
    }
  }, [data.data, heatmapHeight]);

  const xScale = useMemo(() =>
    scaleLinear<number>({
      domain: [0, data.columns.length],
      range: [50, maxWidth],
    }), [data, maxWidth]);

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

  const isSelectedGene = (geneSymbol: string) => !!selectedCell && selectedCell.geneSymbol === geneSymbol;

  return (
    <svg
      width={width}
      height={heatmapHeight + 10}
      onMouseLeave={() => setSelectedCell(undefined)}
    >
      <Group top={0} left={50}>
        {!!selectedCell && (
          <>
            <rect
              style={{fill: "rgba(0, 0, 0, 0.2)"}}
              x={50}
              y={selectedCell.y}
              height={binHeight - binGap}
              width={selectedCell.x - 50}
            />
            <rect
              style={{fill: "rgba(0, 0, 0, 0.2)"}}
              y={binGap}
              x={selectedCell.x}
              width={binWidth - binGap}
              height={selectedCell.y - binGap}
            />
          </>
        )}
        <HeatMap
          data={data}
          xScale={xScale}
          yScale={yScale}
          colorScale={colorScale}
          binWidth={binWidth}
          setSelectedCell={setSelectedCell}
        />
      </Group>
      <AxisLeft
        scale={yScale}
        top={5}
        left={90}
        numTicks={data.numOfRows}
        tickFormat={value => data.rows[value as number]?.markerSymbol || '-'}
        tickComponent={({formattedValue, ...rest}) => {
          const matchesGene = isSelectedGene(formattedValue);
          const style: CSSProperties = matchesGene ?
            { fontWeight: "bold", fontSize: "12px" } :
            { fontWeight: "normal", fontSize: "10px" };
          return (
            <Text
              style={style}
              {...rest}
            >
              {formattedValue}
            </Text>
          )
        }}
      />
    </svg>
  )
};

export default LateAdultHeatmap;