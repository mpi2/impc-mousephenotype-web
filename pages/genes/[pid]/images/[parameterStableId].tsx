import {
  faArrowLeftLong,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faRefresh,
  faVenus,
  faMars,
  faMarsAndVenus,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useMemo, useState } from "react";
import { Badge, Col, Container, Row } from "react-bootstrap";
import Card from "@/components/Card";
import Search from "@/components/Search";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from "./styles.module.scss";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import Skeleton from "react-loading-skeleton";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { AlleleSymbol, FilterBox } from "@/components";
import { GeneImageCollection, Image } from "@/models/gene";
import classNames from "classnames";
import { getIcon } from "@/utils";
import Head from "next/head";

type Filters = {
  selectedCenter: string;
};

const addTrailingSlash = (url) => (!url?.endsWith("/") ? url + "/" : url);
const SkeletonText = ({ width = "300px" }) => (
  <Skeleton style={{ display: "block", width }} inline />
);
const getZygosityColor = (zygosity: string) => {
  switch (zygosity) {
    case "heterozygote":
      return "#88CCEE";
    case "homozygote":
      return "#DDCC77";
    case "hemizygote":
      return "#CC6677";

    default:
      return "#FFF";
  }
};

const FilterBadge = ({
  children,
  onClick,
  icon,
  isSelected,
}: {
  children: ReactNode;
  onClick: () => void;
  icon?: any;
  isSelected: boolean;
}) => (
  <Badge
    className={classNames(styles.badge, { 'active': isSelected })}
    pill
    bg="badge-secondary"
    onClick={onClick}
  >
    {children}&nbsp;
    {!!icon ? <FontAwesomeIcon icon={icon} /> : null}
  </Badge>
);

