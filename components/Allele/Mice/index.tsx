import React from "react";
import {
  faCartShopping,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Alert } from "react-bootstrap";
import Card from "../../Card";
import Pagination from "../../Pagination";
import _ from "lodash";
import SortableTable from "../../SortableTable";
import useQuery from "../../useQuery";

const Mice = ({
  mgiGeneAccessionId,
  alleleName,
}: {
  mgiGeneAccessionId: string;
  alleleName: string;
}) => {
  const [data, setData] = useState(null);
  const [sorted, setSorted] = useState<any[]>(null);
  const [__, loading, error] = useQuery({
    query: `/api/v1/alleles/mice/get_by_mgi_and_allele_name/${mgiGeneAccessionId}/${alleleName}`,
    afterSuccess: (raw) => {
      console.log(raw);
      const processed = raw || [];
      setData(processed);
      setSorted(_.orderBy(processed, "productId", "asc"));
    },
  });

  if (loading) {
    return (
      <Card id="mice">
        <h2>Mice</h2>
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card id="mice">
        <h2>Mice</h2>
        <Alert variant="primary">No mice products found for this allele.</Alert>
      </Card>
    );
  }

  return (
    <Card id="mice">
      <h2>Mice</h2>
      {!data && data.length == 0 ? (
        <Alert variant="primary" style={{ marginTop: "1em" }}>
          No mice products found for this allele.
        </Alert>
      ) : (
        <Pagination data={sorted}>
          {(pageData) => (
            <SortableTable
              doSort={() => {}}
              defaultSort={["title", "asc"]}
              headers={[
                { width: 3, label: "Colony Name", disabled: true },
                {
                  width: 2,
                  label: "Genetic Background",
                  disabled: true,
                },
                { width: 2, label: "Production Centre", disabled: true },
                { width: 1, label: "QC Data", disabled: true },
                {
                  width: 2,
                  label: "ES Cell/Parent Mouse Colony",
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
                    <td>{p.testStrain}</td>
                    <td>{p.productionCentre}</td>
                    <td>
                      {p.qcData.map(({ productionQC }) => (
                        <a href={productionQC} target="_blank" className="link">
                          QC data{" "}
                          <FontAwesomeIcon
                            icon={faExternalLinkAlt}
                            className="grey"
                            size="xs"
                          />
                        </a>
                      ))}
                    </td>
                    <td>{p.associatedProductEsCellName}</td>
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
export default Mice;
