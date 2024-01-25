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
      const filteredData = !!datasetSummary?.parameterStableId ? (
        data.filter(d => d.parameterStableId === datasetSummary.parameterStableId)
      ) : data;
      return filteredData.flatMap(byParameter => byParameter.datasets);
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
                { width: 1, label: "Center", field: "phenotypingCenter", cmp: <PlainTextCell /> },
                { width: 1, label: "External Sample ID", field: "externalSampleId", cmp: <PlainTextCell /> },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default GrossPathology;
