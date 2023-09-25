import Search from "../../components/Search";
import { Container, Tab, Tabs } from "react-bootstrap";
import Card from "../../components/Card";
import PublicationsList from "../../components/PublicationsList";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import colorsPlugin from '../../utils/chart/color.plugin';
import dataLabelsPlugin from 'chartjs-plugin-datalabels';
import styles from './styles.module.scss';
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "../../api-service";
import SortableTable from "../../components/SortableTable";
import { faTable, faChartBar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "../../components/Pagination";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

type AggregationData = {
  incrementalCountsByYear: Array<{ pubYear: number, count: number }>;
  publicationsByQuarter: Array<{ pubYear: number, count: number, byQuarter: Array<{ quarter: number, count: number }> }>;
  publicationsByGrantAgency: Array<{ agency: string, count: number }>;
}

const PublicationsPage = () => {
  const [ pubByQuarterData, setPubByQuarterData ] = useState<ChartData<'bar'>>(null);
  const [ quarterChartView, setQuarterChartView ] = useState<'year'|'quarter'>('year');
  const [ grantAgencyView, setGrantAgencyView ] = useState<'chart' | 'table'>('chart');
  const quarterChartRef = useRef();
  const { data} = useQuery({
    queryKey: ['publications', 'aggregation'],
    queryFn: () => fetchAPI(`/api/v1/publications/aggregation`),
    select: (aggregationData: AggregationData) => {
      const yearlyIncrementData = aggregationData.incrementalCountsByYear
      const allGrantsData = aggregationData.publicationsByGrantAgency;
      const publicationsByGrantsChart = allGrantsData.filter(pubCount => pubCount.count > 8);
      const publicationsByQuarter = aggregationData.publicationsByQuarter.map(year => {
        return {
          ...year,
          byQuarter: year.byQuarter.sort((q1, q2) => q1.quarter - q2.quarter )
        }
      });

      return {
        yearlyChart: {
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              title: { display: false },
            },
            scales: {
              y: {
                title: { display: true, text: "Number of publications" }
              }
            }
          },
          data: {
            labels: yearlyIncrementData.map(point => point.pubYear),
            datasets: [{
              data: yearlyIncrementData.map((point, index) => {
                const totalBefore = yearlyIncrementData.slice(0, index).reduce((acc, point) => acc + point.count, 0);
                return point.count + totalBefore;
              }),
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            }]
          }
        },
        grantsChart: {
          options: {
            indexAxis: 'y' as const,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: { display: false }
            }
          },
          data: {
            labels: publicationsByGrantsChart.map(pubCount => pubCount.agency),
            datasets: [{
              label: 'Publications',
              data: publicationsByGrantsChart.map(pubCount => pubCount.count),
            }]
          }
        },
        quartersChart: {
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              title: { display: true },
              datalabels: {
                color: '#000',
                align: 'top' as const,
                anchor: 'end' as const,
              }
            },
            scales: {
              y: {
                title: { display: true, text: "Number of publications" }
              }
            },
            onHover: (e, elements) => {
              elements.length ? e.native.target.style.cursor = 'pointer' : e.native.target.style.cursor = 'auto';
            },
            onClick: (e, elements) => {
              if (elements.length > 0 && quarterChartView === 'year') {
                const elementClicked = elements[0];
                const yearInfo = publicationsByQuarter[elementClicked.index];
                const newData = {
                  labels: yearInfo.byQuarter.map(quarter => `${yearInfo.pubYear} Q${quarter.quarter}`),
                  datasets: [{
                    data: yearInfo.byQuarter.map(quarter => quarter.count)
                  }]
                };
                setQuarterChartView('quarter');
                setPubByQuarterData(newData);
              } else if (quarterChartView === 'quarter') {
                setQuarterChartView('year');
                setPubByQuarterData({
                  labels: publicationsByQuarter.map(pubCount => pubCount.pubYear.toString()),
                  datasets: [{
                    data: yearlyIncrementData.map((pubCount) => pubCount.count),
                  }],
                });
              }
            }
          },
          data: {
            labels: publicationsByQuarter.map(pubCount => pubCount.pubYear.toString()),
            datasets: [{
              data: yearlyIncrementData.map((pubCount) => pubCount.count),
            }],
          }
        },
        allGrantsData,
      }
    },
  });

  useEffect(() => {
    if (data && pubByQuarterData === null) {
      setPubByQuarterData(data.quartersChart.data);
    }
  }, [data]);

  return (
    <>
      <Search />
      <Container className="page">
        <Card>
          <h1 className="mb-4 mt-2">
            <strong>IKMC/IMPC related publications</strong>
          </h1>
          <Tabs defaultActiveKey="all-publications">
            <Tab eventKey="all-publications" title="All publications">
              <div className="mt-5">
                <PublicationsList />
              </div>
            </Tab>
            <Tab eventKey="publications-stats" title="Publications stats">
              <Card>
                <div className="tab-content-container">
                  <h2>Yearly increase of IKMC/IMPC related publications</h2>
                  <div className={styles.chartContainer}>
                    {data && (
                      <Line
                        data={data.yearlyChart.data}
                        options={data.yearlyChart.options}
                      />
                    )}
                  </div>
                </div>
              </Card>
              <Card>
                <div className="tab-content-container">
                  <h2>IKMC/IMPC related publications by year of publication</h2>
                  <div className={styles.chartContainer}>
                    {pubByQuarterData && (
                      <Bar
                        ref={quarterChartRef}
                        data={pubByQuarterData}
                        options={data.quartersChart.options}
                        plugins={[ colorsPlugin, dataLabelsPlugin ]}
                      />
                    )}
                  </div>
                </div>
              </Card>
              <Card>
                <div className="tab-content-container">
                  <div className={styles.changeViewWrapper}>
                    <button
                      className={`btn btn-secondary btn-lg ${grantAgencyView === 'chart' ? 'active' : ''}`}
                      onClick={() => setGrantAgencyView('chart')}
                    >
                      <FontAwesomeIcon icon={faChartBar} />
                      Chart view
                    </button>
                    <button
                      className={`btn btn-secondary btn-lg ${grantAgencyView === 'table' ? 'active' : ''}`}
                      onClick={() => setGrantAgencyView('table')}
                    >
                      <FontAwesomeIcon icon={faTable} />
                      Table view
                    </button>
                  </div>
                  <h2>{
                    grantAgencyView === 'chart' ?
                      'Top 100 grant agencies by number of publications' :
                      'All grant agencies funded IKMC/IMPC related publications'
                  }</h2>
                  { grantAgencyView === 'chart' ? (
                    <div style={{ minHeight: "2000px" }} className="position-relative">
                      {data && (
                        <Bar
                          data={data.grantsChart.data}
                          options={data.grantsChart.options}
                          plugins={[ colorsPlugin ]}
                        />
                      )}
                    </div>
                  ) : (
                    <Pagination data={data?.allGrantsData}>
                      {pageData => (
                        <SortableTable
                          headers={[
                            { width: 1, label: "Grant agency", field: "key", disabled: true },
                            { width: 1, label: "Number of publications", field: "value", disabled: true },
                          ]}
                        >
                          {pageData.map(row => (
                            <tr key={row.agency}>
                              <td>{row.agency}</td>
                              <td>{row.count}</td>
                            </tr>
                          ))}
                        </SortableTable>
                      )}
                    </Pagination>
                  ) }
                </div>
              </Card>
            </Tab>
            <Tab eventKey="consortium-publications" title="Consortium publications">
              <div className="mt-5">
                <PublicationsList onlyConsortiumPublications />
              </div>
            </Tab>
          </Tabs>
        </Card>
      </Container>
    </>
  )
}

export default PublicationsPage;