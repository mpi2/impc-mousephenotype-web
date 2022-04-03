import { Tab, Tabs } from "react-bootstrap";
import Card from "../../Card";
import SignificantPhenotypes from "./SignificantPhenotypes";

const Phenotypes = ({ data }) => {
  console.log(data);
  return (
    <Card>
      <h2>Phenotypes</h2>
      <Tabs defaultActiveKey="significantPhenotypes" id="phenotypes">
        <Tab eventKey="significantPhenotypes" title="Significant Phenotypes">
          <SignificantPhenotypes data={data} />
        </Tab>
        <Tab eventKey="measurementsChart" title="Statistical Analysis">
          <p>Statistical Analysis</p>
        </Tab>
        <Tab eventKey="allData" title="All data">
          <p>All data</p>
        </Tab>
      </Tabs>
    </Card>
  );
};

export default Phenotypes;
