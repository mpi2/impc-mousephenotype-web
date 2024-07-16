import { CSSProperties, memo, useEffect, useMemo, useState } from "react";
import { scaleQuantize, scaleBand } from "@visx/scale";
import { LateAdultDataParsed, LateAdultRowResponse } from "@/models";
import { Group } from "@visx/group";
import { HeatmapRect } from "@visx/heatmap";
import { AxisLeft, AxisTop } from "@visx/axis";
import { Text } from '@visx/text';
import { ScaleBand, ScaleQuantize } from "d3-scale";
import { clamp } from 'lodash';
import classNames from "classnames";


const binHeight = 25;
const binGap = 2;

type CellData = {
  x: number;
  y: number;
  geneSymbol: string;
  procedureName: string;
}

type Props = {
  width: number;
  data: LateAdultDataParsed;
  genesList: Array<LateAdultRowResponse>;
  selectedParam: string;
  onParamSelected: (param: string) => void;
}
type HeatMapProps = {
  data: LateAdultDataParsed;
  xScale: ScaleBand<number>;
  yScale: ScaleBand<number>;
  colorScale: ScaleQuantize<string, never>;
  binWidth: number;
  allGenesList: Array<LateAdultRowResponse>;
  setSelectedCell: (data: CellData) => void;
};

const HeatMap = memo((props: HeatMapProps) => {
  const {
    data,
    xScale,
    yScale,
    colorScale,
    binWidth,
    allGenesList,
    setSelectedCell,
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
              className={classNames("visx-heatmap-rect", { "hasData": bin.count > 0 })}
              width={xScale.bandwidth() - binGap}
              height={yScale.bandwidth() - binGap}
              x={bin.x}
              y={bin.y}
              fill={bin.color}
              onMouseOver={() => {
                setSelectedCell({
                  x: bin.x,
                  y: bin.y,
                  geneSymbol: allGenesList[bin.row].markerSymbol,
                  procedureName: data.columns[bin.column],
                })
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
    data,
    genesList,
    selectedParam,
    onParamSelected,
  } = props;

  const numOfCols = data.columns.length;
  const binWidth = width / numOfCols;
  const maxWidth = width - 50;
  const [heatmapHeight, setHeatmapHeight] = useState<number>(undefined);
  const [selectedCell, setSelectedCell] = useState<CellData>(undefined);

  useEffect(() => {
    if (genesList) {
      const maxHeigth = (genesList.length * binHeight) + 170;
      if (heatmapHeight !== maxHeigth) {
        setHeatmapHeight(maxHeigth);
      }
    }
  }, [genesList.length, heatmapHeight]);

  const xScale = useMemo(() =>
    scaleBand<number>({
      domain: data.columns.map((_, index) => index),
      range: [50, maxWidth],
      round: true
    }), [data, maxWidth]);

  const yScale = useMemo(() =>
    scaleBand<number>({
      domain: genesList.map((_, index) => index),
      range: [100, heatmapHeight],
    }),[genesList, heatmapHeight]);


  const colorScale = useMemo(() =>
    scaleQuantize({
      domain: [0, 2],
      range: ["#dedede8f", "#15a2b88f", "#ed7b25c4"]
    }),[]);

  const isSelectedGene = (geneSymbol: string) => !!selectedCell && selectedCell.geneSymbol === geneSymbol;
  const isSelectedParam = (parameterName: string) => !!selectedCell && selectedCell.procedureName === parameterName;

  const hasData = useMemo(() => data.data.some(col => col.bins.length !== 0), [data]);

  return (
    <svg
      width={width}
      height={heatmapHeight + 100}
      onMouseLeave={() => setSelectedCell(undefined)}
    >
      <Text
        className={classNames({ 'axis-link': !!selectedParam })}
        x={width / 2}
        y={20}
        style={{ textAnchor: "middle", fontSize: "1.3em", fontWeight: "700" }}
        onClick={() => {
          if (!!selectedParam) onParamSelected(undefined);
        }}
      >
        {!!selectedParam ? `← Genes vs ${selectedParam} parameters` : `Genes vs Procedures`}
      </Text>
      <Group top={100} left={50}>
        {!!selectedCell && (
          <>
            <rect
              style={{fill: "rgba(0, 0, 0, 0.2)"}}
              x={60}
              y={selectedCell.y}
              height={yScale.bandwidth() - binGap}
              width={clamp(selectedCell.x - 60 - binGap, 0, maxWidth)}
            />
            <rect
              style={{fill: "rgba(0, 0, 0, 0.2)"}}
              y={100 + binGap}
              x={selectedCell.x}
              width={xScale.bandwidth() - binGap}
              height={clamp(selectedCell.y - 100 - binGap * 2, 0, heatmapHeight)}
            />
            <rect
              style={{fill: "rgba(0, 0, 0, 0.2)"}}
              x={selectedCell.x + binWidth - 2}
              y={selectedCell.y}
              height={yScale.bandwidth() - binGap}
              width={clamp(width - selectedCell.x - 62 - xScale.bandwidth(), 0, maxWidth)}
            />
          </>
        )}
        {!hasData && (
          <Text x={width / 2} y="120" style={{ textAnchor: "middle" }}>
            No genes match the inserted text
          </Text>
        )}
        <HeatMap
          data={data}
          allGenesList={genesList}
          xScale={xScale}
          yScale={yScale}
          colorScale={colorScale}
          binWidth={binWidth}
          setSelectedCell={setSelectedCell}
        />
      </Group>
      <AxisTop
        scale={xScale}
        top={190}
        left={48}
        tickFormat={value => data.columns[value as number]}
        tickValues={data.columns.map((col, index) => index)}
        tickComponent={({formattedValue, ...rest}) => {
          const matchesParam = isSelectedParam(formattedValue);
          const style: CSSProperties = matchesParam ?
            { fontWeight: "bold" } :
            { fontWeight: "normal"  };
          return (
            <text
              className="axis-link"
              style={style}
              {...rest}
              transform={`rotate(-50, ${rest.x}, 0)`}
              textAnchor="start"
              alignmentBaseline="middle"
              onClick={() => onParamSelected(formattedValue)}
            >
              {formattedValue}
            </text>
          )
        }}
      />
      {hasData && (
        <AxisLeft
          scale={yScale}
          top={100}
          left={90}
          numTicks={genesList.length}
          tickFormat={value => genesList[value as number]?.markerSymbol || '-'}
          tickComponent={({formattedValue, ...rest}) => {
            const matchesGene = isSelectedGene(formattedValue);
            const style: CSSProperties = matchesGene ?
              { fontWeight: "bold", fontSize: "12px" } :
              { fontWeight: "normal", fontSize: "10px" };
            return (
              <Text style={style} {...rest}>
                {formattedValue}
              </Text>
            )
          }}
        />
      )}
    </svg>
  )
};

export default LateAdultHeatmap;