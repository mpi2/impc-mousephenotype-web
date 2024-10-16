import { useState } from "react";
import { useRouter } from "next/router";
import { useBodyWeightQuery } from "@/hooks";
import { Card, Search } from "@/components";
import { Alert, Container, Spinner } from "react-bootstrap";
import {
  BodyWeightChart,
  BodyWeightDataComparison,
  ChartNav,
} from "@/components/Data";
import { getDatasetByKey } from "@/utils";
import Head from "next/head";

const BodyWeightChartPage = () => {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState("");
  const mgiGeneAccessionId = router.query.mgiGeneAccessionId as string;

  const { bodyWeightData, isBodyWeightLoading, isFetching, isError } =
    useBodyWeightQuery(mgiGeneAccessionId as string, router.isReady);

  const activeDataset = !!selectedKey
    ? getDatasetByKey(bodyWeightData, selectedKey)
    : bodyWeightData?.[0];

  return (
    <>
      <Head>
        <title>
          Body weight curve chart for {activeDataset?.geneSymbol} |
          International Mouse Phenotyping Consortium
        </title>
      </Head>
      <Search />
      <Container className="page">
        <Card>
          <ChartNav
            mgiGeneAccessionId={mgiGeneAccessionId}
            geneSymbol={activeDataset?.geneSymbol}
            isFetching={isBodyWeightLoading}
          />
          <h1 className="mt-2 mb-4">
            <strong className="text-capitalize">Body weight curve</strong>
          </h1>
          {!bodyWeightData && !isBodyWeightLoading && (
            <Alert variant="primary" className="mb-4 mt-2">
              <Alert.Heading>No data available</Alert.Heading>
              <p>We could not find the data to display in this page.</p>
            </Alert>
          )}
          {isFetching && (
            <span>
              <Spinner animation="border" size="sm" />
              &nbsp; Loading data
            </span>
          )}
          {isError === false && (
            <BodyWeightDataComparison
              data={bodyWeightData}
              selectedKey={selectedKey}
              onSelectParam={setSelectedKey}
            />
          )}
        </Card>
      </Container>
      <div
        style={{ position: "sticky", top: 0, zIndex: 100 }}
        className="bg-grey pt-2"
      >
        <Container>
          <div>
            {!!activeDataset && (
              <BodyWeightChart datasetSummary={activeDataset} />
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

export default BodyWeightChartPage;
