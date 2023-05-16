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

const Crispr = ({
  mgiGeneAccessionId,
  alleleName,
}: {
  mgiGeneAccessionId: string;
  alleleName: string;
}) => {
  const [data, setData] = useState(null);
  const [__, loading, error] = useQuery({
    query: `/api/v1/alleles/crispr/get_by_mgi_and_allele_superscript/${mgiGeneAccessionId}/${alleleName}`,
    afterSuccess: (raw) => {
      console.log(raw);
      const processed = (raw ?? [])[0] || undefined;
      setData(processed);
    },
  });

  if (loading) {
    return (
      <Card id="esCell">
        <h2>ES Cells</h2>
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (error) {
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
      )}
    </Card>
  );
};
export default Crispr;
