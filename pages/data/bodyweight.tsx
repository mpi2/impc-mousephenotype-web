import { useState } from "react";
import { useRouter } from "next/router";
import { useBodyWeightQuery } from "@/hooks";
import { Card, Search } from "@/components";
import { Alert, Button, Container, Tab, Tabs } from "react-bootstrap";
import styles from "@/pages/data/styles.module.scss";
import Skeleton from "react-loading-skeleton";
import { formatPValue } from "@/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import { ABR, BodyWeightChart, DataComparison } from "@/components/Data";
import SkeletonTable from "@/components/skeletons/table";

const BodyWeightChartPage = () => {
  const [tab, setTab] = useState('0');
  const [showComparison, setShowComparison] = useState(true);
  const router = useRouter();
  const mgiGeneAccessionId = router.query.mgiGeneAccessionId;

  const { bodyWeightData, isBodyWeightLoading } = useBodyWeightQuery(mgiGeneAccessionId as string, router.isReady);

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
                  { bodyWeightData?.[0]?.["geneSymbol"] || <Skeleton />}
                </a>
              </button>{" "}
              / phenotype data breakdown
            </span>
          </div>
          {(!bodyWeightData && !isBodyWeightLoading) && (
            <Alert variant="primary" className="mb-4 mt-2">
              <Alert.Heading>No data available</Alert.Heading>
              <p>We could not find the data to display this page.</p>
            </Alert>
          )}
          <h1 className="mb-4 mt-2">
            <strong className="text-capitalize">
              {bodyWeightData &&
                bodyWeightData[0]?.["significantPhenotype"] &&
                bodyWeightData[0]?.["significantPhenotype"]["name"]}
            </strong>
          </h1>
          {!!bodyWeightData && (
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
                {bodyWeightData && bodyWeightData.length} parameter /
                zygosity / metadata group combinations tested, with the lowest
                p-value of{" "}
                <strong>
                  {bodyWeightData &&
                    formatPValue(
                      Math.min(...bodyWeightData.map(d => d?.["reportedPValue"]), 0)
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
          {(!isBodyWeightLoading && bodyWeightData.length > 0) ? (
            <DataComparison
              visibility={showComparison}
              data={bodyWeightData}
            />
          ) : <SkeletonTable />}
        </Card>
      </Container>
      <div
        style={{ position: "sticky", top: 0, zIndex: 100 }}
        className="bg-grey pt-2"
      >
        <Container>
          <Tabs defaultActiveKey={0} onSelect={(e) => setTab(e)}>
            {bodyWeightData && bodyWeightData.map((d, i) => (
              <Tab
                eventKey={i}
                title={
                  <>
                    Combination #{i + 1} ({formatPValue(d["reportedPValue"])}{" "}
                    {i === 0 ? " | lowest" : null})
                  </>
                }
                key={i}
              >
                <BodyWeightChart datasetSummary={d} />
              </Tab>
            ))}
          </Tabs>
        </Container>
      </div>
    </>
  );
}

export default BodyWeightChartPage;