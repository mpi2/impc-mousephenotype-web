import { Alert, Col, Row, Spinner, Tab, Tabs } from "react-bootstrap";
import Card from "../../Card";
import AllData from "./AllData";
import SignificantPhenotypes from "./SignificantPhenotypes";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { GeneSummary } from "@/models/gene";
import { sectionWithErrorBoundary } from "@/hoc/sectionWithErrorBoundary";
import { useSignificantPhenotypesQuery } from "@/hooks";
import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { orderPhenotypedSelectionChannel, summarySystemSelectionChannel } from "@/eventChannels";
import _ from 'lodash';
import { Variant } from "react-bootstrap/types";
import { SectionHeader } from "@/components";
import { faTriangleExclamation, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const GraphicalAnalysis = dynamic(
  () => import("./GraphicalAnalysis"),
  {ssr: false}
);

const AllelePhenotypeDiagram = dynamic(
  () => import('./AllelePhenotypeDiagram'),
  {ssr: false}
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
    alertVariant = "primary"
  } = props;

  if (isFetching) {
    return (
      <p className="grey" style={{ padding: '1rem' }}>
        <Spinner animation="border" size="sm" />&nbsp;
        Loading...
      </p>
    )
  }
  if (isError && !data?.length && errorMessage) {
    return (
      <Alert variant={alertVariant} className="mt-3">
        {errorMessage}
      </Alert>
    )
  }
  return (
    <div className="mt-3">{children}</div>
  );
}

const Phenotypes = ({ gene }: { gene: GeneSummary }) => {
  const router = useRouter();
  const [tabKey, setTabKey] = useState('significantPhenotypes');
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
  } = useSignificantPhenotypesQuery(gene.mgiGeneAccessionId, router.isReady);

  useEffect(() => {
    const unsubscribeOnSystemSelection = summarySystemSelectionChannel.on(
      'onSystemSelection',
      (_) => {
        if (tabKey !== 'significantPhenotypes') setTabKey('significantPhenotypes');
      });
    return () => {
      unsubscribeOnSystemSelection();
    }
  }, [tabKey]);

  useEffect(() => {
    const unsubscribeOnAlleleSelection = orderPhenotypedSelectionChannel.on(
      "onAlleleSelected",
      () => {
        if (tabKey !== 'allData') setTabKey('allData');
      });
    return () => {
      unsubscribeOnAlleleSelection();
    }
  }, [tabKey]);

  useEffect(() => {
    if (router.query.dataLifeStage && router.query.dataSearch) {
      setTabKey('allData');
      setAllDataFilters(prevState => ({
        ...prevState,
        lifeStageName: router.query.dataLifeStage,
        procedureName: router.query.dataSearch
      }));
      if (router.query.dataQuery) {
        setAllDataQuery(router.query.dataQuery as string);
      }
    }
  }, [router]);

  const hasDataRelatedToPWG = phenotypeData?.some(item => item.projectName === 'PWG');

  const hasOneAlleleOrMore = _.uniq(phenotypeData?.map(p => p.alleleSymbol)).length > 1;

  return (
    <Card id="data" style={{ position: 'relative' }}>
      <SectionHeader
        containerId="#data"
        title="Phenotypes"
        href="https://dev.mousephenotype.org/help/data-visualization/phenotype-pages/"
      />
      <Tabs
        activeKey={tabKey}
        onSelect={key => setTabKey(key)}
      >
        <Tab eventKey="significantPhenotypes" title={`Significant Phenotypes (${phenotypeData?.length || 0})`}>
          <TabContent
            isFetching={isPhenotypeFetching}
            isError={isPhenotypeError}
            data={phenotypeData}
            errorMessage={<span>No phenotype data available for <i>{gene.geneSymbol}</i>.</span>}
          >
          <SignificantPhenotypes
              phenotypeData={phenotypeData}
              hasDataRelatedToPWG={hasDataRelatedToPWG}
            />
          </TabContent>
        </Tab>
        <Tab eventKey="allData" title={`All data (${allDataCount})`}>
          <div className="mt-3">
            <AllData
              routerIsReady={router.isReady}
              onTotalData={setAllDataCount}
              additionalSelectedValues={allDataFilters}
              queryFromURL={allDataQuery}
            />
          </div>
        </Tab>
        <Tab eventKey="measurementsChart" title="Graphical Analysis">
          <div className="mt-3">
            <GraphicalAnalysis
              mgiGeneAccessionId={gene.mgiGeneAccessionId}
              routerIsReady={router.isReady}
            />
          </div>
        </Tab>
        { hasOneAlleleOrMore && (
          <Tab eventKey="allelesByPhenotype" title="Alleles by Phenotype">
            <AllelePhenotypeDiagram
              phenotypeData={phenotypeData}
              isPhenotypeLoading={isPhenotypeLoading}
              isPhenotypeError={isPhenotypeError}
            />
          </Tab>
        )}
      </Tabs>
    </Card>
  );
};

export default sectionWithErrorBoundary(Phenotypes, 'Phenotypes', 'data');
