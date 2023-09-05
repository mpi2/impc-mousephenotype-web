import Search from "../../components/Search";
import { Breadcrumb, Col, Container, Image, Row } from "react-bootstrap";
import Card from "../../components/Card";
import data from '../../mocks/data/landing-pages/cardiovascular.json';
import PieChart from "../../components/PieChart";
import SortableTable from "../../components/SortableTable";
import styles from './styles.module.scss';
import { useState } from "react";
import PublicationsList from "../../components/PublicationsList";
import ScatterChart from "../../components/ScatterChart";
import ChordDiagram from "../../components/ChordDiagram";


const ProcedureWithVersions = ({ procedure }) => {
  return (
    <li key={procedure.name}>
      { procedure.name }&nbsp;
      { procedure.versions.map(version => (
        <>
          <a
            key={version.impressId}
            className="link primary"
            href={'//www.mousephenotype.org/impress/protocol/' + version.impressId }
          >
            {version.name}
          </a>,&nbsp;
        </>
      )) }
    </li>
  )
}

const CardiovascularLandingPage = () => {
  const [ tableExtended, setTableExtended ] = useState(false);
  const phenotypeData = !tableExtended ? data.phenotypes.slice(0, 10) : data.phenotypes;
  return (
    <>
      <Search />
      <Container className="page" style={{lineHeight: 2}}>
        <Card>
          <div className="subheading">
            <Breadcrumb>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>IMPC data collections</Breadcrumb.Item>
              <Breadcrumb.Item>Cardiovascular</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className="mb-4 mt-2">
            <strong>Cardiovascular System</strong>
          </h1>
          <Container>
            <p>
              This page introduces cardiovascular related phenotypes present in mouse lines produced by the IMPC.
              The cardiovascular system refers to the observable morphological and physiological characteristics
              of the mammalian heart, blood vessels, or circulatory system that are manifested
              through development and lifespan.
            </p>
            <Row>
              <Col md={7}>
                <div className={styles.chartWrapper}>
                  {data && (
                    <PieChart
                      title=""
                      data={data.genesTested}
                      chartColors={['rgba(239, 123, 11,1.0)', 'rgba(9, 120, 161,1.0)', 'rgba(119, 119, 119,1.0)', 'rgba(238, 238, 180,1.0)']}
                    />
                  )}
                </div>
              </Col>
              <Col md={5}>
                <SortableTable
                  headers={[
                    { width: 1, label: "Phenotype", field: "key", disabled: true },
                    { width: 1, label: "# Genes", field: "value", disabled: true },
                  ]}
                >
                  {phenotypeData && phenotypeData.map(row => (
                    <tr key={row.id}>
                      <td>
                        <a href={'http://www.mousephenotype.org/data/phenotypes/' + row.id} >{ row.name }</a>
                      </td>
                      <td>
                        <a href={'http://www.mousephenotype.org/data/phenotypes/export/' + row.id} >{ row.noOfGenes }</a>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <a className="btn" onClick={() => setTableExtended(!tableExtended)}>
                        { tableExtended ? 'Show less': 'Show more' }
                      </a>
                    </td>
                    <td>
                      <a className="link primary" href="https://www.mousephenotype.org/data/phenotypes/export/MP:0005385?fileType=tsv&fileName=IMPC_Cardiovascular%20System">
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
            <Row>
              <h2>Approach</h2>
              <p>
                In order to identify the function of genes, the consortium uses a series of standardised protocols as
                described in IMPReSS (International Mouse Phenotyping Resource of Standardised Screens).
                <br/><br/>
                Heart and vascular function/physiology are measured through several procedures like echocardiography
                and electrocardiogram and non-invasive blood pressure.
                Cardiovascular system morphology is assessed through macroscopic and microscopic measurements,
                like heart weight, gross pathology and gross morphology in both embryo and adult animals.
                A complete list of protocols and related phenotypes are presented in the table below.
                Links to impress are provided for more details on the procedure.
              </p>
            </Row>
          </Container>
        </Card>
        <Card>
          <Container>
            <Row>
              <h2>Procedures that can lead to relevant phenotype associations</h2>
              <div>
                <h6>Young adult</h6>
                <ul>
                  {data && data.procedures.youngAdult.map(procedure => (
                    <ProcedureWithVersions procedure={procedure} />
                  ))}
                </ul>
              </div>
              <div>
                <h6>Embryo</h6>
                <ul>
                  {data && data.procedures.embryo.map(procedure => (
                    <ProcedureWithVersions procedure={procedure} />
                  ))}
                </ul>
              </div>
            </Row>
          </Container>
        </Card>
        <Card>
          <Container>
            <h1><strong>Phenotypes distribution</strong></h1>
            <p>
              This graph shows genes with a significant effect on at least one cardiovascular system phenotype.
            </p>
            <div className={styles.chartWrapper}>
              <ScatterChart
                title="Number of phenotype associations to Cardiovascular System"
                data={data.genes}
              />
            </div>
            <p>
              The following diagram represents the various biological system phenotypes associations for genes
              linked to cardiovascular system phenotypes.
              The line thickness is correlated with the strength of the association. <br/><br/>
              Clicking on chosen phenotype(s) on the diagram allow to select common genes. Corresponding gene lists can be downloaded using the download icon.
            </p>
            <ChordDiagram width={960} height={960} topTerms={["cardiovascular system phenotype"]}/>
          </Container>
        </Card>
        <Card>
          <Container>
            <h1><strong>Cardiovascular systemp IKMC/IMPC related publications</strong></h1>
            <PublicationsList />
          </Container>
        </Card>
      </Container>
    </>
  )

}

export default CardiovascularLandingPage;