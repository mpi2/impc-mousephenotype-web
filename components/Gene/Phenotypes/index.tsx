import { Alert, Tab, Tabs } from "react-bootstrap";
import Card from "../../Card";
import AllData from "./AllData";
import SignificantPhenotypes from "./SignificantPhenotypes";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import useQuery from "../../useQuery";

const StatisticalAnalysis = dynamic(() => import("./StatisticalAnalysis"), {
  ssr: false,
});

const Phenotypes = ({ gene }: { gene: any }) => {
  const router = useRouter();
  const [phenotypeData, phenotypeLoading, phenotypeError] = useQuery({
    query: `/api/v1/genes/${"MGI:1929293" || router.query.pid}/phenotype-hits`,
  });
  const [geneData, geneLoading, geneError] = useQuery({
    query: `/api/v1/genes/${
      "MGI:1860086" || router.query.pid
    }/statistical-result`,
  });

  if (phenotypeLoading || geneLoading) {
    return (
      <Card id="data">
        <h2>Phenotypes</h2>
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  return (
    <Card id="data">
      <h2>Phenotypes</h2>
      <Tabs defaultActiveKey="significantPhenotypes">
        <Tab eventKey="significantPhenotypes" title="Significant Phenotypes">
          {!!phenotypeError ? (
            <Alert variant="primary">
              Error loading phenotypes for {gene.geneSymbol}: {phenotypeError}
            </Alert>
          ) : (
            <SignificantPhenotypes data={phenotypeData} />
          )}
        </Tab>
        <Tab eventKey="measurementsChart" title="Statistical Analysis">
          {!!geneError ? (
            <Alert variant="primary">
              Error loading phenotypes for {gene.geneSymbol}: {geneError}
            </Alert>
          ) : (
            <StatisticalAnalysis data={geneData} />
          )}
        </Tab>
        <Tab eventKey="allData" title="All data">
          {!!geneError ? (
            <Alert variant="primary">
              Error loading phenotypes for {gene.geneSymbol}: {geneError}
            </Alert>
          ) : (
            <AllData data={geneData} />
          )}
        </Tab>
      </Tabs>
    </Card>
  );
};

export default Phenotypes;
