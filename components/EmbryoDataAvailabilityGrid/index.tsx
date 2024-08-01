import { AxisTick } from "@nivo/axes";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import Select from 'react-select';
import data from './GeneVsProcedure.data';
import PaginationControls from "../PaginationControls";
import { useEmbryoWOLQuery, usePagination } from "@/hooks";
import _ from "lodash";
import React, { useMemo, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";

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
  const [selectedWOL, setSelectedWOL] = useState<Array<string>>([]);
  const [query, setQuery] = useState<string>(undefined)
  const { data: dataIndex } = useEmbryoWOLQuery(data => {
    return _.groupBy(data, 'FUSIL') as DataIndex;
  });

  const filteredData = useMemo(() => {
    const newSelectedGenes = selectedWOL.flatMap(s => dataIndex[s]).map(d => d.gene_id);
    const dataFilteredByWOL = selectedWOL.length
      ? data.filter(g => newSelectedGenes.includes(g.mgiAccessionId))
      : data;
    return !!query
      ? dataFilteredByWOL.filter(g => g.id.toLowerCase().includes(query.toLowerCase()))
      : dataFilteredByWOL;
  }, [selectedWOL, dataIndex, query]);

  const {
    paginatedData: chartData,
    activePage,
    totalPages,
    setActivePage,
  } = usePagination<EmbryoData>(filteredData, 25);

  const geneIndex = chartData.reduce((acc, d) => ({ [d.id]: d.mgiAccessionId, ...acc }), {});

  const onChangeWOL = (selected: Array<{ value: string, label: string }>) => {
    setSelectedWOL(selected.map(selection => selection.value));
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
        <div className="col-6">
          <InputGroup>
            <InputGroup.Text id="gene-filter">
              Filter by gene symbol
            </InputGroup.Text>
            <Form.Control
              id="gene-control"
              aria-describedby="gene-filter"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </InputGroup>
        </div>
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
          textAlign: "center"
        }}
      >
        {chartData.length ? (
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
        ) : (
          <h2 className="mt-5">No genes match the term entered</h2>
        )}
      </div>
      {totalPages > 1 && (
        <PaginationControls
          currentPage={activePage}
          totalPages={totalPages}
          onPageChange={setActivePage}
        />
      )}
    </>
  );

};
export default EmbryoDataAvailabilityGrid;