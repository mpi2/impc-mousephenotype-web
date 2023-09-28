import { Container, Breadcrumb, Row, Col, Image } from "react-bootstrap";
import Script from "next/script";

import Search from "../../components/Search";
import Card from "../../components/Card";
import styles from './styles.module.scss';
import SortableTable from "../../components/SortableTable";
import PieChart from "../../components/PieChart";
import { PublicationListProps } from "../../components/PublicationsList";
import data from '../../mocks/data/landing-pages/embryo.json';
import dynamic from "next/dynamic";
import EmbryoDataAvailabilityGrid from "../../components/EmbryoDataAvailabilityGrid";

const PublicationsList = dynamic<PublicationListProps>(
  () => import("../../components/PublicationsList"), {ssr: false}
);

type EmbryoLandingPageData = {
  primaryViability: Array<{ label: string; value: number }>;
  primaryViabilityChartData: Array<{ label: string; value: number }>;
  windowsOfLethality: Array<{ label: string; value: number }>;
}

const EmbryoLandingPage = () => {
  return (
    <>
      <Search />
      <Container className="page" style={{lineHeight: 2}}>
        <Card>
          <div className={styles.subheading}>
            <Breadcrumb>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>IMPC data collections</Breadcrumb.Item>
              <Breadcrumb.Item>Embryo Data</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className="mb-4 mt-2">
            <strong>Introduction to IMPC Embryo Data</strong>
          </h1>
          <Container>
            <Row>
              <Col xs={12} md={4} className="text-center">
                <Image className={styles.embryoImage} src="images/landing-pages/Tmem100_het.jpg" fluid />
              </Col>
              <Col xs={12} md={8}>
                <p>
                  Up to one third of homozygous knockout lines are lethal, which means no homozygous mice or less than expected
                  are observed past the weaning stage (IMPC <a className="link primary" href="https://beta.mousephenotype.org/impress/ProcedureInfo?action=list&procID=703&pipeID=7">Viability Primary Screen procedure</a>).
                  Early death may occur during embryonic development or soon after birth, during the pre-weaning stage.
                  For this reason, the IMPC established a <a className="link primary" href="https://beta.mousephenotype.org/impress">systematic embryonic phenotyping pipeline</a> to morphologically evaluate
                  mutant embryos to ascertain the primary perturbations that cause early death and thus gain insight into gene function.
                </p>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col>
                <p>Read more in our paper on&nbsp;
                  <a className="link primary" href="https://europepmc.org/article/PMC/5295821">
                    High-throughput discovery of novel developmental phenotypes, Nature 2016.
                  </a>
                </p>
              </Col>
            </Row>
          </Container>
        </Card>
        <Card>
          <Container>
            <h1><strong>IMPC Embryonic Pipeline</strong></h1>
            <p>
              As determined in IMPReSS (see interactive diagram here), all embryonic lethal lines undergo gross morphology
              assessment at E12.5 (embryonic day 12.5) to determine whether defects occur earlier or later
              during embryonic development. A comprehensive imaging platform is then used to assess dysmorphology.
              Embryo gross morphology, as well as 2D and 3D imaging are actively being implemented by the IMPC for lethal lines.
            </p>
            <div className="text-center">
              <Image src="images/landing-pages/IMPC-Embryo-Pipeline-Diagram.png" fluid />
            </div>
          </Container>
        </Card>
        <Card>
          <Container>
            <h1><strong>Determining Lethal Lines</strong></h1>
            <p>
              The IMPC assesses each gene knockout line for viability (Viability Primary Screen &nbsp;
              <a className="link primary" href="https://beta.mousephenotype.org/impress/ProcedureInfo?action=list&procID=703&pipeID=7">IMPC_VIA_001</a>
              &nbsp;and <a className="link primary" href="https://beta.mousephenotype.org/impress/ProcedureInfo?action=list&procID=1188&pipeID=7#Parameters">IMPC_VIA_002</a>).
              In this procedure, the proportion of homozygous pups is determined soon after birth, during the preweaning stage,
              in litters produced from mating heterozygous animals. A line is declared lethal if no homozygous pups
              for the null allele are detected at weaning age, and subviable if pups homozygous for the null allele
              constitute less than 12.5% of the litter.
            </p>
            <Row className="mb-3">
              <Col md={7}>
                <div className={styles.chartWrapper}>
                  {data && (
                    <PieChart
                      title="Primary Viability"
                      data={data.primaryViabilityChartData}
                    />
                  )}
                </div>
              </Col>
              <Col md={5}>
                <SortableTable
                    headers={[
                      { width: 1, label: "Category", field: "key", disabled: true },
                      { width: 1, label: "Lines", field: "value", disabled: true },
                    ]}
                >
                  {data && data.primaryViability.map(row => (
                    <tr>
                      <td>{ row.label }</td>
                      <td>{ row.value }</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={2}>
                      <a className="link primary" href="https://ftp.ebi.ac.uk/pub/databases/impc/all-data-releases/latest/results/viability.csv.gz">
                        Download
                      </a>
                    </td>
                  </tr>
                </SortableTable>
              </Col>
            </Row>
            <Row>
              <p>
                Lethal strains are further phenotyped in the <a className="link primary" href="https://beta.mousephenotype.org/impress">embryonic phenotyping pipeline</a>.
                For embryonic lethal and subviable strains, heterozygotes are phenotyped in the IMPC <a className="link primary" href="https://beta.mousephenotype.org/impress">adult phenotyping pipeline</a>.
              </p>
            </Row>
            <Row>
              <Col md={7}>
                <div className={styles.chartWrapper}>
                  {data && (
                    <PieChart
                      title="Secondary Viability / Windows of Lethality"
                      data={data.windowsOfLethality}
                    />
                  )}
                </div>
              </Col>
              <Col md={5}>
                <SortableTable
                  headers={[
                    { width: 1, label: "Category", field: "key", disabled: true },
                    { width: 1, label: "Lines", field: "value", disabled: true },
                  ]}
                >
                  {data && data.windowsOfLethality.map(row => (
                    <tr>
                      <td>{ row.label }</td>
                      <td>{ row.value }</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={2}>
                      <a className="link primary" href="https://impc-datasets.s3.eu-west-2.amazonaws.com/embryo-landing-assets/wol_all.csv">
                        Download
                      </a>
                    </td>
                  </tr>
                </SortableTable>
              </Col>
            </Row>
          </Container>
        </Card>
        <Card>
          <Container>
            <h1><strong>Embryo Data Availability Grid</strong></h1>
            <Row>
              <Col>
                <p>Filter by Window of Lethality</p>
                <EmbryoDataAvailabilityGrid />
              </Col>
            </Row>
          </Container>
        </Card>
        <Card>
          <Container>
            <h1><strong>Accessing Embryo Phenotype Data</strong></h1>
            <Row>
              <Col>
                <p>Embryo phenotye data can be accessed in multiple ways:</p>
                <ul>
                  <li>
                    <a className="link primary" href="https://beta.mousephenotype.org/data/embryo_imaging">Embryo Images: interactive heatmap</a>
                    &nbsp;A compilation of all our Embryo Images,
                    organised by gene and life stage, with access to the Interactive Embryo Viewer,
                    where you can compare mutants and wild types side by side and rotate 2D and 3D images;
                    we also provide access to our external partners' embryo images.
                  </li>
                  <li>
                    <a className="link primary" href="https://beta.mousephenotype.org/data/embryo/vignettes">Embryo Vignettes</a>
                    &nbsp;Showcase of best embryo images with detailed explanations.
                  </li>
                  <li>
                    <a className="link primary" href="ftp://ftp.ebi.ac.uk/pub/databases/impc/all-data-releases/latest/results/">
                      From the FTP site, latest release
                    </a>
                    &nbsp;All our results.
                    Reports need to be filtered by a dedicated column, Life Stage (E9.5, E12.5, E15.5 and E18.5).
                    Please check the README file or see documentation here.
                  </li>
                  <li>
                    Using the REST API (see documentation <a className="link primary" href="https://www.mousephenotype.org/help/programmatic-data-access/">here</a>)
                  </li>
                </ul>
              </Col>
            </Row>
          </Container>
        </Card>
        <Card>
          <Container>
            <h1><strong>IKMC/IMPC related publications</strong></h1>
            <PublicationsList prefixQuery="embryo" />
          </Container>
        </Card>
      </Container>
    </>
  )
};

export default EmbryoLandingPage;