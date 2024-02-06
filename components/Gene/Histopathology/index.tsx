import { useContext, useEffect, useState } from "react";
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
import { sectionWithErrorBoundary } from "@/hoc/sectionWithErrorBoundary";
import { GeneContext } from "@/contexts";

const Histopathology = () => {
  const router = useRouter();
  const gene = useContext(GeneContext);
  const [sorted, setSorted] = useState<any[]>(null);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['genes', router.query.pid, 'histopathology'],
    queryFn: () => fetchAPI(`/api/v1/genes/${router.query.pid}/gene_histopathology`),
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

  if (isError && error === 'No content' && gene.hasHistopathologyData) {
    return (
      <Card id="histopathology">
        <h2>Histopathology</h2>
        <Alert variant="primary">
          This gene doesn't have any significant Histopathology hits.&nbsp;
          <Link className="primary link" href={`/data/histopath/${router.query.pid}`}>
            Please click here to see the raw data
          </Link>
        </Alert>
      </Card>
    )
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
      <p>
        Summary table of phenotypes displayed during the Histopathology procedure which are considered significant.
        Full histopathology data table, including submitted images,&nbsp;
        <Link className="link primary" href={`/data/histopath/${router.query.pid}`}>can be accessed by clicking this link</Link>.
      </p>
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
            {pageData.map((p, index) => {
              const allele = formatAlleleSymbol(p.alleleSymbol);
              return (
                <tr key={index}>
                  <td>
                    <Link
                      href={`/data/histopath/${router.query.pid}?anatomy=${(
                        p.parameterName.split(" -")[0] || ""
                      ).toLowerCase()}`}
                      legacyBehavior>
                      <strong className="link">{`${p.parameterName} ${p.mpathTermName}`}</strong>
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

export default sectionWithErrorBoundary(Histopathology, "Histopathology", "histopathology");
