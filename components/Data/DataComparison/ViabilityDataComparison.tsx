import { useState } from "react";
import Pagination from "../../Pagination";
import SortableTable from "../../SortableTable";
import _ from "lodash";
import { formatAlleleSymbol, getIcon, getSexLabel } from "@/utils";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dataset } from "@/models";
import styles from './styles.module.scss';
import { getBackgroundColorForRow, groupData, processData } from "./utils";

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
const ViabilityDataComparison = (props: Props) => {
  const {
    data,
    initialSortByProp,
    selectedKey,
    onSelectParam = (_) => {}
  } = props;

  const groups = groupData(data);
  const processed = processData(groups);
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    prop: !!initialSortByProp ? initialSortByProp : 'phenotypingCentre',
    order: 'asc' as const,
  })
  const sorted = _.orderBy(processed, sortOptions.prop, sortOptions.order);
  if (!data) {
    return null;
  }

  return (
    <>
      <div className="mt-4" style={{color: '#797676', fontSize: '95%'}}>
        <span>
          P-values equal or lower to 10<sup>-4</sup> (P &lt; 0.0001) are marked as significant.
        </span>
      </div>
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
                {width: 3, label: "Parameter", field: "parameter"},
                {
                  width: 1,
                  label: "Phenotyping Centre",
                  field: "phenotypingCentre",
                },
                {width: 2, label: "Allele", field: "alleleSymbol"},
                {width: 1, label: "Zygosity", field: "zygosity"},
                {width: 1, label: "Significant sex", field: "sex"},
                {width: 1, label: "Life Stage", field: "lifeStageName"},
                {width: 1, label: "Colony Id", field: "colonyId",},
                {width: 2, label: "Viability", field: "viability"}
              ]}
            >
              {pageData.map((d, i) => {
                const allele = formatAlleleSymbol(d.alleleSymbol);
                return (
                  <tr key={d.key} className={getBackgroundColorForRow(d, i, selectedKey)}>
                    <td>
                      <button className={styles.selectionButton} onClick={() => onSelectParam(d.key)}>
                        {d.parameterName}
                      </button>
                    </td>
                    <td>{d.phenotypingCentre}</td>
                    <td>
                      {allele[0]}
                      <sup>{allele[1]}</sup>
                    </td>
                    <td>{d.zygosity}</td>
                    <td>
                      {d.sex === 'not_considered' ? (
                        <OverlayTrigger
                          placement="top"
                          trigger={["hover", "focus"]}
                          overlay={<Tooltip>{getSexLabel(d.sex)}</Tooltip>}
                        >
                          <span className="me-2">
                            <FontAwesomeIcon icon={getIcon(d.sex)} size="lg"/>
                          </span>
                        </OverlayTrigger>
                      ) : (
                        <>
                          {["male", "female", "not_considered"]
                            .filter(sex => d.sex === sex)
                            .map(significantSex => (
                              <OverlayTrigger
                                placement="top"
                                trigger={["hover", "focus"]}
                                overlay={<Tooltip>{getSexLabel(significantSex)}</Tooltip>}
                              >
                                <span className="me-2">
                                  <FontAwesomeIcon icon={getIcon(significantSex)} size="lg"/>
                                </span>
                              </OverlayTrigger>
                            ))
                          }
                        </>
                      )}
                    </td>
                    <td>{d.lifeStageName}</td>
                    <td>{d.colonyId}</td>
                    <td>{d.viability}</td>
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

export default ViabilityDataComparison;