import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "react-bootstrap";
import Card from "@/components/Card";
import { useRouter } from "next/router";
import { formatAlleleSymbol } from "@/utils";
import { PropsWithChildren, ReactNode } from "react";


type ChartSummaryProps = {
  datasetSummary: any;
  additionalContent?: ReactNode,
  title?: string;
}
const ChartSummary = ({ title, additionalContent = null, datasetSummary, children }: PropsWithChildren<ChartSummaryProps>) => {
  const router = useRouter();
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
                Testing protocol
              </span>
            <strong>{datasetSummary["procedureName"]}</strong>
          </p>
          <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Testing environment
              </span>
            <strong>Lab conditions and equipment</strong>
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
            <strong>{datasetSummary["significantPhenotype"]?.["name"]}</strong>
          </p>
        </Col>
      </Row>
    </Card>
  )
};

export default ChartSummary;