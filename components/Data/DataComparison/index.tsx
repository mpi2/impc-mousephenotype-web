import Link from "next/link";
import { useEffect, useState } from "react";
import { BodySystem } from "../../BodySystemIcon";
import Pagination from "../../Pagination";
import SortableTable from "../../SortableTable";
import styles from "./styles.module.scss";
import _ from "lodash";
import { formatAlleleSymbol, formatPValue } from "../../../utils";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const DataComparison = ({ data }) => {
  const groups = data?.reduce((acc, d) => {
    const {
      alleleAccessionId,
      parameterStableId,
      zygosity,
      sex,
      reportedPValue,
    } = d;

    const key = `${alleleAccessionId}-${parameterStableId}-${zygosity}`;
    if (acc[key]) {
      if (acc[key].reportedPValue < reportedPValue) {
        acc[key].reportedPValue = Number(reportedPValue);
        acc[key].sex = sex;
      }
    } else {
      acc[key] = { ...d };
    }
    acc[key][`pValue_${sex}`] = Number(reportedPValue);

    return acc;
  }, {});

  const processed =
    (groups ? Object.values(groups) : []).map((d: any) => ({
      ...d,
      topLevelPhenotype: d.topLevelPhenotypes[0]?.name,
      phenotype: d.significantPhenotype.name,
      id: d.significantPhenotype.id,
    })) || [];

  const [sorted, setSorted] = useState<any[]>(null);

  useEffect(() => {
    setSorted(_.orderBy(processed, "phenotype", "asc"));
  }, [data]);

  if (!data) {
    return null;
  }

  const getPValueSortFn = (key: string) => {
    return (d) => {
      return d[`pValue_${key}`] ?? 0;
    };
  };

  return (
    <Pagination data={sorted}>
      {(pageData) => (
        <SortableTable
          doSort={(sort) => {
            setSorted(_.orderBy(processed, sort[0], sort[1]));
          }}
          defaultSort={["parameter", "asc"]}
          headers={[
            { width: 0.5, label: "#", disabled: true },
            { width: 3, label: "Parameter", field: "parameter" },
            {
              width: 2,
              label: "Phenotyping Centre",
              field: "phenotypingCentre",
            },
            { width: 2, label: "Allele", field: "alleleSymbol" },
            { width: 1, label: "Zyg", field: "zygosity" },
            { width: 1, label: "Life Stage", field: "lifeStageName" },
            { width: 1, label: "Metadata split flag", field: "flag" },
            {
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
            },
          ]}
        >
          {pageData.map((d, i) => {
            const allele = formatAlleleSymbol(d.alleleSymbol);
            return (
              <tr>
                <td>{i + 1}</td>
                <td>{d.parameterName}</td>
                <td>{d.phenotypingCentre}</td>
                <td>
                  {allele[0]}
                  <sup>{allele[1]}</sup>
                </td>
                <td>{d.zygosity}</td>
                <td>{d.lifeStageName}</td>
                <td>??</td>
                {["male", "female", "not_considered"].map((col) => {
                  const isMostSignificant = d.sex === col;
                  return (
                    <td
                      className={
                        isMostSignificant
                          ? "bold orange-dark-x bg-orange-light-x"
                          : ""
                      }
                    >
                      {!!d[`pValue_${col}`] ? (
                        formatPValue(d[`pValue_${col}`])
                      ) : (
                        <OverlayTrigger
                          placement="top"
                          trigger={["hover", "focus"]}
                          overlay={
                            <Tooltip>Not significant or not tested</Tooltip>
                          }
                        >
                          <span className="grey">—</span>
                        </OverlayTrigger>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </SortableTable>
      )}
    </Pagination>
  );
};

export default DataComparison;
