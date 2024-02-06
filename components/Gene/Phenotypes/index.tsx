import { Alert, Button, Tab, Tabs } from "react-bootstrap";
import Card from "../../Card";
import AllData from "./AllData";
import SignificantPhenotypes from "./SignificantPhenotypes";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import { GeneSummary, GeneStatisticalResult } from "@/models/gene";
import { sectionWithErrorBoundary } from "@/hoc/sectionWithErrorBoundary";
import { useSignificantPhenotypesQuery } from "@/hooks";
import AllelePhenotypeDiagram from "@/components/Gene/Phenotypes/AllelePhenotypeDiagram";

const StatisticalAnalysis = dynamic(() => import("./StatisticalAnalysis"), {
  ssr: false,
});

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

  const {data: geneData, isLoading: isGeneLoading, isError: isGeneError} = useQuery({
    queryKey: ['genes', router.query.pid, 'statistical-result'],
    queryFn: () => fetchAPI(`/api/v1/genes/${router.query.pid}/statistical-result`),
    enabled: router.isReady,
    select: data => data as Array<GeneStatisticalResult>
  });

  const {
    phenotypeData,
    isPhenotypeLoading,
    isPhenotypeError
  } = useSignificantPhenotypesQuery(gene.mgiGeneAccessionId, router.isReady);

  const hasDataRelatedToPWG =
    geneData?.some(item => item.projectName === 'PWG') ||
    phenotypeData?.some(item => item.projectName === 'PWG');

  return (
    <Card id="data">
      <h2>Phenotypes</h2>
      <Tabs defaultActiveKey="significantPhenotypes">
        <Tab eventKey="significantPhenotypes" title="Significant Phenotypes">
          <div className="mt-3">
            <SignificantPhenotypes
              phenotypeData={phenotypeData}
              isPhenotypeLoading={isPhenotypeLoading}
              isPhenotypeError={isPhenotypeError}
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
      </Tabs>
      {hasDataRelatedToPWG && (
        <span style={{ textAlign: 'right', marginTop: '1rem', fontSize: "90%" }}>
          * Significant with a threshold of 1x10-3, check the&nbsp;
          <a className="primary link" href="https://www.mousephenotype.org/publications/data-supporting-impc-papers/pain/">
            Pain Sensitivity page&nbsp;
          </a>
          for more information.
        </span>
      )}
    </Card>
  );
};

export default sectionWithErrorBoundary(Phenotypes, 'Phenotypes', 'data');
