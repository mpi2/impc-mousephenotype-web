import {
  faArrowLeftLong,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faRefresh,
  faVenus,
  faMars,
  faMarsAndVenus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Badge, Col, Container, Row } from "react-bootstrap";
import Card from "@/components/Card";
import Search from "@/components/Search";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from "./styles.module.scss";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import Skeleton from "react-loading-skeleton";

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
        {!!images?.[selected]?.jpegUrl && (
          <ImageViewer image={images?.[selected]?.jpegUrl} />
        )}
      </Col>
      {images?.map((image, i) => (
        <Col key={image.observationId} md={4} lg={3} className="mb-2">
          <div
            style={{
              minHeight: 50,
              backgroundColor: "#ddd",
              borderRadius: 5,
              overflow: "hidden",
              border: 'solid #B65A15',
              borderWidth: i === selected ? 2 : 0,
            }}
            onClick={() => {
              setSelected(i);
            }}
          >
            <img src={image.thumbnailUrl} style={{ width: "100%" }} alt="" />
          </div>
        </Col>
      ))}
    </Row>
  );
};

const ImagesCompare = () => {
  const router = useRouter();
  const { parameterStableId = "", pid } = router.query;
  const { data: mutantImages } = useQuery({
    queryKey: ['genes', pid, 'images', parameterStableId],
    queryFn: () => fetchAPI(`/api/v1/images/find_by_mgi_and_stable_id?mgiGeneAccessionId=${pid}&parameterStableId=${parameterStableId}`),
    enabled: router.isReady,
    select: data => {
      const selectedDataset = data.find(d => d.pipelineStableId.includes('IMPC'));
      return !!selectedDataset ? selectedDataset : data[0];
    }
  });

  const { data: controlImages } = useQuery({
    queryKey: ['genes', pid, 'images', parameterStableId, 'control'],
    queryFn: () => fetchAPI(`/api/v1/images/find_by_stable_id_and_sample_id?biologicalSampleGroup=control&parameterStableId=${parameterStableId}`),
    enabled: router.isReady && !!mutantImages?.strainAccessionId,
    select: data => data.find(d => d.strainAccessionId === mutantImages.strainAccessionId)
  });

  const [selectedSex, setSelectedSex] = useState('both');
  const [selectedZyg, setSelectedZyg] = useState('both');

  const filterImages = (images) => {
    return images
      .filter(i => selectedSex !== 'both' ? i.sex === selectedSex : true)
      .filter(i => selectedZyg !== 'both' ? i.zygosity === selectedZyg : true)
  }

  return <>
    <Search />
    <Container className="page">
      <Card>
        <Link href={`/genes/${pid}#images`} className="grey mb-3 small">

          <FontAwesomeIcon icon={faArrowLeftLong} />&nbsp;
          BACK TO GENE
        </Link>
        <p className={styles.subheading}>Images</p>
        <h1 className="mb-4 mt-2">
          <strong>{mutantImages?.procedureName || <Skeleton />}</strong> / {mutantImages?.parameterName || <Skeleton />}
        </h1>
        <div className={`mb-4 ${styles.filtersWrapper}`}>
          Show by:
          <div className={styles.filter}>
            <strong>Sex:</strong>
            <Badge className={styles.badge} pill bg="secondary" onClick={() => setSelectedSex('both')}>
              Both
              <FontAwesomeIcon icon={faMarsAndVenus} />
            </Badge>
            <Badge className={styles.badge} pill bg="secondary" onClick={() => setSelectedSex('female')}>
              Female
              <FontAwesomeIcon icon={faVenus} />
            </Badge>
            <Badge className={styles.badge} pill bg="secondary" onClick={() => setSelectedSex('male')}>
              Male
              <FontAwesomeIcon icon={faMars} />
            </Badge>
          </div>
          <div className={styles.filter}>
            <strong>Zygosity:</strong>
            <Badge className={styles.badge} pill bg="secondary" onClick={() => setSelectedZyg('both')}>
              Both
            </Badge>
            <Badge className={styles.badge} pill bg="secondary" onClick={() => setSelectedZyg('heterozygote')}>
              Het.
            </Badge>
            <Badge className={styles.badge} pill bg="secondary" onClick={() => setSelectedZyg('homozygote')}>
              Hom.
            </Badge>
          </div>
        </div>
        <div>
          <Row>
            <Col sm={6}>
              <h3>WT Images</h3>
              <Column images={filterImages(controlImages?.images)} />
            </Col>
            <Col sm={6}>
              <h3>Mutant Images</h3>
              <Column images={filterImages(mutantImages?.images)} />
            </Col>
          </Row>
        </div>
      </Card>
    </Container>
  </>;
};

export default ImagesCompare;
