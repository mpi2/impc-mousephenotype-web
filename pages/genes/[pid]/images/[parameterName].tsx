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
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "../../../../api-service";

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

const WTColumn = ({ images }) => {
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
            // TODO: decode url if it's base64
            <img src={image.thumbnailUrl} style={{ width: "100%" }} />
          </div>
        </Col>
      ))}
    </Row>
  );
};

const Column = ({ images }) => {
  const [selected, setSelected] = useState(0);
  return (
    <Row className={`mt-3 ${styles.images}`}>
      <Col xs={12} style={{ display: "flex" }}>
        <ImageViewer image={images[selected]?.fullFileUrl} />
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
  const [wt, setWt] = useState(null);
  useEffect(() => setWt(gData), []);
  const router = useRouter();
  const { parameterName = "", pid } = router.query;
  const { data: images } = useQuery({
    queryKey: ['genes', pid, 'images', parameterName],
    queryFn: () => fetchAPI(`/api/imaging/v1/thumbnails?genotype=PMAV`),
    enabled: router.isReady,
  })
  if (!wt) return null;

  const groups = _.groupBy(wt.geneImages, "parameterName");
  const wtImages = groups?.[parameterName as string];
  console.log(wt, wtImages, images);
  // TODO: add an Error page here.
  if (!wtImages || !images) return null;

  const procedureName = wtImages?.[0].procedureName;

  return <>
    <Search />
    <Container className="page">
      <Card>
        <Link href={`/genes/${pid}`} className="grey mb-3 small">

          <FontAwesomeIcon icon={faArrowLeftLong} />BACK TO GENE
        </Link>
        <p className={styles.subheading}>Images</p>
        <h1 className="mb-4 mt-2">
          <strong>{procedureName}</strong> / {parameterName}
        </h1>
        <div>
          <Row>
            <Col sm={6}>
              <h3>WT Images</h3>
              <WTColumn images={wtImages} />
            </Col>
            <Col sm={6}>
              <h3>Mutant Images</h3>
              <Column images={images} />
            </Col>
          </Row>
        </div>
      </Card>
    </Container>
  </>;
};

export default ImagesCompare;
