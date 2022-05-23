import styles from "./styles.module.scss";
import _ from "lodash";
import Card from "../../Card";

const Summary = () => {
  return (
    <Card>
      <div className={styles.subheadingCont}>
        <div className={styles.subheading}>
          <span className={`${styles.subheadingSection} primary`}>
            Phenotype
          </span>
          <a className={styles.subheadingSection} href="#">
            Synonyms: movement abnormalities, abnormal movement
          </a>
        </div>
      </div>
      <h1>
        <strong>Abnormal stationary movement</strong>
      </h1>
      <div className={styles.summaryContent}>
        <div>
          <h3>Description</h3>
          <p className="grey">
            Altered ability or inability to change body posture or shift a body
            part.
          </p>
        </div>
        <div className={styles.stats}>
          <div>
            <p className="secondary h2 mb-2">54</p>
            <span className="grey">significant genes</span>
          </div>
          <div>
            <p className="secondary h2 mb-2">0.78%</p>
            <span className="grey">of tested genes</span>
          </div>
          <div>
            <p className="h2 mb-2">6907</p>
            <span className="grey">tested genes</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Summary;
