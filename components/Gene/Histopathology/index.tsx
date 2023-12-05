import {useEffect, useState} from "react";
import { useRouter } from "next/router";
import Card from "../../Card";
import Pagination from "../../Pagination";
import SortableTable from "../../SortableTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMars, faVenus } from "@fortawesome/free-solid-svg-icons";
import { formatAlleleSymbol } from "@/utils";
import { Alert } from "react-bootstrap";
import Link from "next/link";
import _ from "lodash";
import { fetchAPI } from "@/api-service";
import { useQuery } from "@tanstack/react-query";
import { GeneHistopathology } from "@/models/gene";

const Histopathology = ({ gene }: { gene: any }) => {
  const router = useRouter();
  const [sorted, setSorted] = useState<any[]>(null);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['genes', router.query.pid, 'histopathology'],
    queryFn: () => fetchAPI(`/api/v1/genes/${router.query.pid}/histopathology`),
    placeholderData: null,
    enabled: router.isReady,
    select: data => data as Array<GeneHistopathology>,
  });

  useEffect(() => {
    if (data) {
      setSorted(_.orderBy(data, "parameterName", "asc"));
    }
  }, [data]);

  if (isLoading) {
    return (
      <Card id="histopathology">
        <h2>Histopathology</h2>
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (isError || !sorted) {
    return (
      <Card id="histopathology">
        <h2>Histopathology</h2>
        <Alert variant="primary">
          There is no histopathology data found for {gene.geneSymbol}.
        </Alert>
      </Card>
    );
  }

  return (
    <Card id="histopathology">
      <h2>Histopathology</h2>
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
                      legacyBehavior>
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
    </Card>
  );
};

export default Histopathology;
