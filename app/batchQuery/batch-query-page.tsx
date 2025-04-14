"use client";

import Search from "@/components/Search";
import { Container, Form, Tabs, Tab, Alert, Modal } from "react-bootstrap";
import { AlleleSymbol, Card, LoadingProgressBar } from "@/components";
import {
  ChangeEvent,
  Suspense,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { orderBy } from "lodash";
import {
  initialState,
  reducer,
  toogleFlagPayload,
} from "@/utils/batchQuery/reducer";
import { SelectedAlleleData, SelectOptions } from "@/models";
import moment from "moment";
import { Metadata } from "next";
import { useBatchQuery } from "@/hooks";
import { BatchQueryResults } from "./batch-query-results";

const BATCH_QUERY_DOWNLOAD_ROOT =
  process.env.NEXT_PUBLIC_BATCH_QUERY_DOWNLOAD_ROOT || "";

type SortOptions = {
  prop: string | ((any) => void);
  order: "asc" | "desc";
};

export const metadata: Metadata = {
  title:
    "IMPC dataset batch query | International Mouse Phenotyping Consortium",
};

const BatchQueryPage = () => {
  const [geneIds, setGeneIds] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);
  const [fileIDCount, setFileIDCount] = useState<number | null>(null);
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
    useState<SelectedAlleleData | null>(null);

  const downloadButtonIsBusy =
    state.isBusyJSON || state.isBusyTSV || state.isBusyXLSX;

  const handleClose = () => setSelectedAlleleData(null);

  const geneIdArray: Array<string> = useMemo(() => {
    const regex = /(MGI:\d+),?/g;
    return [...(geneIds?.matchAll(regex) || [])].map((res) => res[1]);
  }, [geneIds]);

  useEffect(() => {
    // case 1: user updated input (list or file)
    if ((!!geneIds || !!file) && formSubmitted) {
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

  const { data: results, isFetching } = useBatchQuery(
    tab,
    geneIdArray,
    file,
    formSubmitted,
    downloadButtonIsBusy,
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
            gene.allSignificantSystems.includes(system),
          ),
        )
      : results;
    intermediateRes = selectedPhenotypes.length
      ? intermediateRes.filter((gene) =>
          selectedPhenotypes.every((phenotype) =>
            gene.allSignificantPhenotypes.includes(phenotype),
          ),
        )
      : intermediateRes;
    return intermediateRes;
  }, [results, selectedSystems, selectedPhenotypes]);

  const selectOptions = useMemo(() => {
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
      const phenotypeSelectOptions: SelectOptions = [];
      const systemSelectOptions: SelectOptions = [];
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
        allSignificantSystems: systemSelectOptions,
      };
    }
    return {
      phenotypeSelectOptions: [] as SelectOptions,
      systemSelectOptions: [] as SelectOptions,
      allSignificantSystems: [] as SelectOptions,
    };
  }, [filteredData]);

  const sortedData = useMemo(() => {
    if (
      sortOptions.prop === "allSignificantPhenotypes" ||
      sortOptions.prop === "allSignificantSystems"
    ) {
      const { prop, order } = sortOptions;
      return filteredData?.sort((a, b) =>
        order === "asc"
          ? a[prop].length - b[prop].length
          : b[prop].length - a[prop].length,
      );
    }
    return orderBy(filteredData, sortOptions.prop, sortOptions.order);
  }, [filteredData, sortOptions]);

  const fetchFilteredDataset = async (
    payload: toogleFlagPayload,
    pathURL: string,
    zippedFile: boolean,
  ) => {
    let body;
    if (tab === "upload-your-list") {
      const data = new FormData();
      data.append("file", file);
      body = data;
    } else {
      body = JSON.stringify({ mgi_ids: geneIdArray });
    }
    dispatch({ type: "toggle", payload });
    const url = `${BATCH_QUERY_DOWNLOAD_ROOT}${pathURL}?`;
    let acceptHeader = "application/json";
    switch (payload) {
      case "TSV":
        acceptHeader = "text/tab-separated-values";
        break;
      case "XLSX":
        acceptHeader = "application/vnd.ms-excel";
        break;
      case "JSON":
      case "SummaryJSON":
      default:
        break;
    }
    const response = await fetch(url, {
      method: "POST",
      body,
      headers: {
        Accept: acceptHeader,
      },
    });
    const fileData = await response.blob();
    const objUrl = window.URL.createObjectURL(fileData);
    const a = document.createElement("a");
    a.href = objUrl;
    if (zippedFile) {
      a.download = `batch-query-${moment(new Date()).format("YYYY-MM-DD")}.zip`;
    } else {
      const extension =
        payload === "JSON" || payload === "SummaryJSON"
          ? "json"
          : payload === "TSV"
            ? "tsv"
            : "xlsx";
      a.download = `batch-query-${moment(new Date()).format("YYYY-MM-DD")}.${extension}`;
    }
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
          <BatchQueryResults
            sortedData={sortedData ?? []}
            hasMoreThan1000Ids={
              geneIdArray?.length >= 1000 || fileIDCount >= 1000
            }
            isFetching={isFetching}
            numberTotalGenes={sortedData?.length ?? 0}
            isDataAvailable={!!filteredData}
            downloadButtonsState={state}
            selectOptions={selectOptions}
            actualResults={results?.length ?? 0}
            selectedSystems={selectedSystems}
            selectedPhenotypes={selectedPhenotypes}
            updateSelectedSystems={updateSelectedSystems}
            fetchFilteredDataset={fetchFilteredDataset}
            updateSelectedPhenotypes={updateSelectedPhenotypes}
            setSortOptions={setSortOptions}
            setSelectedAlleleData={setSelectedAlleleData}
          />
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
