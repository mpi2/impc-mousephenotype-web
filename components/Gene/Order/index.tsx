import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { formatAlleleSymbol } from "@/utils";
import Card from "../../Card";
import Pagination from "../../Pagination";
import SortableTable from "../../SortableTable";
import styles from "./styles.module.scss";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import { GeneOrder } from "@/models/gene";
import { sectionWithErrorBoundary } from "@/hoc/sectionWithErrorBoundary";
import { NumAllelesContext } from "@/contexts";

const Order = ({ allelesStudied }: { allelesStudied: Array<string> }) => {
  const router = useRouter();
  const [sorted, setSorted] = useState<any[]>(null);
  const { setNumOfAlleles } = useContext(NumAllelesContext);
  const { isLoading, isError, data: filtered } = useQuery({
    queryKey: ['genes', router.query.pid, 'order'],
    queryFn: () => fetchAPI(`/api/v1/genes/${router.query.pid}/order`),
    select: data => data.filter(
      d =>
        d.productTypes.length > 1 ||
        !["intermediate_vector", "crispr"].includes(d.productTypes[0])
    ) as Array<GeneOrder>,
    enabled: router.isReady
  });
  useEffect(() => {
    if (filtered) {
      setSorted(_.orderBy(filtered, "alleleSymbol", "asc"));
    }
  }, [filtered]);

  useEffect(() => {
    if (sorted?.length) {
      setNumOfAlleles(sorted.length);
    }
  }, [sorted]);

  if (isLoading) {
    return (
      <Card id="order">
        <h2>Order Mouse and ES Cells</h2>
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card id="order">
        <h2>Order Mouse and ES Cells</h2>
        <Alert variant="primary">No data available for this section.</Alert>
      </Card>
    );
  }

  return (
    <Card id="order">
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
            <>
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
                {pageData.map((d, index) => {
                  const allele = formatAlleleSymbol(d.alleleSymbol);
                  return (
                    <tr key={index}>
                      <td>
                        <strong className={styles.link}>
                          {allele[0]}
                          <sup>{allele[1]}</sup>
                          {allelesStudied.includes(d.alleleSymbol) && (
                            <span className="secondary">&nbsp;*</span>
                          )}
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
                          className="link primary small"
                        >
                          <strong>View products</strong>&nbsp;
                          <FontAwesomeIcon icon={faChevronRight} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </SortableTable>
              <p className="small">
                <span className="secondary">*</span>&nbsp;:
                This allele has been studied by the IMPC
              </p>
            </>
          )}
        </Pagination>
      )}
    </Card>
  );
};

export default sectionWithErrorBoundary(Order, 'Order Mouse and ES Cells', 'order');
