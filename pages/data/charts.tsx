import { Col, Container, Row } from "react-bootstrap";
import Card from "../../components/Card";
import Search from "../../components/Search";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  TimeScale,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import {
  BoxPlotController,
  BoxAndWiskers,
  BoxPlotChart,
} from "@sgratzl/chartjs-chart-boxplot";
import "chartjs-adapter-moment";
import moment from "moment";
import { useRouter } from "next/router";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Legend,
  Tooltip,
  BoxPlotController,
  BoxAndWiskers,
  CategoryScale
);

const bgColors = {
  wt: "rgba(239, 123, 11, 0.2)",
  hom: "rgba(9, 120, 161, 0.7)",
};
const boderColors = {
  wt: "rgba(239, 123, 11, 0.5)",
  hom: "rgba(9, 120, 161, 0.7)",
};
const shapes = { male: "triangle", female: "circle" };
const pointRadius = 5;

const scatterDataTemplate = {
  datasets: [
    {
      type: "scatter" as const,
      label: "Female WT",
      backgroundColor: bgColors.wt,
      data: [],
      borderColor: boderColors.wt,
      borderWidth: 1,
      pointStyle: shapes.female,
      radius: pointRadius,
      yAxisID: "y",
    },
    {
      type: "scatter" as const,
      label: "Male WT",
      backgroundColor: bgColors.wt,
      data: [],
      borderColor: boderColors.wt,
      borderWidth: 1,
      pointStyle: shapes.male,
      radius: pointRadius + 1,
      yAxisID: "y",
    },
    {
      type: "scatter" as const,
      label: "Female HOM",
      backgroundColor: bgColors.hom,
      data: [],
      borderColor: boderColors.hom,
      borderWidth: 1,
      pointStyle: shapes.female,
      radius: pointRadius,
      yAxisID: "y",
    },
    {
      type: "scatter" as const,
      label: "Male HOM",
      backgroundColor: bgColors.hom,
      data: [],
      borderColor: boderColors.hom,
      borderWidth: 1,
      pointStyle: shapes.male,
      radius: pointRadius,
      yAxisID: "y",
    },
    {
      type: "line" as const,
      label: "Soft window statistical weight",
      backgroundColor: "black",
      data: [],
      borderColor: "black",
      borderWidth: 3,
      pointStyle: "rect",
      radius: 0,
      yAxisID: "y1",
      borderDash: [5, 5],
    },
  ],
};

const boxPlotDataTemplate = {
  labels: ["Female WT", "Male WT", "Female HOM", "Male HOM"],
  datasets: [
    {
      type: "boxplot" as const,
      backgroundColor: bgColors.wt,
      data: [],
      borderColor: boderColors.wt,
      borderWidth: 2,
      itemRadius: 0,
      padding: 100,
      outlierRadius: 2,

    },
    {
      type: "boxplot" as const,
      backgroundColor: bgColors.wt,
      data: [],
      borderColor: boderColors.wt,
      borderWidth: 0,
    },
    {
      type: "boxplot" as const,
      backgroundColor: bgColors.hom,
      data: [],
      borderColor: boderColors.hom,
      borderWidth: 1,
    },
    {
      type: "boxplot" as const,
      backgroundColor: bgColors.hom,
      data: [],
      borderColor: boderColors.hom,
      borderWidth: 1,
    },
  ],
};

const UnidimensionalScatterPlot = ({ data }) => {
  return (
    <Chart
      type="scatter"
      data={data}
      options={{
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 20,
            },
          },
        },
        scales: {
          x: {
            type: "time",
            display: true,
            offset: true,
            time: {
              unit: "month",
            },
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",

            // grid line settings
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          },
        },
      }}
    />
  );
};

const UnidimensionalBoxPlotPlot = ({ data }) => {
  return (
    <Chart
      type="boxplot"
      data={data}
      options={{
        plugins: {
          legend: {
            display: false,
            position: "bottom",
            labels: {
              usePointStyle: false,
              padding: 20,
            },
          },
        },
      }}
    />
  );
};

