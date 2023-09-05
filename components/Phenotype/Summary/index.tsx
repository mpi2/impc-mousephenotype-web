import styles from "./styles.module.scss";
import Card from "../../Card";
import { BodySystem } from "../../BodySystemIcon";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretSquareDown } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/router";
import { faWarning } from "@fortawesome/free-solid-svg-icons";


const Summary = ({ phenotype, isLoading, isError }) => {
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
            {phenotype.phenotypeSynonyms
              .slice(0, SYNONYMS_COUNT)
              .map(
                (s, i) =>
                  `${s}${
                    i < Math.min(phenotype.phenotypeSynonyms.length - 1, SYNONYMS_COUNT)
                      ? ", "
                      : ""
                  }`
              )}
            {phenotype.phenotypeSynonyms.length > SYNONYMS_COUNT && (
              <OverlayTrigger
                placement="bottom"
                trigger={["hover", "focus"]}
                overlay={
                  <Tooltip>
                    <div style={{ textAlign: "left" }}>
                      {phenotype.phenotypeSynonyms
                        .slice(SYNONYMS_COUNT, phenotype.phenotypeSynonyms.length)
                        .map((s, i) => (
                          <>
                            <span style={{ whiteSpace: "nowrap" }}>
                              {s}
                              {i < phenotype.phenotypeSynonyms.length ? ", " : ""}
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
                    +{phenotype.phenotypeSynonyms.length - SYNONYMS_COUNT} more&nbsp;
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
      <h1>
        <strong>{phenotype.phenotypeName}</strong>
      </h1>
      <div className={styles.summaryContent}>
        <div>
          <h3>Description</h3>
          <p className="grey">{phenotype.phenotypeDefinition}</p>
        </div>
        <div className={styles.stats}>
          <div>
            <p className="secondary h2 mb-2">{phenotype.significantGenes}</p>
            <span className="grey">significant genes</span>
          </div>
          <div>
            <p className="secondary h2 mb-2">{calculatePercentageGenes()}%</p>
            <span className="grey">of tested genes</span>
          </div>
          <div>
            <p className="h2 mb-2">{getNoTotalGenes()}</p>
            <span className="grey">tested genes</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Summary;
