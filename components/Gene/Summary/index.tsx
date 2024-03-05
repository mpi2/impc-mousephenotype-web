import { faCaretSquareDown } from "@fortawesome/free-regular-svg-icons";
import {
  faCartPlus,
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
import Card from "../../Card";
import { BodySystem } from "../../BodySystemIcon";
import { useRouter } from "next/router";
import Check from "../../Check";
import Head from "next/head";
import { GeneSummary } from "@/models/gene";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";

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

const CollectionItem = ({
  name,
  link,
  hasData,
  external = false,
}: {
  name: string;
  link: string;
  hasData: boolean;
  external?: boolean;
}) => (
  hasData ? (
    <a
      href={link}
      className={`link ${styles.dataCollection}`}
      data-testid={name}
    >
      <Check isChecked={hasData} />
      {name}
    </a>
  ) : (
    <span className={styles.dataCollectionInactive} data-testid={name}>
      <Check isChecked={hasData} />
      {name}
    </span>
  )
);

const Metric = ({
  children,
  value,
}: {
  children: string;
  value: number;
}) => {
  return (
    <div className={styles.metric}>
      <div className={styles.progressCircleCont}>
        <CircularProgressbarWithChildren
          strokeWidth={8}
          value={100}
          styles={buildStyles({
            strokeLinecap: "butt",
            pathTransitionDuration: 0.5,
            pathColor: "#e8e8e8",
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
      </div>
    </div>
  );
};

type SummaryProps = {
  gene: GeneSummary;
  numOfAlleles: number;
}
const Summary = ({ gene, numOfAlleles }: SummaryProps) => {
  const SYNONYMS_COUNT = 2;

  const joined = [
    ...(gene.significantTopLevelPhenotypes ?? []),
    ...(gene.notSignificantTopLevelPhenotypes ?? []),
  ];

  const displaySynonyms = () => {
    return gene.synonyms.slice(0, SYNONYMS_COUNT).join(', ');
  }
  const displaySynonymsInTooltip = () => {
    return gene.synonyms
      .slice(SYNONYMS_COUNT, gene.synonyms.length)
      .map((s, i) => (
        <span key={s} style={{ whiteSpace: "nowrap" }}>
          {s}
          {i < gene.synonyms.length ? ", " : ""}
          <br />
        </span>
      ))
  }

  const notTested = allBodySystems.filter((x) => joined.indexOf(x) < 0);
  const significantCount = gene.significantTopLevelPhenotypes?.length ?? 0;
  const nonSignificantCount = gene.notSignificantTopLevelPhenotypes?.length ?? 0;
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
            className={`${styles.subheadingSection} link`}
            href={`http://www.informatics.jax.org/marker/${gene.mgiGeneAccessionId}`}
            target="_blank"
          >
            {gene.mgiGeneAccessionId}
            <FontAwesomeIcon style={{ marginLeft: '0.5em' }} icon={faExternalLinkAlt} size="xs" />
          </a>
          {gene?.synonyms?.length > 0 && (
            <span className={styles.subheadingSection}>
            Synonyms:{" "}
              {displaySynonyms()}
              {gene.synonyms.length > SYNONYMS_COUNT && (
                <OverlayTrigger
                  placement="bottom"
                  trigger={["hover", "focus"]}
                  overlay={
                    <Tooltip>
                      <div style={{ textAlign: "left" }}>
                        {displaySynonymsInTooltip()}
                      </div>
                    </Tooltip>
                  }
                >
                  {({ ref, ...triggerHandler }) => (
                    <span {...triggerHandler} ref={ref} className="link" data-testid="synonyms">
                    ,&nbsp;+{gene.synonyms.length - SYNONYMS_COUNT} more{" "}
                      <FontAwesomeIcon icon={faCaretSquareDown} />
                  </span>
                  )}
                </OverlayTrigger>
              )}
          </span>
          )}
        </div>
        <a
          className={`${styles.howLink} secondary`}
          href="https://www.mousephenotype.org/understand/start-using-the-impc/impc-data-generation/"
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
        {/*<FollowBtn />*/}
      </div>
      <Row className={styles.gap}>
        <Col lg={6}>
          <h3>Physiological systems</h3>
          <div className={styles.progressHeader}>
            <div data-testid="totalCount">
              <span className="secondary">
                {significantCount + nonSignificantCount}
              </span>&nbsp;/&nbsp;{allCount} physiological systems tested
            </div>
            <a href="#data" className="link">
              View data
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
                <span className={`${styles.pill} bg-primary white`} data-testid="significantCount">
                  {significantCount}
                </span>{" "}
                Significantly impacted by the knock-out
              </h5>
              <div className={styles.bodySystems} data-testid="significantSystemIcons">
                {gene.significantTopLevelPhenotypes.map((x) => (
                  <BodySystem key={x} name={x} isSignificant color="primary" />
                ))}
              </div>
            </div>
          )}
          {!!nonSignificantCount && (
            <div className={styles.bodySystemGroup}>
              <h5 className={styles.bodySystemGroupSummary}>
                <span className={`${styles.pill} bg-secondary white`} data-testid="nonSignificantCount">
                  {nonSignificantCount}
                </span>{" "}
                No significant impact
              </h5>
              <div className={styles.bodySystems} data-testid="notSignificantSystemIcons">
                {gene.notSignificantTopLevelPhenotypes.map((x) => (
                  <BodySystem key={x} name={x} color="grey" hoverColor="secondary" />
                ))}
              </div>
            </div>
          )}
          {!!notTestedCount && (
            <div className={styles.bodySystemGroup}>
              <h5 className={styles.bodySystemGroupSummary}>
                <span className={`${styles.pill} bg-grey`} data-testid="nonTestedCount">
                  {notTestedCount}
                </span>{" "}
                Not tested
              </h5>
              <div data-testid="notTestedSystemIcons">
                {notTested.map((system) => (
                  <BodySystem
                    key={system}
                    name={system}
                    hoverColor="grey"
                    color="grey-light"
                  />
                ))}
              </div>
            </div>
          )}
        </Col>
        <Col lg={6} style={{ position: "relative" }}>
          <Row>
            <Col md={6}>
              <h3>Gene metrics</h3>
              <Metric value={gene.significantPhenotypesCount || 0}>
                Significant phenotypes
              </Metric>
            </Col>
            <Col md={6}>
              <h3>Expression examined in</h3>
              <Metric value={gene.adultExpressionObservationsCount || 0}>
                Adult tissues
              </Metric>
            </Col>
            <Col md={6}>
              <Metric value={gene.associatedDiseasesCount || 0}>
                Associated diseases
              </Metric>
            </Col>
            <Col md={6}>
              <Metric value={gene.embryoExpressionObservationsCount || 0}>
                Embryo tissues
              </Metric>
            </Col>
          </Row>
          <h3 className="mt-5">Data collections</h3>
          <Row className="mb-5">
            <Col md={6} className="pe-0">
              <CollectionItem
                link="#expressions"
                name="LacZ expression"
                hasData={gene.hasLacZData}
              />
              <br/>
              <CollectionItem
                link="#histopathology"
                name="Histopathology"
                hasData={gene.hasHistopathologyData}
              />
              <br/>
              <CollectionItem
                link="#images"
                name="Images"
                hasData={gene.hasImagingData}
              />
            </Col>
            <Col md={6}>
              <CollectionItem
                link={`/data/viability?mgiGeneAccessionId=${gene.mgiGeneAccessionId}`}
                name="Viability data"
                hasData={gene.hasViabilityData}
                external
              />
              <br/>
              <CollectionItem
                link={`/data/bodyweight?mgiGeneAccessionId=${gene.mgiGeneAccessionId}`}
                name="Body weight measurements"
                hasData={gene.hasBodyWeightData}
                external
              />
              <br/>
              <CollectionItem
                link={`//www.mousephenotype.org/embryoviewer/?mgi=${gene.mgiGeneAccessionId}`}
                name="Embryo imaging data"
                hasData={gene.hasEmbryoImagingData}
                external
              />
            </Col>
          </Row>
          <div className="purchaseBanner">
            <Link className="link" href="#order">
              <span>{numOfAlleles || <Skeleton width="30px" inline/>} allele products available</span>
            </Link>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default Summary;
