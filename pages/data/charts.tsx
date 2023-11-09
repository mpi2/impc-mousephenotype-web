import { useState } from "react";
import { Alert, Button, Container, Tab, Tabs } from "react-bootstrap";
import Card from "@/components/Card";
import Search from "@/components/Search";
import Unidimensional from "@/components/Data/Unidimensional";
import Viability from "@/components/Data/Viability";
import Categorical from "@/components/Data/Categorical";
import TimeSeries from "@/components/Data/TimeSeries";
import Histopathology from "@/components/Data/Histopathology";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import DataComparison from "@/components/Data/DataComparison";
import { formatPValue } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import EmbryoViability from "@/components/Data/EmbryoViability";
import Skeleton from "react-loading-skeleton";
import ABR from "@/components/Data/ABR";

const Charts = () => {
  const [tab, setTab] = useState('0');
  const [showComparison, setShowComparison] = useState(true);
  const [additionalSummaries, setAdditionalSummaries] = useState<Array<any>>([]);
  const router = useRouter();
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

      default:
        return null;
    }
  };

  const apiUrl = router.query.mpTermId
    ? `/api/v1/genes/${router.query.mgiGeneAccessionId}/${router.query.mpTermId}/dataset/`
    : `/api/v1/genes/dataset/find_by_multiple_parameter?mgiGeneAccessionId=${router.query.mgiGeneAccessionId}&alleleAccessionId=${router.query.alleleAccessionId}&zygosity=${router.query.zygosity}&parameterStableId=${router.query.parameterStableId}&pipelineStableId=${router.query.pipelineStableId}&procedureStableId=${router.query.procedureStableId}&phenotypingCentre=${router.query.phenotypingCentre}`;

  const selectedParameterKey = !router.query.mpTermId ? `${router.query.alleleAccessionId}-${router.query.parameterStableId}-${router.query.zygosity}` : null;

  let { data: datasetSummaries, isLoading, isError } = useQuery({
    queryKey: [
      "genes",
      router.query.mgiGeneAccessionId,
      router.query.mpTermId,
      apiUrl,
      "dataset",
    ],
    queryFn: () => fetchAPI(apiUrl),
    enabled: router.isReady,
    select: data => {
      data.sort((a, b) => {
        return a["reportedPValue"] - b["reportedPValue"];
      });
      return data?.filter(
        (value, index, self) =>
          self.findIndex((v) => v.datasetId === value.datasetId) === index
      );
    }
  });

  const isABRChart = !!datasetSummaries?.some(dataset => dataset["dataType"] === "unidimensional" && dataset["procedureGroup"] === "IMPC_ABR");
  const isViabilityChart = !!datasetSummaries?.some(dataset => dataset["procedureGroup"] === "IMPC_VIA");

  const allSummaries = datasetSummaries?.concat(additionalSummaries);

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
                  { datasetSummaries?.[0]["geneSymbol"] || <Skeleton />}
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
              {datasetSummaries &&
                datasetSummaries[0]["significantPhenotype"] &&
                datasetSummaries[0]["significantPhenotype"]["name"]}
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
                      Math.min(
                        ...allSummaries.map((d) => d["reportedPValue"])
                      )
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
          {!isLoading && showComparison && (
            <DataComparison
              data={allSummaries}
              selectedParameter={selectedParameterKey}
              isViabilityChart={isViabilityChart}
              {...(isABRChart && { initialSortByProp: 'parameterStableId' })}
            />
          )}
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
              {datasetSummaries &&
                datasetSummaries.map((d, i) => (
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
      <Container>
        {/* <Card>
          <p>Current mode: {mode}</p>
          <div style={{ display: "flex" }}>
            <button
              onClick={() => {
                setMode("Unidimensional");
              }}
            >
              Unidimensional
            </button>
            <button
              onClick={() => {
                setMode("Categorical");
              }}
            >
              Categorical
            </button>
            <button
              onClick={() => {
                setMode("Viability");
              }}
            >
              Viability
            </button>
            <button
              onClick={() => {
                setMode("Time series");
              }}
            >
              Time series
            </button>
            <button
              onClick={() => {
                setMode("Embryo");
              }}
            >
              Embryo
            </button>
            <button
              onClick={() => {
                setMode("Histopathology");
              }}
            >
              Histopathology
            </button>
          </div>
        </Card> */}
      </Container>
    </>
  );
};

export default Charts;
