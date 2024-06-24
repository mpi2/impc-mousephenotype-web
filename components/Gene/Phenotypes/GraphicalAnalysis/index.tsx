import { useState, useMemo, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import styles from "./styles.module.scss";
import { Form } from "react-bootstrap";
import { GeneStatisticalResult } from "@/models/gene";
import { useGeneAllStatisticalResData } from "@/hooks";
import { AllelesStudiedContext } from "@/contexts";
import { Cat, CatType, cats, options } from './shared';
import GraphicalAnalysisChart from "./GraphicalAnalysisChart";
import LoadingProgressBar from "@/components/LoadingProgressBar";

type Props = {
  mgiGeneAccessionId: string;
  routerIsReady: boolean;
}

const StatisticalAnalysis = (props: Props) => {
  const {
    mgiGeneAccessionId,
    routerIsReady,
  } = props;
  const { setAllelesStudiedLoading } = useContext(AllelesStudiedContext);
  const [cat, setCat] = useState<Cat | null>({
    type: cats.BODY_SYSTEMS,
  });
  const [significantOnly, setSignificantOnly] = useState<boolean>(false);

  const { geneData, isGeneFetching, isGeneError } = useGeneAllStatisticalResData(
    mgiGeneAccessionId,
    routerIsReady,
  );

  useEffect(() => setAllelesStudiedLoading(isGeneFetching), [isGeneFetching]);

  const filteredData = useMemo(
    () => {
      const allData = {};
      geneData.forEach(result => {
        const { mgiGeneAccessionId, parameterStableId, alleleAccessionId, metadataGroup, pValue} = result;
        const hash = `${mgiGeneAccessionId}-${parameterStableId}-${alleleAccessionId}-${metadataGroup}-${pValue}`;
        if (result[hash] === undefined) {
          allData[hash] = result;
        }
      });
      return Object.values(allData) as Array<GeneStatisticalResult>;
    },
    [geneData]
  );

  const handleToggle = () => {
    setSignificantOnly(!significantOnly);
  };

  const significantSuffix = (() => {
    if (cat.type === cats.BODY_SYSTEMS) {
      return "physiological systems";
    } else if (cat.type === cats.PROCEDURES) {
      return "procedures";
    }
    return "";
  })();

  const hasDataRelatedToPWG = geneData.some(item => item.projectName === 'PWG');

  return (
    <>
      <div
        style={{
          paddingLeft: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <p>
          <label
            htmlFor="groupBy"
            className="grey"
            style={{ marginRight: "0.5rem" }}
          >
            Include in groups:
          </label>
          <Form.Select
            style={{ display: "inline-block", width: 280, marginRight: "2rem" }}
            aria-label="Group by"
            // value={cat.type}
            defaultValue={cat.type}
            id="groupBy"
            className="bg-white"
            onChange={(el) => {
              setCat({ type: el.target.value as CatType });
            }}
          >
            {options.map(({ label, category }) => (
              <option value={category}>{label}</option>
            ))}
          </Form.Select>
          <button onClick={handleToggle} className={styles.inlineButton}>
            <FontAwesomeIcon
              icon={significantOnly ? faCheckSquare : faSquare}
              className={significantOnly ? "primary" : "grey"}
            />{" "}
            Only show significant {significantSuffix}
          </button>
        </p>
      </div>
      {isGeneFetching ? (
        <div className="mt-4" style={{display: 'flex', justifyContent: 'center'}}>
          <LoadingProgressBar/>
        </div>
      ) : (
        <GraphicalAnalysisChart
          data={filteredData}
          cat={cat}
          sig={significantOnly}
          hasDataRelatedToPWG={hasDataRelatedToPWG}
        />
      )}
    </>
  );
};

export default StatisticalAnalysis;
