import Search from "@/components/Search";
import Card from "@/components/Card";
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import data from '../../mocks/data/landing-pages/hearing.json';
import { SmartTable, SimpleTextCell } from "@/components/SmartTable";

type GeneHearingData = {
  geneSymbol: string;
  zygosity: string;
  status: string;
  hearingLoss: string;
};

const HearingLandingPage = () => {
  return (
    <>
      <Search />
      <Container className="page" style={{lineHeight: 2}}>
        <Card>
          <div className="subheading">
            <Breadcrumb>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>IMPC data collections</Breadcrumb.Item>
              <Breadcrumb.Item>Hearing Data</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className="mb-4 mt-2">
            <strong>IMPC Hearing Data</strong>
          </h1>
          <Container>
            <Row>
              <Col xs={12}>
                <p>
                  The IMPC is hunting unknown genes responsible for hearing loss by screening knockout mice.
                  Worldwide, 360 million people live with mild to profound hearing loss. Notably, 70% hearing loss
                  occurs as an isolated condition (non-syndromic) and 30% with additional phenotypes (syndromic).
                  The vast majority of genes responsible for hearing loss are unknown.
                </p>
                <ul>
                  <li>
                    Press releases: <a className="primary link" href="https://www.ebi.ac.uk/about/news/press-releases/hearing-loss-genes/">EMBL-EBI</a>&nbsp;|&nbsp;
                    <a className="primary link" href="https://www.mrc.ac.uk/news/browse/genes-critical-for-hearing-identified/">MRC</a>&nbsp;|&nbsp;
                    <a className="primary link" href="https://www.mousephenotype.org/blog/2018/04/06/novel-hearing-loss-genes-identified-in-large-study-by-scientists-across-the-world/">IMPC</a>&nbsp;|&nbsp;
                  </li>
                  <li>
                    <a className="primary link" href="http://bit.ly/IMPCDeafness">Nature Communications (released 12/10/2017)</a>
                  </li>
                  <li>
                    <a className="primary link" href="https://static-content.springer.com/esm/art%3A10.1038%2Fs41467-017-00595-4/MediaObjects/41467_2017_595_MOESM1_ESM.pdf">Supplementary Material</a>
                  </li>
                </ul>
              </Col>
            </Row>
          </Container>
        </Card>
        <Card>
          <h1 className="mb-4 mt-2">
            <strong>Approach</strong>
          </h1>
          <p>
            In order to identify the function of genes, the consortium uses a series of response (ABR) test conducted at 14 weeks of age.
            Hearing is assessed at five frequencies – 6kHz, 12kHz, 18kHz, 24kHz and 30kHz – as well as a broadband click stimulus.
            Increased thresholds are indicative of abnormal hearing.
            Abnormalities in adult ear morphology are recorded as part of the&nbsp;
            <a className="primary link" href="https://www.mousephenotype.org/impress/protocol/186">Combined SHIRPA and Dysmorphology (CSD)</a> protocol,
            which includes a response to a click box test (absence is indicative of a strong hearing deficit)
            and visual inspection for behavioural signs that may indicate vestibular dysfunction e.g. head bobbing or circling.
          </p>
          <h2>Procedures that can lead to relevant phenotype associations</h2>
          <span>Young Adult:</span>
          <ul>
            {data.proceduresYoungAdult.map(prod => (
              <li>
                {prod.title}:&nbsp;
                {prod.items.map(item => (
                  <>
                    <a
                      className="primary link"
                      href={`//www.mousephenotype.org/impress/protocol/${item.procedureId}`}>
                      {item.name},&nbsp;
                    </a>
                  </>
                ))}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2>IMPC Deafness Publication</h2>
          <h3>Hearing loss investigated in 3,006 knockout mouse lines</h3>
          <p>
            <a className="link primary" href="http://bit.ly/IMPCDeafness">A large scale hearing loss screen reveals an extensive unexplored genetic landscape for auditory dysfunction.</a>
          </p>
          <ul>
            <li>67 genes identified as candidate hearing loss genes</li>
            <li>52 genes are not previously associated with hearing loss and encompass a
              wide
              range of functions from structural proteins to transcription factors
            </li>
            <li>Among the novel candidate genes, <i>Atp2b1</i> is expressed in the inner
              ear and
              <i>Sema3f</i> plays a role in sensory hair cell innervation in the
              cochlea
            </li>
            <li>The IMPC will continue screening for hearing loss mutants in its second
              5 year
              phase
            </li>
          </ul>
          <h3>Methods</h3>
          <p>Response data from the <a className="link primary" href="https://www.mousephenotype.org/impress/protocol/149/7">Auditory
            Brain Stem response (ABR)</a> test was used – hearing at five frequencies,
            6kHz, 12kHz, 18kHz,
            24kHz and
            30kHz was measured.
          </p>
          <ul>
            <li>Control wildtype mice from each phenotypic centre included, matched for
              gender, age,
              phenotypic pipeline and metadata (e.g. instrument)
            </li>
            <li>Our production statistical approach that automatically detects mutants
              with abnormal hearing
              was manually curated to yield 67 genes with profound hearing loss
            </li>
          </ul>
        </Card>
        <Card>
          <h2>Gene table</h2>
          <SmartTable<GeneHearingData>
            data={data.genes}
            defaultSort={["geneSymbol", "asc"]}
            columns={[
              { width: 1, label: "Gene symbol", field: "geneSymbol", cmp: SimpleTextCell },
              { width: 1, label: "Zygosity", field: "zygosity", cmp: SimpleTextCell },
              { width: 1, label: "Status", field: "status", cmp: SimpleTextCell },
              { width: 1, label: "Hearing loss", field: "hearingLoss", cmp: SimpleTextCell },
            ]}
          />
        </Card>
      </Container>
    </>
  )

};

export default HearingLandingPage;