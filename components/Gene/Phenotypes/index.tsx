import { Alert, Spinner, Tab, Tabs } from "react-bootstrap";
import Card from "../../Card";
import AllData from "./AllData";
import SignificantPhenotypes from "./SignificantPhenotypes";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { GenePhenotypeHits, GeneSummary } from "@/models/gene";
import { sectionWithErrorBoundary } from "@/hoc/sectionWithErrorBoundary";
import { useSignificantPhenotypesQuery } from "@/hooks";
import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import {
  orderPhenotypedSelectionChannel,
  summarySystemSelectionChannel,
} from "@/eventChannels";
import { uniq } from "lodash";
import { Variant } from "react-bootstrap/types";
import { SectionHeader } from "@/components";
import { ErrorBoundary } from "react-error-boundary";

const GraphicalAnalysis = dynamic(() => import("./GraphicalAnalysis"), {
  ssr: false,
});

const AllelePhenotypeDiagram = dynamic(
  () => import("./AllelePhenotypeDiagram"),
  { ssr: false }
);

type TabContentProps = {
  errorMessage: ReactNode;
  isFetching: boolean;
  isError: boolean;
  data: Array<any>;
  alertVariant?: Variant;
};

const TabContent = (props: PropsWithChildren<TabContentProps>) => {
  const {
    errorMessage,
    isFetching,
    isError,
    data,
    children,
    alertVariant = "primary",
  } = props;

  if (isFetching) {
    return (
      <p className="grey" style={{ padding: "1rem" }}>
        <Spinner animation="border" size="sm" />
        &nbsp; Loading...
      </p>
    );
  }
  if (isError && !data?.length && errorMessage) {
    return (
      <Alert variant={alertVariant} className="mt-3">
        {errorMessage}
      </Alert>
    );
  }
  return <div className="mt-3">{children}</div>;
};

type PhenotypesProps = {
  gene: GeneSummary;
  sigPhenotypesFromServer: Array<GenePhenotypeHits>;
};

const Phenotypes = ({ gene, sigPhenotypesFromServer }: PhenotypesProps) => {
  const router = useRouter();
  const [tabKey, setTabKey] = useState("significantPhenotypes");
  const [allDataCount, setAllDataCount] = useState<number>(0);
  const [allDataFilters, setAllDataFilters] = useState({
    procedureName: undefined,
    topLevelPhenotypeName: undefined,
    lifeStageName: undefined,
    zygosity: undefined,
    alleleSymbol: undefined,
  });
  const [allDataQuery, setAllDataQuery] = useState<string>(undefined);

  const {
    phenotypeData,
    isPhenotypeLoading,
    isPhenotypeError,
    isPhenotypeFetching,
    error: sigPhenotypeError,
    fetchStatus: sigPhenotypeFetchStatus,
  } = useSignificantPhenotypesQuery(
    gene.mgiGeneAccessionId,
    router.isReady && sigPhenotypesFromServer?.length === 0
  );

  const sigPhenotypes = sigPhenotypesFromServer || phenotypeData;

  useEffect(() => {
    const unsubscribeOnSystemSelection = summarySystemSelectionChannel.on(
      "onSystemSelection",
      (_) => {
        if (tabKey !== "significantPhenotypes")
          setTabKey("significantPhenotypes");
      }
    );
    return () => {
      unsubscribeOnSystemSelection();
    };
  }, [tabKey]);

  useEffect(() => {
    const unsubscribeOnAlleleSelection = orderPhenotypedSelectionChannel.on(
      "onAlleleSelected",
      () => {
        if (tabKey !== "allData") setTabKey("allData");
      }
    );
    return () => {
      unsubscribeOnAlleleSelection();
    };
  }, [tabKey]);

  useEffect(() => {
    if (router.query.dataLifeStage && router.query.dataSearch) {
      setTabKey("allData");
      setAllDataFilters((prevState) => ({
        ...prevState,
        lifeStageName: router.query.dataLifeStage,
        procedureName: router.query.dataSearch,
      }));
      if (router.query.dataQuery) {
        setAllDataQuery(router.query.dataQuery as string);
      }
    }
  }, [router]);

  const hasDataRelatedToPWG = sigPhenotypes?.some(
    (item) => item.projectName === "PWG"
  );

  const hasOneAlleleOrMore =
    uniq(sigPhenotypes?.map((p) => p.alleleSymbol)).length > 1;

  return (
    <Card id="data" style={{ position: "relative" }}>
      <SectionHeader
        containerId="#data"
        title="Phenotypes"
        href="https://www.mousephenotype.org/help/data-visualization/gene-pages/significant-phenotypes-measurement-charts-and-all-data-tables/"
      />
      <Tabs activeKey={tabKey} onSelect={(key) => setTabKey(key)}>
        <Tab
          eventKey="significantPhenotypes"
          title={`Significant Phenotypes (${sigPhenotypes?.length || 0})`}
        >
          <TabContent
            isFetching={isPhenotypeFetching}
            isError={isPhenotypeError}
            data={sigPhenotypes}
            errorMessage={
              <span>
                No phenotype data available for <i>{gene.geneSymbol}</i>.
              </span>
            }
          >
            <SignificantPhenotypes
              phenotypeData={sigPhenotypes}
              hasDataRelatedToPWG={hasDataRelatedToPWG}
            />
          </TabContent>
        </Tab>
        <Tab
          eventKey="allData"
          title={allDataCount === 0 ? "All data" : `All data (${allDataCount})`}
        >
          <div className="mt-3">
            <AllData
              tableIsVisible
              onTotalData={setAllDataCount}
              additionalSelectedValues={allDataFilters}
              queryFromURL={allDataQuery}
              hasDataRelatedToPWG={hasDataRelatedToPWG}
            />
          </div>
        </Tab>
        <Tab eventKey="measurementsChart" title="Graphical Analysis">
          <div className="mt-3">
            <ErrorBoundary
              fallback={
                <Alert variant="danger">
                  An error occurred, please try later
                </Alert>
              }
            >
              <GraphicalAnalysis
                mgiGeneAccessionId={gene.mgiGeneAccessionId}
                routerIsReady={router.isReady}
                chartIsVisible={tabKey === "measurementsChart"}
              />
            </ErrorBoundary>
          </div>
        </Tab>
        {hasOneAlleleOrMore && (
          <Tab eventKey="allelesByPhenotype" title="Alleles by Phenotype">
            <ErrorBoundary
              fallback={
                <Alert variant="danger">
                  An error occurred, please try later
                </Alert>
              }
            >
              <AllelePhenotypeDiagram
                phenotypeData={sigPhenotypes}
                isPhenotypeLoading={isPhenotypeLoading}
                isPhenotypeError={isPhenotypeError}
              />
            </ErrorBoundary>
          </Tab>
        )}
      </Tabs>
    </Card>
  );
};

export default sectionWithErrorBoundary(Phenotypes, "Phenotypes", "data");
