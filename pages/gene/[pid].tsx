import { faCaretSquareDown } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowDown,
  faBone,
  faCartPlus,
  faCheckCircle,
  faChevronDown,
  faChevronRight,
  faExternalLinkAlt,
  faSkullCrossbones,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Col,
  Container,
  OverlayTrigger,
  Popover,
  Row,
  Tooltip,
} from "react-bootstrap";
import {
  CircularProgressbar,
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import Search from "../../components/Search";
import styles from "./styles.module.scss";

const BodySystem = ({
  name,
  isSignificant = false,
  color = "grey",
}: {
  isSignificant?: boolean;
  name: string;
  color?: string;
}) => {
  return isSignificant ? (
    <span className={styles.bodySystem}>
      <FontAwesomeIcon size="2x" icon={faBone} className={color} /> {name}
    </span>
  ) : (
    <OverlayTrigger
      placement="top"
      trigger="hover"
      overlay={<Tooltip>{name}</Tooltip>}
    >
      {({ ref, ...triggerHandler }) => (
        <span {...triggerHandler} ref={ref} className={styles.bodySystem}>
          <FontAwesomeIcon
            size="2x"
            icon={faSkullCrossbones}
            className={color}
          />
        </span>
      )}
    </OverlayTrigger>
  );
};

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

const Gene = () => {
  return (
    <>
      <Search />
      <Container className={styles.page}>
        <div className="card">
          <div className={styles.subheadingCont}>
            <div className={styles.subheading}>
              <span className={`${styles.subheadingSection} primary`}>
                Gene
              </span>
              <a
                className={`${styles.subheadingSection}`}
                href="http://www.informatics.jax.org/marker/MGI:2444773"
                target="_blank"
              >
                MGI:2444773 <FontAwesomeIcon icon={faExternalLinkAlt} />
              </a>
              <a className={styles.subheadingSection} href="#">
                Synonyms: IPS-1, D430028G21Rik, +3 more{" "}
                <FontAwesomeIcon icon={faCaretSquareDown} />
              </a>
            </div>
            <a
              className={`${styles.howLink} secondary`}
              href="https://www.mousephenotype.org/understand/data-collections/"
            >
              How IMPC generates data <FontAwesomeIcon icon={faChevronRight} />
            </a>
          </div>
          <h1>
            <strong>Mavs</strong> <span className="grey">|</span> mitochondrial
            antiviral signaling protein
          </h1>
          <Row className={styles.gap}>
            <Col>
              <h3>Impacted physiological systems</h3>
              <div className={styles.progressHeader}>
                <div>
                  <span className="secondary">15</span> /20 physiological
                  systems tested
                </div>
                <a href="#data" className="secondary">
                  View data <FontAwesomeIcon icon={faArrowDown} />
                </a>
              </div>
              <div className={styles.progressContainer}>
                <div
                  className={styles.progressSegmentPrimary}
                  style={{ width: `${(1 / 20) * 100}%` }}
                />
                <div
                  className={styles.progressSegment}
                  style={{ width: `${((15 - 1) / 20) * 100}%` }}
                />
              </div>
              <div className={styles.bodySystemGroupSignificant}>
                <p className={styles.bodySystemGroupSummary}>
                  <span className={`${styles.pill} bg-primary white`}>1</span>{" "}
                  <span>
                    <strong>Significantly</strong> impacted by the knock-out
                  </span>
                </p>
                <div className={styles.bodySystems}>
                  <BodySystem name="Skeleton" isSignificant color="primary" />
                </div>
              </div>
              <div className={styles.bodySystemGroup}>
                <p className={styles.bodySystemGroupSummary}>
                  <span className={`${styles.pill} bg-secondary white`}>
                    15
                  </span>{" "}
                  <span>
                    <strong>No significant</strong> impact
                  </span>
                </p>
                <div className={styles.bodySystems}>
                  {[
                    "motality/aging",
                    "reproductive system",
                    "growth/size/body region",
                    "homeostasis/metabolism",
                    "behaviour/neurological system",
                    "cardiovescular system",
                    "renal/urinal system",
                    "limbs/digits/tail",
                    "immune system",
                    "integument or pigmentation",
                    "craniofacial",
                    "hearing/vestibular/ear",
                    "endocrine/exocrine",
                    "vision/eye",
                  ].map((system) => (
                    <BodySystem name={system} color="secondary" />
                  ))}
                </div>
              </div>
              <div className={styles.bodySystemGroup}>
                <p className={styles.bodySystemGroupSummary}>
                  <span className={`${styles.pill} bg-grey white`}>15</span>{" "}
                  <strong>No tested</strong>
                </p>
                {[
                  "motality/aging",
                  "reproductive system",
                  "growth/size/body region",
                  "homeostasis/metabolism",
                  "behaviour/neurological system",
                ].map((system) => (
                  <BodySystem name={system} />
                ))}
              </div>
            </Col>
            <Col style={{ position: "relative" }}>
              <h3>
                Gene metrics{" "}
                <span className="thin">compared to IMPC average</span>
              </h3>
              <Row>
                <Col md={6}>
                  <Metric value={2} average={7}>
                    Significant phenotypes
                  </Metric>
                </Col>
                <Col md={6}>
                  <Metric value={67} average={97}>
                    Expressions
                  </Metric>
                </Col>
                <Col md={6}>
                  <Metric value={3} average={8}>
                    Associated disease
                  </Metric>
                </Col>
                <Col md={6}>
                  <Metric value={3} average={23}>
                    Significant phenotypes
                  </Metric>
                </Col>
              </Row>
              <h3 className="mt-3">Data collections</h3>
              <Row>
                <Col md={5} className="pe-0">
                  <a href="#lacz" className={styles.dataCollection}>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Lacz expression
                  </a>
                </Col>
                <Col md={6} className="pe-0">
                  <a href="#histopathology" className={styles.dataCollection}>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Histopathology
                  </a>
                </Col>
                <Col md={5} className="pe-0">
                  <a href="#images" className={styles.dataCollection}>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Images (x-rays)
                  </a>
                </Col>
                <Col md={7}>
                  <a
                    href="https://www.mousephenotype.org/data/charts?accession=MGI:2444773&parameter_stable_id=IMPC_BWT_008_001&procedure_stable_id=IMPC_BWT_001&chart_type=TIME_SERIES_LINE"
                    target="_blank"
                    className={styles.dataCollection}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Body Weight Measurements{" "}
                    <FontAwesomeIcon
                      icon={faExternalLinkAlt}
                      className="grey"
                    />
                  </a>
                </Col>
                <Col md={5} className="pe-0">
                  <a href="#lacz" className={styles.dataCollection}>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Viability Data{" "}
                    <FontAwesomeIcon
                      icon={faExternalLinkAlt}
                      className="grey"
                    />
                  </a>
                </Col>
                <Col md={7}>
                  <span className={styles.dataCollectionInactive}>
                    <FontAwesomeIcon icon={faTimesCircle} className="grey" />
                    Embryo Imaging Data
                  </span>
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
        </div>
      </Container>
    </>
  );
};

export default Gene;
