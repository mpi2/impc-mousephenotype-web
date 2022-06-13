import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "react-bootstrap";
import { BodySystem } from "../../../BodySystemIcon";
import styles from "./styles.module.scss";
import _ from "lodash";
import { useState } from "react";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../../../Pagination";

const AllData = ({ data }: { data: any }) => {
  const [sort, setSort] = useState<[string, "asc" | "desc"]>(["pvalue", "asc"]);
  if (!data) {
    return null;
  }
  const sorted = _.orderBy(data, sort[0], sort[1]);

  const SortableTh = ({ label, field, width }) => {
    const selected = field === sort[0];
    const handleSelect = () => {
      if (selected) {
        setSort([sort[0], sort[1] === "asc" ? "desc" : "asc"]);
      } else {
        setSort([field, sort[1]]);
      }
    };
    return (
      <th {...(!!width ? { width: `${(width / 12) * 100}%` } : {})}>
        <button
          style={{
            fontWeight: selected ? "bold" : "normal",
          }}
          className={styles.inlineButton}
          onClick={handleSelect}
        >
          {label}{" "}
          {selected && (
            <FontAwesomeIcon
              icon={sort[1] === "asc" ? faCaretDown : faCaretUp}
            />
          )}
        </button>
      </th>
    );
  };

  return (
    <>
      <Pagination data={sorted}>
        {(currentPage) => (
          <Table striped bordered className={styles.table}>
            <thead>
              <tr>
                <SortableTh
                  width={4}
                  label="Procedure/parameter"
                  field="procedureName"
                />
                <SortableTh
                  width={2}
                  label="Physiological system"
                  field="topLevelPhenotypeTermName"
                />
                <SortableTh width={1} label="P value" field="pValue" />
                <SortableTh
                  width={2}
                  label="Life stage"
                  field="lifeStageName"
                />
                <SortableTh width={1} label="Xygosity" field="zygosity" />
                <SortableTh
                  width={2}
                  label="Significance"
                  field="significant"
                />
              </tr>
            </thead>
            <tbody>
              {currentPage.map(
                (
                  {
                    procedureName,
                    parameterName,
                    lifeStageName,
                    zygosity,
                    significant,
                    pValue,
                    topLevelPhenotype,
                  },
                  i
                ) => (
                  <tr key={`tr-${parameterName}-${i}`}>
                    <td className={styles.procedureName}>
                      <small className="grey">{procedureName} /</small>
                      <br />
                      <strong>{parameterName}</strong>
                    </td>
                    <td>
                      {(topLevelPhenotype || []).map((x) => (
                        <BodySystem
                          name={x.name}
                          key={x.id}
                          color="primary"
                          noSpacing
                        />
                      ))}
                    </td>
                    <td>
                      {!!pValue
                        ? Math.round(-Math.log10(pValue) * 1000) / 1000
                        : null}
                    </td>
                    <td>{lifeStageName}</td>
                    <td style={{ textTransform: "capitalize" }}>{zygosity}</td>
                    <td>{significant ? "Yes" : "No"}</td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
        )}
      </Pagination>
    </>
  );
};

export default AllData;