const ImageInformation = ({
  image,
  inViewer = false,
}: {
  image: Image,
  inViewer?: boolean
}) => {
  return (
    <div className={classNames(styles.additionalInfo, {[styles.inViewer]: inViewer})}>
      {!!image.ageInWeeks && (
        <span>
          Age: {image.ageInWeeks} weeks <br/>
        </span>
      )}
      <div className={styles.indicatorsContainer}>
        <FontAwesomeIcon icon={getIcon(image.sex)}/>
      </div>
      <div className={styles.indicatorsContainer}>
        {inViewer ? (
          <span>{image.zygosity}</span>
          ) : (
          <div className={`${styles.common} ${styles.zygosityIndicator}`}>
            <FontAwesomeIcon icon={faCircle} style={{color: getZygosityColor(image.zygosity)}}/>
          </div>
        )}
      </div>
      {!!image.alleleSymbol && (
        <AlleleSymbol symbol={image.alleleSymbol} withLabel={false}/>
      )}
      {(inViewer && image.associatedParameters?.length) && (
        <>
          <div className="break"></div>
          <div className={styles.associatedParams}>
            <span>Associated parameters</span>
            {image.associatedParameters.map(param => (
              <div key={param.stableId}>
                {param.name} - <b>{param.value}</b>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const ImageViewer = ({image}) => {
  if (!image) {
    return (
      <Skeleton
        containerClassName="flex-1"
        style={{flex: 1, height: "100%"}}
      />
    );
  }
  return (
    <TransformWrapper>
      {({zoomIn, zoomOut, resetTransform, ...rest}) => (
        <div className={styles.viewer}>
          <div className={styles.tools}>
            <button onClick={() => zoomIn()}>
              <FontAwesomeIcon icon={faMagnifyingGlassPlus} title="zoom in button" titleId="zoom-in-icon"/>
            </button>
            <button onClick={() => zoomOut()}>
              <FontAwesomeIcon icon={faMagnifyingGlassMinus} title="zoom out button" titleId="zoom-out-icon"/>
            </button>
            <button onClick={() => resetTransform()}>
              <FontAwesomeIcon icon={faRefresh} title="reset zoom button" titleId="reset-zoom-icon"/>
            </button>
          </div>
          <TransformComponent>
            <img
              key={image?.jpegUrl}
              src={addTrailingSlash(image?.jpegUrl)}
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
            className={classNames(styles.singleImage, { [styles.active]: selected === i })}
            onClick={() => onSelection(i)}
          >
            <LazyLoadImage
              src={addTrailingSlash(image.thumbnailUrl)}
              effect="blur"
              alt={""}
              width="100%"
              wrapperProps={{ style: { width: "100%" } }}
            />
            <ImageInformation image={image}/>
          </div>
        </Col>
      ))}
      {images && images.length === 0 ? (
        <div style={{textAlign: "center"}}>
          <h3>
            <strong>No images to show</strong>
          </h3>
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
    queryKey: ["genes", pid, "images", parameterStableId],
    queryFn: () =>
      fetchAPI(
        `/api/v1/images/find_by_mgi_and_stable_id?mgiGeneAccessionId=${pid}&parameterStableId=${parameterStableId}`
      ),
    enabled: router.isReady,
    select: data => (data as Array<GeneImageCollection>)
      .sort((a, b) => a.pipelineStableId.localeCompare(b.pipelineStableId)),
    placeholderData: [],
  });

  const { data: controlImagesRaw } = useQuery({
    queryKey: ["genes", pid, "images", parameterStableId, "control"],
    queryFn: () =>
      fetchAPI(
        `/api/v1/images/find_by_stable_id_and_sample_id?biologicalSampleGroup=control&parameterStableId=${parameterStableId}`
      ),
    enabled: router.isReady,
    select: data => (data as Array<GeneImageCollection>)
      .sort((a, b) => a.pipelineStableId.localeCompare(b.pipelineStableId)),
    placeholderData: [],
  });

  const [selectedSex, setSelectedSex] = useState("both");
  const [selectedZyg, setSelectedZyg] = useState("both");
  const [selectedMutantCenter, setSelectedMutantCenter] = useState<string>('IMPC');
  const [selectedControlCenter, setSelectedControlCenter] = useState<string>('IMPC');
  const [selectedAllele, setSelectedAllele] = useState<string>('all');

  const filterControlImages = (images: Array<Image>) => {
    return images?.filter((i) =>
      selectedSex !== "both" ? i.sex === selectedSex : true
    );
  };
  const filterMutantImages = (images: Array<Image>) => {
    return images
      ?.filter((i) => (selectedSex !== "both" ? i.sex === selectedSex : true))
      ?.filter((i) =>
        selectedZyg !== "both" ? i.zygosity === selectedZyg : true
      )
      ?.filter(i =>
        selectedAllele !== 'all' ? i.alleleSymbol === selectedAllele : true
      );
  };
  const filterImagesByCenter = (images: Array<GeneImageCollection>, type: "control" | "mutant", filters: Filters) => {
    const { selectedCenter } = filters;
    const setSelectedCenter = type === "control" ? setSelectedControlCenter : setSelectedMutantCenter;
    const hasImagesForParameter = !!images.find(c => c.pipelineStableId.includes(selectedCenter));
    if (hasImagesForParameter) {
      return images
        .filter(collection => collection.pipelineStableId.includes(selectedCenter))
        .flatMap(collection => collection.images) || [];
    } else if (images?.length >= 1 && !images[0].pipelineStableId.includes(selectedCenter)) {
      setSelectedCenter(images[0].pipelineStableId.split('_')[0]);
      return images[0].images;
    }
  };

  const { procedureName, parameterName, geneSymbol } = useMemo(() => {
    if (mutantImages.length) {
      return mutantImages[0];
    }
    return {
      procedureName: null,
      parameterName: null,
      geneSymbol: null
    }
  }, [mutantImages.length]);

  const selectedControlImages = useMemo(
    () => filterImagesByCenter(controlImagesRaw, "control", { selectedCenter: selectedControlCenter }),
    [controlImagesRaw, selectedControlCenter]
  );
  const selectedMutantImages = useMemo(
    () => filterImagesByCenter(mutantImages, "mutant", { selectedCenter: selectedMutantCenter }),
    [mutantImages, selectedMutantCenter]
  );

  const allMutantCenters = useMemo(
    () =>
      Array.from(new Set(mutantImages?.map(c => c.pipelineStableId.split('_')[0]))) || [] as Array<string>,
    [mutantImages]
  );

  const allControlCenters = useMemo(
    () =>
      Array.from(new Set(controlImagesRaw?.map(c => c.pipelineStableId.split('_')[0]))) || [] as Array<string>,
    [controlImagesRaw]
  );

  const alleles: Array<string> = useMemo(
    () =>
      Array.from(new Set(selectedMutantImages?.map(c => c.alleleSymbol))) || [] as Array<string>,
    [selectedMutantImages]
  );

  const controlImages = useMemo(
    () => filterControlImages(selectedControlImages),
    [selectedControlImages, selectedSex]
  );
  const filteredMutantImages = useMemo(
    () => filterMutantImages(selectedMutantImages),
    [selectedMutantImages, selectedSex, selectedZyg, selectedAllele]
  );

  return (
    <>
      <Head>
        <title>{geneSymbol} Image Comparator | International Mouse Phenotyping Consortium</title>
      </Head>
      <Search />
      <Container className="page">
        <Card>
          <Link href={`/genes/${pid}#images`} className="primary mb-3" style={{ fontSize: '1.13rem'}}>
            <FontAwesomeIcon icon={faArrowLeftLong} /> Back to {geneSymbol || <SkeletonText />}
          </Link>
          <p className={styles.subheading}>Images</p>
          <h1 className="mb-4 mt-2" style={{ display: "flex", gap: "1rem" }}>
            <strong>{procedureName || <SkeletonText />}</strong>{" "}
            /&nbsp;
            {parameterName || <SkeletonText />}
          </h1>
          <div>
            <Row>
              <Col sm={6}>
                <div className={styles.headerContainer}>
                  <h3 style={{ marginBottom: 0 }}>WT Images ({selectedControlImages?.length})</h3>
                  <FilterBox
                    controlId="controlCenterFilter"
                    label="Center"
                    ariaLabel="Filter control images by center"
                    value={selectedControlCenter}
                    onChange={setSelectedControlCenter}
                    options={allControlCenters}
                    controlStyle={{display: "inline-block", width: 100}}
                    allOptionEnabled={false}
                    displayEvenWithOnlyOneOption
                  />
                </div>
                <Col xs={12}>
                  <div className={classNames("ratio", "ratio-16x9", styles.imageContainer)}>
                    <ImageViewer image={controlImages?.[selectedWTImage]}/>
                  </div>
                  <div className={styles.imageInfo}>
                    {!!controlImages?.[selectedWTImage] && (
                      <ImageInformation image={controlImages[selectedWTImage]} inViewer/>
                    )}
                  </div>
                </Col>
              </Col>
              <Col sm={6}>
                <div className={styles.headerContainer}>
                  <h3 style={{ marginBottom: 0 }}>Mutant Images ({selectedMutantImages?.length})</h3>
                  <FilterBox
                    controlId="mutantCenterFilter"
                    label="Center"
                    ariaLabel="Filter mutant images by center"
                    value={selectedMutantCenter}
                    onChange={setSelectedMutantCenter}
                    options={allMutantCenters}
                    controlStyle={{display: "inline-block", width: 100}}
                    allOptionEnabled={false}
                    displayEvenWithOnlyOneOption
                  />
                </div>
                <Col xs={12}>
                <div className={classNames("ratio", "ratio-16x9", styles.imageContainer)}>
                    <ImageViewer image={filteredMutantImages?.[selectedMutantImage]}/>
                  </div>
                  <div className={styles.imageInfo}>
                    {!!filteredMutantImages?.[selectedMutantImage] && (
                      <ImageInformation image={filteredMutantImages[selectedMutantImage]} inViewer/>
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
                      <FontAwesomeIcon style={{color: '#FFF'}} icon={faCircle}/>
                    </div>
                    Wildtype
                  </span>
                  <span className={styles.legendWrapper}>
                    <div className={styles.legendBackground}>
                      <FontAwesomeIcon style={{color: '#88CCEE'}} icon={faCircle}/>
                    </div>
                    Heterozygote
                  </span>
                  <span className={styles.legendWrapper}>
                    <div className={styles.legendBackground}>
                      <FontAwesomeIcon style={{color: '#DDCC77'}} icon={faCircle}/>
                    </div>
                    Homozygote
                  </span>
                  <span className={styles.legendWrapper}>
                    <div className={styles.legendBackground}>
                      <FontAwesomeIcon style={{color: '#CC6677'}} icon={faCircle}/>
                    </div>
                    Hemizygote
                  </span>
                </div>
              </Col>
              <Col xs={12}>
                <div className={styles.filtersWrapper}>
                  <div className={styles.column}>
                    Filter by:
                    <div className={styles.filter}>
                      <strong>Sex:</strong>
                      <FilterBadge
                        isSelected={selectedSex === 'both'}
                        icon={faMarsAndVenus}
                        onClick={() => setSelectedSex('both')}
                      >
                        All
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
                  </div>
                  <div className={classNames(styles.column, styles.mutantFilter)}>
                    <div className={styles.filter}>
                      <strong>Mutant zygosity:</strong>
                      <FilterBadge
                        isSelected={selectedZyg === 'both'}
                        onClick={() => setSelectedZyg('both')}
                      >
                        All
                      </FilterBadge>
                      <FilterBadge
                        isSelected={selectedZyg === 'heterozygote'}
                        onClick={() => setSelectedZyg('heterozygote')}
                      >
                        Heterozygote
                      </FilterBadge>
                      <FilterBadge
                        isSelected={selectedZyg === 'homozygote'}
                        onClick={() => setSelectedZyg('homozygote')}
                      >
                        Homozygote
                      </FilterBadge>
                      <FilterBadge
                        isSelected={selectedZyg === 'hemizygote'}
                        onClick={() => setSelectedZyg('hemizygote')}
                      >
                        Hemizygote
                      </FilterBadge>
                    </div>
                    {alleles.length > 1 && (
                      <div className={styles.filter}>
                        <FilterBox
                          controlId="allelesFilter"
                          label="Allele"
                          ariaLabel="Filter by allele"
                          value={selectedAllele}
                          onChange={setSelectedAllele}
                          options={alleles}
                          controlStyle={{display: "inline-block", width: 200}}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Column
                  selected={selectedWTImage}
                  images={controlImages}
                  onSelection={(imageIndex) => setSelectedWTImage(imageIndex)}
                />
              </Col>
              <Col sm={6}>
                <Column
                  selected={selectedMutantImage}
                  images={filteredMutantImages}
                  onSelection={(imageIndex) =>
                    setSelectedMutantImage(imageIndex)
                  }
                />
              </Col>
            </Row>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default ImagesCompare;
