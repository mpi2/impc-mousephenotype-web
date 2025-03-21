"use client";
import { useMemo, useState } from "react";
import { AxisTick } from "@nivo/axes";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import Select from "react-select";
import PaginationControls from "../PaginationControls";
import { Form, InputGroup } from "react-bootstrap";
import { usePagination } from "@/hooks";
import styles from "./styles.module.scss";
import classnames from "classnames";
import { capitalize } from "lodash";

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
  viewAllGenes: boolean;
  onDataFilterChange: (value: boolean) => void;
};

const EmbryoDataAvailabilityGrid = ({
  selectOptions,
  data,
  secondaryViabilityData,
  viewAllGenes,
  onDataFilterChange,
}: Props) => {
  const [query, setQuery] = useState<string>(undefined);
  const [selectedWOL, setSelectedWOL] = useState<Array<string>>([]);

  const dataIndex: Record<
    string,
    Array<{ geneSymbol: string; mgiGeneAccessionId: string }>
  > = useMemo(
    () =>
      secondaryViabilityData?.reduce(
        (acc, d) => ({
          [d.windowOfLethality]: d.genes,
          ...acc,
        }),
        {},
      ),
    [secondaryViabilityData],
  );

  const processedData = useMemo(() => {
    function getWOLSByGene(mgiGeneAccessionId: string) {
      return Object.entries(dataIndex).reduce((res, [wol, genesByWol]) => {
        if (
          genesByWol
            .map((g) => g.mgiGeneAccessionId)
            .includes(mgiGeneAccessionId)
        ) {
          if (!!res) {
            return `${res}, ${capitalize(wol)}`;
          }
          return capitalize(wol);
        }
        return res;
      }, "");
    }
    return data.map((d) => ({
      id: d.geneSymbol,
      mgiGeneAccessionId: d.mgiGeneAccessionId,
      data: [
        "OPT E9.5",
        "MicroCT E9.5",
        "MicroCT E14.5-E15.5",
        "MicroCT E18.5",
        "Mager Lab Pre E9.5",
        "Vignettes",
        "Window(s) of Lethality ¹",
      ].map((p) => ({
        x: p,
        y: d.procedureNames.includes(p)
          ? d.hasAutomatedAnalysis
            ? 2
            : 1
          : p === "Mager Lab Pre E9.5" && d.isUmassGene
            ? 1
            : p === "Vignettes" && d.hasVignettes
              ? 1
              : p === "Window(s) of Lethality ¹" &&
                getWOLSByGene(d.mgiGeneAccessionId),
      })),
    }));
  }, [data, dataIndex]);

  const filteredData = useMemo(() => {
    const newSelectedGenes = selectedWOL
      .flatMap((wol) => dataIndex[wol])
      .sort((a, b) => a.geneSymbol.localeCompare(b.geneSymbol))
      .map((d) => d.mgiGeneAccessionId);
    const selectedData = !!newSelectedGenes.length
      ? newSelectedGenes
          .map((geneId) =>
            processedData.find((d) => d.mgiGeneAccessionId === geneId),
          )
          .filter(Boolean)
      : processedData;
    return selectedData.filter((gene) =>
      !!query ? gene?.id.toLowerCase().includes(query.toLowerCase()) : true,
    );
  }, [processedData, query, selectedWOL, dataIndex]);

  const {
    paginatedData: chartData,
    activePage,
    setActivePage,
    totalPages,
  } = usePagination(filteredData, 25);

  const geneIndex = useMemo(
    () =>
      chartData?.reduce(
        (acc, d) => ({ [d.id]: d.mgiGeneAccessionId, ...acc }),
        {},
      ),
    [chartData],
  );

  const onChangeWOL = (selected) => {
    setSelectedWOL(selected.map((s) => s.value));
  };

  const onClickTick = (cell: any) => {
    const geneAcc = geneIndex[cell.serieId];
    const dataType = cell.data.x;
    // dont do anything if cell is empty
    if (cell.value === 0) {
      return;
    }
    let url = "";
    if (
      [
        "OPT E9.5",
        "MicroCT E9.5",
        "MicroCT E14.5-E15.5",
        "MicroCT E18.5",
      ].includes(dataType)
    ) {
      url = `//www.mousephenotype.org/embryoviewer/?mgi=${geneAcc}`;
    } else if (dataType === "Vignettes") {
      url = `/data/embryo/vignettes?gene=${cell.serieId}`;
    } else if (dataType === "LacZ") {
      url = `//www.mousephenotype.org/data/imageComparator?parameter_stable_id=IMPC_ELZ_064_001&acc=${geneAcc}`;
    } else {
      url = `//blogs.umass.edu/jmager/${cell.serieId}`;
    }
    window.open(url, "_blank", "noreferrer");
  };

  return (
    <>
      <div className={styles.controlsContainer}>
        <div className={styles.selectorContainer}>
          <label>Filter by Window of Lethality</label>
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
        <div>
          <Form.Group>
            <Form.Label id="gene-filter" style={{ marginBottom: 0 }}>
              Filter by gene symbol
            </Form.Label>
            <Form.Control
              className="bg-white"
              id="gene-control"
              aria-describedby="gene-filter"
              placeholder="Pparg..."
              style={{ minHeight: 47 }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Form.Group>
        </div>
        <div>
          <span>Viewing {filteredData.length} results</span>
          <Form.Group>
            <Form.Check
              style={{ display: "flex", alignItems: "center", gap: "0.5em" }}
              id="gene-control"
              label="Only display genes with image data"
              checked={viewAllGenes}
              onChange={(e) => onDataFilterChange(e.target.checked)}
            />
          </Form.Group>
        </div>
      </div>
      <div className={styles.labelsContainer}>
        <div className={styles.colorLabelContainer}>
          <span className={classnames(styles.baseLabel, styles.noData)}></span>
          &nbsp;No data
        </div>
        <div className={styles.colorLabelContainer}>
          <span
            className={classnames(styles.baseLabel, styles.imagesAvailable)}
          ></span>
          &nbsp;Images available
        </div>
        <div className={styles.colorLabelContainer}>
          <span
            className={classnames(
              styles.baseLabel,
              styles.volumetricAnalysisAvailable,
            )}
          ></span>
          &nbsp;Images and automated volumetric analysis available
        </div>
        <div className={styles.colorLabelContainer}>
          <span
            className={classnames(styles.baseLabel, styles.associationWithWOL)}
          ></span>
          &nbsp;Lethality window association
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
        {chartData.length ? (
          <ResponsiveHeatMap
            data={chartData}
            margin={{ top: 100, right: 80, bottom: 20, left: 120 }}
            valueFormat={(v: any) => {
              if (v === "") {
                return "No associated lethality window";
              }
              if (!!v.length) {
                return v;
              }
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
                  onClick={() => {
                    const selectedGene = chartData[tick.tickIndex];
                    window.open(
                      `/data/genes/${
                        selectedGene?.mgiGeneAccessionId
                      }?dataQuery=viability`,
                      "_blank",
                      "noreferrer",
                    );
                  }}
                />
              ),
            }}
            axisRight={null}
            colors={(cell: any) => {
              const value = cell.value || 0;
              if (value === "" || !!value.length) {
                return "#E1BE6A";
              }
              const options = ["#ECECEC", "#17a2b8", "#ed7b25"];
              return options[value];
            }}
            labelTextColor="black"
            emptyColor="#ccc"
            borderWidth={0.25}
            borderColor="#000"
            enableLabels={false}
            annotations={[]}
            onClick={onClickTick}
            theme={{
              axis: {
                ticks: {
                  text: {
                    fontStyle: "italic",
                  },
                },
              },
            }}
          />
        ) : (
          <h2 className="mt-5">No genes match the filters selected</h2>
        )}
      </div>
      {totalPages > 1 && (
        <PaginationControls
          currentPage={activePage}
          totalPages={totalPages}
          onPageChange={setActivePage}
        />
      )}
      <div style={{ fontSize: "85%", flex: "1 0 100%" }}>
        <span>
          ¹ A gene can belong to multiple lethality windows because has been
          studied in multiple centers or multiple alleles have been studied.
        </span>
      </div>
    </>
  );
};
export default EmbryoDataAvailabilityGrid;
