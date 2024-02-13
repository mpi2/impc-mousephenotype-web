import Search from "../components/Search";
import Card from "../components/Card";
import { Button, Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Markdown from 'react-markdown'
import mockData from '../mocks/data/release/release_metadata.json';
import { NumberCell, PlainTextCell, SmartTable } from "@/components/SmartTable";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
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
}

const valuePair = (key: string, value: string | number) => (
  <div>
    <span className="grey">{key}: </span>
    {typeof value === 'number' ? (
      <strong>{value.toLocaleString()}</strong>
    ) : (
      <strong>{value}</strong>
    )}
  </div>
);

const ReleaseNote = () => {
  const [showAll, setShowAll] = useState(false);

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric'});
  };
  const findZygosityCount = (p, zygosity) => {
    return p.counts.find(count => count.zygosity === zygosity)?.count || 0;
  };
  const getProductionStatusByType = (statusArray, type: string) => {
    return statusArray.find(s => s.statusType === type)
      .counts
      .filter(count => count.status !== null);
  };

  const getProcedureCount = (procedure, type: 'Early adult'|'Late adult'|'Embryo') : number => {
    const embryoLifeStages = ['Embryo', 'E18.5', 'E9.5', 'E15.5', 'E12.5']
    switch (type) {
      case "Early adult":
      case "Late adult":
        return procedure.counts.find(c => c.lifeStage === type)?.count || 0;
      case "Embryo":
        return procedure.counts.find(c => embryoLifeStages.includes(c.lifeStage))?.count || 0;
    }
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
    }
  };

  const phenotypeAssociationsData = {
    labels: mockData.phenotypeAnnotations.map(phenotype => phenotype.topLevelPhenotype),
    datasets: [
      {
        label: 'Homozygote',
        data: mockData.phenotypeAnnotations.map(p => findZygosityCount(p, 'homozygote')),
        backgroundColor: 'rgb(119, 119, 119)'
      },
      {
        label: 'Heterozygote',
        data: mockData.phenotypeAnnotations.map(p => findZygosityCount(p, 'heterozygote')),
        backgroundColor: 'rgb(9, 120, 161)',
      },
      {
        label: 'Hemizygote',
        data: mockData.phenotypeAnnotations.map(p => findZygosityCount(p, 'hemizygote')),
        backgroundColor: 'rgb(239, 123, 11)',
      }
    ]
  };

  const overallProdStatusOptions = {
    scales: {
      y: { title: { display: true, text: 'Number of genes' } }
    },
    plugins: {
      legend: {
        display: false,
      }
    }
  };

  const genotypingStatusChartData = {
    labels: getProductionStatusByType(mockData.productionStatus, 'genotyping').map(c => {
      return c.status === 'Mouse Allele Modification Genotype Confirmed' ? 'Genotype Confirmed' : c.status
    }),
    datasets: [
      {
        label: '',
        data: getProductionStatusByType(mockData.productionStatus, 'genotyping').map(c => c.count),
        backgroundColor: 'rgb(239, 123, 11)'
      }
    ]
  };

  const phenotypingStatusChartData = {
    labels: getProductionStatusByType(mockData.productionStatus, 'phenotyping').map(c => c.status),
    datasets: [
      {
        label: '',
        data: getProductionStatusByType(mockData.productionStatus, 'phenotyping').map(c => c.count),
        backgroundColor: 'rgb(239, 123, 11)'
      }
    ]
  };

  const phenotypeCallsByProdOpts = {
    maintainAspectRatio: true,
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
    }
  };

  const phenotypeCallsByProdData = {
    labels: mockData.phenotypeAssociationsByProcedure.map(phenotype => phenotype['procedure_name']),
    datasets: [
      {
        label: 'Early Adult',
        data: mockData.phenotypeAssociationsByProcedure.map(p => getProcedureCount(p, 'Early adult')),
        backgroundColor: 'rgb(119, 119, 119)'
      },
      {
        label: 'Late Adult',
        data: mockData.phenotypeAssociationsByProcedure.map(p => getProcedureCount(p, 'Late adult')),
        backgroundColor: 'rgb(9, 120, 161)',
      },
      {
        label: 'Embryo',
        data: mockData.phenotypeAssociationsByProcedure.map(p => getProcedureCount(p, 'Embryo')),
        backgroundColor: 'rgb(239, 123, 11)',
      }
    ]
  };

  return (
    <>
      <Search />
      <Container style={{ maxWidth: 1240 }} className="page">
        <Card>
          <p
            className="small caps mb-2 primary"
            style={{ letterSpacing: "0.1rem" }}
          >
            RELEASE NOTES
          </p>
          <h1 className="h1 mb-2">IMPC Data Release {mockData.dataReleaseVersion} Notes</h1>
          <p className="grey mb-3">{formatDate(mockData.dataReleaseDate)}</p>

          <Row className="mb-4">
            <Col lg={6}>
              <h3 className="mb-0 mt-3 mb-2">Summary</h3>
              {valuePair("Number of phenotyped genes", mockData.summaryCounts.phenotypedGenes)}
              {valuePair("Number of phenotyped mutant lines", mockData.summaryCounts.phenotypedLines)}
              {valuePair("Number of phenotype calls", mockData.summaryCounts.phentoypeCalls)}
            </Col>
            <Col lg={6}>
              <h3 className="mb-0 mt-3 mb-2">Data access</h3>
              <div className="mb-1">
                <a href="https://www.mousephenotype.org/help/non-programmatic-data-access" className="link orange-dark ">
                  Ftp interface&nbsp;
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

          {valuePair("Statistical package", `${mockData.statisticalAnalysisPackage.name} (${mockData.statisticalAnalysisPackage.version})`)}
          {valuePair("Genome Assembly", `${mockData.genomeAssembly.species} (${mockData.genomeAssembly.version})`)}

          <h3 className="mb-0 mt-5 mb-2">Highlights</h3>
          <p>
            <Markdown>{mockData.dataReleaseNotes}</Markdown>
          </p>
        </Card>
        <Card>
          <h2>Total number of lines and specimens in DR {mockData.dataReleaseVersion}</h2>
          <SmartTable<SampleCounts>
            data={mockData.sampleCounts}
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
            data={mockData.dataQualityChecks}
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

export default ReleaseNote;
