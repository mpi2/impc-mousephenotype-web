import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Card from "../../Card";
import Pagination from "../../Pagination";
import SortableTable from "../../SortableTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { formatAlleleSymbol } from "../../../utils";
import { Alert } from "react-bootstrap";

const Publications = () => {
  const router = useRouter();

  const [publicationData, setPublicationData] = useState(null);
  const [sorted, setSorted] = useState<any[]>(null);
  useEffect(() => {
    if (!router.isReady) return;

    (async () => {
      const res = await fetch(`/api/genes/${router.query.pid}/publications`);
      if (res.ok) {
        const data = await res.json();
        setPublicationData(data);
        setSorted(_.orderBy(data, "title", "asc"));
      }
    })();
  }, [router.isReady]);

  return (
    <Card id="publications">
      <h2>IMPC related publications</h2>
      <p>
        The table below lists publications which used either products generated
        by the IMPC or data produced by the phenotyping efforts of the IMPC.
        These publications have also been associated to the gene.
      </p>
      {publicationData ? (
        <Pagination data={sorted}>
          {(pageData) => (
            <SortableTable
              doSort={(sort) => {
                setSorted(_.orderBy(publicationData, sort[0], sort[1]));
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
          No publications found that use IMPC mice or data for this gene.
        </Alert>
      )}
    </Card>
  );
};

export default Publications;
