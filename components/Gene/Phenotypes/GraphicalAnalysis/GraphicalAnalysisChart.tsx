import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Cat, colorArray, systemColorMap } from './shared';
import { scaleLinear } from '@visx/scale';
import { Group } from "@visx/group";
import { Circle, AreaClosed } from "@visx/shape";
import { GridColumns, GridRows } from '@visx/grid';
import { AxisBottom, AxisLeft } from "@visx/axis";
import { withTooltip, Tooltip } from "@visx/tooltip";
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip";
import { GlyphTriangle } from "@visx/glyph";
import { curveMonotoneX } from "@visx/curve";
import { PatternLines } from "@visx/pattern";
import { Brush } from "@visx/brush";
import BaseBrush from "@visx/brush/lib/BaseBrush";
import { BrushHandleRenderProps } from "@visx/brush/lib/BrushHandle";
import { Bounds } from "@visx/brush/lib/types";
import { max, extent } from "@visx/vendor/d3-array";
import { useDebounceCallback } from 'usehooks-ts';

const BrushHandle = ({ y, width, isBrushActive }: BrushHandleRenderProps) => {
  if (!isBrushActive) {
    return null;
  }

  return (
    <Group left={(width / 2) + 7.5} top={y + 4}>
      <path
        fill="#f2f2f2"
        d="M -4.5 0.5 L 3.5 0.5 L 3.5 15.5 L -4.5 15.5 L -4.5 0.5 M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12"
        stroke="#999999"
        strokeWidth="1"
        style={{ cursor: 'ns-resize', transform: "rotateZ(90deg)" }}
      />
    </Group>
  );
};

const TooltipContent = ({ statResult } : { statResult: any }) => {
  return (
    <div>
      <h3>{statResult.parameterName}</h3>
      <span>{statResult.topLevelPhenotypes[0]}</span><br/>
      <span>
        { statResult.pValue === 0 && statResult.significant ? "Manual association" : `P-value: ${parseFloat(statResult.pValue).toExponential(3)}`}
      </span><br/>
      <span><strong>Zygosity:</strong> {statResult.zygosity}</span><br/>
      <span><strong>Procedure:</strong> {statResult.procedureName}</span><br/>
      {(statResult.maleMutantCount && statResult.femaleMutantCount) && (
        <>
          <span><strong>Mutants:</strong> {statResult.maleMutantCount || 0} males & {statResult.femaleMutantCount || 0} females</span>
          <br/>
        </>
      )}
      {statResult.effectSize && (
        <>
          <span><strong>Effect size:</strong> {statResult.effectSize}</span>
          <br/>
        </>
      )}
      <span><strong>Metadata group:</strong> {statResult.metadataGroup}</span>
    </div>
  )
}

type Props = {
  data: Array<any>;
  width: number;
  height: number;
  yAxisLabels: Array<string>;
  isByProcedure: boolean;
  category: Cat;
  significantOnly: boolean;
};

type TooltipData = {
  statResult: any;
}

let tooltipTimeout: number;
const selectedBrushStyle = {
  fill: `url(#brush_pattern)`,
  stroke: '#CCC',
};

