import { useState } from "react";
import Pagination from "../../Pagination";
import SortableTable from "../../SortableTable";
import _ from "lodash";
import { formatAlleleSymbol } from "@/utils";
import { Dataset } from "@/models";
import styles from './styles.module.scss';
import { groupData, processData, getBackgroundColorForRow } from "./utils";

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
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    prop: !!initialSortByProp ? initialSortByProp : 'phenotype',
    order: 'asc' as const,
  })
  const sorted = _.orderBy(processed, sortOptions.prop, sortOptions.order);
  if (!data) {
    return null;
  }

  return (
    <>
      <Pagination data={sorted}>
        {(pageData) => (
          <>
            <SortableTable
              doSort={(sort) => {
                setSortOptions({
                  prop: sort[0],
                  order: sort[1]
                })
              }}
              defaultSort={["phenotypingCentre", "asc"]}
              headers={[
                {width: 1, label: "Phenotyping Centre", field: "phenotypingCentre"},
                {width: 2, label: "Allele", field: "alleleSymbol"},
                {width: 1, label: "Zygosity", field: "zygosity"},
                {width: 1, label: "Life Stage", field: "lifeStageName"},
                {width: 1, label: "Colony Id", field: "colonyId",},
              ]}
            >
              {pageData.map((d, i) => {
                const allele = formatAlleleSymbol(d.alleleSymbol);
                return (
                  <tr key={d.key} className={getBackgroundColorForRow(d, i, selectedKey)}>
                    <td>
                      <button className={styles.selectionButton} onClick={() => onSelectParam(d.key)}>
                        {d.phenotypingCentre}
                      </button>
                    </td>
                    <td>
                      {allele[0]}
                      <sup>{allele[1]}</sup>
                    </td>
                    <td>{d.zygosity}</td>
                    <td>{d.lifeStageName}</td>
                    <td>{d.colonyId}</td>
                  </tr>
                );
              })}
            </SortableTable>
          </>
        )}
      </Pagination>
    </>
  );
};

export default BodyWeightDataComparison;
