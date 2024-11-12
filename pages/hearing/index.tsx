import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import data from "../../mocks/data/landing-pages/hearing.json";
import { SmartTable, PlainTextCell } from "@/components/SmartTable";
import { mutantChartColors, wildtypeChartColors } from "@/utils/chart";
import { Chart } from "react-chartjs-2";
import errorbarsPlugin from "@/utils/chart/errorbars.plugin";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import Link from "next/link";
import Head from "next/head";
import {
  AlleleSymbol,
  Card,
  NonSSRPublicationsList,
  PublicationDataAlert,
  PleiotropyChart,
  Search,
} from "@/components";
import { ParentSize } from "@visx/responsive";
import { usePleiotropyQuery } from "@/hooks";
import { SortType } from "@/models";
import { useMemo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineController,
  BarController
);

type GeneHearingData = {
  geneSymbol: string;
  zygosity: string;
  status: string;
  hearingLoss: string;
};

const ABRChart = ({ geneData }) => {
  const getChartLabels = () => {
    return [
      "Click-evoked ABR threshold",
      null,
      "6kHz-evoked ABR Threshold",
      "12kHz-evoked ABR Threshold",
      "18kHz-evoked ABR Threshold",
      "24kHz-evoked ABR Threshold",
      "30kHz-evoked ABR Threshold",
    ];
  };

  const getPointStyle = (zygosity, sex) => {
    if (zygosity === "WT" && sex === "Male") {
      return "rectRot";
    } else if (zygosity === "WT" && sex === "Female") {
      return "rect";
    } else if (zygosity !== "WT" && sex === "Male") {
      return "circle";
    } else if (zygosity !== "WT" && sex === "Female") {
      return "triangle";
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    scales: {
      y: {
        min: 0,
        max: 120,
        title: {
          display: true,
          text: "dB SPL",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { usePointStyle: true },
      },
      tooltip: {
        usePointStyle: true,
        title: { padding: { top: 10 } },
        callbacks: {
          label: (ctx) => {
            const minValue = ctx.raw.yMin.toFixed(2);
            const maxValue = ctx.raw.yMax.toFixed(2);
            return `${ctx.dataset.label}: ${ctx.formattedValue} (SD: ${minValue} - ${maxValue})`;
          },
        },
      },
    },
  };
  const processData = () => {
    return geneData.map((dataset) => {
      const sexKey = dataset.sex === "female" ? "Female" : "Male";
      const zygLabel =
        dataset.zygosity === "wildtype"
          ? "WT"
          : dataset.zygosity === "heterozygote"
          ? "Het"
          : "Hom";
      const label = `${sexKey} ${zygLabel}`;
      return {
        type: "line" as const,
        label: label,
        data: dataset.values.map((val, index) => {
          if (val === null) {
            return { x: null, y: null };
          }
          const { min, max } = dataset.sd[index];
          return {
            y: val,
            yMin: min,
            yMax: max,
            x: getChartLabels()[index],
          };
        }),
        borderColor:
          zygLabel === "WT"
            ? wildtypeChartColors.fullOpacity
            : mutantChartColors.fullOpacity,
        backgroundColor:
          zygLabel === "WT"
            ? wildtypeChartColors.halfOpacity
            : mutantChartColors.halfOpacity,
        pointStyle: getPointStyle(zygLabel, sexKey),
      };
    });
  };

  const chartData = {
    labels: getChartLabels(),
    datasets: processData(),
  };

  const chartPlugins = [errorbarsPlugin];

  return (
    <>
      <div style={{ textAlign: "center", marginTop: "1.5em" }}>
        <h3 style={{ marginBottom: 0 }}>
          Evoked ABR Threshold (6, 12, 18, 24, 30kHz)
        </h3>
        <a
          className="primary link"
          href="https://www.mousephenotype.org/impress/ProcedureInfo?action=list&procID=542"
        >
          Auditory Brain Stem Response
        </a>
      </div>
      <div style={{ position: "relative", height: "300px" }}>
        <Chart
          type="bar"
          data={chartData}
          options={chartOptions}
          plugins={chartPlugins}
        />
      </div>
    </>
  );
};

const HearingLandingPage = () => {
  const { data: pleiotropyData, isLoading } = usePleiotropyQuery(
    "hearing/vestibular/ear"
  );
  const defaultSort: SortType = useMemo(() => ["geneSymbol", "asc"], []);
  return (
    <>
      <Head>
        <title>Hearing | International Mouse Phenotyping Consortium</title>
      </Head>
      <Search />
      <Container className="page" style={{ lineHeight: 2 }}>
        <Card>
          <div className="subheading">
            <Breadcrumb>
              <Breadcrumb.Item active>Home</Breadcrumb.Item>
              <Breadcrumb.Item active>IMPC data collections</Breadcrumb.Item>
              <Breadcrumb.Item active>Hearing Data</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className="mb-4 mt-2">
            <strong>IMPC Hearing Data</strong>
          </h1>
          <PublicationDataAlert dataReleaseVersion="5.0">
            <p>
              This publication page originally used the Data Release 5.0 <br />
              The procedures and genes has not changed since then but the
              vignettes are displaying data from the latest Data Release.
            </p>
          </PublicationDataAlert>
          <Container>
            <Row>
              <Col xs={12}>
                <p>
                  The IMPC is hunting unknown genes responsible for hearing loss
                  by screening knockout mice. Worldwide, 360 million people live
                  with mild to profound hearing loss. Notably, 70% hearing loss
                  occurs as an isolated condition (non-syndromic) and 30% with
                  additional phenotypes (syndromic). The vast majority of genes
                  responsible for hearing loss are unknown.
                </p>
                <ul>
                  <li>
                    Press releases:{" "}
                    <a
                      className="primary link"
                      href="https://www.ebi.ac.uk/about/news/press-releases/hearing-loss-genes/"
                    >
                      EMBL-EBI
                    </a>
                    &nbsp;|&nbsp;
                    <a
                      className="primary link"
                      href="https://www.mrc.ac.uk/news/browse/genes-critical-for-hearing-identified/"
                    >
                      MRC
                    </a>
                    &nbsp;|&nbsp;
                    <a
                      className="primary link"
                      href="https://www.mousephenotype.org/blog/2018/04/06/novel-hearing-loss-genes-identified-in-large-study-by-scientists-across-the-world/"
                    >
                      IMPC
                    </a>
                    &nbsp;|&nbsp;
                  </li>
                  <li>
                    <a
                      className="primary link"
                      href="http://bit.ly/IMPCDeafness"
                    >
                      Nature Communications (released 12/10/2017)
                    </a>
                  </li>
                  <li>
                    <a
                      className="primary link"
                      href="https://static-content.springer.com/esm/art%3A10.1038%2Fs41467-017-00595-4/MediaObjects/41467_2017_595_MOESM1_ESM.pdf"
                    >
                      Supplementary Material
                    </a>
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
            In order to identify the function of genes, the consortium uses a
            series of response (ABR) test conducted at 14 weeks of age. Hearing
            is assessed at five frequencies – 6kHz, 12kHz, 18kHz, 24kHz and
            30kHz – as well as a broadband click stimulus. Increased thresholds
            are indicative of abnormal hearing. Abnormalities in adult ear
            morphology are recorded as part of the&nbsp;
            <a
              className="primary link"
              href="https://www.mousephenotype.org/impress/protocol/186"
            >
              Combined SHIRPA and Dysmorphology (CSD)
            </a>{" "}
            protocol, which includes a response to a click box test (absence is
            indicative of a strong hearing deficit) and visual inspection for
            behavioural signs that may indicate vestibular dysfunction e.g. head
            bobbing or circling.
          </p>
          <h2>Procedures that can lead to relevant phenotype associations</h2>
          <span>Young Adult:</span>
          <ul>
            {data.proceduresYoungAdult.map((prod, index) => (
              <li key={index}>
                {prod.title}:&nbsp;
                {prod.items.map((item, indexItems) => (
                  <a
                    key={indexItems}
                    className="primary link"
                    href={`//www.mousephenotype.org/impress/protocol/${item.procedureId}`}
                  >
                    {item.name},&nbsp;
                  </a>
                ))}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2>IMPC Deafness Publication</h2>
          <h3>Hearing loss investigated in 3,006 knockout mouse lines</h3>
          <p>
            <a className="link primary" href="http://bit.ly/IMPCDeafness">
              A large scale hearing loss screen reveals an extensive unexplored
              genetic landscape for auditory dysfunction.
            </a>
          </p>
          <ul>
            <li>67 genes identified as candidate hearing loss genes</li>
            <li>
              52 genes are not previously associated with hearing loss and
              encompass a wide range of functions from structural proteins to
              transcription factors
            </li>
            <li>
              Among the novel candidate genes, <i>Atp2b1</i> is expressed in the
              inner ear and
              <i>Sema3f</i> plays a role in sensory hair cell innervation in the
              cochlea
            </li>
            <li>
              The IMPC will continue screening for hearing loss mutants in its
              second 5 year phase
            </li>
          </ul>
          <h3>Methods</h3>
          <p>
            Response data from the{" "}
            <a
              className="link primary"
              href="https://www.mousephenotype.org/impress/protocol/149/7"
            >
              Auditory Brain Stem response (ABR)
            </a>{" "}
            test was used – hearing at five frequencies, 6kHz, 12kHz, 18kHz,
            24kHz and 30kHz was measured.
          </p>
          <ul>
            <li>
              Control wildtype mice from each phenotypic centre included,
              matched for gender, age, phenotypic pipeline and metadata (e.g.
              instrument)
            </li>
            <li>
              Our production statistical approach that automatically detects
              mutants with abnormal hearing was manually curated to yield 67
              genes with profound hearing loss
            </li>
          </ul>
        </Card>
        <Card>
          <h2>Gene table</h2>
          <SmartTable<GeneHearingData>
            data={data.genes}
            defaultSort={defaultSort}
            columns={[
              {
                width: 1,
                label: "Gene symbol",
                field: "geneSymbol",
                cmp: <PlainTextCell style={{ fontStyle: "italic" }} />,
              },
              {
                width: 1,
                label: "Zygosity",
                field: "zygosity",
                cmp: <PlainTextCell />,
              },
              {
                width: 1,
                label: "Status",
                field: "status",
                cmp: <PlainTextCell />,
              },
              {
                width: 1,
                label: "Hearing loss",
                field: "hearingLoss",
                cmp: <PlainTextCell />,
              },
            ]}
          />
        </Card>
        <Card>
          <h2>Vignettes</h2>
          <Container>
            <Row>
              <Col>
                <div style={{ textAlign: "center" }}>
                  <h2 style={{ marginBottom: 0 }}>Novel, mild hearing loss</h2>
                  <Link
                    className="primary link"
                    href={`/genes/${data.adgrb1.mgiGeneAccessionId}`}
                  >
                    <AlleleSymbol
                      symbol={data.adgrb1.alleleSymbol}
                      withLabel={false}
                    />
                  </Link>
                </div>
                <ABRChart geneData={data.adgrb1.values} />
              </Col>
              <Col>
                <div style={{ textAlign: "center" }}>
                  <h2 style={{ marginBottom: 0 }}>Know, severe hearing loss</h2>
                  <Link
                    className="primary link"
                    href={`/genes/${data.elmod1.mgiGeneAccessionId}`}
                  >
                    <AlleleSymbol
                      symbol={data.elmod1.alleleSymbol}
                      withLabel={false}
                    />
                  </Link>
                </div>
                <ABRChart geneData={data.elmod1.values} />
              </Col>
            </Row>
            <Row className="mt-5">
              <Col>
                <div style={{ textAlign: "center" }}>
                  <h2 style={{ marginBottom: 0 }}>
                    Novel, high-frequency hearing loss
                  </h2>
                  <Link
                    className="primary link"
                    href={`/genes/${data.ccdc88c.mgiGeneAccessionId}`}
                  >
                    <AlleleSymbol
                      symbol={data.ccdc88c.alleleSymbol}
                      withLabel={false}
                    />
                  </Link>
                </div>
                <ABRChart geneData={data.ccdc88c.values} />
              </Col>
              <Col>
                <div style={{ textAlign: "center" }}>
                  <h2 style={{ marginBottom: 0 }}>
                    Novel, severe hearing loss
                  </h2>
                  <Link
                    className="primary link"
                    href={`/genes/${data.zfp719.mgiGeneAccessionId}`}
                  >
                    <AlleleSymbol
                      symbol={data.zfp719.alleleSymbol}
                      withLabel={false}
                    />
                  </Link>
                </div>
                <ABRChart geneData={data.zfp719.values} />
              </Col>
            </Row>
          </Container>
        </Card>
        <Card>
          <h2>Phenotypes distribution</h2>
          <div style={{ position: "relative", height: "500px" }}>
            <ParentSize
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              {({ width, height }) => (
                <PleiotropyChart
                  title="Number of phenotype associations to Hearing"
                  phenotypeName="Hearing"
                  data={pleiotropyData}
                  isLoading={isLoading}
                  width={width}
                  height={height}
                />
              )}
            </ParentSize>
          </div>
        </Card>
        <Card>
          <Container>
            <h1>
              <strong>IKMC/IMPC related publications</strong>
            </h1>
            <NonSSRPublicationsList prefixQuery="hearing" />
          </Container>
        </Card>
      </Container>
    </>
  );
};

export default HearingLandingPage;
