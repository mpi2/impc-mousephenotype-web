import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Card from "../../components/Card";
import CategoricalBarPlot from "./Plots/CategoricalBarPlot";

const Categorical = () => {
  const router = useRouter();
  const [categoricalSeries, setCategoricalSeries] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/supporting-data-categorical/MGI:1929293/`);
      if (res.ok) {
        const response = await res.json();
        console.log(response);
        const dataPoints: Array<any> = response.dataPoints;
        const index = {};
        const categories = [];
        dataPoints.forEach((p) => {
          if (!index[p.specimenSex]) index[p.specimenSex] = {};
          if (!index[p.specimenSex][p.biologicalSampleGroup]) {
            index[p.specimenSex][p.biologicalSampleGroup] = { total: 0 };
          }
          if (!index[p.specimenSex][p.biologicalSampleGroup][p.category]) {
            index[p.specimenSex][p.biologicalSampleGroup][p.category] = 0;
          }
          index[p.specimenSex][p.biologicalSampleGroup].total += 1;
          index[p.specimenSex][p.biologicalSampleGroup][p.category] += 1;
          if(!categories.includes(p.category))
          categories.push(p.category);
        });
        console.log(index);
        

        const series = [];
        Object.keys(index).forEach((sex) =>
          Object.keys(index[sex]).forEach((sampleGroup) => {
            categories.forEach((category) => {
              series.push({
                sex,
                sampleGroup,
                category,
                value:
                  ((index[sex][sampleGroup][category] || 0 )/
                    index[sex][sampleGroup].total) *
                  100,
              });
            });
          })
        );
        console.log(series);
        
        setCategoricalSeries(series);
      }
    })();
  }, []);

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
            <strong>Mavs data charts [Categorical]</strong>
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
        <Col lg={12}>
          <Card>
            <h2 className="primary">
              <CategoricalBarPlot series={categoricalSeries} zygosity="homozygote" />
            </h2>
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

export default Categorical;
