import { useEffect, useMemo, useState } from "react";
import Pagination from "../../Pagination";
import SortableTable from "../../SortableTable";
import { orderBy, has, camelCase, trim } from "lodash";
import { formatPValue, getIcon, getSexLabel } from "@/utils";
import { OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dataset, SortType, TableHeader } from "@/models";
import { getBackgroundColorForRow, groupData, processData } from "./utils";
import { AlleleSymbol } from "@/components";
import Skeleton from "react-loading-skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { PlainTextCell, SmartTable } from "@/components/SmartTable";

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
            {pValue === null || pValue === undefined ? (
              <OverlayTrigger
                placement="top"
                trigger={["hover", "focus"]}
                overlay={<Tooltip>Not significant or not tested</Tooltip>}
              >
                <span className="grey">—</span>
              </OverlayTrigger>
            ) : (
              formatPValue(pValue)
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
  dataIsLoading: boolean;
  isMiniSpecProcedure?: boolean;
};

type SortOptions = {
  prop: string | ((any) => void);
  order: "asc" | "desc";
};

type MiniSpecMetadata = Record<string, string>;

const DataComparison = (props: Props) => {
  const {
    data,
    isViabilityChart = false,
    initialSortByProp,
    selectedKey,
    displayPValueThreshold = true,
    displayPValueColumns = true,
    onSelectParam = (_) => {},
    dataIsLoading,
    isMiniSpecProcedure = false,
  } = props;

  const groups = groupData(data);
  const processed = processData(groups);
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    prop: !!initialSortByProp ? initialSortByProp : "phenotype",
    order: "asc" as const,
  });
  const defaultSort: SortType = useMemo(() => {
    return isViabilityChart
      ? ["parameter", "asc"]
      : ["pValue_not_considered", "asc"];
  }, [isViabilityChart]);
  const sorted = orderBy(processed, sortOptions.prop, sortOptions.order);
  const [metadataValues, setMetadataValues] = useState<{
    data: Array<MiniSpecMetadata>;
    labels: Array<string>;
  }>({
    data: [],
    labels: [],
  });
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
        label: "P-Value",
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
    isMiniSpecProcedure
      ? {
          width: 1,
          label: "Metadata",
          field: "metadataValues",
        }
      : null,
  ]
    .filter(Boolean)
    .concat(displayPValueColumns ? lastColumnHeader : [])
    .filter((h) =>
      displayPValueColumns ? h : !h.label.includes("Significant"),
    );

  const numOfHeaders = tableHeaders.reduce(
    (acc, header) => acc + (header.children ? header.children.length : 1),
    0,
  );

  const displayModalTable = (metadataValues: Array<string>) => {
    const labels = metadataValues[0].split("|").map((keyAndValue) => {
      const [key] = keyAndValue.split("=");
      return trim(key);
    });

    const data: Array<MiniSpecMetadata> = metadataValues.map(
      (stringifiedValue) => {
        const exploded = stringifiedValue.split("|");
        const result: MiniSpecMetadata = {};
        exploded.forEach((keyAndValue) => {
          const [key, value] = keyAndValue.split("=");
          result[camelCase(key)] = trim(value);
        });
        return result;
      },
    );
    setMetadataValues({ data, labels });
  };

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
        <div style={{ color: "#797676", fontSize: "95%" }}>
          <span>
            P-Values equal or lower to 10<sup>-4</sup> (P &lt; 0.0001) are
            marked as significant.
          </span>
        </div>
      )}
      <Pagination data={sorted}>
        {(pageData) => (
          <AnimatePresence>
            <SortableTable
              className="data-comparison-table"
              doSort={(sort) =>
                setSortOptions({ prop: sort[0], order: sort[1] })
              }
              defaultSort={defaultSort}
              headers={tableHeaders}
            >
              {pageData.map((d, i) => {
                return (
                  <motion.tr
                    key={d.key}
                    className={getBackgroundColorForRow(d, i, selectedKey)}
                    onClick={() => onSelectParam(d.key)}
                    layout
                    initial={{ y: 10, opacity: 0, maxHeight: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <td>{d.parameterName}</td>
                    <td>{d.phenotypingCentre}</td>
                    <td>
                      <AlleleSymbol symbol={d.alleleSymbol} withLabel={false} />
                    </td>
                    <td>{d.zygosity}</td>
                    {displayPValueColumns && (
                      <td>
                        {["male", "female", "not_considered"]
                          .filter(
                            (sex) =>
                              has(d, `pValue_${sex}`) &&
                              d[`pValue_${sex}`] !== null &&
                              d[`pValue_${sex}`] !== undefined &&
                              d[`pValue_${sex}`] < 0.0001,
                          )
                          .map((significantSex, index) => (
                            <OverlayTrigger
                              key={index}
                              placement="top"
                              trigger={["hover", "focus"]}
                              overlay={
                                <Tooltip>{getSexLabel(significantSex)}</Tooltip>
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
                      </td>
                    )}
                    <td>{d.lifeStageName}</td>
                    <td>{d.colonyId}</td>
                    {isMiniSpecProcedure && (
                      <td>
                        <a
                          className="link primary"
                          onClick={() => displayModalTable(d.metadataValues)}
                        >
                          View&nbsp;
                          <FontAwesomeIcon icon={faEye} />
                        </a>
                      </td>
                    )}
                    {displayPValueColumns && (
                      <LastColumn
                        dataset={d}
                        isViabilityChart={isViabilityChart}
                      />
                    )}
                  </motion.tr>
                );
              })}
              {pageData.length === 0 && dataIsLoading && (
                <motion.tr
                  layout
                  initial={{ y: 10, opacity: 0, maxHeight: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0, maxHeight: 0 }}
                >
                  {[...Array(numOfHeaders)].map((_, i) => (
                    <td key={i}>
                      <Skeleton />
                    </td>
                  ))}
                </motion.tr>
              )}
            </SortableTable>
          </AnimatePresence>
        )}
      </Pagination>
      <Modal
        size="xl"
        show={!!metadataValues.data.length}
        onHide={() => setMetadataValues({ data: [], labels: [] })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Mini spec procedure metadata</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!!metadataValues.data.length && (
            <SmartTable
              columns={metadataValues.labels.map((label) => ({
                width: 1,
                label,
                field: camelCase(label),
                cmp: <PlainTextCell />,
              }))}
              data={metadataValues.data}
              defaultSort={[metadataValues.labels[0], "asc"]}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DataComparison;
