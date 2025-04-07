"use client";

import {
  faCircle,
  faArrowLeft,
  faExternalLinkAlt,
  faSlash,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Card from "@/components/Card";
import Search from "@/components/Search";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from "./styles.module.scss";
import { useQuery } from "@tanstack/react-query";
import { fetchURL } from "@/api-service";
import Skeleton from "react-loading-skeleton";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { AlleleSymbol, ZoomButtons } from "@/components";
import { GeneSummary } from "@/models/gene";
import classNames from "classnames";
import { getIcon } from "@/utils";

const SkeletonText = ({ width = "300px" }) => (
  <Skeleton style={{ display: "block", width }} inline />
);
const getZygosityColor = (zygosity: string) => {
  switch (zygosity) {
    case "HET":
      return "#88CCEE";
    case "HOM":
      return "#DDCC77";
    case "HEMI":
      return "#CC6677";
    default:
      return "#FFF";
  }
};

const ImageInformation = ({
  image,
  inViewer = false,
  showAssocParam = false,
}: {
  image: any;
  inViewer?: boolean;
  showAssocParam?: boolean;
}) => {
  return (
    <div
      className={classNames(styles.additionalInfo, {
        [styles.inViewer]: inViewer,
      })}
    >
      {!!image.ageInWeeks && (
        <span>
          Age: {image.ageInWeeks} weeks <br />
        </span>
      )}
      <div className={styles.indicatorsContainer}>
        <FontAwesomeIcon icon={getIcon(image.gender.toLowerCase())} />
      </div>
      <div className={styles.indicatorsContainer}>
        {inViewer ? (
          <span>{image.zygosity}</span>
        ) : (
          <div className={`${styles.common} ${styles.zygosityIndicator}`}>
            <FontAwesomeIcon
              icon={faCircle}
              style={{ color: getZygosityColor(image.genotype) }}
            />
          </div>
        )}
      </div>
      {!!image.alleleSymbol && (
        <AlleleSymbol symbol={image.alleleSymbol} withLabel={false} />
      )}
      {showAssocParam && image.associatedParameters?.length && (
        <>
          <hr className="break" style={{ margin: 0 }}></hr>
          <div className={classNames(styles.associatedParams, styles.small)}>
            {image.associatedParameters.map((param, index) => (
              <div key={`${param.stableId}-${index}`}>
                {param.name} <br /> <b>{param.value}</b>
              </div>
            ))}
          </div>
        </>
      )}
      {inViewer && image.associatedParameters?.length && (
        <>
          <div className="break"></div>
          <div className={styles.associatedParams}>
            <span>Associated parameters</span>
            {image.associatedParameters.map((param, index) => (
              <div key={`${param.stableId}-${index}`}>
                {param.name} - <b>{param.value}</b>
              </div>
            ))}
          </div>
        </>
      )}
      {inViewer && !!image.imageLink && (
        <>
          <div style={{ flexBasis: "100%", height: 0 }} />
          <Link className="link primary" href={image.imageLink} target="_blank">
            View high resolution image
            <FontAwesomeIcon
              icon={faExternalLinkAlt}
              className="grey"
              size="xs"
              style={{ marginLeft: "0.3rem" }}
            />
          </Link>
        </>
      )}
    </div>
  );
};

type ImageViewerProps = {
  image: any;
  name: string;
  hasAvailableImages: boolean;
};

const ImageViewer = ({ image, name, hasAvailableImages }: ImageViewerProps) => {
  if (!image && hasAvailableImages) {
    return (
      <Skeleton
        containerClassName="flex-1"
        style={{ flex: 1, height: "100%" }}
      />
    );
  }
  if (!image && !hasAvailableImages) {
    return (
      <div className={styles.noPhoto}>
        <span className="fa-layers">
          <FontAwesomeIcon
            icon={faSlash}
            style={{ color: "#000" }}
            size="lg"
            transform="shrink-1 left-2"
          />
          <FontAwesomeIcon
            icon={faCamera}
            style={{ color: "#000" }}
            size="lg"
          />
        </span>
        <span>
          <b>No image available</b>
        </span>
        <small>
          <i>Please select another center from the top</i>
        </small>
      </div>
    );
  }
  return (
    <TransformWrapper>
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <div className={styles.viewer}>
          <ZoomButtons
            containerClassName={styles.tools}
            onZoomIn={() => zoomIn()}
            onZoomOut={() => zoomOut()}
            onResetZoom={() => resetTransform()}
            tooltipsPosition="left"
          />
          <TransformComponent>
            <img
              data-testid={`selected-image-${name}`}
              key={image?.fullResolutionFilePath}
              src={image?.fullResolutionFilePath}
              style={{ width: "100%", display: "block" }}
              alt=""
            />
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );
};

const Column = ({ images, selected, onSelection }) => {
  return (
    <Row className={styles.images}>
      {images?.map((image, i) => (
        <Col key={image.observationId} md={4} lg={3} className="mb-2">
          <div
            data-testid="single-image"
            className={classNames(styles.singleImage, {
              [styles.active]: selected === i,
            })}
            onClick={() => onSelection(i)}
          >
            <LazyLoadImage
              src={image.smallThumbnailFilePath}
              effect="blur"
              alt={""}
              width="100%"
              wrapperProps={{ style: { width: "100%" } }}
            />
            <ImageInformation image={image} />
          </div>
        </Col>
      ))}
      {images && images.length === 0 ? (
        <div style={{ textAlign: "center" }}>
          <h3>
            <strong>No images to show</strong>
          </h3>
        </div>
      ) : null}
    </Row>
  );
};

type LegacyImageViewerProps = {
  gene: GeneSummary;
  mgiGeneAccessionId: string;
  procedureName: string;
};

const LegacyImageViewer = ({
  gene,
  mgiGeneAccessionId,
  procedureName,
}: LegacyImageViewerProps) => {
  const [selectedMutantImage, setSelectedMutantImage] = useState(0);
  const [selectedWildtypeImage, setSelectedWildtypeImage] = useState(0);
  const { data: legacyImages } = useQuery({
    queryKey: ["genes", mgiGeneAccessionId, "legacy-images", procedureName],
    queryFn: () =>
      fetchURL(
        `/data/api/legacy-images/get-images-by-param-and-mgi?mgiGeneAccessionId=${mgiGeneAccessionId}&procedureName=${procedureName}`,
      ),
    enabled: !!mgiGeneAccessionId && !!procedureName,
  });

  console.log(legacyImages);
  const { mutantImages, wildtypeImages } = useMemo(() => {
    return {
      mutantImages: legacyImages?.mutantImages ?? [],
      wildtypeImages: legacyImages?.wildtypeImages ?? [],
    };
  }, [legacyImages]);

  return (
    <>
      <Search />
      <Container className="page">
        <Card>
          <div className={styles.subheading}>
            <span className={`${styles.subheadingSection} primary`}>
              <Link
                href={`/genes/${mgiGeneAccessionId}#images`}
                className="mb-3"
                style={{
                  textTransform: "none",
                  fontWeight: "normal",
                  letterSpacing: "normal",
                  fontSize: "1.15rem",
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                &nbsp; Go Back to{" "}
                <i>
                  {gene.geneSymbol || (
                    <Skeleton style={{ width: "50px" }} inline />
                  )}
                </i>
              </Link>
            </span>
          </div>
          <p className={`${styles.subheading} mt-2`}>
            Sanger collection images
          </p>
          <h1 className="mb-4 mt-2" style={{ display: "flex", gap: "1rem" }}>
            <strong>{procedureName || <SkeletonText />}</strong>
          </h1>
          <div>
            <Row>
              <Col sm={6}>
                <div className={styles.headerContainer}>
                  <h3 style={{ marginBottom: 0 }}>
                    Wildtype images ({wildtypeImages?.length})
                  </h3>
                </div>
                <Col xs={12}>
                  <div
                    className={classNames(
                      "ratio",
                      "ratio-16x9",
                      styles.imageContainer,
                    )}
                  >
                    <ImageViewer
                      name="mutant"
                      image={wildtypeImages?.[selectedWildtypeImage]}
                      hasAvailableImages={wildtypeImages?.length !== 0 || false}
                    />
                  </div>
                  <div className={styles.imageInfo}>
                    {!!wildtypeImages?.[selectedWildtypeImage] && (
                      <ImageInformation
                        image={wildtypeImages[selectedWildtypeImage]}
                        inViewer
                      />
                    )}
                  </div>
                </Col>
              </Col>
              <Col sm={6}>
                <div className={styles.headerContainer}>
                  <h3 style={{ marginBottom: 0 }}>
                    Mutant images ({mutantImages?.length})
                  </h3>
                </div>
                <Col xs={12}>
                  <div
                    className={classNames(
                      "ratio",
                      "ratio-16x9",
                      styles.imageContainer,
                    )}
                  >
                    <ImageViewer
                      name="mutant"
                      image={mutantImages?.[selectedMutantImage]}
                      hasAvailableImages={mutantImages?.length !== 0 || false}
                    />
                  </div>
                  <div className={styles.imageInfo}>
                    {!!mutantImages?.[selectedMutantImage] && (
                      <ImageInformation
                        image={mutantImages[selectedMutantImage]}
                        inViewer
                      />
                    )}
                  </div>
                </Col>
              </Col>
            </Row>
            <Row className="mt-3 mb-3">
              <Col xs={12}>
                <div className={styles.legendsContainer}>
                  <span>Zygosity indicators</span>
                  <span className={styles.legendWrapper}>
                    <div className={styles.legendBackground}>
                      <FontAwesomeIcon
                        style={{ color: "#FFF" }}
                        icon={faCircle}
                      />
                    </div>
                    Wildtype
                  </span>
                  <span className={styles.legendWrapper}>
                    <div className={styles.legendBackground}>
                      <FontAwesomeIcon
                        style={{ color: "#88CCEE" }}
                        icon={faCircle}
                      />
                    </div>
                    Heterozygote
                  </span>
                  <span className={styles.legendWrapper}>
                    <div className={styles.legendBackground}>
                      <FontAwesomeIcon
                        style={{ color: "#DDCC77" }}
                        icon={faCircle}
                      />
                    </div>
                    Homozygote
                  </span>
                  <span className={styles.legendWrapper}>
                    <div className={styles.legendBackground}>
                      <FontAwesomeIcon
                        style={{ color: "#CC6677" }}
                        icon={faCircle}
                      />
                    </div>
                    Hemizygote
                  </span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Column
                  selected={selectedWildtypeImage}
                  images={wildtypeImages}
                  onSelection={setSelectedWildtypeImage}
                />
              </Col>
              <Col sm={6}>
                <Column
                  selected={selectedMutantImage}
                  images={mutantImages}
                  onSelection={setSelectedMutantImage}
                />
              </Col>
            </Row>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default LegacyImageViewer;
