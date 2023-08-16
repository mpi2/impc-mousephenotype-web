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
import {
  faArrowLeftLong,
  faStar,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import DataComparison from "../../components/Data/DataComparison";
import { formatPValue } from "../../utils";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "../../api-service";

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
  const [tab, setTab] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const router = useRouter();
  const getChartType = (datasetSummary: any) => {
    switch (datasetSummary["dataType"]) {
      case "unidimensional":
        return <Unidimensional datasetSummary={datasetSummary} />;
      case "categorical":
        return <Categorical datasetSummary={datasetSummary} />;
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

  const { data: datasetSummaries, isLoading } = useQuery({
    queryKey: ['genes', router.query.mgiGeneAccessionId, router.query.mpTermId, 'dataset'],
    queryFn: () => fetchAPI(`/api/v1/genes/${router.query.mgiGeneAccessionId}/${router.query.mpTermId}/dataset/`),
    enabled: router.isReady
  });
  datasetSummaries ? console.log(datasetSummaries) : null;
  if (datasetSummaries) {
    datasetSummaries.sort((a, b) => {
      return a["reportedPValue"] - b["reportedPValue"];
    });
  }
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
                  {datasetSummaries && datasetSummaries[0]["geneSymbol"]}
                </a>
              </button>{" "}
              / phenotype data breakdown
            </span>
          </div>
          <h1 className="mb-4 mt-2">
            <strong className="text-capitalize">
              {datasetSummaries &&
                datasetSummaries[0]["significantPhenotype"]["name"]}
            </strong>
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
                {datasetSummaries && datasetSummaries.length} parameter /
                zygosity / metadata group combinations tested, with the lowest
                p-value of{" "}
                <strong>
                  {datasetSummaries &&
                    formatPValue(
                      Math.min(
                        ...datasetSummaries.map((d) => d["reportedPValue"])
                      )
                    )}
                </strong>
                .
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
          {!isLoading && showComparison && (
            <DataComparison data={datasetSummaries} />
          )}
        </Card>
      </Container>
      <div
        style={{ position: "sticky", top: 0, zIndex: 100 }}
        className="bg-grey pt-2"
      >
        <Container>
          <Tabs defaultActiveKey={0} onSelect={(e) => setTab(e)}>
            {datasetSummaries &&
              datasetSummaries.map((d, i) => (
                <Tab
                  eventKey={i}
                  title={
                    <>
                      Combination {i + 1} ({formatPValue(d["reportedPValue"])}{" "}
                      {i === 0 ? " | lowest" : null})
                    </>
                  }
                  key={i}
                >
                  <div>{getChartType(d)}</div>
                </Tab>
              ))}
          </Tabs>
        </Container>
      </div>
      <Container>
        {/* <Card>
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
        </Card> */}
      </Container>
    </>
  );
};

export default Charts;
