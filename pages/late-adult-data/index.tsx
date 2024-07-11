import Head from "next/head";
import Search from "@/components/Search";
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import Card from "@/components/Card";
import { useQuery } from "@tanstack/react-query";
import { fetchLandingPageData } from "@/api-service";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { LateAdultHeatmap } from "@/components";

const LateAdultDataPage = () => {

  const { data: allProd } = useQuery({
    queryKey: ["late-adult-heatmap", "all-procedures"],
    queryFn: () => fetchLandingPageData("late_adult_landing/procedure_level_data"),
    select: data => ({
      columns: data.columns,
      rows: data.rows.map((row, rowNum) => ({
        bin: rowNum,
        data: row,
        bins: row.significance.map((value, sigNum) => ({
          bin: sigNum,
          count: value
        }))
      })).splice(0, 10)
    }),
    placeholderData: () => ({ columns: [], rows: [] }),
  });

  return (
    <>
      <Head>
        <title>Late Adult Data | IMPC | International Mouse Phenotyping Consortium</title>
      </Head>
      <Search />
      <Container className="page" style={{lineHeight: 2}}>
        <Card>
          <div className="subheading">
            <Breadcrumb>
              <Breadcrumb.Item active>Home</Breadcrumb.Item>
              <Breadcrumb.Item active>IMPC data collections</Breadcrumb.Item>
              <Breadcrumb.Item active>Late Adult Data</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className="mb-4 mt-2">
            <strong>Late adult data</strong>
          </h1>
          <Container>
            <Row>
              <Col xs={12}>
                <p>
                  In a global effort to understand gene function, the IMPC is collecting phenotype data of
                  knockout mice at the <strong>embryo, early adult and late adult life stages</strong>.
                  Selected mouse lines enter the <strong>ageing pipeline</strong>, in which specimens are aged to see gene knockout effects later in life.
                </p>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col>
                <p>
                  Phenotype data is collected following standardized phenotyping pipelines, as described in&nbsp;
                  <a className="link primary" href="https://www.mousephenotype.org/impress">IMPReSS</a>,
                  which determines what procedures are performed, how and when. The&nbsp;
                  <a className="link primary" href="https://www.mousephenotype.org/understand/the-data/">Late Adult pipeline</a>
                  is based on the Early Adult pipeline,
                  with exclusion of some procedures. For example, hearing based tests can be excluded due to deafness in the baseline.
                  The testing for the Late Adult pipeline starts at <strong>52 weeks or later</strong>.
                  An “early adult” specimen is less than 16 weeks of age, a “middle aged adult” comprises mice between 16 and 48 weeks of age,
                  and a “late adult” is more than 48 weeks of age. A description of all pipelines can be found here.
                </p>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col>
                <p>
                  The diagram below shows <strong>all mouse lines for which the IMPC has collected ageing data up to now</strong>.
                  You can scroll down or use the box on the right-hand side to look for a gene of interest.
                  Clicking on the procedure name changes the diagram view to show the underlying parameters,
                  and you can return to the default view by clicking on the header.
                  Clicking on a cell opens up the <strong>“All data table” in the Gene page</strong>,
                  filtered for the selected late adult procedure or parameter,
                  in order to view the underlying data and the statistical tests that were applied.
                </p>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col>
                <p>
                  IMPC uses most recently <strong>approved gene symbols</strong>.
                  The search box above supports gene synonyms, MGI identifiers, and human gene symbols.
                  Please use it to find most recent mouse gene symbols.
                </p>
              </Col>
            </Row>
            <div className="mt-4">
              <h3>IMPC Late adult heat map</h3>
              {!!allProd && (
                <ParentSize>
                  {({ width }) => (
                    <LateAdultHeatmap
                      width={width}
                      data={allProd}
                    />
                  )}
                </ParentSize>
              )}
            </div>
          </Container>
        </Card>
      </Container>
    </>
  );
}

export default LateAdultDataPage;