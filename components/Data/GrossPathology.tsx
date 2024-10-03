import { GrossPathologyDataset } from "@/models";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Row, Col, Card } from "react-bootstrap";
import { SmartTable, PlainTextCell } from "../SmartTable";
import router from "next/router";
import { useGrossPathologyChartQuery } from "@/hooks";
import ChartSummary from "./ChartSummary/ChartSummary";

const GrossPathology = ({ datasetSummary }) => {
  const { data } = useGrossPathologyChartQuery(
    datasetSummary.mgiGeneAccessionId,
    datasetSummary.parameterStableId,
    router.isReady
  );

  return (
    <>
      {" "}
      <ChartSummary datasetSummary={datasetSummary}>
        A Gross Pathology and Tissue Collection phenotypic assay was performed
        on {data[0] ? data[0].specimenCount : 0} mice. The mutants are for the{" "}
        {data[0] ? data[0].alleleSymbol : 0} allele.
      </ChartSummary>
      <Row>
        <Col>
          <Card>
            <br />
            <h2>Observation counts</h2>
            <SmartTable<GrossPathologyDataset>
              data={data}
              defaultSort={["alleleSymbol", "asc"]}
              columns={[
                {
                  width: 1,
                  label: "Anatomy",
                  field: "parameterName",
                  cmp: <PlainTextCell />,
                },
                {
                  width: 1,
                  label: "Zygosity",
                  field: "zygosity",
                  cmp: <PlainTextCell />,
                },
                {
                  width: 1,
                  label: "Abnormal",
                  field: "abnormalCounts",
                  cmp: <PlainTextCell />,
                },
                {
                  width: 1,
                  label: "Normal",
                  field: "normalCounts",
                  cmp: <PlainTextCell />,
                },
                {
                  width: 1,
                  label: "Center",
                  field: "phenotypingCenter",
                  cmp: <PlainTextCell />,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default GrossPathology;
