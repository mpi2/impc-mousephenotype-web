import React, { useEffect } from "react";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Alert } from "react-bootstrap";
import Card from "../../Card";
import Pagination from "../../Pagination";
import _ from "lodash";
import SortableTable from "../../SortableTable";
import { formatESCellName } from "@/utils";
import { faWindowMaximize } from "@fortawesome/free-regular-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";

const ESCell = ({
  mgiGeneAccessionId,
  alleleName,
  setQcData,
}: {
  mgiGeneAccessionId: string;
  alleleName: string;
  setQcData: (any) => void;
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['genes', mgiGeneAccessionId, 'alleles', 'es_cell', alleleName],
    queryFn: () => fetchAPI(`/api/v1/alleles/es_cell/get_by_mgi_and_allele_name/${mgiGeneAccessionId}/${alleleName}`),
    placeholderData: []
  });
  const [sorted, setSorted] = useState<any[]>([]);
  useEffect(() => {
    if (data) {
      setSorted(_.orderBy(data, "productId", "asc"));
    }
  }, [data]);

  if (isLoading) {
    return (
      <Card id="esCell">
        <h2>ES Cells</h2>
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card id="esCell">
        <h2>ES Cells</h2>
        <Alert variant="primary">
          No ES cell products found for this allele.
        </Alert>
      </Card>
    );
  }

  return (
    <Card id="esCell">
      <h2>ES Cells</h2>
      {!data && data.length == 0 ? (
        <Alert variant="primary" style={{ marginTop: "1em" }}>
          No ES cell products found for this allele.
        </Alert>
      ) : (
        <Pagination data={sorted}>
          {(pageData) => (
            <SortableTable
              doSort={() => {}}
              defaultSort={["title", "asc"]}
              headers={[
                { width: 2, label: "ES Cell Clone", disabled: true },
                {
                  width: 2,
                  label: "ES Cell strain",
                  disabled: true,
                },
                { width: 2, label: "Parental Cell Line", disabled: true },
                { width: 1, label: "IKMC Project", disabled: true },
                { width: 1, label: "QC Data", disabled: true },
                {
                  width: 2,
                  label: "Targeting Vector",
                  disabled: true,
                },
                { width: 2, label: "Order / Contact", disabled: true },
              ]}
            >
              {pageData.map((p) => {
                return (
                  <tr>
                    <td>
                      <strong>{p.name}</strong>
                    </td>
                    <td>{formatESCellName(p.strain)}</td>
                    <td>{p.parentEsCellLine}</td>
                    <td>{p.ikmcProjectId}</td>
                    <td>
                      {p.qcData.map(({ productionQC }) => (
                        <a
                          href="#"
                          target="_blank"
                          className="link"
                          onClick={(e) => {
                            e.preventDefault();
                            setQcData(p.qcData);
                          }}
                        >
                          View&nbsp;
                          <FontAwesomeIcon
                            icon={faWindowMaximize}
                            className="grey"
                            size="xs"
                          />
                        </a>
                      ))}
                    </td>
                    <td>{p.associatedProductVectorName}</td>
                    <td>
                      {p.orders.map(({ orderLink, orderName }) => (
                        <a
                          href={orderLink}
                          target="_blank"
                          className="link primary"
                        >
                          <FontAwesomeIcon icon={faCartShopping} /> {orderName}
                        </a>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </SortableTable>
          )}
        </Pagination>
      )}
    </Card>
  );
};
export default ESCell;
