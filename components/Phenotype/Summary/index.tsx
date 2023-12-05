import styles from "./styles.module.scss";
import Card from "../../Card";
import { BodySystem } from "../../BodySystemIcon";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretSquareDown } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/router";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { PhenotypeSummary } from "@/models/phenotype";

type Props = {
  phenotype: PhenotypeSummary;
  isLoading: boolean;
  isError: boolean;
}

const Summary = ({ phenotype, isLoading, isError }: Props) => {
  const router = useRouter();

  const SYNONYMS_COUNT = 2;

  const getNoTotalGenes = () => {
    if (!phenotype) return null;
    return phenotype.significantGenes + phenotype.notSignificantGenes;
  }

  const calculatePercentageGenes = () => {
    if (!phenotype) return null;
    if (getNoTotalGenes() === 0) return 0;
    return Number((phenotype.significantGenes / getNoTotalGenes()) * 100).toFixed(2);
  }

  const displaySynonyms = () => {
    return phenotype.phenotypeSynonyms.slice(0, SYNONYMS_COUNT).join(',');
  }
  const displaySynonymsInTooltip = () => {
    return phenotype.phenotypeSynonyms
      .slice(SYNONYMS_COUNT, phenotype.phenotypeSynonyms.length)
      .map((s, i) => (
        <span key={s} style={{ whiteSpace: "nowrap" }}>
          {s}
          {i < phenotype.phenotypeSynonyms.length ? ", " : ""}
          <br />
        </span>
      ))
  }

  if (isLoading) {
    return (
      <Card>
        <div className={styles.subheadingCont}>
          <div className={styles.subheading}>
            <span className={`${styles.subheadingSection} primary`}>Phenotype</span>
            <span className={`${styles.subheadingSection}`}>
              {router.query.id}
            </span>
          </div>
        </div>
        <br />
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <div className={styles.subheadingCont}>
          <div className={styles.subheading}>
            <span className={`${styles.subheadingSection} primary`}>Phenotype</span>
            <span className={`${styles.subheadingSection}`}>
              {router.query.id}
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

  return (
    <Card>
      <div className={styles.subheadingCont}>
        <div className={styles.subheading}>
          <span className={`${styles.subheadingSection} primary`}>
            Phenotype
          </span>
          <a className={styles.subheadingSection} href="#">
            Synonyms:&nbsp;
            {displaySynonyms()}
            {phenotype.phenotypeSynonyms.length > SYNONYMS_COUNT && (
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
                    ,&nbsp;+{phenotype.phenotypeSynonyms.length - SYNONYMS_COUNT} more&nbsp;
                    <FontAwesomeIcon icon={faCaretSquareDown} />
                  </span>
                )}
              </OverlayTrigger>
            )}
          </a>
          {phenotype.topLevelPhenotypes.map(system => (
            <BodySystem
              key={system.id}
              name={system.name}
              prependLabel="System"
              color="grey"
              hoverColor="grey"
              noSpacing
            />
          ))}
        </div>
      </div>
      <Row>
        <Col lg={6}>
          <h1 style={{ margin: 0 }}>
            <strong>{phenotype.phenotypeName}</strong>
          </h1>
        </Col>
        <Col lg={6}>
          <div className={styles.stats}>
            <div data-testid="significant-genes">
              <p className="secondary h2 mb-0">{phenotype.significantGenes}</p>
              <span className="grey">significant genes</span>
            </div>
            <div data-testid="tested-genes-percentage">
              <p className="secondary h2 mb-0">{calculatePercentageGenes()}%</p>
              <span className="grey">of tested genes</span>
            </div>
            <div data-testid="total-genes-tested">
              <p className="h2 mb-0">{getNoTotalGenes()}</p>
              <span className="grey">tested genes</span>
            </div>
          </div>
        </Col>
      </Row>
      <div className={styles.summaryContent}>
        <div>
          <h3>Description</h3>
          <p className="grey">{phenotype.phenotypeDefinition}</p>
        </div>
        <div className="purchaseBanner phenotype-page">
          <span>Significant gene-phenotype associations</span>
          <a href="#associations-table" className="purchaseButton">
             View data
          </a>
        </div>
      </div>
    </Card>
  );
};

export default Summary;
