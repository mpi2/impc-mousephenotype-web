import { useState, useEffect } from "react";
import { AxisTick } from "@nivo/axes";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import Select from 'react-select';
import { csvToJSON } from "../../utils";
import data from './GeneVsProcedure.data';

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

const EmbryoDataAvailabilityGrid = () => {
  const [chartData, setChartData] = useState<Array<EmbryoData>>(data.slice(0, 25));
  const [dataIndex, setDataIndex] = useState<DataIndex>({});
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(data.length / 25));
  const windowOfLetality = [
    { value: "Perinatal lethal", label: "Perinatal lethal" },
    { value: "E9.5 lethal", label: "E9.5 lethal" },
    { value: "E12.5 lethal", label: "E12.5 lethal" },
    { value: "E15.5 lethal", label: "E15.5 lethal" },
    { value: "E18.5 lethal", label: "E18.5 lethal" },
    { value: "Lorem ipsum", label: "Lorem ipsum" },
  ];
  const geneIndex = chartData.reduce((acc, d) => ({ [d.id]: d.mgiAccessionId, ...acc }), {});

  useEffect(() => {
    fetch(
      "//impc-datasets.s3.eu-west-2.amazonaws.com/embryo-landing-assets/wol_all.csv"
    )
      .then(res => res.text())
      .then(res => {
        const dataValues: Array<WOLData> = csvToJSON(res);
        const filterByWOL = (valueToFilter: string) => dataValues.filter(d => d.wol.includes(valueToFilter));
        const dataIndex: DataIndex = {
          "Perinatal lethal": filterByWOL('perinatal_lethal'),
          "E9.5 lethal": filterByWOL('E9_5_lethal'),
          "E12.5 lethal": filterByWOL('E12_5_lethal'),
          "E15.5 lethal": filterByWOL('E15_5_lethal'),
          "E18.5 lethal": filterByWOL('E18_5_lethal'),
          "Lorem ipsum": filterByWOL('insufficient data"'),
        };
        setDataIndex(dataIndex);
      });
  }, []);

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
  }

  return (
    <>
      <div className="row m-2 ">
        <div className="col-6">
          <Select
            options={windowOfLetality}
            isMulti
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select window of lethality"
            onChange={onChangeWOL}
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
        <PaginationComponent
          currentPage={activePage}
          totalPages={totalPages}
          onPageChange={handlePaginationChange}
        />
      )}
    </>
  );

};


function PaginationComponent (
  {currentPage, totalPages, onPageChange,}: { currentPage: number; totalPages: number; onPageChange: (page: number) => void; }
) {
  const [pageRange, setPageRange] = useState([1, 2, 3]);
  const handlePageChange = (page: number) => {
    onPageChange(page);
    updatePageRange(page, totalPages);
  };

  const updatePageRange = (page: number, totalPages: number) => {
    let rangeStart = Math.max(1, page - 2);
    let rangeEnd = Math.min(totalPages, page + 2);

    if (rangeEnd - rangeStart < 4) {
      // If the range is too small, adjust it to always show 5 pages
      if (page <= 3) {
        rangeEnd = Math.min(totalPages, 5);
      } else {
        rangeStart = Math.max(1, totalPages - 4);
      }
    }

    setPageRange(
      Array.from(
        { length: rangeEnd - rangeStart + 1 },
        (_, i) => rangeStart + i
      )
    );
  };

  const isFirstPageActive = currentPage === 1;
  const isLastPageActive = currentPage === totalPages;

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${isFirstPageActive ? "disabled" : ""}`}>
          <button
            className="page-link"
            aria-label="Previous"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>
        {pageRange[0] > 1 && (
          <>
            <li className={`page-item ${currentPage === 1 ? "active" : ""}`}>
              <button
                className="page-link"
                aria-label="Previous"
                onClick={() => handlePageChange(1)}
              >
                <span aria-hidden="true">1</span>
              </button>
            </li>
            {pageRange[0] > 2 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
          </>
        )}
        {pageRange.map((pageNumber) => (
          <li
            key={pageNumber}
            className={`page-item ${
              currentPage === pageNumber ? "active" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        ))}
        {pageRange[pageRange.length - 1] < totalPages && (
          <>
            {pageRange[pageRange.length - 1] < totalPages - 1 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
            <li
              className={`page-item ${
                currentPage === totalPages ? "active" : ""
              }`}
            >
              <button
                className="page-link"
                aria-label="Previous"
                onClick={() => handlePageChange(totalPages)}
              >
                <span aria-hidden="true">{totalPages}</span>
              </button>
            </li>
          </>
        )}
        <li className={`page-item ${isLastPageActive ? "disabled" : ""}`}>
          <button
            className="page-link"
            aria-label="Next"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
export default EmbryoDataAvailabilityGrid;