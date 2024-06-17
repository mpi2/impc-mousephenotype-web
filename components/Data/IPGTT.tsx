import { Dataset } from "@/models";
import { Tab, Tabs } from "react-bootstrap";
import { useRelatedParametersQuery } from "@/hooks/related-parameters.query";
import { useState } from "react";
import { getChartType } from "@/components/Data/Utils";

const parameterList = [
  "IMPC_IPG_002_001",
  "IMPC_IPG_010_001",
  "IMPC_IPG_011_001",
  "IMPC_IPG_012_001",
];

type IPGTTProps = {
  datasetSummaries: Array<Dataset>;
  onNewSummariesFetched: (missingSummaries: Array<any>) => void;
};

const IPGTT = (props: IPGTTProps) => {
  const { datasetSummaries, onNewSummariesFetched } = props;
  const [key, setKey] = useState(datasetSummaries[0].parameterName);

  const {datasets, datasetsAreLoading} = useRelatedParametersQuery(
    datasetSummaries,
    parameterList,
    onNewSummariesFetched
  );

  return (
    <Tabs
      activeKey={key}
      onSelect={(k) => setKey(k)}
    >
      {datasets.map(dataset => (
        <Tab
          key={dataset.id}
          title={dataset.parameterName}
          eventKey={dataset.parameterName}
        >
          {getChartType(dataset, key === dataset.parameterName)}
        </Tab>
      ))}
    </Tabs>
  );

};

export default IPGTT;