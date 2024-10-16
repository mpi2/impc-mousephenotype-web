import { useEffect, useMemo, useState } from "react";
import { Alert, Container, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import { formatPValue, getDatasetByKey, getSmallestPValue } from "@/utils";
import {
  ABR,
  ChartNav,
  DataComparison,
  FlowCytometryImages,
  IPGTT,
  PPI,
} from "@/components/Data";
import { Card, Search } from "@/components";
import { useDatasetsQuery, useFlowCytometryQuery } from "@/hooks";
import { Dataset } from "@/models";
import Skeleton from "react-loading-skeleton";
import Head from "next/head";
import { getChartType } from "@/components/Data/Utils";
import { chartLoadingIndicatorChannel } from "@/eventChannels";
import { useDebounce } from "usehooks-ts";

const parametersListPPI = [
  "IMPC_ACS_033_001", // % PP1
  "IMPC_ACS_034_001", // % PP2
  "IMPC_ACS_035_001", // % PP3
  "IMPC_ACS_036_001", // % PP4
];

const Charts = () => {
  const [selectedKey, setSelectedKey] = useState("");
  const [additionalSummaries, setAdditionalSummaries] = useState<
    Array<Dataset>
  >([]);
  const [specialChartLoading, setSpecialChartLoading] = useState(true);
  const debouncedSpChartLoading = useDebounce<boolean>(
    specialChartLoading,
    500
  );
  const router = useRouter();
  const mgiGeneAccessionId = router.query.mgiGeneAccessionId as string;

  const getPageTitle = (summaries: Array<Dataset>, isError: boolean) => {
    if ((!summaries || summaries.length === 0) && !isError) {
      return <Skeleton width={200} />;
    } else if (
      !!summaries.some((d) => d.procedureStableId === "IMPC_IPG_001")
    ) {
      return "Intraperitoneal glucose tolerance test";
    } else if (allSummaries[0]?.significantPhenotype?.name) {
      return allSummaries[0]?.significantPhenotype?.name;
    } else {
      return allSummaries[0]?.procedureName;
    }
  };

  const { datasetSummaries, isFetching, isError } = useDatasetsQuery(
    mgiGeneAccessionId,
    router.query,
    router.isReady
  );

  useEffect(() => {
    const unsubscribeToggleIndicator = chartLoadingIndicatorChannel.on(
      "toggleIndicator",
      (payload: boolean) => setSpecialChartLoading(payload)
    );

    return () => {
      unsubscribeToggleIndicator();
    };
  }, []);

  const hasFlowCytometryImages = !isError
    ? !!datasetSummaries.some(
        (dataset) =>
          dataset.procedureStableId.startsWith("MGP_BMI") ||
          dataset.procedureStableId.startsWith("MGP_MLN") ||
          dataset.procedureStableId.startsWith("MGP_IMM")
      )
    : false;

  const parameterStableId =
    (router.query.parameterStableId as string) || datasetSummaries?.length
      ? datasetSummaries[0]?.parameterStableId
      : null;

  const { data: flowCytometryImages } = useFlowCytometryQuery(
    mgiGeneAccessionId,
    parameterStableId,
    router.isReady && !!parameterStableId && hasFlowCytometryImages
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

  const isTimeSeries = !isError
    ? !!datasetSummaries.some((dataset) => dataset.dataType === "time_series")
    : false;

  const isIPGTTChart = !isError
    ? !!datasetSummaries.some(
        (dataset) => dataset.procedureStableId === "IMPC_IPG_001"
      )
    : false;

  const isPPIChart = !isError
    ? !!datasetSummaries.some((dataset) =>
        parametersListPPI.includes(dataset.parameterStableId)
      )
    : false;

  useEffect(() => {
    if (!isPPIChart && specialChartLoading) {
      setSpecialChartLoading(false);
    }
  }, [isPPIChart]);
  const allSummaries = datasetSummaries?.concat(additionalSummaries) || [];
  const activeDataset = !!selectedKey
    ? getDatasetByKey(allSummaries, selectedKey)
    : allSummaries?.[0];

  const extraChildren =
    hasFlowCytometryImages && flowCytometryImages.length ? (
      <FlowCytometryImages images={flowCytometryImages} />
    ) : null;
  const Chart = getChartType(activeDataset, true, extraChildren);
  const smallestPValue = useMemo(
    () => getSmallestPValue(allSummaries),
    [allSummaries]
  );
  const fetchingInProcess = (isFetching || debouncedSpChartLoading) && !isError;
  return (
    <>
      <Head>
        <title>
          {allSummaries?.[0]?.parameterName} chart for{" "}
          {allSummaries?.[0]?.geneSymbol} | International Mouse Phenotyping
          Consortium
        </title>
      </Head>
      <Search />
      <Container className="page">
        <Card>
          <ChartNav
            mgiGeneAccessionId={mgiGeneAccessionId}
            geneSymbol={allSummaries?.[0]?.geneSymbol}
            isFetching={fetchingInProcess}
          />
          {!datasetSummaries && !isFetching && (
            <Alert variant="primary" className="mb-4 mt-2">
              <Alert.Heading>No data available</Alert.Heading>
              <p style={{ marginBottom: 0 }}>
                We could not find the data to display this page.
              </p>
              <i>
                Please let us know through the&nbsp;
                <a
                  className="link primary"
                  href="https://www.mousephenotype.org/contact-us/"
                >
                  Contact us
                </a>
                &nbsp;page and would be a great help if you could include the
                url page.
              </i>
            </Alert>
          )}
          {!isError && (
            <h1 className="mb-4 mt-2">
              <strong className="text-capitalize">
                {getPageTitle(allSummaries, isError)}
              </strong>
            </h1>
          )}
          {fetchingInProcess && (
            <div className="mb-4">
              <Spinner animation="border" size="sm" />
              &nbsp; Loading data
            </div>
          )}
          {!isTimeSeries && !fetchingInProcess && smallestPValue !== 1 && (
            <div className="mb-4">
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
                  {allSummaries.length} parameter / zygosity / metadata group
                  combinations tested, with the lowest p-value of&nbsp;
                  <strong>
                    {formatPValue(getSmallestPValue(allSummaries))}
                  </strong>
                </span>
              </div>
            </div>
          )}
          {!isError && (
            <DataComparison
              data={allSummaries}
              isViabilityChart={isViabilityChart}
              selectedKey={selectedKey}
              onSelectParam={setSelectedKey}
              displayPValueThreshold={!isTimeSeries}
              displayPValueColumns={!isTimeSeries}
              dataIsLoading={fetchingInProcess}
              {...(isABRChart && { initialSortByProp: "parameterStableId" })}
            />
          )}
          {isPPIChart && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className="btn impc-secondary-button"
                onClick={() => {
                  document.querySelector("#chart").scrollIntoView();
                }}
              >
                View chart
              </button>
            </div>
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
              activeDataset={activeDataset}
            />
          ) : !!isIPGTTChart ? (
            <IPGTT
              datasetSummaries={datasetSummaries}
              onNewSummariesFetched={setAdditionalSummaries}
              activeDataset={activeDataset}
            />
          ) : !!isPPIChart ? (
            <PPI
              datasetSummaries={datasetSummaries}
              onNewSummariesFetched={setAdditionalSummaries}
              activeDataset={activeDataset}
            />
          ) : (
            !!activeDataset && <div>{Chart}</div>
          )}
        </Container>
      </div>
    </>
  );
};

export default Charts;
