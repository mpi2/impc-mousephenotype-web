import { Dataset } from "@/models";
import { fetchAPI } from "@/api-service";
import _ from "lodash";
import { useEffect, useState } from "react";
const clone = (obj: any) => JSON.parse(JSON.stringify(obj));

export const useRelatedParametersQuery = (
  allDatasets: Array<Dataset>,
  allParametersList: Array<string>,
  onMissingProceduresFetched: (datasets: Array<Dataset>) => void,
) => {
  const [datasets, setDatasets] = useState<Array<Dataset>>(allDatasets);
  useEffect(() => {
    const {
      mgiGeneAccessionId,
      alleleAccessionId,
      pipelineStableId,
      zygosity,
      procedureStableId,
      phenotypingCentre,
    } = allDatasets[0];
    const proceduresWithData = allDatasets.map((d) => d.parameterStableId);
    const missingProcedures = allParametersList.filter(
      (p) => !proceduresWithData.includes(p)
    );
    const requests = missingProcedures.map((parameter) =>
      fetchAPI(
        `/api/v1/genes/dataset/find_by_multiple_parameter?mgiGeneAccessionId=${mgiGeneAccessionId}&alleleAccessionId=${alleleAccessionId}&zygosity=${zygosity}&parameterStableId=${parameter}&pipelineStableId=${pipelineStableId}&procedureStableId=${procedureStableId}&phenotypingCentre=${phenotypingCentre}`
      )
    );
    Promise.allSettled(requests)
      .then((responses) =>
        responses
          .filter((promiseRes) => promiseRes.status === "fulfilled")
          .map(
            (promiseRes) => (promiseRes as PromiseFulfilledResult<any>).value
          )
      )
      .then((responses) => {
        const proceduresData = [];
        responses.forEach((datasets) => {
          const uniques = [];
          datasets.forEach(({ id, ...ds }) => {
            if (!uniques.find((d) => _.isEqual(d, ds))) {
              uniques.push({ id, ...ds });
            }
          });
          const selectedDataset = uniques[0];
          proceduresData.push(selectedDataset);
        });
        return proceduresData;
      })
      .then((missingProcedureData) => {
        // get data from props first, then add missing data
        const allData = clone(allDatasets);
        missingProcedureData.forEach((d) => allData.push(d));
        allData.sort((d1, d2) =>
          d1.parameterStableId.localeCompare(d2.parameterStableId)
        );
        onMissingProceduresFetched(missingProcedureData);
        setDatasets(allData);
      });
  }, [allDatasets]);
  return datasets;
}