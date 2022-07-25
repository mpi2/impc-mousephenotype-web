import { faCaretSquareDown } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowDown,
  faCartPlus,
  faChevronRight,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import styles from "./styles.module.scss";
import _ from "lodash";
import Card from "../../Card";

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
import { useEffect, useState } from "react";
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
      <FontAwesomeIcon icon={faExternalLinkAlt} className="grey" />
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
          strokeWidth={13}
          value={(value * 100) / average}
          styles={buildStyles({
            strokeLinecap: "butt",
            pathTransitionDuration: 0.5,
            pathColor: `#00b0b0`,
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
const Summary = () => {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      if (!router.query.pid) return;
      const res = await fetch(`/api/genes/${router.query.pid}/summary`);
      if (res.ok) {
        setData(await res.json());
      }
    })();
  }, [router.query.pid]);

  if (!data) {
    return <p>Loading...</p>;
  }

  const joined = [
    ...data.significantTopLevelPhenotypes,
    ...data.notSignificantTopLevelPhenotypes,
  ];

  const notTested = allBodySystems.filter((x) => joined.indexOf(x) < 0);
  const significantCount = data.significantTopLevelPhenotypes.length;
  const nonSignificantCount = data.notSignificantTopLevelPhenotypes.length;
  const notTestedCount = notTested.length;
  const allCount = allBodySystems.length;
  return (
    <Card>
      <Head>
        <title>
          {data.geneSymbol} Mouse Gene Details | {data.geneName} | International
          Mouse Phenotyping Consortium
        </title>
      </Head>
      <div className={styles.subheadingCont}>
        <div className={styles.subheading}>
          <span className={`${styles.subheadingSection} primary`}>Gene</span>
          <a
            className={`${styles.subheadingSection}`}
            href={`http://www.informatics.jax.org/marker/${data.geneAccessionId}`}
            target="_blank"
          >
            {data.geneAccessionId} <FontAwesomeIcon icon={faExternalLinkAlt} />
          </a>
          <a className={styles.subheadingSection} href="#">
            Synonyms:{" "}
            {data.synonyms
              .slice(0, 2)
              .map((s, i) => `${i > 0 ? ", " : ""}${s}`)}
            {data.synonyms.length >= 3 && (
              <>
                +${data.synonyms.length - 2} more{" "}
                <FontAwesomeIcon icon={faCaretSquareDown} />
              </>
            )}
          </a>
        </div>
        <a
          className={`${styles.howLink} secondary`}
          href="https://www.mousephenotype.org/understand/data-collections/"
        >
          How IMPC generates data <FontAwesomeIcon icon={faChevronRight} />
        </a>
      </div>
      <h1 className="mb-5 mt-2">
        <strong>{data.geneSymbol}</strong> <span className="grey">|</span>{" "}
        {data.geneName}
      </h1>
      <Row className={styles.gap}>
        <Col>
          <h3>Impacted physiological systems</h3>
          <div className={styles.progressHeader}>
            <div>
              <span className="secondary">
                {significantCount + nonSignificantCount}
              </span>{" "}
              /{allCount} physiological systems tested
            </div>
            <a href="#data" className="secondary">
              View data <FontAwesomeIcon icon={faArrowDown} />
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
              <p className={styles.bodySystemGroupSummary}>
                <span className={`${styles.pill} bg-primary white`}>
                  {significantCount}
                </span>{" "}
                <span>
                  <strong>Significantly</strong> impacted by the knock-out
                </span>
              </p>
              <div className={styles.bodySystems}>
                {data.significantTopLevelPhenotypes.map((x) => (
                  <BodySystem name={x} isSignificant color="primary" />
                ))}
              </div>
            </div>
          )}
          {!!nonSignificantCount && (
            <div className={styles.bodySystemGroup}>
              <p className={styles.bodySystemGroupSummary}>
                <span className={`${styles.pill} bg-secondary white`}>
                  {nonSignificantCount}
                </span>{" "}
                <span>
                  <strong>No significant</strong> impact
                </span>
              </p>
              <div className={styles.bodySystems}>
                {data.notSignificantTopLevelPhenotypes.map((x) => (
                  <BodySystem name={x} color="secondary" />
                ))}
              </div>
            </div>
          )}
          {!!notTestedCount && (
            <div className={styles.bodySystemGroup}>
              <p className={styles.bodySystemGroupSummary}>
                <span className={`${styles.pill} bg-grey`}>
                  {notTestedCount}
                </span>{" "}
                <strong>Not tested</strong>
              </p>
              {notTested.map((system) => (
                <BodySystem name={system} />
              ))}
            </div>
          )}
        </Col>
        <Col style={{ position: "relative" }}>
          <h3>
            Gene metrics <span className="thin">compared to IMPC average</span>
          </h3>
          <Row>
            <Col md={6}>
              <Metric value={data.significantPhenotypesCount ?? 0} average={7}>
                Significant phenotypes
              </Metric>
            </Col>
            <Col md={6}>
              <Metric
                value={data.adultExpressionObservationsCount ?? 0}
                average={97}
              >
                Adult expressions
              </Metric>
            </Col>
            <Col md={6}>
              <Metric value={data.associatedDiseasesCount ?? 0} average={8}>
                Associated disease
              </Metric>
            </Col>
            <Col md={6}>
              <Metric
                value={data.embryoExpressionObservationsCount ?? 0}
                average={23}
              >
                Embryo expressions
              </Metric>
            </Col>
          </Row>
          <h3 className="mt-3">Data collections</h3>
          <Row className="mb-5">
            <Col md={5} className="pe-0">
              <CollectionItem
                link="#lacz"
                name="Lacz expression"
                hasData={data.hasLacZData}
              />
            </Col>
            <Col md={6} className="pe-0">
              <CollectionItem
                link="#histopathology"
                name="Histopathology"
                hasData={data.hasHistopathologyData}
              />
            </Col>
            <Col md={5} className="pe-0">
              <CollectionItem
                link="#images"
                name="Images"
                hasData={data.hasImagingData}
              />
            </Col>
            <Col md={7}>
              <CollectionItem
                link="https://www.mousephenotype.org/data/charts?accession=MGI:2444773&parameter_stable_id=IMPC_BWT_008_001&procedure_stable_id=IMPC_BWT_001&chart_type=TIME_SERIES_LINE"
                name="Body weight measurements"
                hasData={data.hasBodyWeightData}
                isExternal
              />
            </Col>
            <Col md={5} className="pe-0">
              <CollectionItem
                link="#viability-data"
                name="Viability data"
                hasData={data.hasViabilityData}
                isExternal
              />
            </Col>
            <Col md={7}>
              <CollectionItem
                link="#embro-images"
                name="Embryo imaging data"
                hasData={data.hasEmbryoImagingData}
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
