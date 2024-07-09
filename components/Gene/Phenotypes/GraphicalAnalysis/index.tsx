import { useState, useMemo, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import styles from "./styles.module.scss";
import { Form } from "react-bootstrap";
import { GeneStatisticalResult } from "@/models/gene";
import { useGeneAllStatisticalResData } from "@/hooks";
import { AllelesStudiedContext } from "@/contexts";
import { Cat, CatType, cats, options, colorArray, systemColorMap } from './shared';
import GraphicalAnalysisChart from "./GraphicalAnalysisChart";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import classNames from "classnames";
import BodySystemIcon from "@/components/BodySystemIcon";
import { formatBodySystems } from "@/utils";
import { sortBy, uniq } from "lodash";

type Props = {
  mgiGeneAccessionId: string;
  routerIsReady: boolean;
};

const transformPValue = (value: number, significant: boolean) => {
  if (value === 0 && significant) {
    // put a high value to show they are really significant
    return 15;
  } else if (value === 0) {
    return 0;
  }
  return -Math.log10(value)
};
const getSignificants = (data: Array<GeneStatisticalResult>) => {
  return data.filter(item => {
    const pValueThreshold = item.projectName === 'PWG' ? 3 : 4;
    return -Math.log10(Number(item.pValue)) >= pValueThreshold;
  });
};
const processData = (data: any, { type }: Cat, significantOnly: boolean) => {
  const { BODY_SYSTEMS, PROCEDURES } = cats;
  const significants = getSignificants(data);
  switch (type) {
    case BODY_SYSTEMS:
      if (significantOnly) {
        const bodySystems = significants.map((x) => x.topLevelPhenotypes[0]);
        const flattend = [].concat.apply([], bodySystems);
        const filtered = data.filter((x) => {
          return x.topLevelPhenotypes.some((y) => flattend.includes(y));
        });
        return sortBy(filtered, ["topLevelPhenotypes", "parameterName"]).map((d, index) => ({...d, arrPos: index}));
      }
      return sortBy(data, ["topLevelPhenotypes", "parameterName"]).map((d, index) => ({...d, arrPos: index}));
    case PROCEDURES:
      if (significantOnly) {
        const procedures = significants.map((x) => x.procedureName);
        const filtered = data.filter((x) => {
          return procedures.includes(x.procedureName);
        });
        return sortBy(filtered, ["procedureName", "parameterName"]).map((d, index) => ({...d, arrPos: index}));
      }
      return sortBy(data, ["procedureName", "parameterName"]).map((d, index) => ({...d, arrPos: index}));
    default:
      return sortBy(significantOnly ? significants : data, "pValue", "desc").map((d, index) => ({...d, arrPos: index}));
  }
};

const GraphicalAnalysis = (props: Props) => {
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

  const dataWithPValue = useMemo(() =>
    filteredData.filter(
      (x) =>
        x.topLevelPhenotypes?.length
    )
      .map((x, index) => ({
        ...x,
        pValue: Number(x.pValue) || 0,
        topLevelPhenotypes: x.topLevelPhenotypes.map((y) => y.name),
      })), [filteredData]);

  const processed = useMemo(
    () => processData(dataWithPValue, cat, significantOnly).map((x) => ({ ...x, chartValue: transformPValue(x.pValue, x.significant) })),
    [dataWithPValue, cat, significantOnly]
  );

  const isByProcedure = cat.type === cats.PROCEDURES;
  const yAxisLabels = useMemo(() =>
      isByProcedure
        ? uniq(processed.map((x) => x.procedureName))
        : uniq(processed.map((x) => x.topLevelPhenotypes[0]))
    ,[processed, isByProcedure]);

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
              <option key={category} value={category}>{label}</option>
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
        <div>
          <div className={classNames(styles.labels, styles.icons)}>
            {yAxisLabels
              .filter(Boolean)
              .map((item, index) => {
                const color = isByProcedure ? colorArray[index] : systemColorMap[item];
                return (
                  <span className="grey" key={item}>
                    <span className={styles.icon} style={{backgroundColor: color}}>
                      {isByProcedure ? null : (
                        <BodySystemIcon name={item} color="white" size="1x"/>
                      )}
                    </span>&nbsp;
                    <small>{formatBodySystems(item)}</small>
                  </span>
                );
              })}
            <span className="grey" style={{display: 'inline-block', whiteSpace: 'nowrap'}}>
          <hr className={styles.dashedLine}/>
          <small>Significant P-value threshold (P &lt; 0.0001)</small>
        </span>
          </div>
          <div className={classNames(styles.labels, "grey")}>
            <div className={styles.figureContainer}>
              <div className={styles.circle}/>
              Statistical annotations
            </div>
            <div className={styles.figureContainer}>
              <div className={styles.triangle}/>
              Manual annotations:
              <i>Are assigned a value of 1x10<sup>-15</sup> in order to be displayed in the chart</i>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <ParentSize>
              {({width, height}) => (
                <GraphicalAnalysisChart
                  width={width}
                  height={height}
                  data={processed}
                  isByProcedure={isByProcedure}
                  yAxisLabels={yAxisLabels}
                ></GraphicalAnalysisChart>
              )}
            </ParentSize>
          </div>
          <div className={styles.bottomLabels}>
            <span className="labels">
              {hasDataRelatedToPWG && (
                <span style={{marginLeft: '1rem'}}>
                  <hr className={styles.dashedLine} style={{borderTop: "3px dashed rgb(255, 99, 132)"}}/>
                  Significant threshold for pain sensitivity (P &lt; 0.001)
                </span>
              )}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default GraphicalAnalysis;
