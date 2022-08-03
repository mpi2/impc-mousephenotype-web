import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import Card from "../Card";
import UnidimensionalBoxPlot from "./Plots/UnidimensionalBoxPlot";
import UnidimensionalScatterPlot from "./Plots/UnidimensionalScatterPlot";

const Unidimensional = () => {
  const router = useRouter();
  const [scatterSeries, setScatterSeries] = useState([]);
  const [lineSeries, setLineSeries] = useState([]);
  const [boxPlotSeries, setBoxPlotSeries] = useState([]);

  const getScatterSeries = (dataPoints, sex, sampleGroup) => {
    const data = dataPoints
      .filter(
        (p) => p.biologicalSampleGroup === sampleGroup && p.specimenSex === sex
      )
      .map((p) => {
        p.x = moment(p.dateOfExperiment);
        p.y = +p.dataPoint;
        return p;
      });
    return {
      sex,
      sampleGroup,
      data,
    };
  };

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/supporting-data/MGI:1929293/`);
      if (res.ok) {
        const response = await res.json();
        console.log(response);
        const dataPoints = response.dataPoints;

        const femaleWTPoints = getScatterSeries(
          dataPoints,
          "female",
          "control"
        );
        const maleWTPoints = getScatterSeries(dataPoints, "male", "control");
        const femaleHomPoints = getScatterSeries(
          dataPoints,
          "female",
          "experimental"
        );
        const maleHomPoints = getScatterSeries(
          dataPoints,
          "male",
          "experimental"
        );
        const windowPoints = [...dataPoints].map((p) => {
          const windowP = { ...p };
          windowP.x = moment(p.dateOfExperiment);
          const weigth = p.windowWeight ? +p.windowWeight : 1;
          windowP.y = weigth;
          return windowP;
        });

        setBoxPlotSeries([
          femaleWTPoints,
          maleWTPoints,
          femaleHomPoints,
          maleHomPoints,
        ]);

        setScatterSeries([
          femaleWTPoints,
          maleWTPoints,
          femaleHomPoints,
          maleHomPoints,
        ]);
        setLineSeries([windowPoints]);
      }
    })();
  }, []);

  if (!scatterSeries) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Card>
        <div>
          <button
            style={{ border: 0, background: "none", padding: 0 }}
            onClick={() => {
              router.back();
            }}
          >
            <a href="#" className="grey mb-3 small">
              <FontAwesomeIcon icon={faArrowLeftLong} /> GO BACK
            </a>
          </button>
          <h1>
            <strong>Mavs data charts</strong>
          </h1>
        </div>
        <h2>Description of the experiments performed</h2>
        <Row>
          <Col md={7} style={{ borderRight: "1px solid #ddd" }}>
            <p>
              A Body Composition (DEXA lean/fat) phenotypic assay was performed
              on 802 mice. The charts show the results of measuring Bone Mineral
              Density (excluding skull) in 8 female, 8 male mutants compared to
              395 female, 391 male controls. The mutants are for the
              Mavsem1(IMPC)Mbp allele.
            </p>
            <p className="small">
              * The high throughput nature of the IMPC means that large control
              sample sizes may accumulate over a long period of time. See the
              animal welfare guidelines for more information.
            </p>
          </Col>
          <Col md={5} className="small">
            <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Testing protocol
              </span>
              <strong>Body Composition (DEXA lean/fat)</strong>
            </p>
            <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Testing environment
              </span>
              <strong>Lab conditions and equipment</strong>
            </p>
            <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Measured value
              </span>
              <strong>Bone Mineral Density (excluding skull)</strong>
            </p>
            <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Life stage
              </span>
              <strong>Early adult</strong>
            </p>
            <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Background Strain
              </span>
              <strong>involves C57BL/6NCrl</strong>
            </p>
            <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Phenotyping center
              </span>
              <strong>UC Davis</strong>
            </p>
            <p className="mb-2">
              <span style={{ display: "inline-block", width: 180 }}>
                Associated Phenotype
              </span>
              <strong>decreased bone mineral density</strong>
            </p>
          </Col>
        </Row>
      </Card>
      <Row>
        <Col lg={5}>
          <Card>
            <UnidimensionalBoxPlot
              series={boxPlotSeries}
              zygosity="homozygote"
            />
          </Card>
        </Col>
        <Col lg={7}>
          <Card>
            <UnidimensionalScatterPlot
              scatterSeries={scatterSeries}
              lineSeries={lineSeries}
              zygosity="homozygote"
              parameterName="Bone Mineral Density (excluding skull)"
              unit="sm"
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <h2>Results of statistical analysis</h2>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <h2>Summary statistics of all data in the dataset</h2>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <h2>Statistical method</h2>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <h2>Windowing parameters</h2>
          </Card>
          <Card>
            <h2>Access the results programmatically</h2>
          </Card>
        </Col>
        <Col>
          <Card>
            <h2>Download all the data</h2>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Unidimensional;
