import Head from "next/head";
import Search from "@/components/Search";
import { Col, Container, Form, Row } from "react-bootstrap";
import { Card } from "@/components";
import { useState } from "react";

type Attributes = {
  label: string;
  value: string;
  defaultOn: boolean;
}

const geneAttributes: Array<Attributes> = [
  {label: 'MGI gene id', value: 'mgi-gene-id', defaultOn: true},
  {label: 'MGI gene symbol', value: 'mgi-gene-symbol', defaultOn: true},
  {label: 'Human ortholog', value: 'human-ortholog', defaultOn: true},
  {label: 'MGI marker synonym', value: 'mgi-marker-synonym', defaultOn: true},
  {label: 'MGI marker name', value: 'mgi-marker-name', defaultOn: true},
  {label: 'MGI marker type', value: 'mgi-marker-type', defaultOn: true},
  {label: 'Mouse status', value: 'mouse-status', defaultOn: true},
  {label: 'Phenotype status', value: 'phenotype-status', defaultOn: true},
  {label: 'ES Cell status', value: 'es-cell-status', defaultOn: false},
  {label: 'Project status', value: 'project-status', defaultOn: false},
  {label: 'Production center', value: 'production-center', defaultOn: false},
  {label: 'Phenotyping center', value: 'phenotyping-center', defaultOn: false},
];

const additionalGeneAttributes: Array<Attributes> = [
  {label: 'Ensembl gene id', value: 'ensembl-gene-id', defaultOn: false},
  {label: 'has QC', value: 'has-qc', defaultOn: false},
  {label: 'P-Value (phenotyping significance)', value: 'p-value', defaultOn: false},
  {label: 'MP id', value: 'mp-id', defaultOn: false},
  {label: 'MP term', value: 'mp-term', defaultOn: false},
  {label: 'MP term synonym', value: 'mp-term-synonym', defaultOn: false},
  {label: 'MP term definition', value: 'mp-term-definition', defaultOn: false},
  {label: 'HP id', value: 'hp-id', defaultOn: false},
  {label: 'HP term', value: 'hp-term', defaultOn: false},
  {label: 'Disease id', value: 'disease-id', defaultOn: false},
  {label: 'Disease term', value: 'disease-term', defaultOn: false},
];

const ensemblGeneAttributes: Array<Attributes> = [
  {label: 'MGI gene id', value: 'mgi-gene-id', defaultOn: true},
  {label: 'Ensembl gene id', value: 'ensembl-gene-id', defaultOn: true},
  {label: 'MGI gene symbol', value: 'mgi-gene-symbol', defaultOn: true},
  {label: 'Human ortholog', value: 'human-ortholog', defaultOn: true},
  {label: 'MGI marker synonym', value: 'mgi-marker-synonym', defaultOn: true},
  {label: 'MGI marker name', value: 'mgi-marker-name', defaultOn: true},
  {label: 'MGI marker type', value: 'mgi-marker-type', defaultOn: true},
  {label: 'Latest phenotype status', value: 'latest-phenotype-status', defaultOn: true},
  {label: 'Latests mouse status', value: 'latest-mouse-status', defaultOn: true},
  {label: 'ES Cell status', value: 'es-cell-status', defaultOn: false},
  {label: 'Project status', value: 'project-status', defaultOn: false},
  {label: 'Production center', value: 'production-center', defaultOn: false},
  {label: 'Phenotyping center', value: 'phenotyping-center', defaultOn: false},
];

const additionalEnsemblGeneAttributes: Array<Attributes> = [
  {label: 'has QC', value: 'has-qc', defaultOn: false},
  {label: 'P-Value (phenotyping significance)', value: 'p-value', defaultOn: false},
  {label: 'MP id', value: 'mp-id', defaultOn: false},
  {label: 'MP term', value: 'mp-term', defaultOn: false},
  {label: 'MP term synonym', value: 'mp-term-synonym', defaultOn: false},
  {label: 'MP term definition', value: 'mp-term-definition', defaultOn: false},
  {label: 'HP id', value: 'hp-id', defaultOn: false},
  {label: 'HP term', value: 'hp-term', defaultOn: false},
  {label: 'Disease id', value: 'disease-id', defaultOn: false},
  {label: 'Disease term', value: 'disease-term', defaultOn: false},
];

