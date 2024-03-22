import { Alert, Tab, Tabs } from "react-bootstrap";
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
import { useEffect, useState } from "react";
import { summarySystemSelectionChannel } from "@/eventChannels";
import _ from 'lodash';


const StatisticalAnalysis = dynamic(
  () => import("./StatisticalAnalysis"),
  {ssr: false}
);

const AllelePhenotypeDiagram = dynamic(
  () => import('./AllelePhenotypeDiagram'),
  {ssr: false}
);

const TabContent = ({ errorMessage, isLoading, isError, data, children }) => {
  if (isLoading) {
    return (
      <p className="grey" style={{ padding: '1rem' }}>Loading...</p>
    )
  }
  if (isError || !data) {
    return (
      <Alert variant="primary" className="mt-3">
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

  const getMutantCount = (dataset: GeneStatisticalResult) => {
    if (!dataset.maleMutantCount && !dataset.femaleMutantCount) {
      return 'N/A';
    }
    return `${dataset.maleMutantCount || 0}m/${dataset.femaleMutantCount || 0}f`;
  };

  const {data: geneData, isLoading: isGeneLoading, isError: isGeneError} = useQuery({
    queryKey: ['genes', router.query.pid, 'statistical-result'],
    queryFn: () => fetchAPI(`/api/v1/genes/${router.query.pid}/statistical-result`),
    enabled: router.isReady,
    select: data => data.map(dataset => ({
      ...dataset,
      mutantCount: getMutantCount(dataset)
    })) as Array<GeneStatisticalResult>
  });

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

  const {
    phenotypeData,
    isPhenotypeLoading,
    isPhenotypeError
  } = useSignificantPhenotypesQuery(gene.mgiGeneAccessionId, router.isReady);

  const hasDataRelatedToPWG =
    geneData?.some(item => item.projectName === 'PWG') ||
    phenotypeData?.some(item => item.projectName === 'PWG');

  const hasOneAlleleOrMore = _.uniq(phenotypeData?.map(p => p.alleleSymbol)).length > 1;

  return (
    <Card id="data">
      <h2>Phenotypes</h2>
      <Tabs
        activeKey={tabKey}
        onSelect={key => setTabKey(key)}
      >
        <Tab eventKey="significantPhenotypes" title="Significant Phenotypes">
          <div className="mt-3">
            <SignificantPhenotypes
              phenotypeData={phenotypeData}
              isPhenotypeLoading={isPhenotypeLoading}
              isPhenotypeError={isPhenotypeError}
              hasDataRelatedToPWG={hasDataRelatedToPWG}
            />
          </div>
        </Tab>
        <Tab eventKey="allData" title="All data">
          <TabContent
            isLoading={isGeneLoading}
            isError={isGeneError}
            errorMessage={`No phenotypes data available for ${gene.geneSymbol}.`}
            data={geneData}
          >
            <AllData data={geneData} />
          </TabContent>
        </Tab>
        <Tab eventKey="measurementsChart" title="Graphical Analysis">
          <TabContent
            isLoading={isGeneLoading}
            isError={isGeneError}
            errorMessage={`No phenotypes data available for ${gene.geneSymbol}.`}
            data={geneData}
          >
            <StatisticalAnalysis data={geneData} />
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
