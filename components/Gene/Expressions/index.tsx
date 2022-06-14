import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Alert, Tab, Tabs, Table } from "react-bootstrap";
import Card from "../../Card";
import Pagination from "../../Pagination";
import styles from "./styles.module.scss";
import _ from "lodash";
import SortableTable from "../../SortableTable";
import Link from "next/link";

const Expressions = () => {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [sorted, setSorted] = useState<any[]>(null);
  const [tab, setTab] = useState("adultExpressions");
  useEffect(() => {
    (async () => {
      if (!router.query.pid) return;
      const res = await fetch(`/api/genes/${router.query.pid}/expression`);
      if (res.ok) {
        const expressions = await res.json();
        const processed =
          expressions?.map((d) => ({
            ...d,
            expressionRate:
              d.expression || d.noExpression
                ? Math.round(
                    (d.expression * 10000) / (d.expression + d.noExpression)
                  ) / 100
                : -1,
          })) || [];
        setData(processed);
        setSorted(_.orderBy(processed, "parameterName", "asc"));
      }
    })();
  }, [router.query.pid]);

  const adultData = sorted
    ? sorted.filter((x) => x.lacZLifestage === "adult")
    : [];
  const embryoData = sorted
    ? sorted.filter((x) => x.lacZLifestage === "embryo")
    : [];

  const selectedData = tab === "adultExpressions" ? adultData : embryoData;

  return (
    <Card id="human-diseases">
      <h2>lacZ Expression</h2>

      <Tabs defaultActiveKey="adultExpressions" onSelect={(e) => setTab(e)}>
        <Tab
          eventKey="adultExpressions"
          title={`Adult expressions (${adultData.length})`}
        ></Tab>
        <Tab
          eventKey="embryoExpressions"
          title={`Embryo expressions (${embryoData.length})`}
        ></Tab>
        <Tab eventKey="adultWT" title="Background staining WT adult"></Tab>
        <Tab eventKey="embryoWT" title="Background staining WT embryo"></Tab>
      </Tabs>
      {!selectedData || !selectedData.length ? (
        <Alert variant="primary" style={{ marginTop: "1em" }}>
          Expression data not available
        </Alert>
      ) : (
        <Pagination data={selectedData}>
          {(pageData) => (
            <SortableTable
              doSort={(sort) => {
                setSorted(_.orderBy(data, sort[0], sort[1]));
              }}
              defaultSort={["parameterName", "asc"]}
              headers={[
                { width: 4, label: "Anatomy", field: "parameterName" },
                { width: 2, label: "Images", field: "imageOnly" },
                { width: 2, label: "Zygosity", field: "zygosity" },
                { width: 2, label: "Mutant Expr", field: "expressionRate" },
              ]}
            >
              {pageData.map((d) => (
                <tr>
                  <td>
                    <Link href="/data/charts?accession=MGI:2444773&allele_accession_id=MGI:6276904&zygosity=homozygote&parameter_stable_id=IMPC_DXA_004_001&pipeline_stable_id=UCD_001&procedure_stable_id=IMPC_DXA_001&parameter_stable_id=IMPC_DXA_004_001&phenotyping_center=UC%20Davis">
                      <strong className={styles.link}>{d.parameterName}</strong>
                    </Link>
                  </td>
                  <td>{d.imageOnly > 0 ? "Wholemount images" : "n/a"}</td>
                  <td>{d.zygosity}</td>
                  <td>
                    {d.expression || d.noExpression
                      ? `${d.expressionRate}% (${d.expression} of ${
                          d.noExpression + d.expression
                        })`
                      : "n/a"}
                  </td>
                </tr>
              ))}
            </SortableTable>
          )}
        </Pagination>
      )}
    </Card>
  );
};

export default Expressions;
