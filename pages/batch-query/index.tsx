import Head from "next/head";
import Search from "@/components/Search";
import { Col, Container, Form, Row } from "react-bootstrap";
import { Card } from "@/components";
import { useEffect, useMemo, useState } from "react";
import { mapAttributes, mapAdditionalAttributes } from "./attributes";
import { useQuery } from "@tanstack/react-query";
import { groupBy } from "lodash";

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

  const { data } = useQuery({
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
    select: (data) => {
      const resultsByAllele = groupBy(data, "alleleSymbol");
    },
  });

  console.log(data);

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
          <div>
            <button
              onClick={() => setFormSubmitted(true)}
              className="btn impc-primary-button"
            >
              Submit
            </button>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default BatchQueryPage;
