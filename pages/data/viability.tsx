import { useState } from "react";
import { useRouter } from "next/router";
import { useViabilityQuery } from "@/hooks";
import { Card, Search } from "@/components";
import { Alert, Container } from "react-bootstrap";
import styles from "@/pages/data/styles.module.scss";
import Skeleton from "react-loading-skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Viability, ViabilityDataComparison } from "@/components/Data";
import SkeletonTable from "@/components/skeletons/table";
import Link from "next/link";
import { getDatasetByKey } from "@/utils";
import Head from "next/head";

const ViabilityChartPage = () => {
  const [selectedKey, setSelectedKey] = useState('');
  const router = useRouter();
  const mgiGeneAccessionId = router.query.mgiGeneAccessionId;

  const { viabilityData, isViabilityLoading} = useViabilityQuery(mgiGeneAccessionId as string, router.isReady);
  const activeDataset = !!selectedKey ? getDatasetByKey(viabilityData, selectedKey) : viabilityData?.[0];

  return (
    <>
      <Head>
        <title>Viability chart for {activeDataset?.geneSymbol} | International Mouse Phenotyping Consortium</title>
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
          {(!viabilityData && !isViabilityLoading) && (
            <Alert variant="primary" className="mb-4 mt-2">
              <Alert.Heading>No data available</Alert.Heading>
              <p>We could not find the data to display this page.</p>
            </Alert>
          )}
          <h1 className="mb-4 mt-2">
            <strong className="text-capitalize">
              Viability data for <i>{viabilityData?.[0]?.["geneSymbol"] || <Skeleton width="50px" inline />}</i> gene
            </strong>
          </h1>
          {!!viabilityData && (
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
                  {viabilityData && viabilityData.length} parameter /
                  zygosity / metadata group combinations tested.
                </span>
              </div>
            </div>
          )}
          {(!isViabilityLoading && viabilityData.length > 0) ? (
            <ViabilityDataComparison
              data={viabilityData}
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
          {!!activeDataset && (
            <Viability datasetSummary={activeDataset} isVisible />
          )}
        </Container>
      </div>
    </>
  );
};

export default ViabilityChartPage;