const mpAttributes: Array<Attributes> = [
  {label: 'MP id', value: 'mp-id', defaultOn: true},
  {label: 'MP term', value: 'mp-term', defaultOn: true},
  {label: 'MP definition', value: 'mp-definition', defaultOn: true},
  {label: 'MGI gene id', value: 'mgi-gene-id', defaultOn: true},
  {label: 'MGI gene symbol', value: 'mgi-gene-symbol', defaultOn: true},
  {label: 'Human ortholog', value: 'human-ortholog', defaultOn: true},
];

const additionalMPAttributes: Array<Attributes> = [
  {label: 'Top level MP id', value: 'toplevel-mp-id', defaultOn: false},
  {label: 'Top level MP term', value: 'toplevel-mp-term', defaultOn: false},
  {label: 'HP id', value: 'hp-id', defaultOn: false},
  {label: 'HP term', value: 'hp-term', defaultOn: false},
  {label: 'Disease id', value: 'disease-id', defaultOn: false},
  {label: 'Disease term', value: 'disease-term', defaultOn: false},
];

const hpAttributes: Array<Attributes> = [
  {label: 'HP id', value: 'hp-id', defaultOn: true},
  {label: 'HP term', value: 'hp-term', defaultOn: true},
  {label: 'MP id', value: 'mp-id', defaultOn: true},
  {label: 'MP term', value: 'mp-term', defaultOn: true},
  {label: 'MP definition', value: 'mp-definition', defaultOn: true},
  {label: 'MGI gene id', value: 'mgi-gene-id', defaultOn: true},
  {label: 'MGI gene symbol', value: 'mgi-gene-symbol', defaultOn: true},
  {label: 'Human ortholog', value: 'human-ortholog', defaultOn: true},
];

const additionalHPAttributes: Array<Attributes> = [
  {label: 'Top level MP id', value: 'toplevel-mp-id', defaultOn: false},
  {label: 'Top level MP term', value: 'toplevel-mp-term', defaultOn: false},
  {label: 'Disease id', value: 'disease-id', defaultOn: false},
  {label: 'Disease term', value: 'disease-term', defaultOn: false},
]

const diseaseAttributes: Array<Attributes> = [
  {label: 'Disease id', value: 'disease-id', defaultOn: true},
  {label: 'Disease term', value: 'disease-term', defaultOn: true},
  {label: 'MGI gene symbol', value: 'mgi-gene-symbol', defaultOn: true},
  {label: 'MGI gene id', value: 'mgi-gene-id', defaultOn: true},
  {label: 'HGNC gene symbol', value: 'HGNC gene symbol', defaultOn: true},
];

const additionalAnatomyAttributes: Array<Attributes> = [
  {label: 'Selected top level anatomy id', value: 'selected-toplevel-mp-id', defaultOn: false},
  {label: 'Selected top level anatomy term', value: 'toplevel-mp-term', defaultOn: false},
];

const anatomyAttributes: Array<Attributes> = [
  {label: 'Anatomy id', value: 'anatomy-id', defaultOn: true},
  {label: 'Anatomy term', value: 'anatomy-term', defaultOn: true},
  {label: 'MGI gene id', value: 'mgi-gene-id', defaultOn: true},
  {label: 'MGI gene symbol', value: 'mgi-gene-symbol', defaultOn: true},
  {label: 'Human ortholog', value: 'human-ortholog', defaultOn: true},
];

const mapAttributes: Record<string, Array<Attributes>> = {
  "impc-gene": geneAttributes,
  "ensembl-gene": ensemblGeneAttributes,
  "mp-id": mpAttributes,
  "hp-id": hpAttributes,
  "decipher-id": diseaseAttributes,
  "anatomy": anatomyAttributes,
  "human-marker-symbol": geneAttributes,
  "mouse-marker-symbol": geneAttributes,
};

