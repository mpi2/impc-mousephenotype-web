import { useState } from "react";
import { useRouter } from "next/router";
import { useBodyWeightQuery } from "@/hooks";
import { Card, Search } from "@/components";
import { Alert, Container } from "react-bootstrap";
import styles from "@/pages/data/styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { BodyWeightChart, BodyWeightDataComparison } from "@/components/Data";
import SkeletonTable from "@/components/skeletons/table";
import Link from "next/link";
import { getDatasetByKey } from "@/utils";
import Head from "next/head";
import Skeleton from "react-loading-skeleton";

const BodyWeightChartPage = () => {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState('');
  const mgiGeneAccessionId = router.query.mgiGeneAccessionId;

  const { bodyWeightData, isBodyWeightLoading } = useBodyWeightQuery(mgiGeneAccessionId as string, router.isReady);
  const activeDataset = !!selectedKey ? getDatasetByKey(bodyWeightData, selectedKey) : bodyWeightData[0];

  return (
    <>
      <Head>
        <title>Body weight curve chart for {activeDataset?.geneSymbol} | International Mouse Phenotyping Consortium</title>
      </Head>
      <Search />
      <Container className="page">
        <Card>
          <div className={styles.subheading}>
            <span className={`${styles.subheadingSection} primary`}>
              <Link
                href={`/genes/${mgiGeneAccessionId}`}
                className="mb-3"
                style={{ textTransform: 'none', fontWeight: 'normal', letterSpacing: 'normal', fontSize: '1.15rem' }}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                &nbsp;
                Go Back to {activeDataset?.geneSymbol || <Skeleton style={{ width: '50px' }} inline />}
              </Link>
            </span>
          </div>
          {(!bodyWeightData && !isBodyWeightLoading) && (
            <Alert variant="primary" className="mb-4 mt-2">
              <Alert.Heading>No data available</Alert.Heading>
              <p>We could not find the data to display this page.</p>
            </Alert>
          )}
          <h1 className="mt-2 mb-0">
            <strong className="text-capitalize">
              Body weight curve
            </strong>
          </h1>
          {(!isBodyWeightLoading && bodyWeightData.length > 0) ? (
            <BodyWeightDataComparison
              data={bodyWeightData}
              selectedKey={selectedKey}
              onSelectParam={setSelectedKey}
            />
          ) : <SkeletonTable />}
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
}

export default BodyWeightChartPage;