const GraphicalAnalysisChart = withTooltip<Props, TooltipData>((props: Props & WithTooltipProvidedProps<TooltipData>) => {
  const {
    data,
    width,
    height,
    yAxisLabels,
    isByProcedure,
    hideTooltip,
    showTooltip,
    tooltipOpen,
    tooltipData,
    tooltipTop,
    tooltipLeft,
    category,
    significantOnly,
  } = props;

  if (!data) {
    return null;
  }

  const [filteredData, setFilteredData] = useState(data);
  const yMax = height - 140;
  const svgRef = useRef<SVGSVGElement>(null);
  const brushRef = useRef<BaseBrush | null>(null);
  const xMax = useMemo(() => data.reduce((acc, x) => x.chartValue > acc ? x.chartValue : acc, 0), [data]);
  const brushMaxWidth = (0.10 * width);
  const yAxisWidth = 0.15 * width;
  const chartWidth = width - brushMaxWidth - yAxisWidth;

  useEffect(() => {
    setFilteredData(data);
  }, [category, significantOnly]);

  const numOfTicks = useMemo(() => {
    if (filteredData.length <= 50) {
      return filteredData.length
    }
    let divisor = 100;
    while ((filteredData.length / divisor) <= 20) divisor -= 1;
    return filteredData.length / divisor;
  }, [filteredData, category]);

  const xScale = useMemo(() =>
    scaleLinear<number>({
      range: [yAxisWidth, chartWidth],
      domain: extent(filteredData, (d) => d.chartValue),
      nice: true
    }),
    [chartWidth, filteredData, category]
  );

  const brushXScale = useMemo(() =>
      scaleLinear<number>({
        range: [0, brushMaxWidth],
        domain: [0, xMax + 5],
        nice: true
      }),
    [width, xMax]
  );

  const yScale = useMemo(() =>
      scaleLinear<number>({
        range: [40, yMax],
        domain: extent(filteredData, (d) => d.arrPos),
        nice: true,
      }),
    [height, filteredData, category]
  );

  const brushYScale = useMemo(() =>
      scaleLinear<number>({
        range: [40, yMax],
        domain: [0, max(data, d => d.arrPos) || 0],
        nice: true,
      }),
    [height, data]
  );


  const initialBrushPosition = useMemo(
    () => ({
      start: { x: brushXScale(data[0].chartValue) },
      end: { x: brushXScale(data[data.length - 1].chartValue) },
    }),
    [brushXScale],
  );

  const handleMouseMove = useCallback((event, x, y, data) => {
    if (tooltipTimeout) clearTimeout(tooltipTimeout);
    if (!svgRef) return;
    showTooltip({
      tooltipLeft: x,
      tooltipTop: y,
      tooltipData: { statResult: data }
    });

  }, [xScale, yScale, showTooltip]);

  const handleMouseLeave = useCallback(() => {
    tooltipTimeout = window.setTimeout(() => {
      hideTooltip();
    }, 300);
  }, [hideTooltip]);

  const onBrushChanges = (domain: Bounds | null) => {
    if (!domain) return;
    const { y0, y1} = domain;
    const newFilteredData = data.filter(d => d.arrPos > y0 && d.arrPos < y1);
    setFilteredData(newFilteredData);
  };

  const onBrushDebounced = useDebounceCallback(onBrushChanges, 1);

  return (
    <div>
      <svg width={width} height={height} ref={svgRef}>
        <GridColumns
          scale={xScale}
          width={width}
          height={yMax + 40}
          stroke="#e0e0e0"
        />
        <GridRows
          scale={yScale}
          width={chartWidth - yAxisWidth + 10}
          left={yAxisWidth - 10}
          numTicks={numOfTicks}
          stroke="#e0e0e0"
        />
        <line x1={xScale(4)} x2={xScale(4)} y1={0} y2={yMax + 40} stroke="#000" strokeWidth={2} strokeDasharray="5 4"/>
        <Group>
          {filteredData.map((x, i) => (
            x.pValue === 0 && x.significant ? (
              <GlyphTriangle
                key={i}
                left={xScale(x.chartValue)}
                top={yScale(x.arrPos)}
                size={110}
                fill="#FFF"
                stroke={isByProcedure ? colorArray[yAxisLabels.indexOf(x.procedureName)] : systemColorMap[x.topLevelPhenotypes[0]]}
                strokeWidth={3}
                onMouseMove={(e) => handleMouseMove(e, xScale(x.chartValue), yScale(x.arrPos), x)}
                onMouseLeave={handleMouseLeave}
                onTouchMove={(e) => handleMouseMove(e, xScale(x.chartValue), yScale(x.arrPos), x)}
                onTouchEnd={handleMouseLeave}
              />
            ) : (
              <Circle
                key={i}
                cx={xScale(x.chartValue)}
                cy={yScale(x.arrPos)}
                r={5}
                fill={isByProcedure ? colorArray[yAxisLabels.indexOf(x.procedureName)] : systemColorMap[x.topLevelPhenotypes[0]]}
                onMouseMove={(e) => handleMouseMove(e, xScale(x.chartValue), yScale(x.arrPos), x)}
                onMouseLeave={handleMouseLeave}
                onTouchMove={(e) => handleMouseMove(e, xScale(x.chartValue), yScale(x.arrPos), x)}
                onTouchEnd={handleMouseLeave}
              />
            )
          ))}
        </Group>
        <Group left={chartWidth} top={0} >
          <AreaClosed
            data={data}
            height={yMax}
            x={d => brushXScale(d.chartValue)}
            y={d => brushYScale(d.arrPos)}
            yScale={brushYScale}
            strokeWidth={1}
            stroke="#000"
            fill="#000"
            curve={curveMonotoneX}
          />
          <PatternLines
            id="brush_pattern"
            height={8}
            width={8}
            stroke="#AAA"
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <Brush
            xScale={brushXScale}
            yScale={brushYScale}
            width={brushMaxWidth}
            height={yMax}
            handleSize={8}
            innerRef={brushRef}
            resizeTriggerAreas={["top", "bottom"]}
            brushDirection="vertical"
            initialBrushPosition={initialBrushPosition}
            selectedBoxStyle={selectedBrushStyle}
            onChange={onBrushDebounced}
            onClick={() => setFilteredData(data)}
            useWindowMoveEvents
            renderBrushHandle={(props) => <BrushHandle {...props} />}
          />
        </Group>
        <AxisLeft
          scale={yScale}
          top={0}
          left={yAxisWidth - 10}
          numTicks={numOfTicks}
          tickFormat={value => filteredData.find(d => d.arrPos === value)?.parameterName}
        />
        <AxisBottom
          top={yMax + 40}
          scale={xScale}
          numTicks={10}
          label="log₁₀(P-value)"
        />
      </svg>
      {tooltipOpen && tooltipData && (
        <Tooltip left={tooltipLeft} top={tooltipTop}>
          <TooltipContent statResult={tooltipData.statResult}/>
        </Tooltip>
      )}
    </div>
  );
});

export default GraphicalAnalysisChart;