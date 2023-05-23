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

const IntermediateVector = ({
  mgiGeneAccessionId,
  alleleName,
}: {
  mgiGeneAccessionId: string;
  alleleName: string;
}) => {
  const [data, setData] = useState(null);
  const [sorted, setSorted] = useState<any[]>(null);
  const [__, loading, error] = useQuery({
    query: `/api/v1/alleles/ivp/get_by_mgi_and_allele_name/${mgiGeneAccessionId}/${alleleName}`,
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
        <h2>Intermediate vectors</h2>
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card id="intermediateVector">
        <h2>Intermediate vectors</h2>
        <Alert variant="primary">
          No intermediate vector products found for this allele.
        </Alert>
      </Card>
    );
  }

  return (
    <Card id="intermediateVector">
      <h2>Intermediate vectors</h2>
      {!data && data.length == 0 ? (
        <Alert variant="primary" style={{ marginTop: "1em" }}>
          No intermediate vector products found for this allele.
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
                  label: "Intermediate Vector",
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
                  width: 1,
                  label: "Vector Map",
                  disabled: true,
                },
                { width: 2, label: "Order", disabled: true },
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
                    <td>{p.targetingVector}</td>
                    <td>{p.cassette}</td>
                    <td>{p.backbone}</td>
                    <td>{p.ikmcProject}</td>
                    <td>
                      {!!p.genbankFile ? (
                        <a
                          href={p.genbankFile}
                          target="_blank"
                          className="link"
                        >
                          Genbank{" "}
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
                      {!!p.vectorMap ? (
                        <a href={p.vectorMap} target="_blank" className="link">
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
                      <a
                        href={p.order}
                        target="_blank"
                        className="link primary"
                      >
                        <FontAwesomeIcon icon={faCartShopping} /> Order
                      </a>
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
export default IntermediateVector;
