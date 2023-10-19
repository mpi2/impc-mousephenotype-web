import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Alert, Tab, Tabs } from "react-bootstrap";
import Card from "../../Card";
import Pagination from "../../Pagination";
import _ from "lodash";
import SortableTable from "../../SortableTable";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";


const getExpressionRate = (p) => {
  return p.expression || p.noExpression
    ? Math.round((p.expression * 10000) / (p.expression + p.noExpression)) / 100
    : -1;
};

const Expressions = ({ gene } : { gene: any }) => {
  const router = useRouter();
  const [sorted, setSorted] = useState<any[]>(null);
  const [tab, setTab] = useState("adultExpressions");
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['gene', router.query.pid, 'expression'],
    queryFn: () => fetchAPI(`/api/v1/genes/${router.query.pid}/expression`),
    select: raw => raw?.map(d => ({
      ...d,
      expressionRate: getExpressionRate(d.mutantCounts),
      wtExpressionRate: getExpressionRate(d.controlCounts),
    })) || [],
    enabled: router.isReady
  });
  useEffect(() => {
    if (data) {
      setSorted(_.orderBy(data, "parameterName", "asc"));
    }
  }, [data])
  const adultData = sorted
    ? sorted.filter((x) => x.lacZLifestage === "adult")
    : [];
  const embryoData = sorted
    ? sorted.filter((x) => x.lacZLifestage === "embryo")
    : [];

  const selectedData = tab === "adultExpressions" ? adultData : embryoData;

  if (isLoading) {
    return (
      <Card id="expressions">
        <h2>lacZ Expression</h2>
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card id="expressions">
        <h2>lacZ Expression</h2>
        <Alert variant="primary">
          No expression data available for {gene.geneSymbol}.
        </Alert>
      </Card>
    );
  }

  return (
    <Card id="expressions">
      <h2>lacZ Expression</h2>

      <Tabs defaultActiveKey="adultExpressions" onSelect={(e) => setTab(e)} className="mb-3">
        <Tab
          eventKey="adultExpressions"
          title={`Adult expressions (${adultData.length})`}
        ></Tab>
        <Tab
          eventKey="embryoExpressions"
          title={`Embryo expressions (${embryoData.length})`}
        ></Tab>
      </Tabs>
      {selectedData.length > 0 ? (
        <Pagination data={selectedData}>
          {(pageData) => (
            <SortableTable
              doSort={(sort) => {
                setSorted(_.orderBy(data, sort[0], sort[1]));
              }}
              defaultSort={["parameterName", "asc"]}
              headers={[
                { width: 3, label: "Anatomy", field: "parameterName" },
                {
                  width: 3,
                  label: "Images",
                  field: "expressionImageParameters",
                },
                { width: 2, label: "Zygosity", field: "zygosity" },
                { width: 1, label: "Mutant Expr", field: "expressionRate" },
                {
                  width: 3,
                  label: "Background staining in controls (WT)",
                  field: "expressionRate",
                },
              ]}
            >
              {pageData.map((d) => (
                <tr>
                  <td>
                    <Link
                      href="/data/charts?accession=MGI:2444773&allele_accession_id=MGI:6276904&zygosity=homozygote&parameter_stable_id=IMPC_DXA_004_001&pipeline_stable_id=UCD_001&procedure_stable_id=IMPC_DXA_001&parameter_stable_id=IMPC_DXA_004_001&phenotyping_center=UC%20Davis"
                      legacyBehavior>
                      <strong className="link">{d.parameterName}</strong>
                    </Link>
                  </td>
                  <td>
                    {!!d.expressionImageParameters
                      ? d.expressionImageParameters.map((p) => (
                        <a
                          className="primary small"
                          href={`https://www.mousephenotype.org/data/imageComparator?acc=${router.query.pid}&anatomy_id=MA:0000168&parameter_stable_id=${p.parameter_stable_id}`}
                        >
                          <FontAwesomeIcon icon={faImage} />{" "}
                          {p.parameter_name}
                        </a>
                      ))
                      : "n/a"}
                  </td>
                  <td>{d.zygosity}</td>
                  <td>
                    {d.expressionRate >= 0
                      ? `${d.expressionRate}% (${d.mutantCounts.expression}/${
                        d.mutantCounts.expression +
                        d.mutantCounts.noExpression
                      })`
                      : "n/a"}
                  </td>
                  <td>
                    {d.wtExpressionRate >= 0
                      ? `${d.wtExpressionRate}% (${
                        d.controlCounts.expression
                      }/${
                        d.controlCounts.expression +
                        d.controlCounts.noExpression
                      })`
                      : "n/a"}
                  </td>
                </tr>
              ))}
            </SortableTable>
          )}
        </Pagination>
      ) : (
        <Alert variant="primary">
          No {tab === 'adultExpressions' ? 'adult' : 'embryo'} expression data available for {gene.geneSymbol}.
        </Alert>
      )}
    </Card>
  );
};

export default Expressions;
