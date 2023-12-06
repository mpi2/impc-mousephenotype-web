import { useState } from "react";
import { Alert, Button, Container, Tab, Tabs } from "react-bootstrap";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import { formatPValue } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import Skeleton from "react-loading-skeleton";
import SkeletonTable from "@/components/skeletons/table";
import { useBodyWeightQuery, useViabilityQuery } from "@/hooks";
import {
  ABR,
  BodyWeightChart,
  Categorical, DataComparison,
  EmbryoViability,
  Histopathology,
  TimeSeries,
  Unidimensional,
  Viability
} from "@/components/Data";
import { Card, Search } from "@/components";


const Charts = () => {
  const [tab, setTab] = useState('0');
  const [showComparison, setShowComparison] = useState(true);
  const [additionalSummaries, setAdditionalSummaries] = useState<Array<any>>([]);
  const router = useRouter();
  const mgiGeneAccessionId = router.query.mgiGeneAccessionId;
  console.log('ID: ', mgiGeneAccessionId);
  const getChartType = (datasetSummary: any) => {
    let chartType = datasetSummary["dataType"];
    if (chartType == "line") {
      chartType =
        datasetSummary["procedureGroup"] == "IMPC_VIA"
          ? "viability"
          : datasetSummary["procedureGroup"] == "IMPC_FER"
          ? "fertility"
          : [
              "IMPC_EVL_001_001",
              "IMPC_EVM_001_001",
              "IMPC_EVP_001_001",
              "IMPC_EVO_001_001",
            ].includes(datasetSummary["procedureGroup"])
          ? "embryo_viability"
          : "line";
    }
    if (chartType === "time_series" && datasetSummary.procedureGroup === "IMPC_BWT") {
      chartType = "bodyweight";
    }
    switch (chartType) {
      case "unidimensional":
        return <Unidimensional datasetSummary={datasetSummary} />;
      case "categorical":
        return <Categorical datasetSummary={datasetSummary} />;
      case "viability":
        return <Viability datasetSummary={datasetSummary} />;
      case "time_series":
        return <TimeSeries datasetSummary={datasetSummary} />;
      case "embryo":
        return <EmbryoViability datasetSummary={datasetSummary} />;
      case "histopathology":
        return <Histopathology datasetSummary={datasetSummary} />;
      case "bodyweight":
        return <BodyWeightChart datasetSummary={datasetSummary} />
      default:
        return null;
    }
  };

  const apiUrl = router.query.mpTermId
    ? `/api/v1/genes/${mgiGeneAccessionId}/${router.query.mpTermId}/dataset/`
    : `/api/v1/genes/dataset/find_by_multiple_parameter?mgiGeneAccessionId=${mgiGeneAccessionId}&alleleAccessionId=${router.query.alleleAccessionId}&zygosity=${router.query.zygosity}&parameterStableId=${router.query.parameterStableId}&pipelineStableId=${router.query.pipelineStableId}&procedureStableId=${router.query.procedureStableId}&phenotypingCentre=${router.query.phenotypingCentre}`;

  const isBodyWeightChart = router.query.chartType === 'bodyweight';
  const isAllViabilityChart = router.query.chartType === 'viability';
  const selectedParameterKey = !router.query.mpTermId ? `${mgiGeneAccessionId}-${router.query.parameterStableId}-${router.query.zygosity}` : null;

  let { data: datasetSummaries, isLoading, isError } = useQuery({
    queryKey: [
      "genes",
      router.query.mgiGeneAccessionId,
      router.query.mpTermId,
      apiUrl,
      "dataset",
    ],
    queryFn: () => fetchAPI(apiUrl),
    enabled: router.isReady && !isBodyWeightChart,
    select: data => {
      data.sort((a, b) => {
        return a["reportedPValue"] - b["reportedPValue"];
      });
      return data?.filter(
        (value, index, self) =>
          self.findIndex((v) => v.datasetId === value.datasetId) === index
      );
    },
    placeholderData: []
  });

  const { bodyWeightData, isBodyWeightLoading } = useBodyWeightQuery(mgiGeneAccessionId as string, router.isReady && isBodyWeightChart);
  const { viabilityData, isViabilityLoading} = useViabilityQuery(mgiGeneAccessionId as string, router.isReady && isAllViabilityChart);
  const isFetchingData = isLoading || isBodyWeightLoading || isViabilityLoading;

  const isABRChart = !!datasetSummaries.some(dataset => dataset["dataType"] === "unidimensional" && dataset["procedureGroup"] === "IMPC_ABR");
  const isViabilityChart = !!datasetSummaries.some(dataset => dataset["procedureGroup"] === "IMPC_VIA");

  let allSummaries = datasetSummaries.concat(additionalSummaries)

  if (isBodyWeightChart) {
    allSummaries = bodyWeightData;
  } else if (isAllViabilityChart) {
    allSummaries = viabilityData;
  } else {
    allSummaries = allSummaries.map(dataset => {
      const bodyWeightDataForDataset = bodyWeightData.find(d => d.datasetId === dataset.datasetId);
      if (bodyWeightDataForDataset) {
        return {...dataset, chartData: bodyWeightDataForDataset.chartData};
      }
      return dataset;
    })
  }

  return (
    <>
      <Search />
      <Container className="page">
        <Card>
          <div className={styles.subheading}>
            <span className={`${styles.subheadingSection} primary`}>
              <button
                style={{
                  border: 0,
                  background: "none",
                  padding: 0,
                }}
                onClick={() => {
                  router.back();
                }}
              >
                <a href="#" className="grey mb-3">
                  { allSummaries?.[0]?.["geneSymbol"] || <Skeleton />}
                </a>
              </button>{" "}
              / phenotype data breakdown
            </span>
          </div>
          {(!datasetSummaries && !isLoading) && (
            <Alert variant="primary" className="mb-4 mt-2">
              <Alert.Heading>No data available</Alert.Heading>
              <p>We could not find the data to display this page.</p>
            </Alert>
          )}
          <h1 className="mb-4 mt-2">
            <strong className="text-capitalize">
              {allSummaries &&
                allSummaries[0]?.["significantPhenotype"] &&
                allSummaries[0]?.["significantPhenotype"]["name"]}
            </strong>
          </h1>
          {!!datasetSummaries && (
            <Alert variant="green" className="mb-0">
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
                {allSummaries && allSummaries.length} parameter /
                zygosity / metadata group combinations tested, with the lowest
                p-value of{" "}
                <strong>
                  {allSummaries &&
                    formatPValue(
                      Math.min(...allSummaries.map(d => d?.["reportedPValue"]), 0)
                    )}
                </strong>
                .
              </span>
                <Button
                  variant="secondary"
                  className="white-x"
                  onClick={() => {
                    setShowComparison(!showComparison);
                  }}
                >
                  <FontAwesomeIcon icon={faTable} />{" "}
                  {showComparison ? "Hide comparison" : "Compare combinations"}
                </Button>
              </div>
            </Alert>
          )}
          {(!isFetchingData && allSummaries.length > 0) ? (
            <DataComparison
              visibility={showComparison}
              data={allSummaries}
              selectedParameter={selectedParameterKey}
              isViabilityChart={isViabilityChart}
              {...(isABRChart && { initialSortByProp: 'parameterStableId' })}
            />
          ) : <SkeletonTable />}
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
            <Tabs defaultActiveKey={0} onSelect={(e) => setTab(e)}>
              {allSummaries && allSummaries.map((d, i) => (
                <Tab
                  eventKey={i}
                  title={
                    <>
                      Combination {i + 1} ({formatPValue(d["reportedPValue"])}{" "}
                      {i === 0 ? " | lowest" : null})
                    </>
                  }
                  key={i}
                >
                  <div>{getChartType(d)}</div>
                </Tab>
              ))}
            </Tabs>
          )}
        </Container>
      </div>
    </>
  );
};

export default Charts;
