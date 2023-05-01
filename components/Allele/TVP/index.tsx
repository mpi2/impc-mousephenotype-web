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
import Link from "next/link";

const TargetingVector = ({
  mgiGeneAccessionId,
  alleleName,
}: {
  mgiGeneAccessionId: string;
  alleleName: string;
}) => {
  const [data, setData] = useState(null);
  const [sorted, setSorted] = useState<any[]>(null);
  const [__, loading, error] = useQuery({
    query: `/api/v1/alleles/tvp/get_by_mgi_and_allele_name/${mgiGeneAccessionId}/${alleleName}`,
    afterSuccess: (raw) => {
      console.log(raw);
      const processed = raw || [];
      setData(processed);
      setSorted(_.orderBy(processed, "productId", "asc"));
    },
  });

  if (loading) {
    return (
      <Card id="targetingVector">
        <h2>Targeting vectors</h2>
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card id="targetingVector">
        <h2>Targeting vectors</h2>
        <Alert variant="primary">
          No targeting vector products found for this allele.
        </Alert>
      </Card>
    );
  }

  return (
    <Card id="targetingVector">
      <h2>Targeting vectors</h2>
      {!data && data.length == 0 ? (
        <Alert variant="primary" style={{ marginTop: "1em" }}>
          No targeting vector products found for this allele.
        </Alert>
      ) : (
        <Pagination data={sorted}>
          {(pageData) => (
            <SortableTable
              doSort={() => {}}
              defaultSort={["title", "asc"]}
              headers={[
                { width: 2, label: "Design Oligos", disabled: true },
                {
                  width: 2,
                  label: "Targeting Vector",
                  disabled: true,
                },
                { width: 1, label: "Cassette", disabled: true },
                { width: 1, label: "Backbone", disabled: true },
                { width: 1.5, label: "IKMC Project", disabled: true },
                {
                  width: 1.5,
                  label: "Genbank File",
                  disabled: true,
                },
                {
                  width: 1.5,
                  label: "Vector Map",
                  disabled: true,
                },
                { width: 1.5, label: "Order", disabled: true },
              ]}
            >
              {pageData.map((p) => {
                return (
                  <tr>
                    <td>
                      <Link
                        href={`/designs/${p.designOligos}?accession=${mgiGeneAccessionId}`}
                        scroll={false}
                        className="secondary"
                      >
                        {p.designOligos ?? "View design oligo"}{" "}
                      </Link>
                      <strong>{p.designOligos}</strong>
                    </td>
                    <td>{p.name}</td>
                    <td>{p.cassette}</td>
                    <td>{p.backbone}</td>
                    <td>{p.ikmcProjectId}</td>
                    <td>
                      {!!p.otherLinks.genbankFile ? (
                        <a
                          href={p.otherLinks.genbankFile}
                          target="_blank"
                          className="link"
                          style={{ textTransform: "capitalize" }}
                        >
                          Genbank file{" "}
                          <FontAwesomeIcon
                            icon={faExternalLinkAlt}
                            className="grey"
                            size="xs"
                          />
                        </a>
                      ) : (
                        "None"
                      )}
                    </td>
                    <td>
                      {!!p.otherLinks.alleleImage ? (
                        <a
                          href={p.otherLinks.alleleImage}
                          target="_blank"
                          className="link"
                          style={{ textTransform: "capitalize" }}
                        >
                          Vector map{" "}
                          <FontAwesomeIcon
                            icon={faExternalLinkAlt}
                            className="grey"
                            size="xs"
                          />
                        </a>
                      ) : (
                        "None"
                      )}
                    </td>
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
export default TargetingVector;
