import Head from "next/head";
import Search from "@/components/Search";
import { Breadcrumb, Col, Container, Row, Image } from "react-bootstrap";
import { Card } from "@/components";
import data from "../../mocks/data/landing-pages/idg.json";
import PieChart from "@/components/PieChart";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import ChordDiagram from "@/components/ChordDiagram";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const IDGPage = () => {
  const geneProductionStatusData = data.geneProductionStatusData || [];

  const idgGenesProductionStatusOptions = {
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'IDG genes IMPC production status'
      }
    },
    interaction: {
      mode: 'index' as const
    }
  };

  const idgGenesProductionStatusData = useMemo(() => ({
    labels: geneProductionStatusData.map(status => status.label),
    datasets: [{
      label: '',
      data: geneProductionStatusData.map(s => s.value),
      backgroundColor: 'rgb(247, 157, 70)'
    }],
  }), [geneProductionStatusData]);

  return (
    <>
      <Head>
        <title>IDG page | International Mouse Phenotyping Consortium</title>
      </Head>
      <Search />
      <Container className="page">
        <Card>
          <div className="subheading">
            <Breadcrumb>
              <Breadcrumb.Item active>Home</Breadcrumb.Item>
              <Breadcrumb.Item active>IMPC data collections</Breadcrumb.Item>
              <Breadcrumb.Item active>IDG</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className="mb-4 mt-2">
            <strong>Illuminating the Druggable Genome (IDG)</strong>
          </h1>
          <Container>
            <Row>
              <Col xs={9}>
                <p>
                  <a className="primary link" href="https://commonfund.nih.gov/idg/index">IDG</a>
                  is an NIH Common Fund project focused on collecting, integrating and making available biological
                  data on 278 human genes from three key druggable protein families that have been identified
                  as potential therapeutic targets: non-olfactory G-protein coupled receptors (GPCRs), ion channels,
                  and protein kinases. The <a className="primary link" href="https://www.mousephenotype.org/about-impc/">IMPC
                  consortium</a> is creating knockout mouse strains for the IDG project to
                  better understand the function of these proteins.
                </p>
              </Col>
              <Col xs={3}>
                <Image style={{ maxWidth: '100%' }} src="/images/landing-pages/idgLogo.png"/>
              </Col>
            </Row>
          </Container>
        </Card>
        <Card>
          <Row>
            <Col className="mb-4" xs={12}>
              <h2>IMPC data representation for IDG genes</h2>
              <p>
                IDG human genes are mapped to mouse orthologs using&nbsp;
                <a className="primary link" href="https://www.genenames.org/tools/hcop/">HCOP</a>.
                The <a className="primary link" href="//www.mousephenotype.org/about-impc/">IMPC consortium</a>&nbsp;is
                using different&nbsp;
                <a className="primary link" href="https://mousephenotype.org/help/#howdoesimpcwork">complementary
                  targeting strategies</a>
                &nbsp;to produce Knockout strains.
                Mice are produced and submitted to standardised phenotyping pipelines.
                Currently 63.7 % of mouse IDG gene have data representation in IMPC, the bar charts and heatmap below
                capture the IMPC data representation at different levels.
                The percentage might increase as we get more data and this page will reflect the change.
              </p>
            </Col>
            <Col xs={6}>
              <div style={{ position: "relative", height: '300px' }}>
                <PieChart
                  title="IDG genes IMPC data status"
                  data={data.orthologPieData}
                  chartColors={['rgb(247, 157, 70)', 'rgb(194, 194, 194)']}
                />
              </div>
            </Col>
            <Col xs={6}>
              <div style={{ position: "relative", height: '300px' }}>
                <Bar options={idgGenesProductionStatusOptions} data={idgGenesProductionStatusData} />
              </div>
            </Col>
          </Row>
        </Card>
        <Card>
          <h2>Phenotype Associations</h2>
          <p>
            The following chord diagrams represent the various biological systems phenotype associations for IDG genes
            categorized both in all and in each family group. The line thickness is correlated with the strength of the
            association.
            Clicking on chosen phenotype(s) on the diagram allow to select common genes. Corresponding gene lists can be
            downloaded using the download icon.
          </p>
        </Card>
        <Card>
          <h3>All families</h3>
          <p>
            <b>{ data.allFamiliesChordData.totalcount }</b> genes have phenotypes in more than one biological system.
            The chord diagram below shows the pleiotropy between these genes.
            <br/>
            <a
              className="link primary"
              href="https://www.mousephenotype.org/data/chordDiagram.csv?&idg=true"
              download="genes_phenotype_associations.csv"
            >
              Get the genes and associated phenotypes.
            </a>
          </p>
          <ChordDiagram
            labels={data.allFamiliesChordData.labels}
            data={data.allFamiliesChordData.matrix}
          />
        </Card>
        <Card>
          <h3>Ion channels</h3>
          <p>
            <b>{ data.ionChannelChordData.totalcount }</b> genes have phenotypes in more than one biological system.
            The chord diagram below shows the pleiotropy between these genes.
            <br/>
            <a
              className="link primary"
              href="https://www.mousephenotype.org/data/chordDiagram.csv?&idg=true&idgClass=IonChannel"
              download="genes_phenotype_associations.csv"
            >
              Get the genes and associated phenotypes.
            </a>
          </p>
          <ChordDiagram
            labels={data.ionChannelChordData.labels}
            data={data.ionChannelChordData.matrix}
          />
        </Card>
        <Card>
          <h3>GPCRs</h3>
          <p>
            <b>{ data.GPCRChordData.totalcount }</b> genes have phenotypes in more than one biological system.
            The chord diagram below shows the pleiotropy between these genes.
            <br/>
            <a
              className="link primary"
              href="https://www.mousephenotype.org/data/chordDiagram.csv?&idg=true&idgClass=IonChannel"
              download="genes_phenotype_associations.csv"
            >
              Get the genes and associated phenotypes.
            </a>
          </p>
          <ChordDiagram
            labels={data.GPCRChordData.labels}
            data={data.GPCRChordData.matrix}
          />
        </Card>
        <Card>
          <h3>Kinases</h3>
          <p>
            <b>{ data.kinaseChordData.totalcount }</b> genes have phenotypes in more than one biological system.
            The chord diagram below shows the pleiotropy between these genes.
            <br/>
            <a
              className="link primary"
              href="https://www.mousephenotype.org/data/chordDiagram.csv?&idg=true&idgClass=IonChannel"
              download="genes_phenotype_associations.csv"
            >
              Get the genes and associated phenotypes.
            </a>
          </p>
          <ChordDiagram
            labels={data.kinaseChordData.labels}
            data={data.kinaseChordData.matrix}
          />
        </Card>
      </Container>
    </>
  )
};

export default IDGPage;