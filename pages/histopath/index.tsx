import Search from "../../components/Search";
import { Breadcrumb, Container } from "react-bootstrap";
import Card from "../../components/Card";
import styles from "./styles.module.scss";
import data from "../../mocks/data/landing-pages/histopath.json";
import { useEffect, useState } from "react";
import PaginationControls from "../../components/PaginationControls";
import { faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

const clone = obj => JSON.parse(JSON.stringify(obj));
const geneMap = new Map();

const HistopathLandingPage = () => {
  const router = useRouter();
  const [ heatmapData, setHeatmapData ] = useState([]);
  const [ query, setQuery ] = useState('');
  const [ originalData, setOriginalData ] = useState([]);
  const [ activePage, setActivePage ] = useState(1);
  const [ pageSize, setPageSize ] = useState(25);
  const [ selectedHeaderIndex, setSelectedHeaderIndex ] = useState<number>(null);
  const [ sort, setSort ] = useState<'asc' | 'desc' | 'none'>('none');
  const [ totalPages, setTotalPages ] = useState(Math.ceil(data.rows.length / pageSize));

  useEffect(() => {
    const result = {};
    data.geneSymbols.forEach((symbol, index) => {
      result[symbol] = { id: symbol, data: []};
      const geneData = data.rows[index];
      result[symbol].data = data.columnHeaders.map(
        (header, headerIndex) => ({
          x: header,
          y: geneData[headerIndex],
          geneSymbol: symbol,
          headerIndex
        })
      )
      geneMap.set(symbol, result[symbol]);
    });
    setHeatmapData(Object.values(result));
    setOriginalData(Object.values(result));
  }, []);

  useEffect(() => {
    let results;
    if (query) {
      results = originalData.filter(gene => gene.id.includes(query));
      setHeatmapData(results);
    } else if (originalData.length !== heatmapData.length){
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

  const getDataSlice = () => heatmapData.slice((activePage - 1) * pageSize, (activePage - 1) * pageSize + pageSize);

  const getCellColor = (value: number) => {
    switch (value) {
      case 4:
        return '#ce6211';
      case 2:
        return '#17a2b8';
      case 0:
        return '#FFF';
    }
  };

  const rewriteWithQuery = (symbol: string) => {
    if (query) {
      const matchRegex = new RegExp(`(${query})`, "");
      return symbol.replace(matchRegex, `<em>${query}</em>`);
    }
    return symbol;
  };

  const displayFixedTissueColumn = (geneSymbol: string) => {
    if (data.geneTissueMap[geneSymbol] !== undefined) {
      const mgiID = data.geneTissueMap[geneSymbol];
      return <a className="link primary" href={`/genes/${mgiID}#purchase`}>Yes</a>
    }
    return 'No';
  };

  const sortByHeader = (index: number) => {
    let newSort: 'asc' | 'desc' | 'none';
    if (sort === 'asc') {
      newSort = 'none';
    } else if (sort === 'desc') {
      newSort = 'asc';
    } else {
      newSort = 'desc';
    }
    if (index !== selectedHeaderIndex) {
      newSort = 'desc';
    }
    const currentData = clone(heatmapData);
    const newData = newSort !== 'none' ? currentData
      // merge all data in a single array
      .flatMap(item => item.data)
      // get only the column we are interested
      .filter(item => item.headerIndex === index)
      .sort((item1, item2) => {
        if (newSort === 'desc') {
          return item2.y - item1.y;
        }
        return item1.y - item2.y;
      })
      // regenerate array with original info
      .map(gene => ({...geneMap.get(gene.geneSymbol)})) :
      clone(originalData);

    setSort(newSort);
    setSelectedHeaderIndex(index);
    setHeatmapData(newData);
  }

  return (
    <>
      <Search />
      <Container className="page" style={{lineHeight: 2}}>
        <Card>
          <div className="subheading">
            <Breadcrumb>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>IMPC data collections</Breadcrumb.Item>
              <Breadcrumb.Item>Histopathology Data</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className="mb-4 mt-2">
            <strong>Histopathology Data</strong>
          </h1>
          <Container>
            <div className="card" style={{ backgroundColor: 'whitesmoke' }}>
              <div className="card-header" style={{ backgroundColor: 'whitesmoke' }}>Histopathology for every gene tested</div>
              <div className="card-body">
                <p className="my-0"><b>Significance Score:</b></p>
                <div>
                  <div title="No Data" className="mr-3">
                    <i className="fa fa-circle" style={{ color: '#FFF' }}></i>&nbsp;&nbsp;No Data
                  </div>
                  <div title="Not Significant" style={{color: '#17a2b8'}} className="mr-3">
                    <i className="fa fa-circle"></i>&nbsp;&nbsp;<b>Not Significant</b>&nbsp;
                    (histopathology finding that is interpreted by the
                    histopathologist to be within normal limits of background strain-related
                    findings or an incidental finding not related to genotype)
                  </div>
                  <div title="Significant" style={{color: '#ce6211'}} className="mr-3">
                    <i className="fa fa-circle"></i>&nbsp;&nbsp;<b>Significant</b>&nbsp;
                    (histopathology finding that is interpreted by the
                    histopathologist to not be a background strain-related finding or an incidental finding)
                  </div>
                </div>
              </div>
            </div>
          </Container>
          <div className={styles.topControls}>
            <div>
              Show
              <select
                name="pageSize"
                className="form-select"
                value={pageSize}
                onChange={e => setPageSize(Number.parseInt(e.target.value, 10))}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              entries
            </div>
            <div>
              Search:
              <input
                className="form-control"
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.tableWrapper}>
            <table className={`table table-striped table-bordered ${styles.heatMap}`}>
              <thead>
                <tr>
                  <th>
                    <div className={styles.header}>Gene</div>
                  </th>
                  <th>Fixed tissue available</th>
                  {data.columnHeaders.map((header, index) => (
                    <th key={header} onClick={() => sortByHeader(index)}>
                      <div className={styles.header}>{header}</div>
                      {index === selectedHeaderIndex && sort === 'desc' && (
                        <FontAwesomeIcon icon={faSortDown} />
                      )}
                      {index === selectedHeaderIndex && sort === 'asc' && (
                        <FontAwesomeIcon icon={faSortUp} />
                      )}
                      {(index !== selectedHeaderIndex || sort === 'none') && (
                        <FontAwesomeIcon icon={faSort} />
                      )}
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
                  {data.columnHeaders.map((header, index) => (
                    <th key={header} onClick={() => sortByHeader(index)}>
                      <div className={styles.header}>
                        {header}
                      </div>
                    </th>
                  ))}
                </tr>
              </tfoot>
              <tbody>
                {getDataSlice().map(gene => (
                  <tr key={gene.id}>
                    <td dangerouslySetInnerHTML={{ __html: rewriteWithQuery(gene.id) }}></td>
                    <td>{ displayFixedTissueColumn(gene.id) }</td>
                    {gene && gene.data && gene.data.map(cell => (
                      <td
                        className={styles.cellData}
                        key={`${gene.id}-${cell.x}`}
                        style={{ '--bs-table-bg-type': getCellColor(cell.y), cursor: cell.y > 0 ? 'pointer': 'auto' } as any}
                        onClick={() => {
                          if (cell.y > 0) {
                            window.open(`https://www.mousephenotype.org/data/histopath/${gene.id}?anatomy="${cell.x}"`);
                          }
                        }}
                      />
                    ))}
                  </tr>
                ))}
                {getDataSlice()?.length === 0 && (
                  <tr><td colSpan={100} style={{ fontSize: 20, fontWeight: 'bold' }}>No results</td></tr>
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
  )
};

export default HistopathLandingPage;