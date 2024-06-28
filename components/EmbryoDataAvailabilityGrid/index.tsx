import { useState } from "react";
import { AxisTick } from "@nivo/axes";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import Select from 'react-select';
import data from './GeneVsProcedure.data';
import PaginationControls from "../PaginationControls";
import { useEmbryoWOLQuery } from "@/hooks";
import _ from "lodash";

type EmbryoData = {
  id: string;
  mgiAccessionId: string;
  data: Array<{ x: string, y: number }>
}
type WOLData = {
  colony: string;
  gene_id: string;
  gene_symbol: string;
  wol: string;
};
type DataIndex = Record<string, Array<WOLData>>;
const ClickableAxisTick = ({tick, onClick}: { tick: any; onClick: (tick: any) => void; }) => {
  return <AxisTick {...tick} onClick={onClick} />;
};

type Props = {
  selectOptions: Array<{ value: string; label: string }>;
}

const EmbryoDataAvailabilityGrid = ({ selectOptions }: Props) => {
  const [chartData, setChartData] = useState<Array<EmbryoData>>(data.slice(0, 25));
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(data.length / 25));
  const geneIndex = chartData.reduce((acc, d) => ({ [d.id]: d.mgiAccessionId, ...acc }), {});


  const { data: dataIndex } = useEmbryoWOLQuery(data => {
    return _.groupBy(data, 'FUSIL') as DataIndex;
  });

  const handlePaginationChange = (pageNumber: number) => {
    setActivePage(pageNumber);
    setChartData(data.slice((pageNumber - 1) * 25, (pageNumber - 1) * 25 + 25));
  };

  const onChangeWOL = selected => {
    const newSelectedGenes = selected.flatMap(s => dataIndex[s.value]).map(d => d.gene_id);
    const newData = selected.length
      ? data.filter(g => newSelectedGenes.includes(g.mgiAccessionId))
      : data;
    setChartData(
      selected.length ? newData.slice(0, 25) : data.slice(0, 25)
    );
    setTotalPages(Math.ceil(newData.length / 25));
    setActivePage(1);
  }

  const onClickTick = (cell: any) => {
    const geneAcc = geneIndex[cell.serieId];
    const dataType = cell.data.x;
    let url = "";
    if (["OPT E9.5", "MicroCT E14.5-E15.5", "MicroCT E18.5"].includes(dataType)) {
      url = `//www.mousephenotype.org/embryoviewer/?mgi=${geneAcc}`;
    } else if (dataType === "Vignettes") {
    } else if (dataType === "LacZ") {
      url = `//www.mousephenotype.org/data/imageComparator?parameter_stable_id=IMPC_ELZ_064_001&acc=${geneAcc}`;
    } else {
      url = `//blogs.umass.edu/jmager/${cell.serieId}`;
    }
    window.open(url, "_blank", "noreferrer");
  };

  return (
    <>
      <div className="row m-2 ">
        <div className="col-6">
          <Select
            options={selectOptions}
            isMulti
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select window of lethality"
            onChange={onChangeWOL}
            aria-label="window of lethality filter"
          />
        </div>
        <div className="col-6"></div>
      </div>
      <div
        style={{
          height: `${
            chartData.length < 25 ? 250 + chartData.length * 5 : 600
          }px`,
          marginRight: "0",
          marginLeft: "0",
          backgroundColor: "white",
          marginTop: "0",
        }}
      >
        <ResponsiveHeatMap
          data={chartData}
          margin={{ top: 100, right: 80, bottom: 20, left: 120 }}
          valueFormat={(v: any) => {
            const options = [
              "No data",
              "Images Available",
              "Images Available",
              "EA not significant -> LA significant",
              "Images and Automated Volumetric Analysis Available",
            ];
            return options[v];
          }}
          animate={true}
          axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: "",
            legendOffset: 50,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "",
            legendPosition: "middle",
            legendOffset: 60,
            renderTick: (tick: any) => (
              <ClickableAxisTick
                tick={tick}
                onClick={() =>
                  window.open(
                    `https://mousephenotype.org/data/genes/${data[tick.tickIndex].mgiAccessionId}`,
                    "_blank",
                    "noreferrer"
                  )
                }
              />
            ),
          }}
          axisRight={null}
          colors={(cell: any) => {
            const options = [
              "#ECECEC",
              "#17a2b8",
              "#ed7b25",
              "#ed7b25",
              "#17a2b8",
            ];
            return options[cell.value || 0];
          }}
          labelTextColor="black"
          emptyColor="#ccc"
          borderWidth={0.25}
          borderColor="#000"
          enableLabels={false}
          legends={[
            {
              anchor: "right",
              translateX: 50,
              translateY: 0,
              length: 200,
              thickness: 10,
              direction: "column",
              tickPosition: "after",
              tickSize: 3,
              tickSpacing: 4,
              tickOverlap: false,
              tickFormat: ">-.0s",
              title: "Value →",
              titleAlign: "middle",
              titleOffset: 4,
            },
          ]}
          annotations={[]}
          onClick={onClickTick}
        />
      </div>
      {totalPages > 1 && (
        <PaginationControls
          currentPage={activePage}
          totalPages={totalPages}
          onPageChange={handlePaginationChange}
        />
      )}
    </>
  );

};
export default EmbryoDataAvailabilityGrid;