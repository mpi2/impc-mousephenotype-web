import { Tab, Tabs } from "react-bootstrap";
import Card from "../../Card";
import AllData from "./AllData";
import SignificantPhenotypes from "./SignificantPhenotypes";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const StatisticalAnalysis = dynamic(() => import("./StatisticalAnalysis"), {
  ssr: false,
});

const Phenotypes = () => {
  const router = useRouter();
  const [phenotypeData, setphenotypeData] = useState(null);
  const [geneData, setGeneData] = useState(null);
  useEffect(() => {
    if (!router.isReady) return;

    (async () => {
      const pData = await fetch(`/api/genes/${router.query.pid}/phenotypes`);
      setphenotypeData(await pData.json());
      const gData = await fetch(
        `/api/genes/${router.query.pid}/statistical-results`
      );
      setGeneData(await gData.json());
    })();
  }, [router.isReady]);

  return (
    <Card id="data">
      <h2>Phenotypes</h2>
      <Tabs defaultActiveKey="significantPhenotypes">
        <Tab eventKey="significantPhenotypes" title="Significant Phenotypes">
          <SignificantPhenotypes data={phenotypeData} />
        </Tab>
        <Tab eventKey="measurementsChart" title="Statistical Analysis">
          <StatisticalAnalysis data={geneData?.statisticalResults} />
        </Tab>
        <Tab eventKey="allData" title="All data">
          <AllData data={geneData?.statisticalResults} />
        </Tab>
      </Tabs>
    </Card>
  );
};

export default Phenotypes;
