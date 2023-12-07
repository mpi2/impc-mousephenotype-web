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
import Card from "../../Card";
import { BodySystem } from "../../BodySystemIcon";
import { useRouter } from "next/router";
import Check from "../../Check";
import Head from "next/head";
import { GeneSummary } from "@/models/gene";

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
}: {
  name: string;
  link: string;
  hasData: boolean;
}) => (
  hasData ? (
    <a
      href={link}
      className={styles.dataCollection}
      data-testid={name}
    >
      <Check isChecked={hasData} />
      {name}&nbsp;
    </a>
  ) : (
    <span className={styles.dataCollectionInactive}>
      <Check isChecked={hasData} />
      {name}&nbsp;
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
  loading: boolean;
  error: string;
}
const Summary = ({ gene, loading, error }: SummaryProps) => {
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
            className={`${styles.subheadingSection}`}
            href={`http://www.informatics.jax.org/marker/${gene.mgiGeneAccessionId}`}
            target="_blank"
          >
            {gene.mgiGeneAccessionId}{" "}
            <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
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
        {/*<FollowBtn />*/}
      </div>
      <Row className={styles.gap}>
        <Col lg={6}>
          <h3>Impacted physiological systems</h3>
          <div data-testid="totalCount" className={styles.progressHeader}>
            <div>
              <span className="secondary">
                {significantCount + nonSignificantCount}
              </span>&nbsp;/&nbsp;{allCount} physiological systems tested
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
          <h3>Gene metrics</h3>
          <Row>
            <Col md={6}>
              <Metric value={gene.significantPhenotypesCount || 0}>
                Significant phenotypes
              </Metric>
            </Col>
            <Col md={6}>
              <Metric value={gene.adultExpressionObservationsCount || 0}>
                Adult expressions
              </Metric>
            </Col>
            <Col md={6}>
              <Metric value={gene.associatedDiseasesCount || 0}>
                Associated disease
              </Metric>
            </Col>
            <Col md={6}>
              <Metric value={gene.embryoExpressionObservationsCount || 0}>
                Embryo expressions
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
              />
              <br/>
              <CollectionItem
                link={`/data/bodyweight?mgiGeneAccessionId=${gene.mgiGeneAccessionId}`}
                name="Body weight measurements"
                hasData={gene.hasBodyWeightData}
              />
              <br/>
              <CollectionItem
                link={`//www.mousephenotype.org/embryoviewer/?mgi=${gene.mgiGeneAccessionId}`}
                name="Embryo imaging data"
                hasData={gene.hasEmbryoImagingData}
              />
            </Col>
          </Row>
          <div className="purchaseBanner">
            <span>4 allele products available</span>
            <a href="#order" className="purchaseButton">
              <FontAwesomeIcon icon={faCartPlus} /> Order Alleles
            </a>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default Summary;
