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
import { ReactNode, useMemo, useState } from "react";
import { Badge, Col, Container, Row } from "react-bootstrap";
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
import { LegacyImageEndpointResponse } from "@/models/gene/images";

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

const FilterBadge = ({
  name,
  children,
  onClick,
  icon,
  isSelected,
}: {
  name: string;
  children: ReactNode;
  onClick: () => void;
  icon?: any;
  isSelected: boolean;
}) => (
  <Badge
    className={classNames(styles.badge, { active: isSelected })}
    pill
    bg="badge-secondary"
    onClick={onClick}
    data-testid={`${isSelected ? "active-" : ""}${name}-filter`}
  >
    {children}&nbsp;
    {!!icon ? <FontAwesomeIcon icon={icon} /> : null}
  </Badge>
);

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
          <span>{image.genotype}</span>
        ) : (
          <div className={`${styles.common} ${styles.zygosityIndicator}`}>
            <FontAwesomeIcon
              icon={faCircle}
              style={{ color: getZygosityColor(image.genotype) }}
            />
          </div>
        )}
      </div>
      {!!image.genotypeString && (
        <AlleleSymbol symbol={image.genotypeString} withLabel={false} />
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
        <Col key={i} md={4} lg={3} className="mb-2">
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
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string | null>
  >({});
  const { data: legacyImages } = useQuery<LegacyImageEndpointResponse>({
    queryKey: ["genes", mgiGeneAccessionId, "legacy-images", procedureName],
    queryFn: () =>
      fetchURL(
        `/data/api/legacy-images/get-images-by-param-and-mgi?mgiGeneAccessionId=${mgiGeneAccessionId}&procedureName=${procedureName}`,
      ),
    enabled: !!mgiGeneAccessionId && !!procedureName,
  });

  const { mutantImages, wildtypeImages, allImages } = useMemo(() => {
    const mtImages = legacyImages?.mutantImages ?? [];
    const wtImages = legacyImages?.wildtypeImages ?? [];
    return {
      mutantImages: mtImages,
      wildtypeImages: wtImages,
      allImages: mtImages.concat(wtImages),
    };
  }, [legacyImages]);

  const { filteredMutantImages, filteredWildtypeImages } = useMemo(() => {
    function imageMatchesFilter(image) {
      return Object.entries(selectedFilters).reduce((result, [key, value]) => {
        return (
          result &&
          (image.annotations.find((a) => a.name === key).value === value ||
            value === "all")
        );
      }, true);
    }
    return {
      filteredMutantImages: mutantImages.filter(imageMatchesFilter),
      filteredWildtypeImages: wildtypeImages.filter(imageMatchesFilter),
    };
  }, [mutantImages, wildtypeImages, selectedFilters]);

  const filterOptions = useMemo(() => {
    if (allImages?.length > 0) {
      const results = new Map<string, Set<string>>();
      allImages.forEach((image) => {
        image.annotations.forEach((annotation) => {
          if (results.has(annotation.name)) {
            const set = results.get(annotation.name);
            set.add(annotation.value);
            results.set(annotation.name, set);
          } else {
            const set = new Set<string>();
            set.add(annotation.value);
            results.set(annotation.name, set);
          }
        });
      });
      const resultObj: Record<string, Array<string>> = {};
      for (const [param, set] of results.entries()) {
        resultObj[param] = [...set];
      }
      return resultObj;
    }
    return [];
  }, [allImages]);

  const filterIsApplied = (option: string, value: string) => {
    if (value === "all" && !selectedFilters[option]) {
      return true;
    }
    return selectedFilters[option] === value;
  };

  const onFilterSelection = (option: string, value: string) => {
    setSelectedFilters((prevState) => ({
      ...prevState,
      [option]: value,
    }));
  };

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
                    Wildtype images ({filteredWildtypeImages?.length})
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
                      image={filteredWildtypeImages?.[selectedWildtypeImage]}
                      hasAvailableImages={
                        filteredWildtypeImages?.length !== 0 || false
                      }
                    />
                  </div>
                  <div className={styles.imageInfo}>
                    {!!filteredWildtypeImages?.[selectedWildtypeImage] && (
                      <ImageInformation
                        image={filteredWildtypeImages[selectedWildtypeImage]}
                        inViewer
                      />
                    )}
                  </div>
                </Col>
              </Col>
              <Col sm={6}>
                <div className={styles.headerContainer}>
                  <h3 style={{ marginBottom: 0 }}>
                    Mutant images ({filteredMutantImages?.length})
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
                      image={filteredMutantImages?.[selectedMutantImage]}
                      hasAvailableImages={
                        filteredMutantImages?.length !== 0 || false
                      }
                    />
                  </div>
                  <div className={styles.imageInfo}>
                    {!!filteredMutantImages?.[selectedMutantImage] && (
                      <ImageInformation
                        image={filteredMutantImages[selectedMutantImage]}
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
              <Col xs={12}>
                <div className={styles.filtersWrapper}>
                  {Object.entries(filterOptions).map(
                    ([option, values], index) => (
                      <div className={styles.column} key={index}>
                        <div className={styles.filter}>
                          <strong>{option}: </strong>
                          <FilterBadge
                            name={`${option}-all-selector`}
                            isSelected={filterIsApplied(option, "all")}
                            onClick={() => onFilterSelection(option, "all")}
                          >
                            All
                          </FilterBadge>
                          {values.map((val) => (
                            <FilterBadge
                              name={`${option}-${val}-selector`}
                              isSelected={filterIsApplied(option, val)}
                              onClick={() => onFilterSelection(option, val)}
                            >
                              {val}
                            </FilterBadge>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Column
                  selected={selectedWildtypeImage}
                  images={filteredWildtypeImages}
                  onSelection={setSelectedWildtypeImage}
                />
              </Col>
              <Col sm={6}>
                <Column
                  selected={selectedMutantImage}
                  images={filteredMutantImages}
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
