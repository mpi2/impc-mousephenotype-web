import styles from "./styles.module.scss";
import Card from "../../Card";
import {BodySystem} from "../../BodySystemIcon";


const Summary = ({ phenotype }) => {

  const getNoTotalGenes = () => {
    if (!phenotype) return null;
    return phenotype.significantGenes + phenotype.notSignificantGenes;
  }

  const calculatePercentageGenes = () => {
    if (!phenotype) return null;
    return Number((phenotype.significantGenes / getNoTotalGenes()) * 100).toFixed(2);
  }

  return (
    <Card>
      <div className={styles.subheadingCont}>
        <div className={styles.subheading}>
          <span className={`${styles.subheadingSection} primary`}>
            Phenotype
          </span>
          <a className={styles.subheadingSection} href="#">
            Synonyms: {phenotype?.phenotypeSynonyms.join(', ')}
          </a>
          {phenotype?.topLevelPhenotypes.map(system => (
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
        <strong>{phenotype?.phenotypeName}</strong>
      </h1>
      <div className={styles.summaryContent}>
        <div>
          <h3>Description</h3>
          <p className="grey">{phenotype?.phenotypeDefinition}</p>
        </div>
        <div className={styles.stats}>
          <div>
            <p className="secondary h2 mb-2">{phenotype?.significantGenes}</p>
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
