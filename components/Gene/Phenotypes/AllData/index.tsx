import { BodySystem } from "../../../BodySystemIcon";
import styles from "./styles.module.scss";
import _ from "lodash";
import { useEffect, useState } from "react";
import Pagination from "../../../Pagination";
import SortableTable from "../../../SortableTable";
import { Alert } from "react-bootstrap";

const AllData = ({ data }: { data: any }) => {
  const [sorted, setSorted] = useState<any[]>(null);

  useEffect(() => {
    setSorted(_.orderBy(data, "pValue", "asc"));
  }, [data]);

  if (!data) {
    return (
      <Alert style={{ marginTop: "1em" }} variant="primary">
        All data not available
      </Alert>
    );
  }

  return (
    <>
      <Pagination data={sorted}>
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
                field: "topLevelPhenotypeTermName",
              },
              { width: 1, label: "P value", field: "pValue" },
              { width: 2, label: "Life stage", field: "lifeStageName" },
              { width: 1, label: "Xygosity", field: "zygosity" },
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
                      ? Math.round(-Math.log10(Number(pValue)) * 1000) / 1000
                      : "-"}
                  </td>
                  <td>{lifeStageName}</td>
                  <td style={{ textTransform: "capitalize" }}>{zygosity}</td>
                  <td>{significant ? "Yes" : "No"}</td>
                </tr>
              )
            )}
          </SortableTable>
        )}
      </Pagination>
    </>
  );
};

export default AllData;
