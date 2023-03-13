import { useState } from "react";
import { Alert, Button, Container, Tab, Tabs } from "react-bootstrap";
import Card from "../../components/Card";
import Search from "../../components/Search";
import Unidimensional from "../../components/Data/Unidimensional";
import Viability from "../../components/Data/Viability";
import Categorical from "../../components/Data/Categorical";
import TimeSeries from "../../components/Data/TimeSeries";
import Embryo from "../../components/Data/Embryo";
import Histopathology from "../../components/Data/Histopathology";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong, faTable } from "@fortawesome/free-solid-svg-icons";
import DataComparison from "../../components/Data/DataComparison";

const mockData = [
  {
    mgiGeneAccessionId: "MGI:1929293",
    pipelineStableId: "HRWL_001",
    procedureStableId: "IMPC_ABR_002",
    procedureName: "Auditory Brain Stem Response",
    parameterStableId: "IMPC_ABR_004_001",
    parameterName: "6kHz-evoked ABR Threshold",
    alleleAccessionId: "MGI:5548707",
    alleleName: "targeted mutation 1b, Wellcome Trust Sanger Institute",
    alleleSymbol: "Cib2<tm1b(EUCOMM)Wtsi>",
    zygosity: "homozygote",
    phenotypingCentre: "MRC Harwell",
    sex: "not_considered",
    projectName: "MRC",
    pValue: 0.0000280473093383979,
    lifeStageName: "Early adult",
    effectSize: 0.973799126637555,
    phenotype: {
      id: "MP:0004738",
      name: "abnormal auditory brainstem response",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005377",
        name: "hearing/vestibular/ear phenotype",
      },
    ],
  },
  {
    mgiGeneAccessionId: "MGI:1929293",
    pipelineStableId: "HRWL_001",
    procedureStableId: "IMPC_CSD_003",
    procedureName: "Combined SHIRPA and Dysmorphology",
    parameterStableId: "IMPC_CSD_039_001",
    parameterName: "Limb grasp",
    alleleAccessionId: "MGI:5548707",
    alleleName: "targeted mutation 1b, Wellcome Trust Sanger Institute",
    alleleSymbol: "Cib2<tm1b(EUCOMM)Wtsi>",
    zygosity: "homozygote",
    phenotypingCentre: "MRC Harwell",
    sex: "female",
    projectName: "BaSH",
    pValue: 8.82567650351401e-7,
    lifeStageName: "Early adult",
    effectSize: null,
    phenotype: {
      id: "MP:0001513",
      name: "limb grasping",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005386",
        name: "behavior/neurological phenotype",
      },
    ],
  },
  {
    mgiGeneAccessionId: "MGI:1929293",
    pipelineStableId: "HRWL_001",
    procedureStableId: "IMPC_CSD_003",
    procedureName: "Combined SHIRPA and Dysmorphology",
    parameterStableId: "IMPC_CSD_036_001",
    parameterName: "Startle response",
    alleleAccessionId: "MGI:5548707",
    alleleName: "targeted mutation 1b, Wellcome Trust Sanger Institute",
    alleleSymbol: "Cib2<tm1b(EUCOMM)Wtsi>",
    zygosity: "homozygote",
    phenotypingCentre: "MRC Harwell",
    sex: "male",
    projectName: "BaSH",
    pValue: 7.56658247323517e-21,
    lifeStageName: "Early adult",
    effectSize: null,
    phenotype: {
      id: "MP:0001486",
      name: "abnormal startle reflex",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005386",
        name: "behavior/neurological phenotype",
      },
    ],
  },
];

const Charts = () => {
  const [mode, setMode] = useState("Unidimensional");
  const [tab, setTab] = useState("a");
  const [showComparison, setShowComparison] = useState(false);
  const router = useRouter();
  const getPage = () => {
    switch (mode) {
      case "Unidimensional":
        return <Unidimensional />;
      case "Categorical":
        return <Categorical />;
      case "Viability":
        return <Viability />;
      case "Time series":
        return <TimeSeries />;
      case "Embryo":
        return <Embryo />;
      case "Histopathology":
        return <Histopathology />;

      default:
        return null;
    }
  };
  return (
    <>
      <Search />
      <Container className="page">
        <Card>
          <div className={styles.subheading}>
            <span className={`${styles.subheadingSection} primary`}>
              <button
                style={{
                  border: 0,
                  background: "none",
                  padding: 0,
                }}
                onClick={() => {
                  router.back();
                }}
              >
                <a href="#" className="grey mb-3">
                  MAVS
                </a>
              </button>{" "}
              / phenotype data breakdown
            </span>
          </div>
          <h1 className="mb-4 mt-2">
            <strong>Decreased bone mineral content</strong>
          </h1>
          <Alert variant="green" className="mb-0">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <span>
                3 parameter/something/something combinations tested, with the
                highest p-value of <strong>2.80x10-5</strong>.
              </span>
              <Button
                variant="secondary"
                className="white-x"
                onClick={() => {
                  setShowComparison(!showComparison);
                }}
              >
                <FontAwesomeIcon icon={faTable} />{" "}
                {showComparison ? "Hide comparison" : "Compare combinations"}
              </Button>
            </div>
          </Alert>
          {showComparison && <DataComparison data={mockData} />}
        </Card>
      </Container>
      <div
        style={{ position: "sticky", top: 0, zIndex: 100 }}
        className="bg-grey pt-2"
      >
        <Container>
          <Tabs defaultActiveKey={"a"} onSelect={(e) => setTab(e)}>
            <Tab
              eventKey="a"
              title={`Combination 1 (2.80x10e-5 | highest)`}
            ></Tab>
            <Tab eventKey="b" title={`Combination 2 (2.14x10e-6)`}></Tab>
            <Tab eventKey="c" title={`Combination 3 (2.14x10e-6)`}></Tab>
          </Tabs>
        </Container>
      </div>
      <Container>
        {getPage()}
        <Card>
          <p>Current mode: {mode}</p>
          <div style={{ display: "flex" }}>
            <button
              onClick={() => {
                setMode("Unidimensional");
              }}
            >
              Unidimensional
            </button>
            <button
              onClick={() => {
                setMode("Categorical");
              }}
            >
              Categorical
            </button>
            <button
              onClick={() => {
                setMode("Viability");
              }}
            >
              Viability
            </button>
            <button
              onClick={() => {
                setMode("Time series");
              }}
            >
              Time series
            </button>
            <button
              onClick={() => {
                setMode("Embryo");
              }}
            >
              Embryo
            </button>
            <button
              onClick={() => {
                setMode("Histopathology");
              }}
            >
              Histopathology
            </button>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default Charts;
