import { Tab, Tabs } from "react-bootstrap";
import Card from "../../Card";
import AllData from "./AllData";
import SignificantPhenotypes from "./SignificantPhenotypes";
// import StatisticalAnalysis from "./StatisticalAnalysis";
import dynamic from "next/dynamic";

const StatisticalAnalysis = dynamic(() => import("./StatisticalAnalysis"), {
  ssr: false,
});

const Phenotypes = ({ phenotypes, gene }) => {
  return (
    <Card id="data">
      <h2>Phenotypes</h2>
      <Tabs defaultActiveKey="significantPhenotypes">
        <Tab eventKey="significantPhenotypes" title="Significant Phenotypes">
          <SignificantPhenotypes data={phenotypes} />
        </Tab>
        <Tab eventKey="measurementsChart" title="Statistical Analysis">
          <StatisticalAnalysis data={gene} />
        </Tab>
        <Tab eventKey="allData" title="All data">
          <AllData data={gene} />
        </Tab>
      </Tabs>
    </Card>
  );
};

export default Phenotypes;
