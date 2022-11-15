import { Tab, Tabs } from "react-bootstrap";
import Card from "../../Card";
import AllData from "./AllData";
import SignificantPhenotypes from "./SignificantPhenotypes";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";

const StatisticalAnalysis = dynamic(() => import("./StatisticalAnalysis"), {
  ssr: false,
});

const Phenotypes = () => {
  const router = useRouter();
  const [phenotypeData, setPhenotypeData] = useState(null);
  const [phenotypeError, setPhenotypeError] = useState(null);
  const [geneData, setGeneData] = useState(null);
  const [geneError, setGeneError] = useState(null);
  useEffect(() => {
    if (!router.isReady) return;

    (async () => {
      try {
        const pRes = await fetch(
          `/api/v1/genes/${"MGI:1929293" || router.query.pid}/phenotype-hits`
        );
        if (pRes.ok) {
          setPhenotypeData(await pRes.json());
        } else {
          throw new Error("Failed to load the phenotype");
        }
      } catch (e) {
        setPhenotypeError(e.message);
      }
      try {
        const gRes = await fetch(
          `/api/v1/genes/${
            "MGI:1860086" || router.query.pid
          }/statistical-results`
        );
        if (gRes.ok) {
          setGeneData(await gRes.json());
        } else {
          throw new Error("Failed to load the gene");
        }
      } catch (e) {
        setGeneError(e.message);
      }
    })();
  }, [router.isReady]);

  if (geneError || phenotypeError) {
    return (
      <Card id="data">
        <p className="grey">
          <FontAwesomeIcon icon={faWarning} /> Failed to load phenotype data.
        </p>
      </Card>
    );
  }

  if (!geneData || !phenotypeData) {
    return (
      <Card id="data">
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  return (
    <Card id="data">
      <h2>Phenotypes</h2>
      <Tabs defaultActiveKey="significantPhenotypes">
        <Tab eventKey="significantPhenotypes" title="Significant Phenotypes">
          <SignificantPhenotypes data={phenotypeData} />
        </Tab>
        <Tab eventKey="measurementsChart" title="Statistical Analysis">
          <StatisticalAnalysis data={geneData} />
        </Tab>
        <Tab eventKey="allData" title="All data">
          <AllData data={geneData} />
        </Tab>
      </Tabs>
    </Card>
  );
};

export default Phenotypes;
