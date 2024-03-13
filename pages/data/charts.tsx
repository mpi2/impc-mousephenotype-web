import { useState } from "react";
import { Alert, Container } from "react-bootstrap";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";
import { formatPValue, getDatasetByKey, getSmallestPValue } from "@/utils";
import SkeletonTable from "@/components/skeletons/table";
import {
  ABR,
  BodyWeightChart,
  Categorical,
  DataComparison,
  EmbryoViability,
  Histopathology,
  TimeSeries,
  Unidimensional,
  Viability,
} from "@/components/Data";
import { Card, Search } from "@/components";
import { useDatasetsQuery } from "@/hooks";
import { Dataset } from "@/models";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import GrossPathology from "@/components/Data/GrossPathology";

const Charts = () => {
  const [selectedKey, setSelectedKey] = useState("");
  const [additionalSummaries, setAdditionalSummaries] = useState<Array<any>>(
    []
  );
  const router = useRouter();
  const mgiGeneAccessionId = router.query.mgiGeneAccessionId as string;
  const getChartType = (datasetSummary: Dataset) => {
    let chartType = datasetSummary.dataType;
    if (chartType == "line") {
      chartType =
        datasetSummary.procedureGroup == "IMPC_VIA"
          ? "viability"
          : datasetSummary.procedureGroup == "IMPC_FER"
          ? "fertility"
          : [
              "IMPC_EVL_001_001",
              "IMPC_EVM_001_001",
              "IMPC_EVP_001_001",
              "IMPC_EVO_001_001",
            ].includes(datasetSummary.procedureGroup)
          ? "embryo_viability"
          : "line";
    }
    if (
      chartType === "time_series" &&
      datasetSummary.procedureGroup === "IMPC_BWT"
    ) {
      chartType = "bodyweight";
    }
    switch (chartType) {
      case "unidimensional":
        return <Unidimensional datasetSummary={datasetSummary} isVisible />;
      case "categorical":
        return <Categorical datasetSummary={datasetSummary} isVisible />;
      case "viability":
        return <Viability datasetSummary={datasetSummary} isVisible />;
      case "time_series":
        return <TimeSeries datasetSummary={datasetSummary} />;
      case "embryo":
        return <EmbryoViability datasetSummary={datasetSummary} isVisible />;
      case "histopathology":
        return <Histopathology datasetSummary={datasetSummary} />;
      case "bodyweight":
        return <BodyWeightChart datasetSummary={datasetSummary} />;
      case "adult-gross-path":
        return <GrossPathology datasetSummary={datasetSummary} />;
      default:
        return null;
    }
  };

  const getPageTitle = (summaries: Array<Dataset>) => {
    if (!summaries || summaries.length === 0) {
      return <Skeleton />;
    } else if (allSummaries[0]?.significantPhenotype?.name) {
      return allSummaries[0]?.significantPhenotype?.name;
    } else {
      return allSummaries[0]?.procedureName;
    }
  };

  const { datasetSummaries, isLoading, isError } = useDatasetsQuery(
    mgiGeneAccessionId,
    router.query,
    router.isReady
  );

  const isABRChart = !isError
    ? !!datasetSummaries.some(
        (dataset) =>
          dataset.dataType === "unidimensional" &&
          dataset.procedureGroup === "IMPC_ABR"
      )
    : false;
  const isViabilityChart = !isError
    ? !!datasetSummaries.some(
        (dataset) => dataset.procedureGroup === "IMPC_VIA"
      )
    : false;

  const allSummaries = datasetSummaries?.concat(additionalSummaries);
  const activeDataset = !!selectedKey
    ? getDatasetByKey(allSummaries, selectedKey)
    : allSummaries[0];

  return (
    <>
      <Search />
      <Container className="page">
        <Card>
          <div className={styles.subheading}>
            <span className={`${styles.subheadingSection} primary`}>
              <Link
                href={`/genes/${mgiGeneAccessionId}`}
                className="mb-3"
                style={{
                  textTransform: "none",
                  fontWeight: "normal",
                  letterSpacing: "normal",
                  fontSize: "1.15rem",
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                &nbsp; Go Back
              </Link>
            </span>
          </div>
          {!datasetSummaries && !isLoading && (
            <Alert variant="primary" className="mb-4 mt-2">
              <Alert.Heading>No data available</Alert.Heading>
              <p>We could not find the data to display this page.</p>
            </Alert>
          )}
          <h1 className="mb-4 mt-2">
            <strong className="text-capitalize">
              {getPageTitle(allSummaries)}
            </strong>
          </h1>
          {!!datasetSummaries && (
            <div className="mb-0">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <span>
                  {allSummaries && allSummaries.length} parameter / zygosity /
                  metadata group combinations tested, with the lowest p-value
                  of&nbsp;
                  <strong>
                    {allSummaries &&
                      formatPValue(getSmallestPValue(allSummaries))}
                  </strong>
                </span>
              </div>
            </div>
          )}
          {!isLoading && !isError && allSummaries.length > 0 ? (
            <DataComparison
              data={allSummaries}
              isViabilityChart={isViabilityChart}
              selectedKey={selectedKey}
              onSelectParam={setSelectedKey}
              {...(isABRChart && { initialSortByProp: "parameterStableId" })}
            />
          ) : !isError ? (
            <SkeletonTable />
          ) : null}
        </Card>
      </Container>
      <div
        style={{ position: "sticky", top: 0, zIndex: 100 }}
        className="bg-grey pt-2"
      >
        <Container>
          {!!isABRChart ? (
            <ABR
              datasetSummaries={datasetSummaries}
              onNewSummariesFetched={setAdditionalSummaries}
            />
          ) : (
            !!activeDataset && <div>{getChartType(activeDataset)}</div>
          )}
        </Container>
      </div>
    </>
  );
};

export default Charts;
