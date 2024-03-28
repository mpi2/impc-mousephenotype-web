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
  EmbryoViability, FlowCytometryImages,
  Histopathology,
  TimeSeries,
  Unidimensional,
  Viability,
} from "@/components/Data";
import { Card, Search } from "@/components";
import { useDatasetsQuery, useFlowCytometryQuery } from "@/hooks";
import { Dataset } from "@/models";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import GrossPathology from "@/components/Data/GrossPathology";
import Head from "next/head";

const Charts = () => {
  const [selectedKey, setSelectedKey] = useState("");
  const [additionalSummaries, setAdditionalSummaries] = useState<Array<any>>(
    []
  );
  const router = useRouter();
  const mgiGeneAccessionId = router.query.mgiGeneAccessionId as string;
  const getChartType = (datasetSummary: Dataset) => {
    let chartType = datasetSummary.dataType;
    if (chartType == "line" || chartType == "embryo") {
      chartType =
        datasetSummary.procedureGroup == "IMPC_VIA"
          ? "viability"
          : datasetSummary.procedureGroup == "IMPC_FER"
          ? "fertility"
          : ["IMPC_EVL", "IMPC_EVM", "IMPC_EVP", "IMPC_EVO"].includes(
              datasetSummary.procedureGroup
            )
          ? "embryo_viability"
          : chartType;
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
        return <TimeSeries datasetSummary={datasetSummary} isVisible />;
      case "embryo_viability":
        return <EmbryoViability datasetSummary={datasetSummary} isVisible />;
      case "embryo":
        return <Categorical datasetSummary={datasetSummary} isVisible />;
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

  const hasFlowCytometryImages = !isError
    ? !!datasetSummaries.some(
      (dataset) =>
        dataset.procedureStableId.startsWith('MGP_BMI') ||
        dataset.procedureStableId.startsWith('MGP_MLN') ||
        dataset.procedureStableId.startsWith('MGP_IMM')
    )
    : false;

  const { data: flowCytometryImages } = useFlowCytometryQuery(
    mgiGeneAccessionId,
    router.query.parameterStableId as string,
    router.isReady && router.query.parameterStableId && hasFlowCytometryImages,
  )

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

  const isTimeSeries = !isError
    ? !!datasetSummaries.some((dataset) => dataset.dataType === "time_series")
    : false;

  const allSummaries = datasetSummaries?.concat(additionalSummaries);
  const activeDataset = !!selectedKey
    ? getDatasetByKey(allSummaries, selectedKey)
    : allSummaries[0];


  const Chart = getChartType(activeDataset);
  return (
    <>
      <Head>
        <title>{allSummaries?.[0]?.parameterName} chart for {allSummaries?.[0]?.geneSymbol} | International Mouse Phenotyping Consortium</title>
      </Head>
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
                &nbsp; Go Back to {allSummaries?.[0]?.geneSymbol || <Skeleton style={{ width: '50px' }} inline />}
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
          {!!datasetSummaries && !isTimeSeries && (
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
              displayPValueThreshold={!isTimeSeries}
              displayPValueColumns={!isTimeSeries}
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
            !!activeDataset && <div>{Chart}</div>
          )}
          {hasFlowCytometryImages && (
            <FlowCytometryImages images={flowCytometryImages} />
          )}
        </Container>
      </div>
    </>
  );
};

export default Charts;
