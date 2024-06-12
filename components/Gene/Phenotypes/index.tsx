import { Alert, Spinner, Tab, Tabs } from "react-bootstrap";
import Card from "../../Card";
import AllData from "./AllData";
import SignificantPhenotypes from "./SignificantPhenotypes";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import { GeneSummary, GeneStatisticalResult } from "@/models/gene";
import { sectionWithErrorBoundary } from "@/hoc/sectionWithErrorBoundary";
import { useSignificantPhenotypesQuery } from "@/hooks";
import { PropsWithChildren, ReactNode, useContext, useEffect, useState } from "react";
import { orderPhenotypedSelectionChannel, summarySystemSelectionChannel } from "@/eventChannels";
import _ from 'lodash';
import { AllelesStudiedContext } from "@/contexts";
import { Variant } from "react-bootstrap/types";


const StatisticalAnalysis = dynamic(
  () => import("./StatisticalAnalysis"),
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
  const { setAllelesStudiedLoading } = useContext(AllelesStudiedContext);
  const [tabKey, setTabKey] = useState('significantPhenotypes');

  const getMutantCount = (dataset: GeneStatisticalResult) => {
    if (!dataset.maleMutantCount && !dataset.femaleMutantCount) {
      return 'N/A';
    }
    return `${dataset.maleMutantCount || 0}m/${dataset.femaleMutantCount || 0}f`;
  };

  const {data: geneData, isFetching: isGeneFetching, isError: isGeneError} = useQuery({
    queryKey: ['genes', router.query.pid, 'statistical-result'],
    queryFn: () => fetchAPI(`/api/v1/genes/${router.query.pid}/statistical-result`),
    enabled: router.isReady,
    select: data => data.map(dataset => ({
      ...dataset,
      mutantCount: getMutantCount(dataset)
    })) as Array<GeneStatisticalResult>,
    placeholderData: []
  });

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

  useEffect(() => setAllelesStudiedLoading(isGeneFetching), [isGeneFetching]);

  const hasDataRelatedToPWG =
    geneData?.some(item => item.projectName === 'PWG') ||
    phenotypeData?.some(item => item.projectName === 'PWG');

  const hasOneAlleleOrMore = _.uniq(phenotypeData?.map(p => p.alleleSymbol)).length > 1;

  let sigPhenotypeErrorMessage = null;
  let sigPhenotypeAlertVariant = "primary";
  if (sigPhenotypeError === 'No content' && isGeneFetching) {
    sigPhenotypeErrorMessage = <div>No results meet the p-value threshold,&nbsp; there may be data in all data tab</div>;
    sigPhenotypeAlertVariant = "warning";
  } else if (sigPhenotypeError === 'No content' && geneData?.length) {
    sigPhenotypeErrorMessage = <div>No results meet the p-value threshold, view all data tab</div>;
    sigPhenotypeAlertVariant = "warning";
  } else if (sigPhenotypeError === 'No content' && !geneData && !phenotypeData) {
    sigPhenotypeErrorMessage = <span>No phenotype data available for <i>{gene.geneSymbol}</i>.</span>;
  }

  return (
    <Card id="data">
      <h2>Phenotypes</h2>
      <Tabs
        activeKey={tabKey}
        onSelect={key => setTabKey(key)}
      >
        <Tab eventKey="significantPhenotypes" title={`Significant Phenotypes (${phenotypeData?.length || 0})`}>
          <TabContent
            isFetching={isPhenotypeFetching}
            isError={isPhenotypeError}
            data={phenotypeData}
            errorMessage={sigPhenotypeErrorMessage}
            alertVariant={sigPhenotypeAlertVariant}
          >
            <SignificantPhenotypes
              phenotypeData={phenotypeData}
              hasDataRelatedToPWG={hasDataRelatedToPWG}
            />
          </TabContent>
        </Tab>
        <Tab eventKey="allData" title={<span>All data ({isGeneFetching ? (<Spinner animation="border" size="sm" />): geneData?.length || 0})</span>}>
          <TabContent
            isFetching={isGeneFetching}
            isError={isGeneError}
            errorMessage={<span>No phenotype data available for <i>{gene.geneSymbol}</i>.</span>}
            data={geneData}
          >
            <AllData data={geneData} />
          </TabContent>
        </Tab>
        <Tab eventKey="measurementsChart" title="Graphical Analysis">
          <TabContent
            isFetching={isGeneFetching}
            isError={isGeneError}
            errorMessage={<span>No phenotype data available for <i>{gene.geneSymbol}</i>.</span>}
            data={geneData}
          >
            <StatisticalAnalysis data={geneData} isVisible={"measurementsChart" === tabKey} />
          </TabContent>
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
