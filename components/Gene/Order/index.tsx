import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import { Alert } from "react-bootstrap";
import { formatAlleleSymbol } from "../../../utils";
import Card from "../../Card";
import Pagination from "../../Pagination";
import SortableTable from "../../SortableTable";
import styles from "./styles.module.scss";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "../../../api-service";

const Order = ({ gene }: { gene: any }) => {
  const router = useRouter();
  const [sorted, setSorted] = useState<any[]>(null);
  const { isLoading, isError, data: filtered } = useQuery({
    queryKey: ['genes', router.query.pid, 'order'],
    queryFn: () => fetchAPI(`/api/v1/genes/${router.query.pid}/order`),
    select: data => data.filter(
      d =>
        d.productTypes.length > 1 ||
        !["intermediate_vector", "crispr"].includes(d.productTypes[0])
    ),
    enabled: router.isReady
  });
  useEffect(() => {
    if (filtered) {
      setSorted(_.orderBy(filtered, "alleleSymbol", "asc"));
    }
  }, [filtered]);

  if (isLoading) {
    return (
      <Card id="purchase">
        <h2>Order Mouse and ES Cells</h2>
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card id="purchase">
        <h2>Order Mouse and ES Cells</h2>
        <Alert variant="primary">No data available for this section.</Alert>
      </Card>
    );
  }

  return (
    <Card id="purchase">
      <h2>Order Mouse and ES Cells</h2>
      <div className="mb-4">
        <p>
          All available products are supplied via our member's centres or
          partnerships. When ordering a product from the IMPC you will be
          redirected to one of their websites or prompted to start an email.
        </p>
      </div>
      {!sorted || !sorted.length ? (
        <Alert className={styles.table} variant="yellow">
          No product found for this gene.
        </Alert>
      ) : (
        <Pagination data={sorted}>
          {(pageData) => (
            <SortableTable
              doSort={(sort) => {
                setSorted(_.orderBy(filtered, sort[0], sort[1]));
              }}
              defaultSort={["alleleSymbol", "asc"]}
              headers={[
                { width: 3, label: "MGI Allele", field: "alleleSymbol" },
                {
                  width: 4,
                  label: "Allele Type",
                  field: "productTypes",
                },
                {
                  width: 3,
                  label: "Produced",
                  field: "alleleDescription",
                },
                {
                  width: 2,
                  label: "",
                  disabled: true,
                },
              ]}
            >
              {pageData.map((d) => {
                const allele = formatAlleleSymbol(d.alleleSymbol);
                return (
                  <tr>
                    <td>
                      <strong className={styles.link}>
                        {allele[0]}
                        <sup>{allele[1]}</sup>
                      </strong>
                    </td>
                    <td>{d.alleleDescription}</td>
                    <td className="text-capitalize">
                      {(
                        (d.productTypes ?? [])
                          .filter(
                            (x) =>
                              !(x === "intermediate_vector" || x === "crispr")
                          )
                          .join(", ") || "None"
                      ).replace(/_/g, " ")}
                    </td>
                    <td className="text-capitalize">
                      <Link
                        href={`/alleles/${router.query.pid}/${allele[1]}`}
                        className="link primary"
                      >
                        View products
                        <FontAwesomeIcon icon={faArrowRight} />
                      </Link>
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

export default Order;
