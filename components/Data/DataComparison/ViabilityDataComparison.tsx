import { useEffect, useMemo, useState } from "react";
import SortableTable from "../../SortableTable";
import { orderBy } from "lodash";
import { getIcon, getSexLabel } from "@/utils";
import { Button, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dataset, DatasetExtra, SortType } from "@/models";
import { getBackgroundColorForRow, groupData, processData } from "./utils";
import { AlleleSymbol } from "@/components";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  data: Array<Dataset>;
  initialSortByProp?: string;
  selectedKey?: string;
  onSelectParam?: (newValue: string) => void;
  dataIsLoading: boolean;
};

type SortOptions = {
  prop: string | ((any) => void);
  order: "asc" | "desc";
};
const ViabilityDataComparison = (props: Props) => {
  const {
    data,
    initialSortByProp,
    selectedKey,
    onSelectParam = (_) => {},
    dataIsLoading,
  } = props;
  const groups = groupData(data);
  const processed = processData(groups);
  const [visibleRows, setVisibleRows] = useState(10);
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    prop: !!initialSortByProp ? initialSortByProp : "alleleSymbol",
    order: "asc" as const,
  });
  const defaultSort: SortType = useMemo(() => ["alleleSymbol", "asc"], []);
  const sorted = orderBy(processed, sortOptions.prop, sortOptions.order);

  const visibleData: Array<DatasetExtra> = useMemo(
    () => sorted.slice(0, visibleRows),
    [sorted, visibleRows],
  );

  const tableHeaders = [
    { width: 1, label: "Allele", field: "alleleSymbol" },
    { width: 1, label: "Viability", field: "viabilityStatement" },
    { width: 1, label: "Zygosity", field: "zygosity" },
    { width: 2, label: "Assay", field: "parameterName" },
    { width: 1, label: "Phenotyping Centre", field: "phenotypingCentre" },
    { width: 0.5, label: "Significant sex", field: "sex" },
    { width: 1, label: "Life Stage", field: "lifeStageName" },
    { width: 1, label: "Colony Id", field: "colonyId" },
  ];

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
      {!dataIsLoading ? (
        <div className="mb-0">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <span>
              {processed && processed.length} parameter / zygosity / metadata
              group combinations tested.
            </span>
          </div>
        </div>
      ) : (
        <span>
          <Spinner animation="border" size="sm" />
          &nbsp; Loading data
        </span>
      )}
      <AnimatePresence>
        <SortableTable
          className="data-comparison-table"
          doSort={(sort) => setSortOptions({ prop: sort[0], order: sort[1] })}
          defaultSort={defaultSort}
          headers={tableHeaders}
        >
          {visibleData.map((d, i) => {
            return (
              <motion.tr
                key={d.key}
                className={getBackgroundColorForRow(d, i, selectedKey)}
                onClick={() => onSelectParam(d.key)}
                layout
                initial={{ y: 10, opacity: 0, maxHeight: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <td>
                  <AlleleSymbol symbol={d.alleleSymbol} withLabel={false} />
                </td>
                <td>
                  {d.viabilityStatement === "Call not made" ? (
                    <>{d.viabilityStatement}</>
                  ) : (
                    <strong>{d.viabilityStatement}</strong>
                  )}
                </td>
                <td>{d.zygosity}</td>
                <td>{d.parameterName}</td>
                <td>{d.phenotypingCentre}</td>
                <td>
                  {d.sex === "not_considered" ? (
                    <OverlayTrigger
                      placement="top"
                      trigger={["hover", "focus"]}
                      overlay={<Tooltip>{getSexLabel(d.sex)}</Tooltip>}
                    >
                      <span className="me-2">
                        <FontAwesomeIcon icon={getIcon(d.sex)} size="lg" />
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
                    </>
                  )}
                </td>
                <td>{d.lifeStageName}</td>
                <td>{d.colonyId}</td>
              </motion.tr>
            );
          })}
          {visibleData.length === 0 && dataIsLoading && (
            <motion.tr
              layout
              initial={{ y: 10, opacity: 0, maxHeight: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0, maxHeight: 0 }}
            >
              {[...Array(tableHeaders.length)].map((_, i) => (
                <td key={i}>
                  <Skeleton />
                </td>
              ))}
            </motion.tr>
          )}
        </SortableTable>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {visibleRows < sorted?.length && (
            <Button
              variant="secondary"
              className="white-x"
              onClick={() => setVisibleRows((prevState) => prevState + 10)}
            >
              View next 10 rows
            </Button>
          )}
        </div>
      </AnimatePresence>
    </>
  );
};

export default ViabilityDataComparison;
