import Head from "next/head";
import Search from "@/components/Search";
import { Container, Form, Spinner, Tabs, Tab, Alert } from "react-bootstrap";
import {
  AlleleSymbol,
  Card,
  LoadingProgressBar,
  SortableTable,
} from "@/components";
import { ChangeEvent, useEffect, useMemo, useReducer, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { groupBy, uniq } from "lodash";
import { maybe } from "acd-utils";
import Link from "next/link";
import { BodySystem } from "@/components/BodySystemIcon";
import { formatAlleleSymbol } from "@/utils";
import {
  initialState,
  reducer,
  toogleFlagPayload,
} from "@/utils/batchQuery/reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const BATCH_QUERY_API_ROOT = process.env.NEXT_PUBLIC_BATCH_QUERY_API_ROOT || "";

type Phenotype = {
  id: string;
  name: string;
};

type BatchQueryItem = {
  alleleAccessionId: string;
  alleleName: string;
  alleleSymbol: string;
  dataType: string;
  displayPhenotype: Phenotype | null;
  effectSize: null | string;
  femaleMutantCount: number | null;
  hgncGeneAccessionId: string;
  humanGeneSymbol: string;
  humanPhenotypes: any[];
  id: string;
  intermediatePhenotypes: Phenotype[] | null;
  lifeStageName: string;
  maleMutantCount: number | null;
  metadataGroup: string;
  mgiGeneAccessionId: string;
  pValue: null | string;
  parameterName: string;
  parameterStableId: string;
  phenotypeSexes: string[] | null;
  phenotypingCentre: string;
  pipelineStableId: string;
  potentialPhenotypes: Phenotype[] | null;
  procedureMinAnimals: number | null;
  procedureMinFemales: number | null;
  procedureMinMales: number | null;
  procedureName: string;
  procedureStableId: string;
  projectName: string;
  significant: boolean;
  significantPhenotype: Phenotype | null;
  statisticalMethod: null | string;
  statisticalResultId: string;
  status: string;
  topLevelPhenotypes: Phenotype[] | null;
  zygosity: string;
};

const DataRow = ({ geneData }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr>
        <td>
          <Link className="link primary" href={`/genes/${geneData.geneId}`}>
            {geneData.geneId}
          </Link>
        </td>
        <td>{geneData.geneSymbol}</td>
        <td>{geneData.humanSymbols.join(",") || "info not available"}</td>
        <td>{geneData.humanGeneIds.join(",") || "info not available"}</td>
        <td>{geneData.allPhenotypes.length}</td>
        <td>{geneData.allSigSystems.length}</td>
        <td>
          <button className="btn" onClick={() => setOpen(!open)}>
            {open ? "Close" : "View"}
          </button>
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
                    </td>
                    <td>{alleleData.significantPhenotypes.length}</td>
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

const BatchQueryPage = () => {
  const [geneIds, setGeneIds] = useState<string>(undefined);
  const [file, setFile] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const downloadButtonIsBusy =
    state.isBusyJSON || state.isBusyTSV || state.isBusyXLSX;

  const geneIdArray = useMemo(() => {
    const regex = /(MGI:\d+),?/g;
    return [...(geneIds?.matchAll(regex) || [])].map((res) => res[1]);
  }, [geneIds]);

  useEffect(() => {
    // case 1: user updated input
    if (!!geneIds && formSubmitted === true) {
      setFormSubmitted(false);
    }
  }, [geneIds, formSubmitted]);

  const getBody = () => {
    let body;
    if (!!file) {
      const data = new FormData();
      data.append("file", file);
      body = data;
    } else {
      body = JSON.stringify({ mgi_ids: geneIdArray });
    }
    return body;
  };

  const { data: results, isFetching } = useQuery({
    queryKey: ["batch-query", geneIdArray],
    queryFn: () => {
      const headers = new Headers();
      headers.append("Accept", "application/json");
      if (geneIdArray.length > 0) {
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
    select: (data: Array<BatchQueryItem>) => {
      const results = {};
      const resultsByGene = groupBy(data, "id");
      for (const [geneId, geneData] of Object.entries(resultsByGene)) {
        const geneSymbol = geneData[0]?.alleleSymbol.split("<")[0];
        const resultsByAllele = groupBy(geneData, "alleleSymbol");
        const sigSystemsSet = new Set<string>();
        const sigPhenotypesSet = new Set<string>();
        const lifeStagesSet = new Set<string>();
        results[geneSymbol] = {
          humanSymbols: uniq(geneData.map((d) => d.humanGeneSymbol)),
          humanGeneIds: uniq(geneData.map((d) => d.hgncGeneAccessionId)),
          geneId,
          allSigSystems: [],
          allPhenotypes: [],
          allSigLifeStages: [],
          alleles: [],
        };
        for (const [allele, alleleData] of Object.entries(resultsByAllele)) {
          const significantData = alleleData.filter(
            (d) => d.significant === true
          );
          const restOfData = alleleData.filter((d) => d.significant === false);
          const getSigPhenotypeNames = (data: Array<BatchQueryItem>) => {
            return data
              .map((d) =>
                maybe(d.significantPhenotype)
                  .map((p) => p.name)
                  .getOrElse(undefined)
              )
              .filter(Boolean);
          };
          const getTopLevelPhenotypeNames = (data: Array<BatchQueryItem>) => {
            return data
              .flatMap((d) =>
                maybe(d.topLevelPhenotypes)
                  .map((systems) => systems.map((s) => s.name))
                  .getOrElse(undefined)
              )
              .filter(Boolean);
          };
          const alleleSigPhenotypes = uniq(
            getSigPhenotypeNames(significantData)
          );
          const alleleSigSystems = uniq(
            getTopLevelPhenotypeNames(significantData)
          );
          const alleleSigLifeStages = uniq(
            significantData.map((d) => d.lifeStageName)
          );

          alleleSigPhenotypes.forEach((p) => sigPhenotypesSet.add(p));
          alleleSigSystems.forEach((s) => sigSystemsSet.add(s));
          alleleSigLifeStages.forEach((l) => lifeStagesSet.add(l));

          results[geneSymbol].alleles.push({
            significantPhenotypes: alleleSigPhenotypes,
            otherPhenotypes: uniq(getSigPhenotypeNames(restOfData)),
            significantLifeStages: alleleSigLifeStages,
            significantSystems: alleleSigSystems,
            otherSystems: uniq(getTopLevelPhenotypeNames(restOfData)),
            allele,
          });
        }
        results[geneSymbol].allSigSystems = [...sigSystemsSet];
        results[geneSymbol].allPhenotypes = [...sigPhenotypesSet];
        results[geneSymbol].allPhenotypes = [...sigPhenotypesSet];
      }
      return Object.entries(results).map(([geneSymbol, geneData]) => {
        return {
          geneSymbol,
          ...(geneData as any),
        };
      });
    },
  });

  const fetchAndDownloadData = async (payload: toogleFlagPayload) => {
    if (geneIdArray?.length > 0 || !!file) {
      const headers = new Headers();
      headers.append("Response-Format", payload.toLowerCase());
      if (geneIdArray.length > 0) {
        headers.append("Content-Type", "application/json");
      }
      dispatch({ type: "toggle", payload });
      const body = getBody();
      const resp = await fetch(BATCH_QUERY_API_ROOT, {
        method: "POST",
        body,
        headers,
      });
      const blob = await resp.blob();
      const objUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", objUrl);
      link.setAttribute("download", "batch-query-data-" + payload);
      link.click();
      URL.revokeObjectURL(objUrl);
      dispatch({ type: "toggle", payload });
    }
  };

  const downloadButtons = useMemo(
    () => [
      {
        key: "TSV",
        isBusy: state.isBusyTSV,
        toogleFlag: () => fetchAndDownloadData("TSV"),
      },
      {
        key: "JSON",
        isBusy: state.isBusyJSON,
        toogleFlag: () => fetchAndDownloadData("JSON"),
      },
      {
        key: "XLSX",
        isBusy: state.isBusyXLSX,
        toogleFlag: () => fetchAndDownloadData("XLSX"),
      },
    ],
    [state, geneIds, file]
  );

  return (
    <>
      <Head>
        <title>
          IMPC dataset batch query | International Mouse Phenotyping Consortium
        </title>
      </Head>
      <Search />
      <Container className="page">
        <Card>
          <h1 className="mb-4 mt-2">
            <strong>IMPC Dataset Batch Query</strong>
          </h1>
          <Tabs className="mt-4">
            <Tab eventKey="paste-your-list" title="Paste your list">
              <Form className="mt-3">
                <Form.Group>
                  <Form.Label>
                    <strong>List of ID's</strong>
                  </Form.Label>
                  <br />
                  <Form.Text className="text-muted">
                    Please format your list like this example:
                    MGI:104785,MGI:97591,etc
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
              disabled={isFetching || downloadButtonIsBusy}
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
          {!!results ? (
            <>
              <SortableTable
                headers={[
                  { width: 1, label: "MGI accession id", field: "geneId" },
                  { width: 1, label: "Marker symbol", field: "geneSymbol" },
                  {
                    width: 1,
                    label: "Human gene symbol",
                    field: "humanSymbols",
                  },
                  { width: 1, label: "Human gene id", field: "humanGeneIds" },
                  {
                    width: 1,
                    label: "# of significant phenotypes",
                    field: "allPhenotypes",
                  },
                  {
                    width: 1,
                    label: "# of systems impacted",
                    field: "allSigSystems",
                  },
                  { width: 1, label: "View allele info", disabled: true },
                ]}
              >
                {results.map((geneData) => (
                  <DataRow geneData={geneData} />
                ))}
              </SortableTable>
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
                          {button.key}
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : !isFetching ? (
            <i className="grey">
              Data will appear here after clicking the submit button.
            </i>
          ) : null}
        </Card>
      </Container>
    </>
  );
};

export default BatchQueryPage;