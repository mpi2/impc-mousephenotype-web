import { Alert, Button, Tab, Tabs } from "react-bootstrap";
import Card from "../../Card";
import AllData from "./AllData";
import SignificantPhenotypes2 from "./SignificantPhenotypes2";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import useQuery from "../../useQuery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const StatisticalAnalysis = dynamic(() => import("./StatisticalAnalysis"), {
  ssr: false,
});

const Phenotypes = ({ gene }: { gene: any }) => {
  const router = useRouter();
  const [phenotypeData, phenotypeLoading, phenotypeError] = useQuery({
    // query: `/api/v1/genes/${"MGI:1929293" || router.query.pid}/phenotype-hits`,
    query: `/api/v1/genes/${router.query.pid}/phenotype-hits`,
  });
  const [geneData, geneLoading, geneError] = useQuery({
    query: `/api/v1/genes/${
      // "MGI:1860086" || router.query.pid
      router.query.pid
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
      <Tabs defaultActiveKey="measurementsChart">
        <Tab eventKey="measurementsChart" title="Statistical Analysis">
          {!!geneError ? (
            <Alert variant="yellow" className="mt-3">
              No phenotypes data available for {gene.geneSymbol}.
            </Alert>
          ) : (
            <StatisticalAnalysis data={geneData} />
          )}
        </Tab>
        <Tab eventKey="significantPhenotypes" title="Significant Phenotypes">
          {!!phenotypeError ? (
            <Alert variant="yellow" className="mt-3">
              No significant phenotypes for {gene.geneSymbol}.
            </Alert>
          ) : (
            <>
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
            </>
          )}
        </Tab>
        <Tab eventKey="allData" title="All data">
          {!!geneError ? (
            <Alert variant="yellow" className="mt-3">
              No phenotypes data available for {gene.geneSymbol}.
            </Alert>
          ) : (
            <>
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
            </>
          )}
        </Tab>
      </Tabs>
    </Card>
  );
};

export default Phenotypes;
