import { Col, Row } from "react-bootstrap";
import Card from "@/components/Card";
import ChartSummary from "@/components/Data/ChartSummary";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import { GrossPathology, GrossPathologyDataset } from "@/models";
import { PlainTextCell, SmartTable } from "@/components/SmartTable";

const GrossPathology = ({ datasetSummary, mgiGeneAccessionId }) => {

  const { data } = useQuery({
    queryKey: ["genes", mgiGeneAccessionId, "gross-pathology"],
    queryFn: () => fetchAPI(`/api/v1/genes/${mgiGeneAccessionId}/pathology`),
    placeholderData: [],
    select: (data: Array<GrossPathology>) => {
      const counts = {}
      const filteredData = !!datasetSummary?.parameterStableId ? (
        data.filter(d => d.parameterStableId === datasetSummary.parameterStableId)
      ) : data;
      let datasetsFiltered = filteredData
        .flatMap(byParameter => byParameter.datasets);

      datasetsFiltered.forEach(dataset => {
        const isNormal = dataset.ontologyTerms
          .find(ontologyTerm => ontologyTerm.termName === 'no abnormal phenotype detected');
        const key = `${dataset.zygosity}-${dataset.phenotypingCenter}-${isNormal ? 'normal' : 'abnormal'}`;
        if (counts[key] === undefined) {
          counts[key] = 0;
        }
        counts[key] += 1;
      });
      datasetsFiltered = [
        ...new Map(datasetsFiltered.map(d => [
          JSON.stringify([d.zygosity,d.phenotypingCenter]), d
        ])).values()
      ];
      return datasetsFiltered.map(dataset => {
        const abnormalCountsKey  = `${dataset.zygosity}-${dataset.phenotypingCenter}-abnormal`;
        const normalCountsKey  = `${dataset.zygosity}-${dataset.phenotypingCenter}-normal`;
        console.log({abnormalCountsKey, normalCountsKey});
        return {
          ...dataset,
          abnormalCounts: counts[abnormalCountsKey]?.toString() || 'N/A',
          normalCounts: counts[normalCountsKey]?.toString() || 'N/A',
        }
      });

    }
  });

  console.log(data);
  return (
    <>
      <ChartSummary datasetSummary={datasetSummary} />
      <Row>
        <Col>
          <Card>
            <h2>Observation numbers</h2>
            <SmartTable<GrossPathologyDataset>
              data={data}
              defaultSort={["alleleSymbol", "asc"]}
              columns={[
                { width: 1, label: "Anatomy", field: "parameterName", cmp: <PlainTextCell /> },
                { width: 1, label: "Zygosity", field: "zygosity", cmp: <PlainTextCell />  },
                { width: 1, label: "Abnormal", field: "abnormalCounts", cmp: <PlainTextCell /> },
                { width: 1, label: "Normal", field: "normalCounts", cmp: <PlainTextCell /> },
                { width: 1, label: "Center", field: "phenotypingCenter", cmp: <PlainTextCell /> },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default GrossPathology;
