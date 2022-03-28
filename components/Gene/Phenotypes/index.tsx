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
          <SignificantPhenotypes />
        </Tab>
        <Tab eventKey="measurementsChart" title="Measurements Chart">
          <p>Measurements chart</p>
        </Tab>
        <Tab eventKey="allData" title="All data">
          <p>All data</p>
        </Tab>
      </Tabs>
    </Card>
  );
};

export default Phenotypes;
