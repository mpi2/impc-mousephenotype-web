import ChartSummary from "@/components/Data/ChartSummary";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/api-service";
import _ from 'lodash';
import { Card } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  BarController
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  BarController,
);

const clone = obj => JSON.parse(JSON.stringify(obj));

const parameterList = [
  "IMPC_ABR_002_001",
  "IMPC_ABR_004_001",
  "IMPC_ABR_006_001",
  "IMPC_ABR_008_001",
  "IMPC_ABR_010_001",
  "IMPC_ABR_012_001",
];

type ABRProps = {
  datasetSummaries: Array<any>;
};

const ABR = ({ datasetSummaries } : ABRProps) => {
  const [datasets, setDatasets] = useState<Array<any>>(datasetSummaries);
  const [zygosity, setZygosity] = useState(datasetSummaries[0].zygosity);
  useEffect(() => {
    const {
      mgiGeneAccessionId,
      alleleAccessionId,
      pipelineStableId,
      zygosity,
      procedureStableId,
      phenotypingCentre,
    } = datasetSummaries[0];
    const proceduresWithData = datasetSummaries.map(d => d.parameterStableId);
    const missingProcedures = parameterList.filter(p => !proceduresWithData.includes(p));
    const requests = missingProcedures.map(parameter => fetchAPI(
      `/api/v1/genes/dataset/find_by_multiple_parameter?mgiGeneAccessionId=${mgiGeneAccessionId}&alleleAccessionId=${alleleAccessionId}&zygosity=${zygosity}&parameterStableId=${parameter}&pipelineStableId=${pipelineStableId}&procedureStableId=${procedureStableId}&phenotypingCentre=${phenotypingCentre}`
    ));
    Promise.allSettled(requests)
      .then(responses =>
        responses
          .filter(promiseRes => promiseRes.status === 'fulfilled')
          .map(promiseRes => (promiseRes as PromiseFulfilledResult<any>).value)
      )
      .then(responses => {
        const proceduresData = [];
        responses.forEach(datasets => {
          const uniques = [];
          datasets.forEach(({id, ...ds}) => {
            if (!uniques.find(d => _.isEqual(d, ds))) {
              uniques.push({ id, ...ds });
            }
          });
          const selectedDataset = uniques[0];
          proceduresData.push(selectedDataset);
        });
        return proceduresData;
      })
      .then(missingProcedureData => {
        // get data from props first, then add missing data
        const allData = clone(datasetSummaries);
        missingProcedureData.forEach(d => allData.push(d));
        allData.sort((d1, d2) => d1.parameterStableId.localeCompare(d2.parameterStableId));
        setDatasets(allData);
      })
  }, [datasetSummaries]);

  const getChartLabels = () => {
    const labels = datasets.map(d => d.parameterName);
    // add the empty column to separate click from 6kHz
    labels.splice(1, 0, null);
    return labels;
  }
  const getStatsData = (sex: 'fem' | 'male', zygLabel: 'Het' | 'Hom' | 'WT', value: 'mean' | 'sd') => {
    const data = clone(datasets);
    data.sort((d1, d2) => d1.parameterStableId.localeCompare(d2.parameterStableId));
    const sexKey = sex === 'fem' ? 'female' : 'male';
    const zygKey = zygLabel === 'WT' ? 'Control' : 'Mutant';
    const valKey = value === 'mean' ? 'Mean' : 'Sd';
    const propName = sexKey + zygKey + valKey;
    const result = data.map(({ summaryStatistics }) => summaryStatistics[propName]);
    // add the empty column to separate click from 6kHz
    result.splice(1, 0, null);
    return result;
  }
  const processData = () => {
    const zygLabel = zygosity === 'heterozygote' ? 'Het' : 'Hom';
    const mutantFemData = getStatsData('fem', zygLabel, 'mean');
    const wtFemData = getStatsData('fem', 'WT', 'mean');
    const mutantMaleData = getStatsData('male', zygLabel, 'mean');
    const wtMaleData = getStatsData('male', 'WT', 'mean');
    return [
      { type: 'line' as const, label: `Male ${zygLabel}.`, data: mutantMaleData},
      { type: 'line' as const, label: `Male WT`, data: wtMaleData},
      { type: 'line' as const, label: `Female ${zygLabel}.`, data: mutantFemData},
      { type: 'line' as const, label: `Female WT`, data: wtFemData},
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxis: {
        min: 0,
        max: 120,
        title: {
          display: true,
          text: 'dB SPL',
        },
      },
      xAxis: {
        grid: {
          display: false,
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
      }
    }
  };

  const chartData = {
    labels: getChartLabels(),
    datasets: processData(),
  };

  return (
    <>
      <ChartSummary datasetSummary={datasetSummaries[0]} />
      <Card>
        <div style={{ position: 'relative', height: '300px' }}>
          <Chart type='bar' data={chartData} options={chartOptions} />
        </div>
      </Card>
    </>
  )
};

export default ABR;