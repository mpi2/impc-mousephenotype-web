import { useState } from "react";
import SortableTable from "../../SortableTable";
import _ from "lodash";
import { formatAlleleSymbol, getIcon, getSexLabel } from "@/utils";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
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
  const [visibleRows, setVisibleRows] = useState(10);
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    prop: !!initialSortByProp ? initialSortByProp : 'alleleSymbol',
    order: 'asc' as const,
  })
  const sorted = _.orderBy(processed, sortOptions.prop, sortOptions.order);

  const getVisibleRows = (data: Array<any>) => {
    return data.slice(0, visibleRows);
  };

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
      <SortableTable
        doSort={(sort) => {
          setSortOptions({
            prop: sort[0],
            order: sort[1]
          })
        }}
        defaultSort={["alleleSymbol", "asc"]}
        headers={[
          {width: 2, label: "Allele", field: "alleleSymbol"},
          {width: 2, label: "Viability", field: "viability"},
          {width: 1, label: "Zygosity", field: "zygosity"},
          {
            width: 1,
            label: "Phenotyping Centre",
            field: "phenotypingCentre",
          },
          {width: 1, label: "Significant sex", field: "sex"},
          {width: 1, label: "Life Stage", field: "lifeStageName"},
          {width: 1, label: "Colony Id", field: "colonyId",},

        ]}
      >
        {getVisibleRows(sorted).map((d, i) => {
          const allele = formatAlleleSymbol(d.alleleSymbol);
          return (
            <tr key={d.key} className={getBackgroundColorForRow(d, i, selectedKey)}>
              <td>
                <button className={styles.selectionButton} onClick={() => onSelectParam(d.key)}>
                  {allele[0]}
                  <sup>{allele[1]}</sup>
                </button>
              </td>
              <td>
                <strong>{d.viability}</strong>
              </td>
              <td>{d.zygosity}</td>
              <td>{d.phenotypingCentre}</td>
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
            </tr>
          );
        })}
      </SortableTable>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
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

export default ViabilityDataComparison;
