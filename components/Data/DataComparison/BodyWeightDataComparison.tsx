import { useEffect, useMemo, useState } from "react";
import SortableTable from "../../SortableTable";
import _ from "lodash";
import { Dataset, DatasetExtra } from "@/models";
import { groupData, processData, getBackgroundColorForRow } from "./utils";
import { Button } from "react-bootstrap";
import { AlleleSymbol } from "@/components";
import Skeleton from "react-loading-skeleton";

type Props = {
  data: Array<Dataset>;
  initialSortByProp?: string;
  selectedKey?: string;
  onSelectParam?: (newValue: string) => void;
}

type SortOptions = {
  prop: string | ((any) => void);
  order: 'asc' | 'desc',
}
const BodyWeightDataComparison = (props: Props) => {
  const {
    data,
    initialSortByProp,
    selectedKey,
    onSelectParam = (_) => {}
  } = props;

  const groups = groupData(data);
  const processed = processData(groups);
  const [visibleRows, setVisibleRows] = useState(10);
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    prop: !!initialSortByProp ? initialSortByProp : 'phenotypingCentre',
    order: 'asc' as const,
  })
  const sorted = _.orderBy(processed, sortOptions.prop, sortOptions.order);

  const visibleData: Array<DatasetExtra> = useMemo(() => sorted.slice(0, visibleRows), [sorted, visibleRows]);

  const tableHeaders = [
    {width: 1, label: "Phenotyping Centre", field: "phenotypingCentre"},
    {width: 2, label: "Allele", field: "alleleSymbol"},
    {width: 1, label: "Zygosity", field: "zygosity"},
    {width: 1, label: "Life Stage", field: "lifeStageName"},
    {width: 1, label: "Colony Id", field: "colonyId",},
  ];

  useEffect(() => {
    if (!!sorted[0]?.key && sorted[0]?.key !== selectedKey && selectedKey === '') {
      onSelectParam(sorted[0].key);
    }
  }, [sorted.length]);

  return (
    <>
      <SortableTable
        className="data-comparison-table"
        doSort={(sort) => {
          setSortOptions({
            prop: sort[0],
            order: sort[1]
          })
        }}
        defaultSort={["phenotypingCentre", "asc"]}
        headers={tableHeaders}
      >
        {visibleData.map((d, i) => {
          return (
            <tr
              key={d.key}
              className={getBackgroundColorForRow(d, i, selectedKey)}
              onClick={() => onSelectParam(d.key)}
            >
              <td>
                {d.phenotypingCentre}
              </td>
              <td>
                <AlleleSymbol symbol={d.alleleSymbol} withLabel={false} />
              </td>
              <td>{d.zygosity}</td>
              <td>{d.lifeStageName}</td>
              <td>{d.colonyId}</td>
            </tr>
          );
        })}
        {visibleData.length === 0 && (
          <tr>
            {[...Array(tableHeaders.length)].map((_, i) => (
              <td key={i}><Skeleton /></td>
            ))}
          </tr>
        )}
      </SortableTable>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        {visibleRows < sorted?.length && (
          <Button
            variant="secondary"
            className="white-x"
            onClick={() => setVisibleRows(prevState => prevState + 10)}
          >
            View next 10 rows
          </Button>
        )}
      </div>
    </>
  );
};

export default BodyWeightDataComparison;
