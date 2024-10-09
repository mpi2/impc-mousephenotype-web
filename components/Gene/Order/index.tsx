import { orderBy } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { formatAlleleSymbol } from "@/utils";
import Card from "../../Card";
import Pagination from "../../Pagination";
import SortableTable from "../../SortableTable";
import styles from "./styles.module.scss";
import { sectionWithErrorBoundary } from "@/hoc/sectionWithErrorBoundary";
import { NumAllelesContext } from "@/contexts";
import Skeleton from "react-loading-skeleton";
import { AlleleSymbol, SectionHeader } from "@/components";
import { orderPhenotypedSelectionChannel } from "@/eventChannels";
import { useGeneOrderQuery } from "@/hooks";
import { GeneOrder } from "@/models/gene";

type OrderProps = {
  allelesStudied: Array<string>;
  allelesStudiedLoading: boolean;
  orderDataFromServer: Array<GeneOrder>;
};

const Order = ({
  allelesStudied,
  allelesStudiedLoading,
  orderDataFromServer,
}: OrderProps) => {
  const router = useRouter();
  const [sorted, setSorted] = useState<any[]>(
    orderBy(orderDataFromServer, "alleleSymbol", "asc")
  );
  const { setNumOfAlleles } = useContext(NumAllelesContext);
  const {
    isFetching,
    isError,
    data: filtered,
  } = useGeneOrderQuery(
    router.query.pid as string,
    router.isReady && orderDataFromServer?.length === 0
  );

  const getProductURL = (allele: string, product: string) => {
    const anchorObjs = {
      mouse: "mice",
      "es cell": "esCell",
      "targeting vector": "targetingVector",
    };
    return `/alleles/${router.query.pid}/${allele}#${anchorObjs[product]}`;
  };

  const orderData = orderDataFromServer || filtered;

  useEffect(() => {
    if (orderData) {
      setSorted(orderBy(orderData, "alleleSymbol", "asc"));
    }
  }, [orderData]);

  useEffect(() => {
    if (sorted?.length) {
      setNumOfAlleles(sorted.length);
    }
  }, [sorted]);

  useEffect(() => {
    if (allelesStudied.length > 0) {
      setSorted(
        sorted?.map((geneOrder) => ({
          ...geneOrder,
          phenotyped: allelesStudied.includes(geneOrder.alleleSymbol),
        }))
      );
    }
  }, [allelesStudied]);

  if (isFetching) {
    return (
      <Card id="order">
        <SectionHeader
          containerId="#order"
          title="Order Mouse and ES Cells"
          href="https://dev.mousephenotype.org/help/mouse-production/ordering-products/"
        />
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card id="order">
        <SectionHeader
          containerId="#order"
          title="Order Mouse and ES Cells"
          href="https://dev.mousephenotype.org/help/mouse-production/ordering-products/"
        />
        <Alert variant="primary">No data available for this section.</Alert>
      </Card>
    );
  }

  return (
    <Card id="order">
      <SectionHeader
        containerId="#order"
        title="Order Mouse and ES Cells"
        href="https://dev.mousephenotype.org/help/mouse-production/ordering-products/"
      />
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
                  setSorted(orderBy(sorted, sort[0], sort[1]));
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
                    width: 1,
                    label: "Phenotyped",
                    field: "phenotyped",
                  },
                  {
                    width: 2,
                    label: "Products",
                    field: "alleleDescription",
                  },
                ]}
              >
                {pageData.map((d, index) => {
                  const allele = formatAlleleSymbol(d.alleleSymbol);
                  return (
                    <tr key={index}>
                      <td>
                        <strong className={styles.link}>
                          <AlleleSymbol
                            symbol={d.alleleSymbol}
                            withLabel={false}
                          />
                        </strong>
                      </td>
                      <td>{d.alleleDescription}</td>
                      <td>
                        {allelesStudiedLoading ? (
                          <Skeleton inline />
                        ) : allelesStudied.includes(d.alleleSymbol) ? (
                          <Link
                            href="#data"
                            className="primary link"
                            onClick={() =>
                              orderPhenotypedSelectionChannel.emit(
                                "onAlleleSelected",
                                d.alleleSymbol
                              )
                            }
                          >
                            Yes
                          </Link>
                        ) : (
                          <>No</>
                        )}
                      </td>
                      <td className="text-capitalize">
                        {d.productTypes
                          .filter(
                            (x) =>
                              !(x === "intermediate_vector" || x === "crispr")
                          )
                          .map((product: string) => product.replace(/_/g, " "))
                          .map((product: string, index: number) => (
                            <Fragment key={`${product}-${index}`}>
                              <Link
                                key={index}
                                href={getProductURL(allele[1], product)}
                                className="primary link"
                              >
                                {product}
                              </Link>
                              <br />
                            </Fragment>
                          )) || "None"}
                      </td>
                    </tr>
                  );
                })}
              </SortableTable>
            </>
          )}
        </Pagination>
      )}
    </Card>
  );
};

export default sectionWithErrorBoundary(
  Order,
  "Order Mouse and ES Cells",
  "order"
);
