import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Card from "../../Card";
import Pagination from "../../Pagination";
import SortableTable from "../../SortableTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { formatAlleleSymbol } from "../../../utils";
import { Alert } from "react-bootstrap";
import _ from "lodash";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "../../../api-service";
import { Publication } from "../../PublicationsList/types";
import moment from "moment";
import MoreItemsTooltip from "../../MoreItemsTooltip";

const ALLELES_COUNT = 2;
const AllelesCell = ({ pub }: { pub: Publication }) => {
  const alleles = pub.alleles.map(allele => formatAlleleSymbol(allele.alleleSymbol));
  return (
    <>
      {alleles.slice(0, ALLELES_COUNT).map(symbol => (
        <>
          {symbol[0]}
          <sup>{symbol[1]}</sup>
          &nbsp;
        </>
      ))}
      <MoreItemsTooltip items={pub.alleles.map(a => a.alleleSymbol)} maxItems={ALLELES_COUNT}/>
    </>
  )
}

const Publications = ({ gene }: { gene: any }) => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  let totalItems = 0;
  const [sorted, setSorted] = useState<any[]>(null);
  const {data, isLoading, isError} = useQuery({
    queryKey: ['genes', router.query.pid, 'publication', page],
    queryFn: () => fetchAPI(`/api/v1/genes/${router.query.pid}/publication?page=${page}`),
    enabled: router.isReady,
    select: response => {
      totalItems = response.totalElements;
      return response.content as Array<Publication>;
    }
  });

  useEffect(() => {
    if (data) {
      setSorted(_.orderBy(data, "title", "asc"));
    }
  }, [data]);

  const getPubDate = (publication: Publication) => {
    return moment(publication.publicationDate).format("MM/YYYY");
  }

  if (isLoading) {
    return (
      <Card id="publications">
        <h2>IMPC related publications</h2>
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card id="publications">
        <h2>IMPC related publications</h2>
        <Alert variant="yellow">No data available for this section</Alert>
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
      {!!sorted && sorted.length ? (
        <Pagination data={sorted} totalItems={totalItems}>
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
                { width: 2, label: "PubMed ID", field: "pmId" },
              ]}
            >
              {pageData.map(p => {
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
                          size="xs"
                          icon={faExternalLinkAlt}
                        />
                      </a>
                    </td>
                    <td>
                      {p.journalTitle} ({getPubDate(p)})
                    </td>
                    <td>
                      <AllelesCell pub={p} />
                    </td>
                    <td>
                      <a
                        href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${p.pmId}`}
                        target="_blank"
                        className="link"
                      >
                        {p.pmId}&nbsp;
                        <FontAwesomeIcon
                          icon={faExternalLinkAlt}
                          className="grey"
                          size="xs"
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
