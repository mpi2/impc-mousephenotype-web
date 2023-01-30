import { useState } from "react";
import { useRouter } from "next/router";
import Card from "../../Card";
import Pagination from "../../Pagination";
import SortableTable from "../../SortableTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMars, faVenus } from "@fortawesome/free-solid-svg-icons";
import { formatAlleleSymbol } from "../../../utils";
import { Alert } from "react-bootstrap";
import Link from "next/link";
import useQuery from "../../useQuery";
import _ from "lodash";

const Histopathology = ({ gene }: { gene: any }) => {
  const router = useRouter();

  const [sorted, setSorted] = useState<any[]>(null);
  const [data, loading, error] = useQuery({
    // query: `/api/v1/genes/${"MGI:2143539" || router.query.pid}/histopathology`,
    query: `/api/v1/genes/${router.query.pid}/histopathology`,
    afterSuccess: (data) => {
      setSorted(_.orderBy(data, "parameterName", "asc"));
    },
  });

  if (loading) {
    return (
      <Card id="histopathology">
        <h2>Histopathology</h2>
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card id="histopathology">
        <h2>Histopathology</h2>
        <Alert variant="yellow">No data available for this section.</Alert>
      </Card>
    );
  }

  return (
    <Card id="histopathology">
      <h2>Histopathology</h2>
      <p>
        Summary table of phenotypes displayed during the Histopathology
        procedure which are considered significant. Full histopathology data
        table, including submitted images, can be accessed by clicking any row
        in this table.
      </p>
      {data ? (
        <Pagination data={sorted}>
          {(pageData) => (
            <SortableTable
              doSort={(sort) => {
                setSorted(_.orderBy(data, sort[0], sort[1]));
              }}
              defaultSort={["parameterName", "asc"]}
              headers={[
                { width: 4, label: "Phenotype", field: "parameterName" },
                {
                  width: 2,
                  label: "Allele",
                  field: "alleleSymbol",
                },
                { width: 2, label: "Zygosity", field: "zygosity" },
                { width: 2, label: "Sex", field: "sex" },
                { width: 2, label: "Life Stage", field: "lifeStageName" },
              ]}
            >
              {pageData.map((p) => {
                const allele = formatAlleleSymbol(p.alleleSymbol);
                return (
                  <tr>
                    <td>
                      <Link
                        href={`/histopath/${router.query.pid}?anatomy=${(
                          p.parameterName.split(" -")[0] || ""
                        ).toLowerCase()}`}
                      >
                        <strong className="link">{p.parameterName}</strong>
                      </Link>
                    </td>
                    <td>
                      {allele[0]}
                      <sup>{allele[1]}</sup>
                    </td>

                    <td>{p.zygosity}</td>
                    <td>
                      <FontAwesomeIcon
                        icon={p.sex == "female" ? faVenus : faMars}
                      />{" "}
                      {p.sex}
                    </td>
                    <td>{p.lifeStageName}</td>
                  </tr>
                );
              })}
            </SortableTable>
          )}
        </Pagination>
      ) : (
        <Alert variant="primary">
          There is no histopathology data found for {gene.geneSymbol}.
        </Alert>
      )}
    </Card>
  );
};

export default Histopathology;
