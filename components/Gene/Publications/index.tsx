import { useState } from "react";
import { useRouter } from "next/router";
import Card from "../../Card";
import Pagination from "../../Pagination";
import SortableTable from "../../SortableTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { formatAlleleSymbol } from "../../../utils";
import { Alert } from "react-bootstrap";
import useQuery from "../../useQuery";
import _ from "lodash";

const Publications = ({ gene }: { gene: any }) => {
  const router = useRouter();
  const [sorted, setSorted] = useState<any[]>(null);
  const [data, loading, error] = useQuery({
    // query: `/api/v1/genes/${"MGI:1860086" || router.query.pid}/publication`,
    query: `/api/v1/genes/${router.query.pid}/publication`,
    afterSuccess: (data) => {
      setSorted(_.orderBy(data, "title", "asc"));
    },
  });

  if (loading) {
    return (
      <Card id="publications">
        <h2>IMPC related publications</h2>
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card id="publications">
        <h2>IMPC related publications</h2>
        <Alert variant="primary">Error loading publications: {error}</Alert>
      </Card>
    );
  }

  return (
    <Card id="publications">
      <h2>IMPC related publications</h2>
      <p>
        The table below lists publications which used either products generated
        by the IMPC or data produced by the phenotyping efforts of the IMPC.
        These publications have also been associated to the {gene.geneSymbol}{" "}
        gene.
      </p>
      {data ? (
        <Pagination data={sorted}>
          {(pageData) => (
            <SortableTable
              doSort={(sort) => {
                setSorted(_.orderBy(data, sort[0], sort[1]));
              }}
              defaultSort={["title", "asc"]}
              headers={[
                { width: 5, label: "Title", field: "title" },
                {
                  width: 3,
                  label: "Journal",
                  field: "journalTitle",
                },
                { width: 2, label: "IMPC Allele", field: "alleleSymbol" },
                { width: 2, label: "PubMed ID", field: "pmcid" },
              ]}
            >
              {pageData.map((p) => {
                const allele = formatAlleleSymbol(p.alleleSymbol);
                return (
                  <tr>
                    <td>
                      <a
                        className="link"
                        target="_blank"
                        href={`https://www.doi.org/${p.doi}`}
                      >
                        <strong>{p.title}</strong>{" "}
                        <FontAwesomeIcon
                          className="grey"
                          icon={faExternalLinkAlt}
                        />
                      </a>
                    </td>
                    <td>
                      {p.journalTitle} ({p.monthOfPublication}/
                      {p.yearOfPublication})
                    </td>
                    <td>
                      {allele[0]}
                      <sup>{allele[1]}</sup>
                    </td>
                    <td>
                      <a
                        href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${p.pmcid}`}
                        target="_blank"
                        className="link"
                      >
                        {p.pmcid}{" "}
                        <FontAwesomeIcon
                          icon={faExternalLinkAlt}
                          className="grey"
                        />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </SortableTable>
          )}
        </Pagination>
      ) : (
        <Alert variant="primary">
          No publications found that use IMPC mice or data for the{" "}
          {gene.geneSymbol} gene.
        </Alert>
      )}
    </Card>
  );
};

export default Publications;
