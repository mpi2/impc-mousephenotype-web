import {
  faArrowLeftLong,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Card from "../../../../components/Card";
import Search from "../../../../components/Search";
import gData from "../../gene.json";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from "./styles.module.scss";

const ImageViewer = ({ image }) => {
  return (
    <TransformWrapper>
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <div className={styles.viewer}>
          <div className={styles.tools}>
            <button onClick={() => zoomIn()}>
              <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
            </button>
            <button onClick={() => zoomOut()}>
              <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
            </button>
            <button onClick={() => resetTransform()}>
              <FontAwesomeIcon icon={faRefresh} />
            </button>
          </div>
          <TransformComponent>
            <img
              src={image}
              alt="test"
              style={{ width: "100%", display: "block" }}
            />
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );
};

const Column = ({ images }) => {
  const [selected, setSelected] = useState(0);
  return (
    <Row className={`mt-3 ${styles.images}`}>
      <Col xs={12} style={{ display: "flex" }}>
        <ImageViewer image={images[selected]?.jpegUrl} />
      </Col>
      {images.map((image, i) => (
        <Col md={4} lg={3} className="mb-2">
          <div
            style={{
              minHeight: 50,
              backgroundColor: "#ddd",
              borderRadius: 5,
              overflow: "hidden",
              opacity: i === selected ? 0.5 : 1,
            }}
            onClick={() => {
              setSelected(i);
            }}
          >
            <img src={image.thumbnailUrl} style={{ width: "100%" }} />
          </div>
        </Col>
      ))}
    </Row>
  );
};

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
          <div>
            <Row>
              <Col sm={6}>
                <Column images={images} />
              </Col>
              <Col sm={6}>
                <Column images={images} />
              </Col>
            </Row>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default ImagesCompare;
