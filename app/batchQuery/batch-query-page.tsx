"use client";

import Search from "@/components/Search";
import {
  Container,
  Form,
  Spinner,
  Tabs,
  Tab,
  Alert,
  Modal,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import {
  AlleleSymbol,
  Card,
  LoadingProgressBar,
  Pagination,
  SortableTable,
} from "@/components";
import {
  ChangeEvent,
  Suspense,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { orderBy } from "lodash";
import Link from "next/link";
import { BodySystem } from "@/components/BodySystemIcon";
import { formatAlleleSymbol } from "@/utils";
import {
  initialState,
  reducer,
  toogleFlagPayload,
} from "@/utils/batchQuery/reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { SortType } from "@/models";
import moment from "moment";

const BATCH_QUERY_API_ROOT = process.env.NEXT_PUBLIC_BATCH_QUERY_API_ROOT || "";
const BATCH_QUERY_DOWNLOAD_ROOT =
  process.env.NEXT_PUBLIC_BATCH_QUERY_DOWNLOAD_ROOT || "";

type BatchQueryItem = {
  geneId: string;
  mouseGeneSymbol: string;
  humanGeneIds: string | Array<string>;
  humanGeneSymbols: string | Array<string>;
  allSignificantSystems: Array<string>;
  allSignificantPhenotypes: Array<string>;
  alleles: Array<{
    allele: string;
    significantPhenotypes: Array<string>;
    significantLifeStages: Array<string>;
    significantSystems: Array<string>;
    notSignificantPhenotypes: Array<string>;
    notSignificantSystems: Array<string>;
  }>;
};

type SortOptions = {
  prop: string | ((any) => void);
  order: "asc" | "desc";
};

type SelectedAlleleData = {
  alelleSymbol: string;
  phenotypes: Array<string>;
};

const formatOptionLabel = ({ value, label, numHits }, { context }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <BodySystem
        name={value}
        color="grey"
        noSpacing
        noMargin={context === "value"}
      />
      {context === "menu" && (
        <>
          <span>{label}</span>
          &nbsp;-&nbsp;<i className="grey small">{numHits} gene(s)</i>
        </>
      )}
    </div>
  );
};

const formatPhenotypeLabel = (option, { context }) => (
  <div>
    <span>{option.label}</span>
    {context === "menu" && (
      <>
        &nbsp;-&nbsp;<i className="grey small">{option.numHits} gene(s)</i>
      </>
    )}
  </div>
);

type DataRowProps = {
  geneData: BatchQueryItem;
  onPhenotypeLinkClick: (data: SelectedAlleleData) => void;
};

const DataRow = ({ geneData, onPhenotypeLinkClick }: DataRowProps) => {
  const [open, setOpen] = useState(false);
  const { mouseGeneSymbol, geneId, humanGeneIds, humanGeneSymbols } = geneData;
  return (
    <>
      <tr>
        <td>
          <Link className="link primary" href={`/genes/${geneData.geneId}`}>
            {geneId}
          </Link>
        </td>
        <td>{mouseGeneSymbol}</td>
        <td>{humanGeneIds?.toString() || "data not available"}</td>
        <td>{humanGeneSymbols?.toString() || "data not available"}</td>
        <td>{geneData.allSignificantPhenotypes.length}</td>
        <td>{geneData.allSignificantSystems.length}</td>
        <td>
          <Button
            className="impc-secondary-button small"
            onClick={() => setOpen(!open)}
          >
            {open ? "Close" : `${geneData.alleles.length} allele(s)`}
            &nbsp;
            <FontAwesomeIcon
              className="link"
              icon={open ? faChevronUp : faChevronDown}
            />
          </Button>
        </td>
      </tr>
      {open && (
        <tr>
          <td></td>
          <td colSpan={6} style={{ padding: 0 }}>
            <SortableTable
              withMargin={false}
              headers={[
                {
                  width: 1,
                  label: "Allele symbol",
                  field: "allele",
                  disabled: true,
                },
                {
                  width: 2,
                  label: "Significant systems",
                  field: "significantSystems",
                  disabled: true,
                },
                {
                  width: 1,
                  label: "# of significant phenotypes",
                  field: "significantPhenotypes",
                  disabled: true,
                },
              ]}
            >
              {geneData.alleles.map((alleleData) => {
                return (
                  <tr>
                    <td>
                      <Link
                        className="link primary"
                        href={`alleles/${geneData.geneId}/${
                          formatAlleleSymbol(alleleData.allele)[1]
                        }`}
                      >
                        <AlleleSymbol
                          symbol={alleleData.allele}
                          withLabel={false}
                        />
                      </Link>
                    </td>
                    <td>
                      {alleleData.significantSystems.map((system, index) => (
                        <BodySystem
                          key={index}
                          name={system}
                          color="system-icon in-table"
                          noSpacing
                        />
                      ))}
                      {alleleData.significantSystems.length === 0 &&
                        "No significant system associated"}
                    </td>
                    <td>
                      {alleleData.significantPhenotypes.length > 0 ? (
                        <Button
                          className="impc-secondary-button small"
                          onClick={() =>
                            onPhenotypeLinkClick({
                              alelleSymbol: alleleData.allele,
                              phenotypes: alleleData.significantPhenotypes,
                            })
                          }
                        >
                          View {alleleData.significantPhenotypes.length}{" "}
                          phenotype(s)
                        </Button>
                      ) : (
                        0
                      )}
                    </td>
                  </tr>
                );
              })}
            </SortableTable>
          </td>
        </tr>
      )}
    </>
  );
};

export const metadata: Metadata = {
  title:
    "IMPC dataset batch query | International Mouse Phenotyping Consortium",
};

const BatchQueryPage = () => {
  const [geneIds, setGeneIds] = useState<string>(undefined);
  const [file, setFile] = useState<File>(null);
  const [fileIDCount, setFileIDCount] = useState<number>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedSystems, setSelectedSystems] = useState([]);
  const [selectedPhenotypes, setSelectedPhenotypes] = useState([]);
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    prop: "mouseGeneSymbol",
    order: "asc" as const,
  });
  const [tab, setTab] = useState("paste-your-list");
  const [selectedAlleleData, setSelectedAlleleData] =
    useState<SelectedAlleleData>(null);
  const defaultSort: SortType = useMemo(() => ["mouseGeneSymbol", "asc"], []);
  const downloadButtonIsBusy =
    state.isBusyJSON || state.isBusyTSV || state.isBusyXLSX;

  const handleClose = () => setSelectedAlleleData(null);

  const geneIdArray = useMemo(() => {
    const regex = /(MGI:\d+),?/g;
    return [...(geneIds?.matchAll(regex) || [])].map((res) => res[1]);
  }, [geneIds]);

  useEffect(() => {
    // case 1: user updated input (list or file)
    if ((!!geneIds || !!file) && formSubmitted === true) {
      setFormSubmitted(false);
    }
  }, [geneIds, formSubmitted, file]);

  useEffect(() => {
    if (file) {
      file.text().then((fileContents) => {
        const ids = fileContents.split("\n");
        if (ids.length !== fileIDCount) {
          setFileIDCount(ids.length);
        }
      });
    }
  }, [file, fileIDCount]);

  const getBody = () => {
    let body;
    if (tab === "upload-your-list") {
      const data = new FormData();
      data.append("file", file);
      body = data;
    } else {
      body = JSON.stringify({ mgi_ids: geneIdArray });
    }
    return body;
  };

  const { data: results, isFetching } = useQuery<Array<BatchQueryItem>>({
    queryKey: ["batch-query", geneIdArray, file, tab],
    queryFn: () => {
      const headers = new Headers();
      headers.append("Accept", "application/json");
      if (tab === "paste-your-list") {
        headers.append("Content-Type", "application/json");
      }
      const body = getBody();

      return fetch(BATCH_QUERY_API_ROOT, {
        method: "POST",
        body,
        headers,
      }).then((res) => res.json());
    },
    enabled:
      (geneIdArray.length > 0 || !!file) &&
      !!formSubmitted &&
      !downloadButtonIsBusy,
    select: (response: any) => {
      const { results, notFoundIds } = response;
      return results.map((gene) => ({
        ...gene,
        alleles: gene.alleles.toSorted(
          (a1, a2) =>
            a2.significantPhenotypes.length - a1.significantPhenotypes.length
        ),
      }));
    },
  });

  const downloadButtons = useMemo(
    () => [
      {
        key: "JSON",
        isBusy: state.isBusyJSON,
        toogleFlag: () => fetchFilteredDataset("application/JSON"),
      },
    ],
    [state, geneIds, file, tab],
  );

  const updateSelectedSystems = (selectedOptions) => {
    setSelectedSystems(selectedOptions.map((opt) => opt.value));
  };

  const updateSelectedPhenotypes = (selectedOptions) => {
    setSelectedPhenotypes(selectedOptions.map((opt) => opt.value));
  };

  const filteredData = useMemo(() => {
    let intermediateRes = selectedSystems.length
      ? results.filter((gene) =>
          selectedSystems.every((system) =>
            gene.allSignificantSystems.includes(system)
          )
        )
      : results;
    intermediateRes = selectedPhenotypes.length
      ? intermediateRes.filter((gene) =>
          selectedPhenotypes.every((phenotype) =>
            gene.allSignificantPhenotypes.includes(phenotype)
          )
        )
      : intermediateRes;
    return intermediateRes;
  }, [results, selectedSystems, selectedPhenotypes]);

  const { systemSelectOptions, phenotypeSelectOptions } = useMemo(() => {
    if (filteredData?.length) {
      const phenotypeResultsMap = new Map<string, number>();
      const systemsMap = new Map<string, number>();
      filteredData
        .flatMap((r) => r.allSignificantPhenotypes)
        .forEach((phenotype) => {
          if (phenotypeResultsMap.has(phenotype)) {
            const newVal = phenotypeResultsMap.get(phenotype) + 1;
            phenotypeResultsMap.set(phenotype, newVal);
          } else {
            phenotypeResultsMap.set(phenotype, 1);
          }
        });
      filteredData
        .flatMap((r) => r.allSignificantSystems)
        .forEach((system) => {
          if (systemsMap.has(system)) {
            const newVal = systemsMap.get(system) + 1;
            systemsMap.set(system, newVal);
          } else {
            systemsMap.set(system, 1);
          }
        });
      const phenotypeSelectOptions = [];
      const systemSelectOptions = [];
      for (const [phenotype, numHits] of phenotypeResultsMap) {
        phenotypeSelectOptions.push({
          value: phenotype,
          label: phenotype,
          numHits,
        });
      }
      for (const [system, numHits] of systemsMap) {
        systemSelectOptions.push({ value: system, label: system, numHits });
      }
      phenotypeSelectOptions.sort((op1, op2) => op2.numHits - op1.numHits);
      systemSelectOptions.sort((op1, op2) => op2.numHits - op1.numHits);
      return {
        phenotypeSelectOptions,
        systemSelectOptions,
      };
    }
    return { phenotypeSelectOptions: [], systemSelectOptions: [] };
  }, [filteredData]);

  const sortedData = useMemo(() => {
    if (
      sortOptions.prop === "allSignificantPhenotypes" ||
      sortOptions.prop === "allSignificantSystems"
    ) {
      const { prop, order } = sortOptions;
      return filteredData.sort((a, b) =>
        order === "asc"
          ? a[prop].length - b[prop].length
          : b[prop].length - a[prop].length
      );
    }
    return orderBy(filteredData, sortOptions.prop, sortOptions.order);
  }, [filteredData, sortOptions]);

  const fetchFilteredDataset = async (payload: toogleFlagPayload) => {
    const body = getBody();
    dispatch({ type: "toggle", payload });
    const response = await fetch(BATCH_QUERY_DOWNLOAD_ROOT, {
      method: "POST",
      body,
    });
    const fileData = await response.blob();
    const url = window.URL.createObjectURL(fileData);
    const a = document.createElement("a");
    a.href = url;
    a.download = `batch-query-${moment(new Date()).format("YYYY-MM-DD")}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    dispatch({ type: "toggle", payload });
  };

  return (
    <>
      <Suspense>
        <Search />
      </Suspense>
      <Container className="page">
        <Card>
          <h1 className="mb-4 mt-2">
            <strong>IMPC Dataset Batch Query</strong>
          </h1>
          <Tabs className="mt-4" onSelect={(e) => setTab(e)}>
            <Tab eventKey="paste-your-list" title="Paste your list">
              <Form className="mt-3">
                <Form.Group>
                  <Form.Label>
                    <strong>List of ID's</strong>
                  </Form.Label>
                  <br />
                  <Form.Text className="text-muted">
                    Please format your list like this: MGI:104785,MGI:97591
                  </Form.Text>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    onChange={(e) => setGeneIds(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Tab>
            <Tab eventKey="upload-your-list" title="Upload your list from file">
              <Form className="mt-3">
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>
                    Supports new line separated identifier list. Please DO NOT
                    submit a mix of identifiers from different datatypes.
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="text/plain"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFile(e.currentTarget.files[0])
                    }
                  />
                </Form.Group>
              </Form>
            </Tab>
          </Tabs>
          <div className="mt-4">
            {formSubmitted && (geneIdArray?.length === 0 || file === null) && (
              <Alert variant="warning">Please enter a list of ID's</Alert>
            )}
            <button
              onClick={() => setFormSubmitted(true)}
              className="btn impc-primary-button"
              disabled={
                isFetching ||
                downloadButtonIsBusy ||
                geneIdArray?.length >= 1000 ||
                fileIDCount >= 1000
              }
            >
              Submit
            </button>
          </div>
        </Card>
        <Card>
          <h2>Results</h2>
          {isFetching && (
            <div
              className="mt-4"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <LoadingProgressBar />
            </div>
          )}
          {!!filteredData ? (
            <>
              <Row>
                <Col>
                  <div>
                    <span className="small grey">
                      Filter genes by physiological system&nbsp;
                    </span>
                    <Select
                      isMulti
                      options={systemSelectOptions}
                      formatOptionLabel={formatOptionLabel}
                      onChange={updateSelectedSystems}
                    />
                  </div>
                </Col>
                <Col>
                  <div>
                    <span className="small grey">
                      Filter genes by significant phenotype&nbsp;
                    </span>
                    <Select
                      isMulti
                      options={phenotypeSelectOptions}
                      formatOptionLabel={formatPhenotypeLabel}
                      onChange={updateSelectedPhenotypes}
                    />
                  </div>
                </Col>
              </Row>
              {!!sortedData.length ? (
                <>
                  <Pagination
                    data={sortedData}
                    topControlsWrapperCSS={{ marginTop: "1rem" }}
                    additionalTopControls={
                      (!!selectedSystems.length ||
                        !!selectedPhenotypes.length) && (
                        <div>
                          <b className="small grey">
                            Showing {sortedData?.length || 0} result(s) of&nbsp;
                            {results?.length || 0}
                          </b>
                        </div>
                      )
                    }
                  >
                    {(pageData) => (
                      <SortableTable
                        defaultSort={defaultSort}
                        doSort={(sort) =>
                          setSortOptions({ prop: sort[0], order: sort[1] })
                        }
                        headers={[
                          {
                            width: 1,
                            label: "MGI accession id",
                            field: "geneId",
                          },
                          {
                            width: 1,
                            label: "Marker symbol",
                            field: "mouseGeneSymbol",
                          },
                          {
                            width: 1,
                            label: "Human gene symbol",
                            field: "humanGeneSymbols",
                          },
                          {
                            width: 1,
                            label: "Human gene id",
                            field: "humanGeneIds",
                          },
                          {
                            width: 1,
                            label: "# of significant phenotypes",
                            field: "allSignificantPhenotypes",
                          },
                          {
                            width: 1,
                            label: "# of systems impacted",
                            field: "allSignificantSystems",
                          },
                          {
                            width: 1,
                            label: "View allele info",
                            disabled: true,
                          },
                        ]}
                      >
                        {pageData.map((geneData) => (
                          <DataRow
                            geneData={geneData}
                            onPhenotypeLinkClick={setSelectedAlleleData}
                          />
                        ))}
                      </SortableTable>
                    )}
                  </Pagination>
                  <div>
                    <div
                      className="grey"
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                      }}
                    >
                      {downloadButtons.map((button) => (
                        <button
                          key={button.key}
                          className="btn impc-secondary-button small"
                          onClick={button.toogleFlag}
                          disabled={button.isBusy}
                        >
                          {button.isBusy ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faDownload} size="sm" />
                              &nbsp;
                              {button.key}
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <h3 className="mt-3">No genes match the filters selected</h3>
              )}
            </>
          ) : geneIdArray?.length >= 1000 || fileIDCount >= 1000 ? (
            <>
              <Alert variant="warning">
                Because your list has more than 1,000 IDs, results won't be
                displayed. You can download the filtered data or the entire
                dataset.
              </Alert>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignSelf: "flex-start",
                }}
              >
                <button
                  className="btn impc-primary-button mb-3"
                  onClick={() => fetchFilteredDataset("application/JSON")}
                >
                  {state.isBusyJSON ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <FontAwesomeIcon icon={faDownload} size="sm" />
                  )}
                  &nbsp; Download filtered dataset JSON
                </button>
                <button className="btn impc-primary-button mb-3">
                  <FontAwesomeIcon icon={faDownload} size="sm" />
                  &nbsp; Download entire dataset (3.39GB) TSV
                </button>
                <button className="btn impc-primary-button mb-3">
                  <FontAwesomeIcon icon={faDownload} size="sm" />
                  &nbsp; Download entire dataset (6.47GB) JSON
                </button>
              </div>
            </>
          ) : !isFetching ? (
            <i className="grey">
              Data will appear here after clicking the submit button.
            </i>
          ) : null}
        </Card>
        <Modal size="lg" show={!!selectedAlleleData} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              Phenotypes for&nbsp;
              <AlleleSymbol
                symbol={selectedAlleleData?.alelleSymbol}
                withLabel={false}
              />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul>
              {selectedAlleleData?.phenotypes.map((phenotype) => (
                <li>{phenotype}</li>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn impc-secondary-button small"
              onClick={handleClose}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default BatchQueryPage;
