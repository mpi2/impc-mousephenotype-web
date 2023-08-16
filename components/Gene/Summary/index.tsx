import { faCaretSquareDown } from "@fortawesome/free-regular-svg-icons";
import {
  faCartPlus,
  faChevronCircleDown,
  faChevronRight,
  faExternalLinkAlt,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import styles from "./styles.module.scss";
import _ from "lodash";
import Card from "../../Card";
import FollowBtn from "./FollowBtn";

export const allBodySystems = [
  "mortality/aging",
  "embryo phenotype",
  "reproductive system phenotype",
  "growth/size/body region phenotype",
  "homeostasis/metabolism phenotype",
  "behavior/neurological phenotype",
  "cardiovascular system phenotype",
  "respiratory system phenotype",
  "digestive/alimentary phenotype",
  "renal/urinary system phenotype",
  "limbs/digits/tail phenotype",
  "skeleton phenotype",
  "immune system phenotype",
  "muscle phenotype",
  "integument phenotype",
  "craniofacial phenotype",
  "hearing/vestibular/ear phenotype",
  "adipose tissue phenotype",
  "endocrine/exocrine gland phenotype",
  "vision/eye phenotype",
  "hematopoietic system phenotype",
  "liver/biliary system phenotype",
  "nervous system phenotype",
  "pigmentation phenotype",
];

import { BodySystem } from "../../BodySystemIcon";
import { useRouter } from "next/router";
import Check from "../../Check";
import Head from "next/head";

const CollectionItem = ({
  name,
  link,
  hasData,
  isExternal,
}: {
  name: string;
  link: string;
  hasData: boolean;
  isExternal?: boolean;
}) => (
  <a
    href={link}
    className={hasData ? styles.dataCollection : styles.dataCollectionInactive}
  >
    <Check isChecked={hasData} />
    {name}{" "}
    {isExternal && (
      <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" className="grey" />
    )}
  </a>
);

const Metric = ({
  children,
  value,
  average,
}: {
  children: string;
  value: number;
  average: number;
}) => {
  return (
    <div className={styles.metric}>
      <div className={styles.progressCircleCont}>
        <CircularProgressbarWithChildren
          strokeWidth={8}
          value={(value * 100) / average}
          styles={buildStyles({
            strokeLinecap: "butt",
            pathTransitionDuration: 0.5,
            pathColor: value >= average ? "#ed7b25" : `#00b0b0`,
            trailColor: "#e8e8e8",
            backgroundColor: "#3e98c7",
          })}
        >
          <span className={styles.progressCircleText}>{value}</span>
        </CircularProgressbarWithChildren>
      </div>
      <div className="ms-3">
        <p className="mb-0">
          <strong>{children}</strong>
        </p>
        <p className="grey mb-0">{average} on average</p>
      </div>
    </div>
  );
};
const Summary = ({
  gene,
  loading,
  error,
}: {
  gene: any;
  loading: boolean;
  error: string;
}) => {
  const router = useRouter();

  const SYNONYMS_COUNT = 2;

  if (loading) {
    return (
      <Card>
        <div className={styles.subheadingCont}>
          <div className={styles.subheading}>
            <span className={`${styles.subheadingSection} primary`}>Gene</span>
            <span className={`${styles.subheadingSection}`}>
              {router.query.pid}
            </span>
          </div>
        </div>
        <br />
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className={styles.subheadingCont}>
          <div className={styles.subheading}>
            <span className={`${styles.subheadingSection} primary`}>Gene</span>
            <span className={`${styles.subheadingSection}`}>
              {router.query.pid}
            </span>
          </div>
        </div>
        <div className="mt-5 mb-5 text-center grey">
          <h1>
            <FontAwesomeIcon icon={faWarning} className="mb-4" /> <br />
            <strong>Sorry, we didn't find anything.</strong>
          </h1>
          <p className="grey">Please check your url or try again later.</p>
        </div>
      </Card>
    );
  }

  const joined = [
    ...(gene.significantTopLevelPhenotypes ?? []),
    ...(gene.notSignificantTopLevelPhenotypes ?? []),
  ];

  const notTested = allBodySystems.filter((x) => joined.indexOf(x) < 0);
  const significantCount = gene.significantTopLevelPhenotypes?.length ?? 0;
  const nonSignificantCount =
    gene.notSignificantTopLevelPhenotypes?.length ?? 0;
  const notTestedCount = notTested.length;
  const allCount = allBodySystems.length;
  return (
    <Card>
      <Head>
        <title>
          {gene.geneSymbol} Mouse Gene Details | {gene.geneName} | International
          Mouse Phenotyping Consortium
        </title>
      </Head>
      <div className={styles.subheadingCont}>
        <div className={styles.subheading}>
          <span className={`${styles.subheadingSection} primary`}>Gene</span>
          <a
            className={`${styles.subheadingSection}`}
            href={`http://www.informatics.jax.org/marker/${gene.mgiGeneAccessionId}`}
            target="_blank"
          >
            {gene.mgiGeneAccessionId}{" "}
            <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
          </a>
          <span className={styles.subheadingSection}>
            Synonyms:{" "}
            {gene.synonyms
              .slice(0, SYNONYMS_COUNT)
              .map(
                (s, i) =>
                  `${s}${
                    i < Math.min(gene.synonyms.length - 1, SYNONYMS_COUNT)
                      ? ", "
                      : ""
                  }`
              )}
            {gene.synonyms.length > SYNONYMS_COUNT && (
              <OverlayTrigger
                placement="bottom"
                trigger={["hover", "focus"]}
                overlay={
                  <Tooltip>
                    <div style={{ textAlign: "left" }}>
                      {gene.synonyms
                        .slice(SYNONYMS_COUNT, gene.synonyms.length)
                        .map((s, i) => (
                          <>
                            <span style={{ whiteSpace: "nowrap" }}>
                              {s}
                              {i < gene.synonyms.length ? ", " : ""}
                            </span>
                            <br />
                          </>
                        ))}
                    </div>
                  </Tooltip>
                }
              >
                {({ ref, ...triggerHandler }) => (
                  <span {...triggerHandler} ref={ref} className="link">
                    +{gene.synonyms.length - SYNONYMS_COUNT} more{" "}
                    <FontAwesomeIcon icon={faCaretSquareDown} />
                  </span>
                )}
              </OverlayTrigger>
            )}
          </span>
        </div>
        <a
          className={`${styles.howLink} secondary`}
          href="https://www.mousephenotype.org/understand/data-collections/"
        >
          How IMPC generates&nbsp;data&nbsp;
          <FontAwesomeIcon icon={faChevronRight} />
        </a>
      </div>
      <div className={styles.headingCont}>
        <h1 className="mb-5 mt-2">
          <strong>{gene.geneSymbol}</strong> <span className="grey">|</span>{" "}
          {gene.geneName}
        </h1>
        <FollowBtn />
      </div>
      <Row className={styles.gap}>
        <Col lg={6}>
          <h3>Impacted physiological systems</h3>
          <div className={styles.progressHeader}>
            <div>
              <span className="secondary">
                {significantCount + nonSignificantCount}
              </span>{" "}
              /{allCount} physiological systems tested
            </div>
            <a href="#data" className="link">
              View data <FontAwesomeIcon icon={faChevronCircleDown} />
            </a>
          </div>
          <div className={styles.progressContainer}>
            <div
              className={styles.progressSegmentPrimary}
              style={{ width: `${(significantCount / allCount) * 100}%` }}
            />
            <div
              className={styles.progressSegment}
              style={{
                width: `${(nonSignificantCount / allCount) * 100}%`,
              }}
            />
          </div>
          {!!significantCount && (
            <div className={styles.bodySystemGroupSignificant}>
              <h5 className={styles.bodySystemGroupSummary}>
                <span className={`${styles.pill} bg-primary white`}>
                  {significantCount}
                </span>{" "}
                Significantly impacted by the knock-out
              </h5>
              <div className={styles.bodySystems}>
                {gene.significantTopLevelPhenotypes.map((x) => (
                  <BodySystem name={x} isSignificant color="primary" />
                ))}
              </div>
            </div>
          )}
          {!!nonSignificantCount && (
            <div className={styles.bodySystemGroup}>
              <h5 className={styles.bodySystemGroupSummary}>
                <span className={`${styles.pill} bg-secondary white`}>
                  {nonSignificantCount}
                </span>{" "}
                No significant impact
              </h5>
              <div className={styles.bodySystems}>
                {gene.notSignificantTopLevelPhenotypes.map((x) => (
                  <BodySystem name={x} color="grey" hoverColor="secondary" />
                ))}
              </div>
            </div>
          )}
          {!!notTestedCount && (
            <div className={styles.bodySystemGroup}>
              <h5 className={styles.bodySystemGroupSummary}>
                <span className={`${styles.pill} bg-grey`}>
                  {notTestedCount}
                </span>{" "}
                Not tested
              </h5>
              {notTested.map((system) => (
                <BodySystem
                  name={system}
                  hoverColor="grey"
                  color="grey-light"
                />
              ))}
            </div>
          )}
        </Col>
        <Col lg={6} style={{ position: "relative" }}>
          <h3>Gene metrics compared to IMPC average</h3>
          <Row>
            <Col md={6}>
              <Metric value={gene.significantPhenotypesCount ?? 0} average={8}>
                Significant phenotypes
              </Metric>
            </Col>
            <Col md={6}>
              <Metric
                value={gene.adultExpressionObservationsCount ?? 0}
                average={57}
              >
                Adult expressions
              </Metric>
            </Col>
            <Col md={6}>
              <Metric value={gene.associatedDiseasesCount ?? 0} average={3}>
                Associated disease
              </Metric>
            </Col>
            <Col md={6}>
              <Metric
                value={gene.embryoExpressionObservationsCount ?? 0}
                average={42}
              >
                Embryo expressions
              </Metric>
            </Col>
          </Row>
          <h3 className="mt-5">Data collections</h3>
          <Row className="mb-5">
            <Col md={5} className="pe-0">
              <CollectionItem
                link="#lacz"
                name="LacZ expression"
                hasData={gene.hasLacZData}
              />
            </Col>
            <Col md={6} className="pe-0">
              <CollectionItem
                link="#histopathology"
                name="Histopathology"
                hasData={gene.hasHistopathologyData}
              />
            </Col>
            <Col md={5} className="pe-0">
              <CollectionItem
                link="#images"
                name="Images"
                hasData={gene.hasImagingData}
              />
            </Col>
            <Col md={7}>
              <CollectionItem
                link="https://www.mousephenotype.org/data/charts?accession=MGI:2444773&parameter_stable_id=IMPC_BWT_008_001&procedure_stable_id=IMPC_BWT_001&chart_type=TIME_SERIES_LINE"
                name="Body weight measurements"
                hasData={gene.hasBodyWeightData}
                isExternal
              />
            </Col>
            <Col md={5} className="pe-0">
              <CollectionItem
                link="#viability-data"
                name="Viability data"
                hasData={gene.hasViabilityData}
                isExternal
              />
            </Col>
            <Col md={7}>
              <CollectionItem
                link="#embro-images"
                name="Embryo imaging data"
                hasData={gene.hasEmbryoImagingData}
                isExternal
              />
            </Col>
          </Row>
          <div className={styles.purchaseBanner}>
            <span>4 allele products available</span>
            <a href="#purchase" className={styles.purchaseButton}>
              <FontAwesomeIcon icon={faCartPlus} /> Order Alleles
            </a>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default Summary;
