import Head from "next/head";
import Search from "@/components/Search";
import { Col, Container, Form, Row } from "react-bootstrap";
import {
  AlleleSymbol,
  Card,
  LoadingProgressBar,
  SortableTable,
} from "@/components";
import { useEffect, useMemo, useState } from "react";
import { mapAttributes, mapAdditionalAttributes } from "./attributes";
import { useQuery } from "@tanstack/react-query";
import { groupBy, uniq } from "lodash";
import { maybe } from "acd-utils";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { BodySystem } from "@/components/BodySystemIcon";
import { formatAlleleSymbol } from "@/utils";

const mapLabels = {
  "impc-gene": "GENE",
  "ensembl-gene": "ENSEMBL",
  "mp-id": "MP",
  "hp-id": "HP",
  "decipher-id": "DISEASE",
  anatomy: "ANATOMY",
  "human-marker-symbol": "MARKER SYMBOL",
  "mouse-marker-symbol": "MARKER SYMBOL",
};

const mapPlaceholders = {
  "impc-gene": "MGI:106209",
  "ensembl-gene": "ENSMUSG00000011257",
  "mp-id": "MP:0001926",
  "hp-id": "HP:0000400",
  "decipher-id": "OMIM:100300, ORPHA:93, DECIPHER:17",
  anatomy: "MA:0003077, EMAPA:35955",
  "human-marker-symbol": "Ca4, CA4",
  "mouse-marker-symbol": "Car4, CAR4",
};

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
  const [typeSelection, setTypeSelection] = useState<"byID" | "bySymbol">(
    "byID"
  );
  const [idSelection, setIDSelection] = useState("impc-gene");
  const [symbolSelection, setSymbolSelection] = useState("human-marker-symbol");
  const [geneIds, setGeneIds] = useState<string>(undefined);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const attributes =
    typeSelection === "byID"
      ? mapAttributes[idSelection]
      : mapAttributes[symbolSelection];
  const additionalAttributes =
    typeSelection === "byID"
      ? mapAdditionalAttributes[idSelection]
      : mapAdditionalAttributes[symbolSelection];
  const selectedKey = typeSelection === "byID" ? idSelection : symbolSelection;

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

  const { data: results, isFetching } = useQuery({
    queryKey: ["batch-query", geneIdArray],
    queryFn: () => {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Accept", "application/json");
      return fetch("http://localhost:8020/proxy/query", {
        method: "POST",
        body: JSON.stringify({ mgi_ids: geneIdArray }),
        headers,
      }).then((res) => res.json());
    },
    enabled: geneIdArray.length > 0 && !!formSubmitted,
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
              .map((d) =>
                maybe(d.topLevelPhenotypes)
                  .map((systems) => systems.map((s) => s.name).join(","))
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

  console.log(results);

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
          <h3>Datatype input</h3>
          <Form>
            <Row style={{ alignItems: "center" }}>
              <Col xs="auto">
                <Form.Check
                  type="radio"
                  id="queryByID"
                  label="by ID"
                  name="datatype-selection"
                  checked={typeSelection === "byID"}
                  onChange={() => setTypeSelection("byID")}
                />
              </Col>
              <Col xs="auto">
                <Form.Select
                  value={idSelection}
                  onChange={(e) => setIDSelection(e.target.value)}
                  disabled={typeSelection !== "byID"}
                >
                  <option value="impc-gene">IMPC Gene</option>
                  <option value="ensembl-gene" disabled>
                    Ensembl Gene
                  </option>
                  <option value="mp-id" disabled>
                    MP ID
                  </option>
                  <option value="hp-id" disabled>
                    HP ID
                  </option>
                  <option value="decipher-id" disabled>
                    OMIM/ORPHANET/DECIPHER
                  </option>
                  <option value="anatomy" disabled>
                    Anatomy
                  </option>
                </Form.Select>
              </Col>
              <Col xs="auto">
                <Form.Check
                  type="radio"
                  id="queryBySymbol"
                  label="by symbol"
                  name="datatype-selection"
                  checked={typeSelection === "bySymbol"}
                  onChange={() => setTypeSelection("bySymbol")}
                  disabled
                />
              </Col>
              <Col xs="auto">
                <Form.Select
                  value={symbolSelection}
                  onChange={(e) => setSymbolSelection(e.target.value)}
                  disabled={typeSelection !== "bySymbol"}
                >
                  <option value="human-marker-symbol">
                    Human marker symbol
                  </option>
                  <option value="mouse-marker-symbol">
                    Mouse marker symbol
                  </option>
                </Form.Select>
              </Col>
            </Row>
          </Form>
          <Form className="mt-4">
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>List of ID's</strong>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={mapPlaceholders[selectedKey]}
                onChange={(e) => setGeneIds(e.target.value)}
              />
            </Form.Group>
          </Form>
          <h3 className="mt-4">Customized output</h3>
          <Form>
            <fieldset disabled>
              <Row>
                <div className="mb-2 mt-2">
                  <strong>{mapLabels[selectedKey]} attributes</strong>
                </div>
                {attributes.map((field) => (
                  <Col key={field.value} xs="3">
                    <Form.Check
                      type="checkbox"
                      id={`${selectedKey}-${field.value}`}
                      label={field.label}
                      defaultChecked={field.defaultOn}
                    />
                  </Col>
                ))}
              </Row>
            </fieldset>
          </Form>
          <div className="mb-2 mt-2">
            <strong>Additional annotations to {mapLabels[selectedKey]}</strong>
          </div>
          <Form>
            <fieldset disabled>
              <Row>
                {additionalAttributes.map((field) => (
                  <Col key={field.value} xs="3">
                    <Form.Check
                      type="checkbox"
                      id={`${selectedKey}-${field.value}`}
                      label={field.label}
                      defaultChecked={field.defaultOn}
                    />
                  </Col>
                ))}
              </Row>
            </fieldset>
          </Form>
          <div>
            <button
              onClick={() => setFormSubmitted(true)}
              className="btn impc-primary-button"
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
          {!!results && (
            <SortableTable
              headers={[
                { width: 1, label: "MGI accession id", field: "geneId" },
                { width: 1, label: "Marker symbol", field: "geneSymbol" },
                { width: 1, label: "Human gene symbol", field: "humanSymbols" },
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
          )}
        </Card>
      </Container>
    </>
  );
};

export default BatchQueryPage;
