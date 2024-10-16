import { useState } from "react";
import { useRouter } from "next/router";
import { useViabilityQuery } from "@/hooks";
import { Card, Search } from "@/components";
import { Alert, Container, Spinner } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import {
  ChartNav,
  Viability,
  ViabilityDataComparison,
} from "@/components/Data";
import { getDatasetByKey } from "@/utils";
import Head from "next/head";

const ViabilityChartPage = () => {
  const [selectedKey, setSelectedKey] = useState("");
  const router = useRouter();
  const mgiGeneAccessionId = router.query.mgiGeneAccessionId as string;

  const { viabilityData, isViabilityLoading } = useViabilityQuery(
    mgiGeneAccessionId as string,
    router.isReady
  );
  const activeDataset = !!selectedKey
    ? getDatasetByKey(viabilityData, selectedKey)
    : viabilityData?.[0];

  return (
    <>
      <Head>
        <title>
          Viability chart for {activeDataset?.geneSymbol} | International Mouse
          Phenotyping Consortium
        </title>
      </Head>
      <Search />
      <Container className="page">
        <Card>
          <ChartNav
            mgiGeneAccessionId={mgiGeneAccessionId}
            geneSymbol={activeDataset?.geneSymbol}
            isFetching={isViabilityLoading}
          />
          {!viabilityData && !isViabilityLoading && (
            <Alert variant="primary" className="mb-4 mt-2">
              <Alert.Heading>No data available</Alert.Heading>
              <p>We could not find the data to display this page.</p>
            </Alert>
          )}
          <h1 className="mb-4 mt-2">
            <strong className="text-capitalize">
              Viability data for&nbsp;
              <i>
                {viabilityData?.[0]?.["geneSymbol"] || (
                  <Skeleton width="50px" inline />
                )}
              </i>
              &nbsp;gene
            </strong>
          </h1>
          {!isViabilityLoading ? (
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
                  {viabilityData && viabilityData.length} parameter / zygosity /
                  metadata group combinations tested.
                </span>
              </div>
            </div>
          ) : (
            <span>
              <Spinner animation="border" size="sm" />
              &nbsp; Loading data
            </span>
          )}
          <ViabilityDataComparison
            data={viabilityData}
            selectedKey={selectedKey}
            onSelectParam={setSelectedKey}
          />
        </Card>
      </Container>
      <div
        style={{ position: "sticky", top: 0, zIndex: 100 }}
        className="bg-grey pt-2"
      >
        <Container>
          {!!activeDataset && (
            <Viability datasetSummary={activeDataset} isVisible />
          )}
        </Container>
      </div>
    </>
  );
};

export default ViabilityChartPage;
