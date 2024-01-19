import { Card, Search } from "@/components";
import styles from "../styles.module.scss";
import { Alert, Button, Container } from "react-bootstrap";
import { useRouter } from "next/router";
import { useGeneSummaryQuery, useHistopathologyQuery } from "@/hooks";
import { PlainTextCell, SmartTable } from "@/components/SmartTable";
import { Histopathology } from "@/models";


const HistopathChartPage = () => {
  const router = useRouter();
  const mgiGeneAccessionId = router.query.pid as string;
  const { data: gene} = useGeneSummaryQuery(mgiGeneAccessionId, router.isReady);
  const { data } = useHistopathologyQuery(mgiGeneAccessionId, router.isReady && !!gene);
  console.log(data);

  return (
    <>
      <Search />
      <Container className="page">
        <Card>
          <div className={styles.subheading}>
            <span className={`${styles.subheadingSection} primary`}>
              <button
                style={{
                  border: 0,
                  background: "none",
                  padding: 0,
                }}
                onClick={() => {
                  router.back();
                }}
              >
                <a href="#" className="grey mb-3">
                  {gene?.geneSymbol}
                </a>
              </button>{" "}
              / Histopathology
            </span>
          </div>
          <h1 className="mb-4 mt-2">
            <strong className="text-capitalize">
              Histopathology data for {gene?.geneSymbol}
            </strong>
          </h1>
          <SmartTable<Histopathology>
            data={data}
            defaultSort={["phenotypeName", "asc"]}
            columns={[
              { width: 1, label: "Zyg", field: "zygosity", cmp: <PlainTextCell style={{ textTransform: "capitalize" }} /> },
              { width: 1, label: "Mouse", field: "specimenNumber", cmp: <PlainTextCell /> },
              { width: 1, label: "Tissue", field: "tissue", cmp: <PlainTextCell /> },
              { width: 1, label: "Life stage", field: "lifeStageName", cmp: <PlainTextCell /> },
              { width: 1, label: "MPATH Process Term", field: "mPathProcessTerm", cmp: <PlainTextCell /> },
              { width: 1, label: "Severity Score", field: "severityScore", cmp: <PlainTextCell /> },
              { width: 1, label: "Significance Score", field: "significanceScore", cmp: <PlainTextCell /> },
            ]}
          />
        </Card>
      </Container>
    </>
  )
}

export default HistopathChartPage;