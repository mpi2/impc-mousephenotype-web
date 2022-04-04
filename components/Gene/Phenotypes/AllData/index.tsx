import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "react-bootstrap";
import { BodySystem } from "../../../BodySystemIcon";
import styles from "./styles.module.scss";
import _ from "lodash";
import { useState } from "react";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

const AllData = ({ data }: { data: any }) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState<[string, "asc" | "desc"]>(["pvalue", "asc"]);
  if (!data) {
    return null;
  }
  const sorted = _.orderBy(data.geneStatisticalResults, sort[0], sort[1]);

  const currentPage = sorted.slice(pageSize * page, pageSize * (page + 1));

  const canGoBack = page >= 1;
  const canGoForward = page * (pageSize + 1) < sorted.length;

  const SortableTh = ({ label, field, width }) => {
    const selected = field === sort[0];
    const handleSelect = () => {
      setPage(0);
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
            background: "none",
            appearance: "none",
            border: "none",
            fontWeight: selected ? "bold" : "normal",
          }}
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
            <SortableTh width={1} label="P value" field="pvalue" />
            <SortableTh width={2} label="Life stage" field="lifeStageName" />
            <SortableTh width={1} label="Xygosity" field="zygosity" />
            <SortableTh width={2} label="Significance" field="significance" />
          </tr>
        </thead>
        <tbody>
          {currentPage.map(
            ({
              procedureName,
              parameterName,
              lifeStageName,
              zygosity,
              significance,
              pvalue,
              topLevelPhenotypeTermName,
            }) => (
              <tr>
                <td className={styles.procedureName}>
                  <small className="grey">{procedureName} /</small>
                  <br />
                  <strong>{parameterName}</strong>
                </td>
                {/* <td>
                <strong>{parameterName}</strong>
              </td> */}
                <td>
                  {(topLevelPhenotypeTermName || []).map((x) => (
                    <BodySystem name={x} color="primary" noSpacing />
                  ))}
                </td>
                <td>
                  {!!pvalue
                    ? Math.round(-Math.log10(pvalue) * 1000) / 1000
                    : null}
                </td>
                <td>{lifeStageName}</td>
                <td>{zygosity}</td>
                <td>{significance}</td>
              </tr>
            )
          )}
        </tbody>
      </Table>
      <p style={{ marginTop: 30 }}>
        Rows per page:{" "}
        <select
          onChange={(e) => {
            const value = Number(e.target.value);
            const newPage = Math.round((pageSize / value) * page);
            setPageSize(value);
            setPage(newPage);
          }}
          value={pageSize}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>{" "}
        <button onClick={() => setPage(page - 1)} disabled={!canGoBack}>
          &lt; Back
        </button>{" "}
        Page {page + 1}{" "}
        <button onClick={() => setPage(page + 1)} disabled={!canGoForward}>
          Next &gt;
        </button>
      </p>
    </>
  );
};

export default AllData;
