import { Col, Row } from "react-bootstrap";
import Card from "@/components/Card";
import ChartSummary from "@/components/Data/ChartSummary";

const GrossPathology = ({ datasetSummary }) => {
  return (
    <>
      <ChartSummary datasetSummary={datasetSummary} />
      <Row>
        <Col>
          <Card>
            <h2>Observation numbers</h2>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default GrossPathology;