const mapAdditionalAttributes: Record<string, Array<Attributes>> = {
  "impc-gene": additionalGeneAttributes,
  "ensembl-gene": additionalEnsemblGeneAttributes,
  "mp-id": additionalMPAttributes,
  "hp-id": additionalHPAttributes,
  "decipher-id": [],
  "anatomy": additionalAnatomyAttributes,
  "human-marker-symbol": additionalGeneAttributes,
  "mouse-marker-symbol": additionalGeneAttributes,
};

const mapLabels = {
  "impc-gene": "GENE",
  "ensembl-gene": "ENSEMBL",
  "mp-id": "MP",
  "hp-id": "HP",
  "decipher-id": "DISEASE",
  "anatomy": "ANATOMY",
  "human-marker-symbol": "MARKER SYMBOL",
  "mouse-marker-symbol": "MARKER SYMBOL",
};

const mapPlaceholders = {
  "impc-gene": "MGI:106209",
  "ensembl-gene": "ENSMUSG00000011257",
  "mp-id": "MP:0001926",
  "hp-id": "HP:0000400",
  "decipher-id": "OMIM:100300, ORPHA:93, DECIPHER:17",
  "anatomy": "MA:0003077, EMAPA:35955",
  "human-marker-symbol": "Ca4, CA4",
  "mouse-marker-symbol": "Car4, CAR4",
}

const BatchQueryPage = () => {
  const [ typeSelection, setTypeSelection ] = useState<"byID" | "bySymbol">("byID");
  const [ idSelection, setIDSelection ] = useState("impc-gene");
  const [ symbolSelection, setSymbolSelection ] = useState("human-marker-symbol");

  const attributes = typeSelection === 'byID' ? mapAttributes[idSelection] : mapAttributes[symbolSelection];
  const additionalAttributes = typeSelection === 'byID' ? mapAdditionalAttributes[idSelection] : mapAdditionalAttributes[symbolSelection];
  const selectedKey = typeSelection === 'byID' ? idSelection : symbolSelection;

  return (
    <>
      <Head>
        <title>IMPC dataset batch query | International Mouse Phenotyping Consortium</title>
      </Head>
      <Search />
      <Container className="page">
        <Card>
          <h1 className="mb-4 mt-2">
            <strong>IMPC Dataset Batch Query</strong>
          </h1>
          <h3>Datatype input</h3>
          <Form>
            <Row style={{alignItems: 'center'}}>
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
                  onChange={e => setIDSelection(e.target.value)}
                  disabled={typeSelection !== "byID"}
                >
                  <option value="impc-gene">IMPC Gene</option>
                  <option value="ensembl-gene">Ensembl Gene</option>
                  <option value="mp-id">MP ID</option>
                  <option value="hp-id">HP ID</option>
                  <option value="decipher-id">OMIM/ORPHANET/DECIPHER</option>
                  <option value="anatomy">Anatomy</option>
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
                />
              </Col>
              <Col xs="auto">
                <Form.Select
                  value={symbolSelection}
                  onChange={e => setSymbolSelection(e.target.value)}
                  disabled={typeSelection !== "bySymbol"}
                >
                  <option value="human-marker-symbol">Human marker symbol</option>
                  <option value="mouse-marker-symbol">Mouse marker symbol</option>
                </Form.Select>
              </Col>
            </Row>
          </Form>
          <h3 className="mt-4">Customized output</h3>
          <Form>
            <Row>
              <div className="mb-2 mt-2">
                <strong>{mapLabels[selectedKey]} attributes</strong>
              </div>
              {attributes.map(field => (
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
          </Form>
          <div className="mb-2 mt-2">
            <strong>Additional annotations to {mapLabels[selectedKey]}</strong>
          </div>
          <Form>
            <Row>
              {additionalAttributes.map(field => (
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
          </Form>
          <Form className="mt-4">
            <Form.Group className="mb-3">
              <Form.Label><strong>List of ID's</strong></Form.Label>
              <Form.Control as="textarea" rows={3} placeholder={mapPlaceholders[selectedKey]} />
            </Form.Group>
          </Form>
          <div>
            <button className="btn impc-primary-button">Submit</button>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default BatchQueryPage;