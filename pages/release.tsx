import { Button, Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";
import Markdown from 'react-markdown'
import { NumberCell, PlainTextCell, SmartTable } from "@/components/SmartTable";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Head from "next/head";
import { Card, Search } from "@/components";
import { fetchLandingPageData } from "@/api-service";
import { groupBy, uniq } from 'lodash';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
);

type SampleCounts = {
  phenotypingCentre: string;
  mutantLines: number;
  mutantSpecimens: number;
  controlSpecimens: number;
};

type DataQualityCheck = {
  dataType: string;
  count: number;
};

type ProdStatusByCenter = {
  statusType: string;
  counts: Array<{ center: string; count: number; status: string; }>;
};

type ReleaseMetadata = {
  dataReleaseDate: string;
  dataReleaseNotes: string;
  dataReleaseVersion: string;
  genomeAssembly: { species: string; version: string };
  statisticalAnalysisPackage: { name: string; version: string };
  summaryCounts: { phenotypedGenes: number; phenotypedLines: number; phentoypeCalls: number; };
  dataQualityChecks: Array<DataQualityCheck>;
  phenotypeAnnotations: Array<{
    topLevelPhenotype: string;
    total: number;
    counts: Array<{ zygosity: string; count: number; }>;
  }>;
  phenotypeAssociationsByProcedure: Array<{
    procedure_name: string;
    total: number;
    counts: Array<{ lifeStage: string; count: number; }>;
  }>;
  productionStatusByCenter: Array<ProdStatusByCenter>;
  productionStatusOverall: Array<{
    statusType: string;
    counts: Array<{ count: number; status: string; }>;
  }>;
  sampleCounts: Array<SampleCounts>;
};

const valuePair = (key: string, value: string | number, enableJustify: boolean = false) => (
  <div style={enableJustify ? { display: "grid", gridTemplateColumns: "1fr 1fr" } : {}}>
    <span className="grey">{key}: </span>
    {typeof value === 'number' ? (
      <strong>{value.toLocaleString()}</strong>
    ) : (
      <strong>{value}</strong>
    )}
  </div>
);

type Props = {
  releaseMetadata: ReleaseMetadata;
}

