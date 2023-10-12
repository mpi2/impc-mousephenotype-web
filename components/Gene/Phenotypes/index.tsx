import { Alert, Button, Tab, Tabs } from "react-bootstrap";
import Card from "../../Card";
import AllData from "./AllData";
import SignificantPhenotypes2 from "./SignificantPhenotypes2";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "../../../api-service";

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
    <>{children}</>
  );
}

const Phenotypes = ({ gene }: { gene: any }) => {
  const router = useRouter();
  const {data: phenotypeData, isLoading: isPhenotypeLoading, isError: isPhenotypeError} = useQuery({
    queryKey: ['genes', router.query.pid, 'phenotype-hits'],
    queryFn: () => fetchAPI(`/api/v1/genes/${router.query.pid}/phenotype-hits`),
    enabled: router.isReady
  });
  const {data: geneData, isLoading: isGeneLoading, isError: isGeneError} = useQuery({
    queryKey: ['genes', router.query.pid, 'statistical-result'],
    queryFn: () => fetchAPI(`/api/v1/genes/${router.query.pid}/statistical-result`),
    enabled: router.isReady
  });

  return (
    <Card id="data">
      <h2>Phenotypes</h2>
      <Tabs defaultActiveKey="significantPhenotypes">
        <Tab eventKey="significantPhenotypes" title="Significant Phenotypes">
          <TabContent
            isLoading={isPhenotypeLoading}
            isError={isPhenotypeError}
            errorMessage={`No significant phenotypes for ${gene.geneSymbol}.`}
            data={phenotypeData}
          >
            <SignificantPhenotypes2 data={phenotypeData} />
            <p className="mt-4 grey">
              Download data as:{" "}
              <Button
                size="sm"
                variant="outline-secondary"
                as="a"
                href={`https://www.mousephenotype.org/data/genes/export/${router.query.pid}?fileType=tsv&fileName=${gene.geneSymbol}`}
                target="_blank"
              >
                <FontAwesomeIcon icon={faDownload} size="sm" /> TSV
              </Button>{" "}
              <Button
                size="sm"
                variant="outline-secondary"
                as="a"
                href={`https://www.mousephenotype.org/data/genes/export/${router.query.pid}?fileType=xls&fileName=${gene.geneSymbol}`}
                target="_blank"
              >
                <FontAwesomeIcon icon={faDownload} size="sm" /> XLS
              </Button>
            </p>
          </TabContent>
        </Tab>
        <Tab eventKey="allData" title="All data">
          <TabContent
            isLoading={isGeneLoading}
            isError={isGeneError}
            errorMessage={`No phenotypes data available for ${gene.geneSymbol}.`}
            data={geneData}
          >
            <AllData data={geneData} />
            <p className="mt-4 grey">
              Download data as:{" "}
              <Button
                size="sm"
                variant="outline-secondary"
                as="a"
                href={`https://www.mousephenotype.org/data/experiments/export?geneAccession=${router.query.pid}&fileType=tsv&fileName=${router.query.pid}`}
                target="_blank"
              >
                <FontAwesomeIcon icon={faDownload} size="sm" /> TSV
              </Button>{" "}
              <Button
                size="sm"
                variant="outline-secondary"
                as="a"
                href={`https://www.mousephenotype.org/data/experiments/export?geneAccession=${router.query.pid}&fileType=xls&fileName=${router.query.pid}`}
                target="_blank"
              >
                <FontAwesomeIcon icon={faDownload} size="sm" /> XLS
              </Button>
            </p>
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
    </Card>
  );
};

export default Phenotypes;
