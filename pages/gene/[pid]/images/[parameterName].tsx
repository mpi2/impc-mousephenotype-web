import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import Card from "../../../../components/Card";
import Search from "../../../../components/Search";
import gData from "../../gene.json";

const ImagesCompare = () => {
  const [geneData, setGeneData] = useState(null);
  useEffect(() => {
    (async () => {
      setGeneData(gData);
    })();
  }, []);
  const router = useRouter();
  const { parameterName = "", pid } = router.query;
  if (!geneData) return null;

  const groups = _.groupBy(geneData.geneImages, "parameterName");
  const images = groups?.[parameterName as string];

  if (!images) return null;

  const procedureName = images?.[0].procedureName;

  return (
    <>
      <Search />
      <Container className="page">
        <Card>
          <Link href={`/gene/${pid}`}>
            <a href="#" className="secondary mb-3">
              <FontAwesomeIcon icon={faArrowLeftLong} /> BACK TO GENE
            </a>
          </Link>
          <h1 style={{ marginBottom: "1rem" }}>
            <strong>{procedureName}</strong> / {parameterName}
          </h1>
          <p className="grey">{images.length} images</p>
          <Row className="mt-3">
            {images.map((image) => (
              <Col md={4} lg={3} className="mb-3">
                <div style={{ minHeight: 50, backgroundColor: "#ddd" }}>
                  <img src={image.thumbnailUrl} style={{ width: "100%" }} />
                </div>
              </Col>
            ))}
          </Row>
        </Card>
      </Container>
    </>
  );
};

export default ImagesCompare;
