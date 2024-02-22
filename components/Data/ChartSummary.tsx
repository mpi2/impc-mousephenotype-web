import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { Col, Modal, Row, Table } from "react-bootstrap";
import Card from "@/components/Card";
import { useRouter } from "next/router";
import { formatAlleleSymbol } from "@/utils";
import { PropsWithChildren, ReactNode, useState } from "react";
import Link from "next/link";


type ChartSummaryProps = {
  datasetSummary: any;
  additionalContent?: ReactNode,
  title?: string;
}
const ChartSummary = ({ title, additionalContent = null, datasetSummary, children }: PropsWithChildren<ChartSummaryProps>) => {
  const router = useRouter();
  const [showMetadataModal, setShowMetadataModal ] = useState(false);
  const allele = formatAlleleSymbol(datasetSummary["alleleSymbol"]);
  const totalMice = Object.keys(datasetSummary["summaryStatistics"]).reduce(
    (acc, key) => {
      return (
        acc +
        (key.includes("Count") ? datasetSummary["summaryStatistics"][key] : 0)
      );
    },
    0
  );

  const metadataArray = datasetSummary.metadataValues?.[0].split('|') || [];

  return (
    <Card>
      <div>
        <button
          style={{ border: 0, background: "none", padding: 0 }}
          onClick={() => {
            router.back();
          }}
        >
          <a href="#" className="grey mb-3 small">
            <FontAwesomeIcon icon={faArrowLeftLong} /> GO BACK
          </a>
        </button>
        <h1>
          <strong>{!!title ? title : datasetSummary["geneSymbol"] + ' data charts'}</strong>
        </h1>
        {additionalContent}
      </div>
      <h2>Description of the experiments performed</h2>
      <Row>
        <Col md={7} style={{ borderRight: "1px solid #ddd" }}>
          {children ? children : (
            <>
              <p>
                A <strong>{datasetSummary["procedureName"]}</strong> phenotypic
                assay was performed on {totalMice} mice. The charts show the
                results of measuring{" "}
                <strong>{datasetSummary["parameterName"]}</strong> in{" "}
                {datasetSummary["summaryStatistics"]["femaleMutantCount"]} female,{" "}
                {datasetSummary["summaryStatistics"]["maleMutantCount"]} male
                mutants compared to{" "}
                {datasetSummary["summaryStatistics"]["femaleControlCount"]}{" "}
                female, {datasetSummary["summaryStatistics"]["maleControlCount"]}{" "}
                male controls. The mutants are for the {allele[0]}
                <sup>{allele[1]}</sup> allele.
              </p>
              <p className="small">
                * The high throughput nature of the IMPC means that large control
                sample sizes may accumulate over a long period of time. See the
                animal welfare guidelines for more information.
              </p>
            </>
          )}
        </Col>
        <Col md={5} className="small">
          <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Zygosity
              </span>
            <strong>{datasetSummary["zygosity"]}</strong>
          </p>
          <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Testing protocol
              </span>
            <strong>
              <Link
                className="link primary"
                href={`https://www.mousephenotype.org/impress/ProcedureInfo?action=list&procID=${datasetSummary.procedureStableKey}&pipeID=${datasetSummary.pipelineStableKey}`}
              >
                {datasetSummary["procedureName"]}
              </Link>
            </strong>
          </p>
          <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Testing environment
              </span>
            <strong className="primary link" onClick={() => setShowMetadataModal(true)}>
              Lab conditions and equipment
            </strong>
          </p>
          <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Measured value
              </span>
            <strong>{datasetSummary["parameterName"]}</strong>
          </p>
          <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Life stage
              </span>
            <strong>{datasetSummary["lifeStageName"]}</strong>
          </p>
          <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Background Strain
              </span>
            <strong>{datasetSummary["geneticBackground"]}</strong>
          </p>
          <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Phenotyping center
              </span>
            <strong>{datasetSummary["phenotypingCentre"]}</strong>
          </p>
          <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Associated Phenotype
              </span>
            {!!datasetSummary["significantPhenotype"]?.["id"] ? (
              <Link href={`/phenotypes/${datasetSummary["significantPhenotype"]["id"]}`}>
                <strong className="link primary">{datasetSummary["significantPhenotype"]?.["name"]}</strong>
              </Link>
            ) : (
              <strong>No significant association</strong>
            )}
          </p>
        </Col>
      </Row>
      <Modal show={showMetadataModal} onHide={() => setShowMetadataModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Experimental conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped borderless>
            <tbody>
            {metadataArray.map(item => item.split('=')).map(([label, value]) =>
              <tr>
                <td>{label}</td>
                <td>{value}</td>
              </tr>
            )}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </Card>
  )
};

export default ChartSummary;