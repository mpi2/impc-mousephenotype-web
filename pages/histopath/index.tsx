import Search from "../../components/Search";
import { Breadcrumb, Container } from "react-bootstrap";
import Card from "../../components/Card";
import styles from "./styles.module.scss";
import data from "../../mocks/data/landing-pages/histopath.json";
import { useEffect, useState } from "react";
import PaginationControls from "../../components/PaginationControls";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import Head from "next/head";

const clone = (obj) => JSON.parse(JSON.stringify(obj));
const geneMap = new Map();

const SortIndicator = ({
  sortStatus,
  sort,
}: {
  sortStatus: boolean;
  sort: "asc" | "desc" | "none";
}) => (
  <>
    {sortStatus && sort === "desc" && <FontAwesomeIcon icon={faSortDown} />}
    {sortStatus && sort === "asc" && <FontAwesomeIcon icon={faSortUp} />}
    {(!sortStatus || sort === "none") && <FontAwesomeIcon icon={faSort} />}
  </>
);

const HistopathLandingPage = () => {
  const router = useRouter();
  const [heatmapData, setHeatmapData] = useState([]);
  const [query, setQuery] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedHeaderIndex, setSelectedHeaderIndex] = useState<number>(null);
  const [sortingByFixedTissue, setSortingByFixedTissue] = useState(false);
  const [sortingByGeneSymbol, setSortingByGeneSymbol] = useState(false);
  const [sort, setSort] = useState<"asc" | "desc" | "none">("none");
  const [totalPages, setTotalPages] = useState(
    Math.ceil(data.rows.length / pageSize)
  );

  useEffect(() => {
    const result = {};
    data.rows.forEach((geneRow, index) => {
      result[geneRow.markerSymbol] = {
        id: geneRow.markerSymbol,
        mgiAccession: geneRow.mgiGeneAccessionId,
        hasTissue: geneRow.hasTissue,
        data: [],
      };
      result[geneRow.markerSymbol].data = data.columns.map(
        (header, headerIndex) => ({
          x: header,
          y: geneRow.significance[headerIndex],
          geneSymbol: geneRow.markerSymbol,
          headerIndex,
        })
      );
      geneMap.set(geneRow.markerSymbol, result[geneRow.markerSymbol]);
    });
    setHeatmapData(Object.values(result));
    setOriginalData(Object.values(result));
  }, []);

  useEffect(() => {
    let results;
    if (query) {
      results = originalData.filter((gene) => gene.id.includes(query));
      setHeatmapData(results);
    } else if (originalData.length !== heatmapData.length) {
      results = [...originalData];
      setHeatmapData(results);
    }
  }, [query]);

  useEffect(() => {
    const newTotalPages = Math.ceil(data.rows.length / pageSize);
    if (newTotalPages !== totalPages) {
      setTotalPages(newTotalPages);
    }
  }, [pageSize]);

  const handlePaginationChange = (pageNumber: number) => {
    setActivePage(pageNumber);
  };

  const getDataSlice = () =>
    heatmapData.slice(
      (activePage - 1) * pageSize,
      (activePage - 1) * pageSize + pageSize
    );

  const getCellColor = (value: number) => {
    switch (value) {
      case 4:
        return "#ce6211";
      case 2:
        return "#17a2b8";
      case 0:
        return "#FFF";
    }
  };

  const rewriteWithQuery = (symbol: string) => {
    if (query) {
      const matchRegex = new RegExp(`(${query})`, "");
      return symbol.replace(matchRegex, `<em>${query}</em>`);
    }
    return symbol;
  };

  const displayFixedTissueColumn = (gene: any) => {
    if (gene.hasTissue) {
      const mgiID = gene.mgiAccession;
      return (
        <a className="link primary" href={`/genes/${mgiID}#order`}>
          Yes
        </a>
      );
    }
    return "No";
  };

  const getNewSort = () => {
    let newSort: "asc" | "desc" | "none";
    if (sort === "asc") {
      newSort = "none";
    } else if (sort === "desc") {
      newSort = "asc";
    } else {
      newSort = "desc";
    }
    return newSort;
  };
  const sortByHeader = (index: number) => {
    let newSort = getNewSort();
    if (index !== selectedHeaderIndex) {
      newSort = "desc";
      setActivePage(1);
    }
    const currentData = clone(heatmapData);
    const newData =
      newSort !== "none"
        ? currentData
            // merge all data in a single array
            .flatMap((item) => item.data)
            // get only the column we are interested
            .filter((item) => item.headerIndex === index)
            .sort((item1, item2) => {
              if (newSort === "desc") {
                return item2.y - item1.y;
              }
              return item1.y - item2.y;
            })
            // regenerate array with original info
            .map((gene) => ({ ...geneMap.get(gene.geneSymbol) }))
        : clone(originalData);

    setSort(newSort);
    setSortingByFixedTissue(false);
    setSortingByGeneSymbol(false);
    setSelectedHeaderIndex(index);
    setHeatmapData(newData);
  };

  const sortByFixedTissue = () => {
    let newSort = getNewSort();
    if (
      (selectedHeaderIndex !== null || sortingByGeneSymbol) &&
      !sortingByFixedTissue
    ) {
      newSort = "desc";
      setActivePage(1);
    }
    const newData = clone(originalData);
    newData.sort((gene1, gene2) => {
      if (
        (gene1.hasTissue && gene2.hasTissue) ||
        (!gene1.hasTissue && !gene2.hasTissue)
      ) {
        return newSort === "desc"
          ? gene1.id.localeCompare(gene2.id)
          : gene2.id.localeCompare(gene1.id);
      } else if (gene1.hasTissue && !gene2.hasTissue) {
        return newSort === "desc" ? -1 : 1;
      } else if (!gene1.hasTissue && gene2.hasTissue) {
        return newSort === "desc" ? 1 : -1;
      }
    });
    setSort(newSort);
    setSortingByGeneSymbol(false);
    setSortingByFixedTissue(true);
    setSelectedHeaderIndex(null);
    setHeatmapData(newData);
  };

  const sortByGeneSymbol = () => {
    let newSort = getNewSort();
    if (
      (selectedHeaderIndex !== null || sortingByFixedTissue) &&
      !sortingByGeneSymbol
    ) {
      newSort = "desc";
      setActivePage(1);
    }
    const newData = clone(originalData);
    if (newSort !== "none") {
      newData.sort((gene1, gene2) =>
        newSort === "desc"
          ? gene1.id.localeCompare(gene2.id)
          : gene2.id.localeCompare(gene1.id)
      );
    }

    setSort(newSort);
    setSortingByGeneSymbol(true);
    setSortingByFixedTissue(false);
    setSelectedHeaderIndex(null);
    setHeatmapData(newData);
  };

  return (
    <>
      <Head>
        <title>Histopathology | International Mouse Phenotyping Consortium</title>
      </Head>
      <Search />
      <Container className="page" style={{ lineHeight: 2 }}>
        <Card>
          <div className="subheading">
            <Breadcrumb>
              <Breadcrumb.Item active>Home</Breadcrumb.Item>
              <Breadcrumb.Item active>IMPC data collections</Breadcrumb.Item>
              <Breadcrumb.Item active>Histopathology Data</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className="mb-4 mt-2">
            <strong>Histopathology Data</strong>
          </h1>
          <Container>
            <div className="card" style={{ backgroundColor: "whitesmoke" }}>
              <div
                className="card-header"
                style={{ backgroundColor: "whitesmoke" }}
              >
                Histopathology for every gene tested
              </div>
              <div className="card-body">
                <p className="my-0">
                  <b>Significance Score:</b>
                </p>
                <div>
                  <div title="No Data" className="mr-3">
                    <i className="fa fa-circle" style={{ color: "#FFF" }}></i>
                    &nbsp;&nbsp;No Data
                  </div>
                  <div
                    title="Not Applicable"
                    style={{ color: "#808080" }}
                    className="mr-3"
                  >
                    <i className="fa fa-circle"></i>&nbsp;&nbsp;Not Applicable
                  </div>
                  <div
                    title="Not Significant"
                    style={{ color: "#17a2b8" }}
                    className="mr-3"
                  >
                    <i className="fa fa-circle"></i>&nbsp;&nbsp;
                    <b>Not Significant</b>&nbsp; (histopathology finding that is
                    interpreted by the histopathologist to be within normal
                    limits of background strain-related findings or an
                    incidental finding not related to genotype)
                  </div>
                  <div
                    title="Significant"
                    style={{ color: "#ce6211" }}
                    className="mr-3"
                  >
                    <i className="fa fa-circle"></i>&nbsp;&nbsp;
                    <b>Significant</b>&nbsp; (histopathology finding that is
                    interpreted by the histopathologist to not be a background
                    strain-related finding or an incidental finding)
                  </div>
                </div>
              </div>
            </div>
          </Container>
          <div className={styles.topControls}>
            <div>
              Gene search:
              <input
                className="form-control"
                title="gene search box"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div>
              Show
              <select
                name="pageSize"
                className="form-select"
                value={pageSize}
                onChange={(e) =>
                  setPageSize(Number.parseInt(e.target.value, 10))
                }
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              entries
            </div>
          </div>
          <div className={styles.tableWrapper}>
            <table
              className={`table table-striped table-bordered ${styles.heatMap}`}
            >
              <thead>
                <tr>
                  <th onClick={sortByGeneSymbol}>
                    <div className={styles.header}>Gene</div>
                    <SortIndicator
                      sortStatus={sortingByGeneSymbol}
                      sort={sort}
                    />
                  </th>
                  <th onClick={sortByFixedTissue}>
                    Fixed tissue available
                    <SortIndicator
                      sortStatus={sortingByFixedTissue}
                      sort={sort}
                    />
                  </th>
                  {data.columns.map((header, index) => (
                    <th key={header} onClick={() => sortByHeader(index)}>
                      <div className={styles.header}>{header}</div>
                      <SortIndicator
                        sortStatus={index === selectedHeaderIndex}
                        sort={sort}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th>
                    <div className={styles.header}>Gene</div>
                  </th>
                  <th>Fixed tissue available</th>
                  {data.columns.map((header, index) => (
                    <th key={header} onClick={() => sortByHeader(index)}>
                      <div className={styles.header}>{header}</div>
                    </th>
                  ))}
                </tr>
              </tfoot>
              <tbody>
                {getDataSlice().map((gene) => (
                  <tr key={gene.id}>
                    <td
                      dangerouslySetInnerHTML={{
                        __html: rewriteWithQuery(gene.id),
                      }}
                    ></td>
                    <td>{displayFixedTissueColumn(gene)}</td>
                    {gene &&
                      gene.data &&
                      gene.data.map((cell) => (
                        <td
                          className={styles.cellData}
                          key={`${gene.id}-${cell.x}`}
                          style={
                            {
                              "--bs-table-bg-type": getCellColor(cell.y),
                              cursor: cell.y > 0 ? "pointer" : "auto",
                            } as any
                          }
                          onClick={() => {
                            if (cell.y > 0) {
                              window.open(
                                `/data/histopath/${
                                  gene.mgiAccession
                                }?anatomy=${cell.x.toLowerCase()}`
                              );
                            }
                          }}
                        />
                      ))}
                  </tr>
                ))}
                {getDataSlice()?.length === 0 && (
                  <tr>
                    <td
                      colSpan={100}
                      style={{ fontSize: 20, fontWeight: "bold" }}
                    >
                      No results
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-5">
            {totalPages > 1 && (
              <PaginationControls
                currentPage={activePage}
                totalPages={totalPages}
                onPageChange={handlePaginationChange}
                showEntriesInfo
                pageSize={pageSize}
              />
            )}
          </div>
        </Card>
      </Container>
    </>
  );
};

export default HistopathLandingPage;
