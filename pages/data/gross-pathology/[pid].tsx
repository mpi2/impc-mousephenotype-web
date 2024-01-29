import { Search } from "@/components";
import { Col, Container, Row } from "react-bootstrap";
import Card from "@/components/Card";
import { PlainTextCell, SmartTable } from "@/components/SmartTable";
import { GrossPathologyDataset } from "@/models";
import { useRouter } from "next/router";
import { useGrossPathologyChartQuery } from "@/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";


const GrossPathChartPage = () => {
  const router = useRouter();
  const mgiGeneAccessionId = router.query.pid as string;
  const grossPathParameterStableId = router.query.grossPathParameterStableId as string;

  const { data } = useGrossPathologyChartQuery(mgiGeneAccessionId, grossPathParameterStableId);

  return (
    <>
      <Search />
      <Container>
        <Row>
          <Col>
            <Card style={{ marginTop: '-80px' }}>
              <Link href={`/genes/${mgiGeneAccessionId}/#data`} className="grey mb-3 small">
                <FontAwesomeIcon icon={faArrowLeftLong} />&nbsp;
                BACK TO GENE
              </Link>
              <br/>
              <h2>Observation numbers</h2>
              <SmartTable<GrossPathologyDataset>
                data={data}
                defaultSort={["alleleSymbol", "asc"]}
                columns={[
                  { width: 1, label: "Anatomy", field: "parameterName", cmp: <PlainTextCell /> },
                  { width: 1, label: "Zygosity", field: "zygosity", cmp: <PlainTextCell />  },
                  { width: 1, label: "Abnormal", field: "abnormalCounts", cmp: <PlainTextCell /> },
                  { width: 1, label: "Normal", field: "normalCounts", cmp: <PlainTextCell /> },
                  { width: 1, label: "Center", field: "phenotypingCenter", cmp: <PlainTextCell /> },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
};

export default GrossPathChartPage;