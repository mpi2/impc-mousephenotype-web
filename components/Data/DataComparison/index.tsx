import { useEffect, useState } from "react";
import Pagination from "../../Pagination";
import SortableTable from "../../SortableTable";
import _ from "lodash";
import {
  formatPValue,
  getIcon,
  getSexLabel,
} from "@/utils";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dataset, TableHeader } from "@/models";
import { getBackgroundColorForRow, groupData, processData } from "./utils";
import { AlleleSymbol } from "@/components";
import Skeleton from "react-loading-skeleton";

type LastColumnProps = {
  isViabilityChart: boolean;
  dataset: any;
};

const LastColumn = ({ isViabilityChart, dataset }: LastColumnProps) => {
  return isViabilityChart ? (
    <td>{dataset.viability}</td>
  ) : (
    <>
      {["male", "female", "not_considered"].map((col) => {
        const pValue = dataset[`pValue_${col}`];
        const isMostSignificant = pValue < 0.0001;
        return (
          <td
            key={col}
            className={
              isMostSignificant
                ? "bold orange-dark-x bg-orange-light-x"
                : "bold"
            }
          >
            {!!dataset[`pValue_${col}`] ? (
              formatPValue(pValue)
            ) : (
              <OverlayTrigger
                placement="top"
                trigger={["hover", "focus"]}
                overlay={<Tooltip>Not significant or not tested</Tooltip>}
              >
                <span className="grey">—</span>
              </OverlayTrigger>
            )}
          </td>
        );
      })}
    </>
  );
};

type Props = {
  data: Array<Dataset>;
  isViabilityChart?: boolean;
  initialSortByProp?: string;
  selectedKey?: string;
  displayPValueThreshold?: boolean;
  displayPValueColumns?: boolean;
  onSelectParam?: (newValue: string) => void;
};

type SortOptions = {
  prop: string | ((any) => void);
  order: "asc" | "desc";
};

const DataComparison = (props: Props) => {
  const {
    data,
    isViabilityChart = false,
    initialSortByProp,
    selectedKey,
    displayPValueThreshold = true,
    displayPValueColumns = true,
    onSelectParam = (_) => {},
  } = props;

  const groups = groupData(data);
  const processed = processData(groups);
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    prop: !!initialSortByProp ? initialSortByProp : "phenotype",
    order: "asc" as const,
  });
  const sorted = _.orderBy(processed, sortOptions.prop, sortOptions.order);
  if (!data) {
    return null;
  }

  const getPValueSortFn = (key: string) => {
    return (d) => {
      return d[`pValue_${key}`] ?? 0;
    };
  };

  const lastColumnHeader = isViabilityChart
    ? {
        width: 2,
        label: "Viability",
        field: "viability",
      }
    : {
        width: 2,
        label: "P Value",
        field: "pValue",
        children: [
          {
            width: 1,
            label: "Male",
            field: "pValue_male",
            sortFn: getPValueSortFn("male"),
          },
          {
            width: 1,
            label: "Female",
            field: "pValue_female",
            sortFn: getPValueSortFn("female"),
          },
          {
            width: 1,
            label: "Combined",
            field: "pValue_not_considered",
            sortFn: getPValueSortFn("not_considered"),
          },
        ],
      };

  const tableHeaders: Array<TableHeader> = [
    { width: 3, label: "Parameter", field: "parameter" },
    {
      width: 1,
      label: "Phenotyping Centre",
      field: "phenotypingCentre",
    },
    { width: 2, label: "Allele", field: "alleleSymbol" },
    { width: 1, label: "Zygosity", field: "zygosity" },
    { width: 1, label: "Significant sex", field: "sex" },
    { width: 1, label: "Life Stage", field: "lifeStageName" },
    { width: 1, label: "Colony Id", field: "colonyId" },
  ]
    .concat(displayPValueColumns ? lastColumnHeader : [])
    .filter((h) =>
      displayPValueColumns ? h : !h.label.includes("Significant")
    );

  const numOfHeaders = tableHeaders.reduce(
    (acc, header) => acc + (header.children ? header.children.length : 1), 0
  );
  useEffect(() => {
    if (
      !!sorted[0]?.key &&
      sorted[0]?.key !== selectedKey &&
      selectedKey === ""
    ) {
      onSelectParam(sorted[0].key);
    }
  }, [sorted.length]);

  return (
    <>
      {displayPValueThreshold && (
        <div className="mt-4" style={{ color: "#797676", fontSize: "95%" }}>
          <span>
            P-values equal or lower to 10<sup>-4</sup> (P &lt; 0.0001) are
            marked as significant.
          </span>
        </div>
      )}
      <Pagination data={sorted}>
        {(pageData) => (
          <>
            <SortableTable
              className="data-comparison-table"
              doSort={(sort) => setSortOptions({ prop: sort[0], order: sort[1]})}
              defaultSort={["parameter", "asc"]}
              headers={tableHeaders}
            >
              {pageData.map((d, i) => {
                return (
                  <tr
                    key={d.key}
                    className={getBackgroundColorForRow(d, i, selectedKey)}
                    onClick={() => onSelectParam(d.key)}
                  >
                    <td>
                      {d.parameterName}
                    </td>
                    <td>{d.phenotypingCentre}</td>
                    <td>
                      <AlleleSymbol symbol={d.alleleSymbol} withLabel={false}/>
                    </td>
                    <td>{d.zygosity}</td>
                    {displayPValueColumns && (
                      <td>
                        {d.sex === "not_considered" ? (
                          <OverlayTrigger
                            placement="top"
                            trigger={["hover", "focus"]}
                            overlay={<Tooltip>{getSexLabel(d.sex)}</Tooltip>}
                          >
                            <span className="me-2">
                              <FontAwesomeIcon
                                icon={getIcon(d.sex)}
                                size="lg"
                              />
                            </span>
                          </OverlayTrigger>
                        ) : (
                          <>
                            {["male", "female", "not_considered"]
                              .filter((sex) => d.sex === sex)
                              .map((significantSex) => (
                                <OverlayTrigger
                                  placement="top"
                                  trigger={["hover", "focus"]}
                                  overlay={
                                    <Tooltip>
                                      {getSexLabel(significantSex)}
                                    </Tooltip>
                                  }
                                >
                                  <span className="me-2">
                                    <FontAwesomeIcon
                                      icon={getIcon(significantSex)}
                                      size="lg"
                                    />
                                  </span>
                                </OverlayTrigger>
                              ))}
                          </>
                        )}
                      </td>
                    )}
                    <td>{d.lifeStageName}</td>
                    <td>{d.colonyId}</td>
                    {displayPValueColumns && (
                      <LastColumn
                        dataset={d}
                        isViabilityChart={isViabilityChart}
                      />
                    )}
                  </tr>
                );
              })}
              {pageData.length === 0 && (
                <tr>
                  {[...Array(numOfHeaders)].map((_, i) => (
                    <td key={i}><Skeleton /></td>
                  ))}
                </tr>
              )}
            </SortableTable>
          </>
        )}
      </Pagination>
    </>
  );
};

export default DataComparison;
