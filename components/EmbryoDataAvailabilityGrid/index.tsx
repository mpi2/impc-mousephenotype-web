import { useEffect, useState } from "react";
import { AxisTick } from "@nivo/axes";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import Select from "react-select";
import PaginationControls from "../PaginationControls";
import { Form, InputGroup } from "react-bootstrap";

type EmbryoData = {
  id: string;
  mgiGeneAccessionId: string;
  data: Array<{ x: string; y: number }>;
};
const ClickableAxisTick = ({
  tick,
  onClick,
}: {
  tick: any;
  onClick: (tick: any) => void;
}) => {
  return <AxisTick {...tick} onClick={onClick} />;
};

type Props = {
  selectOptions: Array<{ value: string; label: string }>;
  data: Array<any>;
  secondaryViabilityData: Array<any>;
};

const EmbryoDataAvailabilityGrid = ({
  selectOptions,
  data,
  secondaryViabilityData,
}: Props) => {
  const [query, setQuery] = useState<string>(undefined);
  const [activePage, setActivePage] = useState(0);
  const [totalPages, setTotalPages] = useState(
    data ? Math.ceil(data.length / 25) : 0
  );
  const [chartData, setChartData] = useState<Array<EmbryoData>>([]);

  useEffect(() => {
    setTotalPages(data ? Math.ceil(data.length / 25) : 0);
    setChartData(
      data
        .slice(activePage * 25, (activePage * 25 + 25))
        .map((d) => ({
          id: d.geneSymbol,
          mgiGeneAccessionId: d.mgiGeneAccessionId,
          data: [
            "OPT E9.5",
            "MicroCT E14.5-E15.5",
            "MicroCT E18.5",
            "UMASS Pre E9.5",
            "Vignettes"
          ].map((p) => ({
            x: p,
            y: d.procedureNames.includes(p)
              ? d.hasAutomatedAnalysis
                ? 2
                : 1
              : p === "UMASS Pre E9.5" && d.isUmassGene
              ? 1
              : p === 'Vignettes' && d.hasVignettes
              ? 1
              : 0,
          })),
        }))
    );
  }, [data, activePage]);

  const geneIndex = chartData?.reduce(
    (acc, d) => ({ [d.id]: d.mgiGeneAccessionId, ...acc }),
    {}
  );

  const dataIndex = secondaryViabilityData?.reduce(
    (acc, d) => ({
      [d.windowOfLethality]: d.genes,
      ...acc,
    }),
    {}
  );

  const onChangeWOL = (selected) => {
    const newSelectedGenes = selected
      .flatMap((s) => dataIndex[s.value])
      .map((d) => d.mgiGeneAccessionId);
    const newData =
      selected.length && data
        ? data.filter((g) => newSelectedGenes.includes(g.mgiGeneAccessionId))
        : data;
    setActivePage(0);
    setTotalPages(Math.ceil(newData.length / 25));
    setChartData(
      newData.slice(0, 25).map((d) => ({
        id: d.geneSymbol,
        mgiGeneAccessionId: d.mgiGeneAccessionId,
        data: [
          "OPT E9.5",
          "MicroCT E14.5-E15.5",
          "MicroCT E18.5",
          "UMASS Pre E9.5",
        ].map((p) => ({
          x: p,
          y: d.procedureNames.includes(p)
            ? d.hasAutomatedAnalysis
              ? 2
              : 1
            : p === "UMASS Pre E9.5" && d.isUmassGene
            ? 1
            : 0,
        })),
      }))
    );
  };

  const onClickTick = (cell: any) => {
    const geneAcc = geneIndex[cell.serieId];
    const dataType = cell.data.x;
    let url = "";
    if (
      ["OPT E9.5", "MicroCT E14.5-E15.5", "MicroCT E18.5"].includes(dataType)
    ) {
      url = `//www.mousephenotype.org/embryoviewer/?mgi=${geneAcc}`;
    } else if (dataType === "Vignettes") {
      url = "/data/embryo/vignettes";
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
              onChange={(e) => setQuery(e.target.value)}
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
          textAlign: "center",
        }}
      >
        {chartData && (
          <ResponsiveHeatMap
            data={chartData}
            margin={{ top: 100, right: 80, bottom: 20, left: 120 }}
            valueFormat={(v: any) => {
              const options = [
                "No data",
                "Images Available",
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
                      `https://mousephenotype.org/data/genes/${
                        data[tick.tickIndex].mgiAccessionId
                      }`,
                      "_blank",
                      "noreferrer"
                    )
                  }
                />
              ),
            }}
            axisRight={null}
            colors={(cell: any) => {
              const options = ["#ECECEC", "#17a2b8", "#ed7b25"];
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
