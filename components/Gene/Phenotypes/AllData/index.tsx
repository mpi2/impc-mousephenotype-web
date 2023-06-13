import { BodySystem } from "../../../BodySystemIcon";
import styles from "./styles.module.scss";
import _ from "lodash";
import { useEffect, useState } from "react";
import Pagination from "../../../Pagination";
import SortableTable from "../../../SortableTable";
import { Alert, Form } from "react-bootstrap";
import { formatAlleleSymbol, formatPValue } from "../../../../utils";
import { allBodySystems } from "../../Summary";

const AllData = ({ data }: { data: any }) => {
  const [sorted, setSorted] = useState<any[]>(null);
  const [procedure, setProcedure] = useState(undefined);
  const [system, setSystem] = useState(undefined);

  useEffect(() => {
    setSorted(_.orderBy(data, "pValue", "asc"));
  }, [data]);

  const filtered = (sorted ?? []).filter(
    ({ procedureName, topLevelPhenotypes }) =>
      (!procedure || procedureName === procedure) &&
      (!system ||
        (topLevelPhenotypes ?? []).some(({ name }) => name === system))
  );

  const procedures = _.sortBy(_.uniq(_.map(data, "procedureName")));
  const getLabel = (name) => _.capitalize(name.replace(/ phenotype/g, ""));

  if (!data) {
    return (
      <Alert style={{ marginTop: "1em" }} variant="primary">
        All data not available
      </Alert>
    );
  }

  return (
    <>
      <div
        style={{
          paddingLeft: "0.5rem",
          paddingTop: "1rem",
          marginBottom: "1rem",
        }}
      >
        <p>
          <label
            htmlFor="procedureFilter"
            className="grey"
            style={{ marginRight: "0.5rem" }}
          >
            Procedure:
          </label>
          <Form.Select
            style={{ display: "inline-block", width: 280, marginRight: "2rem" }}
            aria-label="Filter by procedures"
            defaultValue={undefined}
            id="procedureFilter"
            className="bg-white"
            onChange={(el) => {
              setProcedure(
                el.target.value === "all" ? undefined : el.target.value
              );
            }}
          >
            <option value={"all"}>All</option>
            {procedures.map((p) => (
              <option value={p}>{p}</option>
            ))}
          </Form.Select>
          <label
            htmlFor="systemFilter"
            className="grey"
            style={{ marginRight: "0.5rem" }}
          >
            Physiological system:
          </label>
          <Form.Select
            style={{ display: "inline-block", width: 280, marginRight: "2rem" }}
            aria-label="Filter by physiological system"
            defaultValue={undefined}
            id="systemFilter"
            className="bg-white"
            onChange={(el) => {
              setSystem(
                el.target.value === "all" ? undefined : el.target.value
              );
            }}
          >
            <option value={"all"}>All</option>
            {allBodySystems.map((p) => (
              <option value={p}>{getLabel(p)}</option>
            ))}
          </Form.Select>
        </p>
      </div>
      <Pagination data={filtered}>
        {(currentPage) => (
          <SortableTable
            doSort={(sort) => {
              setSorted(_.orderBy(data, sort[0], sort[1]));
            }}
            defaultSort={["pValue", "asc"]}
            headers={[
              {
                width: 4,
                label: "Procedure/parameter",
                field: "procedureName",
              },
              {
                width: 2,
                label: "Physiological system",
                field: "topLevelPhenotypes",
              },
              { width: 1, label: "P value", field: "pValue" },
              { width: 2, label: "Life stage", field: "lifeStageName" },
              { width: 2, label: "Allele", field: "alleleSymbol" },
              { width: 1, label: "Zygosity", field: "zygosity" },
              { width: 2, label: "Significance", field: "significant" },
            ]}
          >
            {currentPage.map(
              (
                {
                  procedureName,
                  parameterName,
                  lifeStageName,
                  zygosity,
                  significant,
                  pValue,
                  topLevelPhenotypes,
                  alleleSymbol,
                },
                i
              ) => {
                const allele = formatAlleleSymbol(alleleSymbol);
                return (
                  <tr key={`tr-${parameterName}-${i}`}>
                    <td className={styles.procedureName}>
                      <small className="grey">{procedureName} /</small>
                      <br />
                      <strong>{parameterName}</strong>
                    </td>
                    <td>
                      {(topLevelPhenotypes || []).map((x) => (
                        <BodySystem
                          name={x.name}
                          key={x.id}
                          color="black"
                          noSpacing
                        />
                      ))}
                    </td>
                    <td className="orange-dark-x bold">
                      {!!pValue ? formatPValue(pValue) : "-"}
                    </td>
                    <td>{lifeStageName}</td>
                    <td>
                      {allele[0]}
                      <sup>{allele[1]}</sup>
                    </td>
                    <td style={{ textTransform: "capitalize" }}>{zygosity}</td>
                    <td>{significant ? "Yes" : "No"}</td>
                  </tr>
                );
              }
            )}
          </SortableTable>
        )}
      </Pagination>
    </>
  );
};

export default AllData;
