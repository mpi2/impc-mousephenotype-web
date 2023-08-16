import styles from "./styles.module.scss";
import Card from "../../Card";
import {BodySystem} from "../../BodySystemIcon";


const Summary = ({ phenotype }) => {
  return (
    <Card>
      <div className={styles.subheadingCont}>
        <div className={styles.subheading}>
          <span className={`${styles.subheadingSection} primary`}>
            Phenotype
          </span>
          <a className={styles.subheadingSection} href="#">
            Synonyms: {phenotype.synonyms}
          </a>
          <BodySystem
            name={phenotype.system}
            prependLabel="System"
            color="grey"
            hoverColor="grey"
            noSpacing
          />
        </div>
      </div>
      <h1>
        <strong>{phenotype.name}</strong>
      </h1>
      <div className={styles.summaryContent}>
        <div>
          <h3>Description</h3>
          <p className="grey">{phenotype.description}</p>
        </div>
        <div className={styles.stats}>
          <div>
            <p className="secondary h2 mb-2">{phenotype.noSignificantGenes}</p>
            <span className="grey">significant genes</span>
          </div>
          <div>
            <p className="secondary h2 mb-2">{phenotype.percentageTestedGenes}</p>
            <span className="grey">of tested genes</span>
          </div>
          <div>
            <p className="h2 mb-2">{phenotype.noTestedGenes}</p>
            <span className="grey">tested genes</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Summary;
