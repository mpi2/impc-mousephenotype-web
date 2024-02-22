import React, { useEffect } from "react";
import { faCartShopping, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import Card from "../../Card";
import Pagination from "../../Pagination";
import _ from "lodash";
import SortableTable from "../../SortableTable";
import { faWindowMaximize } from "@fortawesome/free-regular-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";

const Mice = ({
  mgiGeneAccessionId,
  alleleName,
  isCrispr,
  setQcData,
}: {
  mgiGeneAccessionId: string;
  alleleName: string;
  isCrispr: boolean;
  setQcData: (any) => void;
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['genes', mgiGeneAccessionId, 'alleles', 'mice', alleleName],
    queryFn: () => fetchAPI(`/api/v1/alleles/mice/get_by_mgi_and_allele_name/${mgiGeneAccessionId}/${alleleName}`),
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
      <Card id="mice">
        <h2>Mice</h2>
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card id="mice">
        <h2>Mice</h2>
        <Alert variant="primary">No mice products found for this allele.</Alert>
      </Card>
    );
  }

  const fixedTissuesLinks: Array<any> = _.uniqBy(data.flatMap(item => item.tissueDistribution), 'tissueEnquiryLink');
  return (
    <Card id="mice">
      <h2>Mice</h2>
      {!data && data.length == 0 ? (
        <Alert variant="primary" style={{ marginTop: "1em" }}>
          No mice products found for this allele.
        </Alert>
      ) : (
        <>
          <Pagination
            data={sorted}
            additionalBottomControls={
              <div>
                {fixedTissuesLinks.map(tissue =>
                    <Button style={{marginRight: '0.5rem'}} href={tissue.tissueEnquiryLink} variant="secondary">
                <span className="white">
                  Make a {tissue.tissueType} enquiry to {tissue.tissueDistributionCentre}
                </span>
                    </Button>
                )}
              </div>
            }
          >
            {(pageData) => (
              <SortableTable
                doSort={() => {
                }}
                defaultSort={["title", "asc"]}
                headers={[
                  {width: 3, label: "Colony Name", disabled: true},
                  {
                    width: 2,
                    label: "Genetic Background",
                    disabled: true,
                  },
                  { width: 2, label: "Production Centre", disabled: true },
                  { width: 1, label: "QC Data", disabled: true },
                  ...(isCrispr
                    ? []
                    : [
                        {
                          width: 2,
                          label: "ES Cell/Parent Mouse Colony",
                          disabled: true,
                        },
                      ]
                  ),
                  { width: 2, label: "Order / Contact", disabled: true },
                ]}
              >
                {pageData.map((p) => {
                  return (
                    <tr>
                      <td>
                        <strong>{p.name}</strong>
                      </td>
                      <td>{p.backgroundColonyStrain}</td>
                      <td>{p.productionCentre}</td>

                      <td>
                        {!!p.qcData && Object.keys(p.qcData).length > 0 && (
                          <a
                            href="#"
                            target="_blank"
                            className="link"
                            onClick={(e) => {
                              e.preventDefault();
                              setQcData(p.qcData);
                            }}
                          >
                            View{" "}
                            <FontAwesomeIcon
                              icon={faWindowMaximize}
                              className="grey"
                              size="xs"
                            />
                          </a>
                        )}
                      </td>
                      {!isCrispr && (
                        <>
                          <td>{p.associatedProductEsCellName}</td>
                        </>
                      )}
                      <td>
                        {p.orders.map(({ orderLink, orderName }) => (
                          <a
                            href={orderLink}
                            target="_blank"
                            className="link primary"
                          >
                            <FontAwesomeIcon
                              icon={
                                orderLink.includes("mailto:")
                                  ? faEnvelope
                                  : faCartShopping
                              }
                            />{" "}
                            {orderName}
                          </a>
                        ))}
                      </td>
                    </tr>
                  );
                })}
              </SortableTable>
            )}
          </Pagination>
        </>
      )}
    </Card>
  );
};
export default Mice;