const ReleaseNotesPage = (props: Props) => {
  const { releaseMetadata } = props;
  const [showAll, setShowAll] = useState(false);

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric'});
  };
  const findZygosityCount = (zygosity, p) => {
    return p.counts.find(count => count.zygosity === zygosity)?.count || 0;
  };
  const getProductionStatusByType = (statusArray, type: string) => {
    return statusArray.find(s => s.statusType === type)
      .counts
      .filter(count => count.status !== null);
  };

  const getProcedureCount = (type: 'Early adult'|'Late adult'|'Embryo', procedure) : number => {
    const embryoLifeStages = ['Embryo', 'E18.5', 'E9.5', 'E15.5', 'E12.5']
    switch (type) {
      case "Early adult":
      case "Late adult":
        return procedure.counts.find(c => c.lifeStage === type)?.count || 0;
      case "Embryo":
        return procedure.counts.find(c => embryoLifeStages.includes(c.lifeStage))?.count || 0;
    }
  };

  const getSortedProcedures = () => {
    return releaseMetadata.phenotypeAssociationsByProcedure.sort(
      ({procedure_name: p1}, {procedure_name: p2}) => {
        const embryoRegex = /E(\d+).5/;
        const p1IsEmbryoProd = p1.match(embryoRegex);
        const p2IsEmbryoProd = p2.match(embryoRegex);
        if (!p1IsEmbryoProd && !p2IsEmbryoProd) {
          return p1.localeCompare(p2)
        } else if (!!p1IsEmbryoProd && !p2IsEmbryoProd) {
          return -1
        } else if (!p1IsEmbryoProd && !!p2IsEmbryoProd) {
          return 1;
        } else {
          const p1EmbryoStage = Number.parseInt(p1IsEmbryoProd[1], 10);
          const p2EmbryoStage = Number.parseInt(p2IsEmbryoProd[1], 10);
          return p1EmbryoStage - p2EmbryoStage;
        }
      }
    )
  };

  const generateProdByCenterData = (data: Array<ProdStatusByCenter>, type: string) => {
    const dataByType = getProductionStatusByType(data, type);
    const labels = uniq(dataByType.map(c => {
      return c.status === 'Mouse Allele Modification Genotype Confirmed' ? 'Genotype Confirmed' : c.status
    })).sort() as Array<string>;
    const datasets = Object.values(groupBy(dataByType, 'center'))
      .map(centerData => {
        return {
          label: centerData[0].center,
          data: labels.map(label => {
            const realLabel = label === 'Genotype Confirmed' ? 'Mouse Allele Modification Genotype Confirmed' : label;
            const existingCount = centerData.find(d => d.status === realLabel);
            if (!!existingCount) {
              return existingCount.count;
            }
            return 0;
          }),
        }
      });
    return {
      labels,
      datasets
    };
  }

  const phenotypeAssociationsOpts = {
    maintainAspectRatio: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        title: { display: true, text: 'Number of genotype-phenotype associations' }
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    },
    interaction: {
      mode: 'index' as const
    }
  };

  const phenotypeAssociationsData = useMemo(() => ({
    labels: releaseMetadata.phenotypeAnnotations.map(phenotype => phenotype.topLevelPhenotype),
    datasets: [
      {
        label: 'Homozygote',
        data: releaseMetadata.phenotypeAnnotations.map(findZygosityCount.bind(null, 'homozygote')),
        backgroundColor: 'rgb(119, 119, 119)'
      },
      {
        label: 'Heterozygote',
        data: releaseMetadata.phenotypeAnnotations.map(findZygosityCount.bind(null, 'heterozygote')),
        backgroundColor: 'rgb(9, 120, 161)',
      },
      {
        label: 'Hemizygote',
        data: releaseMetadata.phenotypeAnnotations.map(findZygosityCount.bind(null, 'hemizygote')),
        backgroundColor: 'rgb(239, 123, 11)',
      }
    ]
  }), [releaseMetadata.phenotypeAnnotations]);

  const overallProdStatusOptions = {
    scales: {
      y: { title: { display: true, text: 'Number of genes' } }
    },
    plugins: {
      legend: {
        display: false,
      }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const prodByCenterStatusOptions = {
    scales: {
      x: { stacked: true },
      y: { stacked: true, title: { display: true, text: 'Number of genes' } }
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
      }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const genotypingStatusChartData = useMemo(() => ({
    labels: getProductionStatusByType(releaseMetadata.productionStatusOverall, 'genotyping').map(c => {
      return c.status === 'Mouse Allele Modification Genotype Confirmed' ? 'Genotype Confirmed' : c.status
    }),
    datasets: [
      {
        label: '',
        data: getProductionStatusByType(releaseMetadata.productionStatusOverall, 'genotyping').map(c => c.count),
        backgroundColor: 'rgb(239, 123, 11)'
      }
    ]
  }), [releaseMetadata.productionStatusOverall]);

  const phenotypingStatusChartData = useMemo(() => ({
    labels: getProductionStatusByType(releaseMetadata.productionStatusOverall, 'phenotyping').map(c => c.status),
    datasets: [
      {
        label: '',
        data: getProductionStatusByType(releaseMetadata.productionStatusOverall, 'phenotyping').map(c => c.count),
        backgroundColor: 'rgb(239, 123, 11)'
      }
    ]
  }), [releaseMetadata.productionStatusOverall]);

  const genotypingProdByCenterChartData = useMemo(() =>
    generateProdByCenterData(releaseMetadata.productionStatusByCenter, 'genotyping'),
    [releaseMetadata.productionStatusByCenter]
  );

  const phenotypingProdByCenterChartData = useMemo(() =>
      generateProdByCenterData(releaseMetadata.productionStatusByCenter, 'phenotyping'),
    [releaseMetadata.productionStatusByCenter]
  );

  const phenotypeCallsByProdOpts = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        title: { display: true, text: 'Number of phenotype calls' }
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    },
    interaction: {
      mode: 'index' as const
    }
  };

  const phenotypeCallsByProdData = useMemo(() => ({
    labels: getSortedProcedures().map(phenotype => phenotype['procedure_name']),
    datasets: [
      {
        label: 'Early Adult',
        data: getSortedProcedures().map(getProcedureCount.bind(null, 'Early adult')),
        backgroundColor: 'rgb(119, 119, 119)'
      },
      {
        label: 'Late Adult',
        data: getSortedProcedures().map(getProcedureCount.bind(null, 'Late adult')),
        backgroundColor: 'rgb(9, 120, 161)',
      },
      {
        label: 'Embryo',
        data: getSortedProcedures().map(getProcedureCount.bind(null, 'Embryo')),
        backgroundColor: 'rgb(239, 123, 11)',
      }
    ]
  }), [releaseMetadata.phenotypeAssociationsByProcedure]);

  return (
    <>
      <Head>
        <title>IMPC Data release {releaseMetadata.dataReleaseVersion} | International Mouse Phenotyping Consortium</title>
      </Head>
      <Search />
      <Container style={{ maxWidth: 1240 }} className="page">
        <Card>
          <p
            className="small caps mb-2 primary"
            style={{ letterSpacing: "0.1rem" }}
          >
            RELEASE NOTES
          </p>
          <h1 className="h1 mb-2">IMPC Data Release {releaseMetadata.dataReleaseVersion} Notes</h1>
          <p className="grey mb-3">{formatDate(releaseMetadata.dataReleaseDate)}</p>

          <Row className="mb-4">
            <Col lg={6}>
              <h3 className="mb-0 mt-3 mb-2">Summary</h3>
              {valuePair("Number of phenotyped genes", releaseMetadata.summaryCounts.phenotypedGenes, true)}
              {valuePair("Number of phenotyped mutant lines", releaseMetadata.summaryCounts.phenotypedLines, true)}
              {valuePair("Number of phenotype calls", releaseMetadata.summaryCounts.phentoypeCalls, true)}
            </Col>
            <Col lg={6}>
              <h3 className="mb-0 mt-3 mb-2">Data access</h3>
              <div className="mb-1">
                <a href="https://www.mousephenotype.org/help/non-programmatic-data-access" className="link orange-dark ">
                  FTP interface&nbsp;
                  <FontAwesomeIcon
                    icon={faExternalLink}
                    size="sm"
                    className="grey"
                  />
                </a>
              </div>
              <div>
                <a href="https://www.mousephenotype.org/help/programmatic-data-access" className="link orange-dark">
                  RESTful interfaces&nbsp;
                  <FontAwesomeIcon
                    icon={faExternalLink}
                    size="sm"
                    className="grey"
                  />
                </a>
              </div>
            </Col>
          </Row>

          {valuePair("Statistical package", `${releaseMetadata.statisticalAnalysisPackage.name} (${releaseMetadata.statisticalAnalysisPackage.version})`)}
          {valuePair("Genome Assembly", `${releaseMetadata.genomeAssembly.species} (${releaseMetadata.genomeAssembly.version})`)}

          <h3 className="mb-0 mt-5 mb-2">Highlights</h3>
          <Markdown>{releaseMetadata.dataReleaseNotes}</Markdown>
        </Card>
        <Card>
          <h2>Total number of lines and specimens in DR {releaseMetadata.dataReleaseVersion}</h2>
          <SmartTable<SampleCounts>
            data={releaseMetadata.sampleCounts}
            defaultSort={['phenotypingCentre', 'asc']}
            columns={[
              {width: 1, label: 'Phenotyping Center', field: 'phenotypingCentre', cmp: <NumberCell /> },
              {width: 1, label: 'Mutant Lines', field: 'mutantLines', cmp: <NumberCell /> },
              {width: 1, label: 'Baseline Mice', field: 'controlSpecimens', cmp: <NumberCell /> },
              {width: 1, label: 'Mutant Mice', field: 'mutantSpecimens', cmp: <NumberCell /> }
            ]}
          />
        </Card>
        <Card>
          <h2>Experimental data and quality checks</h2>
          <SmartTable<DataQualityCheck>
            data={releaseMetadata.dataQualityChecks}
            defaultSort={['count', 'desc']}
            columns={[
              {width: 1, label: 'Data Type', field: 'dataType', cmp: <PlainTextCell /> },
              {width: 1, label: 'QC Passed Data Points', field: 'count', cmp: <NumberCell /> },
            ]}
          />
          <span className="small">* Excluded from statistical analysis.</span>
        </Card>
        <Card>
          <h2>Distribution of phenotype annotations</h2>
          <div style={{ position: 'relative', height: '600px' }}>
            <Bar options={phenotypeAssociationsOpts} data={phenotypeAssociationsData} />
          </div>
        </Card>
        <Card>
          <h2>Production status</h2>
          <h3>Overall</h3>
          <Row className="mb-4">
            <Col lg={6}>
              <div style={{ position: 'relative', height: '400px' }}>
                <Bar options={overallProdStatusOptions} data={genotypingStatusChartData} />
              </div>
            </Col>
            <Col lg={6}>
              <div style={{position: 'relative', height: '400px'}}>
                <Bar options={overallProdStatusOptions} data={phenotypingStatusChartData}/>
              </div>
            </Col>
          </Row>
          <h3>By Center</h3>
          <Row className="mb-4">
            <Col lg={6}>
              <div style={{ position: 'relative', height: '400px' }}>
                <Bar options={prodByCenterStatusOptions} data={genotypingProdByCenterChartData} />
              </div>
            </Col>
            <Col lg={6}>
              <div style={{position: 'relative', height: '400px'}}>
                <Bar options={prodByCenterStatusOptions} data={phenotypingProdByCenterChartData}/>
              </div>
            </Col>
          </Row>
          <p>
            More charts and status information are available from our mouse
            tracking service <a className="link orange-dark">GenTaR</a>.
          </p>
        </Card>
        <Card>
          <h2>Phenotype associations</h2>
          <div style={{position: 'relative', height: '600px'}}>
            <Bar options={phenotypeCallsByProdOpts} data={phenotypeCallsByProdData}/>
          </div>
        </Card>

        <Card>
          <h2>Previous releases</h2>
          <ul>
            <li>
              <a href="/data/previous-releases/18.0">Release 18.0 notes</a>
            </li>

            <li>
              <a href="/data/previous-releases/17.0">Release 17.0 notes</a>
            </li>

            <li>
              <a href="/data/previous-releases/16.0">Release 16.0 notes</a>
            </li>

            <li>
              <a href="/data/previous-releases/15.1">Release 15.1 notes</a>
            </li>

            <li>
              <a href="/data/previous-releases/15.0">Release 15.0 notes</a>
            </li>

            {!showAll ? (
              <Button
                variant="outline-secondary"
                className="mt-2"
                onClick={() => {
                  setShowAll(true);
                }}
              >
                Show all releases
              </Button>
            ) : (
              <>
                <li>
                  <a href="/data/previous-releases/14.0">Release 14.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/13.0">Release 13.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/12.0">Release 12.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/11.0">Release 11.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/10.1">Release 10.1 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/10.0">Release 10.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/9.2">Release 9.2 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/9.1">Release 9.1 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/8.0">Release 8.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/7.0">Release 7.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/6.1">Release 6.1 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/6.0">Release 6.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/5.0">Release 5.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/4.3">Release 4.3 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/4.2">Release 4.2 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/4.0">Release 4.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/3.4">Release 3.4 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/3.3">Release 3.3 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/3.2">Release 3.2 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/3.1">Release 3.1 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/3.0">Release 3.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/2.0">Release 2.0 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/1.1">Release 1.1 notes</a>
                </li>

                <li>
                  <a href="/data/previous-releases/1.0">Release 1.0 notes</a>
                </li>
              </>
            )}
          </ul>
        </Card>
      </Container>
    </>
  );
};

export async function getStaticProps() {
  const data = await fetchLandingPageData("release_metadata");
  return {
    props: { releaseMetadata: data }
  };
}

export default ReleaseNotesPage;