const Charts = () => {
  const [scatterPlotData, setScatterPlotData] = useState({ datasets: [] });
  const [boxPlotData, setBoxPlotData] = useState({ datasets: [] });

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/supporting-data/MGI:1929293/`);
      if (res.ok) {
        const response = await res.json();
        console.log(response);
        const dataPoints = response.dataPoints;
        const max = Math.max(...dataPoints.map((p) => +p.dataPoint));
        const min = Math.min(...dataPoints.map((p) => +p.dataPoint));

        const femaleWTPoints = dataPoints
          .filter(
            (p) =>
              p.biologicalSampleGroup === "control" &&
              p.specimenSex === "female"
          )
          .map((p) => {
            p.x = moment(p.dateOfExperiment);
            p.y = +p.dataPoint;
            return p;
          });
        const maleWTPoints = dataPoints
          .filter(
            (p) =>
              p.biologicalSampleGroup === "control" && p.specimenSex === "male"
          )
          .map((p) => {
            p.x = moment(p.dateOfExperiment);
            p.y = +p.dataPoint;
            return p;
          });
        const femaleHomPoints = dataPoints
          .filter(
            (p) =>
              p.biologicalSampleGroup === "experimental" &&
              p.specimenSex === "female"
          )
          .map((p) => {
            p.x = moment(p.dateOfExperiment);
            p.y = +p.dataPoint;
            return p;
          });
        const maleHomPoints = dataPoints
          .filter(
            (p) =>
              p.biologicalSampleGroup === "experimental" &&
              p.specimenSex === "male"
          )
          .map((p) => {
            p.x = moment(p.dateOfExperiment);
            p.y = +p.dataPoint;
            return p;
          });
        const windowPoints = [...dataPoints].map((p) => {
          const windowP = { ...p };
          windowP.x = moment(p.dateOfExperiment);
          const weigth = p.windowWeight ? +p.windowWeight : 1;
          windowP.y = weigth;
          return windowP;
        });

        const datasets = [
          femaleWTPoints,
          maleWTPoints,
          femaleHomPoints,
          maleHomPoints,
          windowPoints,
        ];
        scatterDataTemplate.datasets.forEach(
          (dt, index) => (dt.data = datasets[index])
        );
       boxPlotDataTemplate.datasets[0].data = [femaleWTPoints.map(p => +p.dataPoint), [], [], []];
       boxPlotDataTemplate.datasets[1].data = [[], maleWTPoints.map(p => +p.dataPoint), [], []];
       boxPlotDataTemplate.datasets[2].data = [[],[], femaleHomPoints.map(p => +p.dataPoint), []];
       boxPlotDataTemplate.datasets[3].data = [[], [], [], maleHomPoints.map(p => +p.dataPoint)];
       console.log(boxPlotDataTemplate);
       
       setBoxPlotData(boxPlotDataTemplate);

        setScatterPlotData(scatterDataTemplate);
      }
    })();
  }, []);

  if (!scatterPlotData) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Search />
      <Container className="page">
        <Card>
          <h2>Mavs data charts</h2>
        </Card>
        <Card>
          <h2>Description of the experiments performed</h2>
          <Row>
            <Col md={6}>
              <p>
                A Body Composition (DEXA lean/fat) phenotypic assay was
                performed on 802 mice. The charts show the results of measuring
                Bone Mineral Density (excluding skull) in 8 female, 8 male
                mutants compared to 395 female, 391 male controls. The mutants
                are for the Mavsem1(IMPC)Mbp allele.
              </p>
              <p className="small">
                * The high throughput nature of the IMPC means that large
                control sample sizes may accumulate over a long period of time.
                See the animal welfare guidelines for more information.
              </p>
            </Col>
            <Col md={6}>
              <p className="mb-0">
                Testing protocol: Body Composition (DEXA lean/fat)
              </p>
              <p className="mb-0">
                Testing environment: Lab conditions and equipment
              </p>
              <p className="mb-0">
                Measured value: Bone Mineral Density (excluding skull)
              </p>
              <p className="mb-0">Life stage: Early adult</p>
              <p className="mb-0">Background Strain: involves: C57BL/6NCrl</p>
              <p className="mb-0">Phenotyping center: UC Davis</p>
              <p className="mb-0">
                Associated Phenotype: decreased bone mineral density
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <UnidimensionalBoxPlotPlot data={boxPlotData} />
            </Col>
            <Col>
              <UnidimensionalScatterPlot data={scatterPlotData} />
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
};

export default Charts;
