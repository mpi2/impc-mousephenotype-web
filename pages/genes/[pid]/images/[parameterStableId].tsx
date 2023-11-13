import {
  faArrowLeftLong,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faRefresh,
  faVenus,
  faMars,
  faMarsAndVenus,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { Badge, Col, Container, Row } from "react-bootstrap";
import Card from "@/components/Card";
import Search from "@/components/Search";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from "./styles.module.scss";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import Skeleton from "react-loading-skeleton";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';


const addTrailingSlash = (url) => !url.endsWith('/') ?  url + '/' : url;
const SkeletonText = ({ width = '300px' }) => <Skeleton style={{ display: 'block', width }} inline />;

const FilterBadge = ({ children, onClick, icon, isSelected }: { children: ReactNode, onClick: () => void, icon?: any, isSelected: boolean }) => (
  <Badge className={`${styles.badge} ${isSelected ? 'active' : ''} `} pill bg="badge-secondary" onClick={onClick}>
    {children}&nbsp;
    {!!icon ? <FontAwesomeIcon icon={icon} /> : null}
  </Badge>
)

const ImageViewer = ({ image }) => {
  console.log('IMAGE VIEWER: ', image);
  if (!image) {
    return <Skeleton containerClassName="flex-1" style={{ flex: 1, height: '100%' }} />
  }
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
            <LazyLoadImage
              key={image?.jpegUrl}
              src={addTrailingSlash(image?.jpegUrl)}
              placeholderSrc={addTrailingSlash(image?.thumbnailUrl)}
              alt="test"
              style={{ width: "100%", display: "block" }}
            />
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );
};

const Column = ({ images, selected, onSelection }) => {
  return (
    <Row className={`mt-3 ${styles.images}`}>
      {images?.map((image, i) => (
        <Col key={image.observationId} md={4} lg={3} className="mb-2">
          <div className={styles.singleImage} onClick={() => onSelection(i)}>
            <div className={styles.overlay}>
              {selected === i ? (
                <div className={styles.checkIndicator}>
                  <FontAwesomeIcon icon={faEye} />
                </div>
              ): null}
            </div>
            <LazyLoadImage
              src={addTrailingSlash(image.thumbnailUrl)}
              effect="blur"
              alt={''}
              width="100%"
              wrapperProps={{ style: {width: '100%'} }}
            />
          </div>
        </Col>
      ))}
      {images && images.length === 0 ? (
        <div style={{ textAlign: 'center' }}>
          <h3><strong>No images to show</strong></h3>
        </div>
      ) : null}
    </Row>
  );
};

const ImagesCompare = () => {
  const router = useRouter();
  const [selectedWTImage, setSelectedWTImage] = useState(0);
  const [selectedMutantImage, setSelectedMutantImage] = useState(0);
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
      ?.filter(i => selectedSex !== 'both' ? i.sex === selectedSex : true)
      ?.filter(i => selectedZyg !== 'both' ? i.zygosity === selectedZyg : true)
  }


  const filteredControlImages = filterImages(controlImages?.images);
  const filteredMutantImages = filterImages(mutantImages?.images);
  return <>
    <Search />
    <Container className="page">
      <Card>
        <Link href={`/genes/${pid}#images`} className="grey mb-3 small">
          <FontAwesomeIcon icon={faArrowLeftLong} />&nbsp;
          BACK TO GENE
        </Link>
        <p className={styles.subheading}>Images</p>
        <h1 className="mb-4 mt-2" style={{ display: 'flex', gap: '1rem' }}>
          <strong>
            {mutantImages?.procedureName || <SkeletonText/>}
          </strong> /&nbsp;
          {mutantImages?.parameterName || <SkeletonText/>}
        </h1>
        <div>
          <Row>
            <Col sm={6}>
              <h3>WT Images</h3>
              <Col
                xs={12}
                style={{ display: "flex" }}
                className="ratio ratio-16x9"
              >
                <ImageViewer image={filteredControlImages?.[selectedWTImage]} />
              </Col></Col>
            <Col sm={6}>
              <h3>Mutant Images</h3>
              <Col
                xs={12}
                style={{ display: "flex" }}
                className="ratio ratio-4x3"
              >
                <ImageViewer image={filteredMutantImages?.[selectedMutantImage]} />
              </Col>
            </Col>
            <Col xs={12}>
              <div className={`mb-4 ${styles.filtersWrapper}`}>
                Show by:
                <div className={styles.filter}>
                  <strong>Sex:</strong>
                  <FilterBadge
                    isSelected={selectedSex === 'both'}
                    icon={faMarsAndVenus}
                    onClick={() => setSelectedSex('both')}
                  >
                    Both
                  </FilterBadge>
                  <FilterBadge
                    isSelected={selectedSex === 'female'}
                    icon={faVenus}
                    onClick={() => setSelectedSex('female')}
                  >
                    Female
                  </FilterBadge>
                  <FilterBadge
                    isSelected={selectedSex === 'male'}
                    icon={faMars}
                    onClick={() => setSelectedSex('male')}
                  >
                    Male
                  </FilterBadge>
                </div>
                <div className={styles.filter}>
                  <strong>Zygosity:</strong>
                  <FilterBadge isSelected={selectedZyg === 'both'} onClick={() => setSelectedZyg('both')}>
                    Both
                  </FilterBadge>
                  <FilterBadge isSelected={selectedZyg === 'heterozygote'} onClick={() => setSelectedZyg('heterozygote')}>
                    Het.
                  </FilterBadge>
                  <FilterBadge isSelected={selectedZyg === 'homozygote'} onClick={() => setSelectedZyg('homozygote')}>
                    Hom.
                  </FilterBadge>
                </div>
              </div>
            </Col>
            <Col sm={6}>
              <Column
                selected={selectedWTImage}
                images={filteredControlImages}
                onSelection={imageIndex => setSelectedWTImage(imageIndex)}
              />
            </Col>
            <Col sm={6}>
              <Column
                selected={selectedMutantImage}
                images={filteredMutantImages}
                onSelection={imageIndex => setSelectedMutantImage(imageIndex)}
              />
            </Col>
          </Row>
        </div>
      </Card>
    </Container>
  </>;
};

export default ImagesCompare;
