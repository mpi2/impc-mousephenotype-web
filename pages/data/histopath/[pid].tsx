import { Card, Search } from "@/components";
import styles from "../styles.module.scss";
import { Badge, Container } from "react-bootstrap";
import { useRouter } from "next/router";
import { useGeneSummaryQuery, useHistopathologyQuery } from "@/hooks";
import { PlainTextCell, SmartTable } from "@/components/SmartTable";
import { Histopathology } from "@/models";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";


const HistopathChartPage = () => {
  const router = useRouter();
  const mgiGeneAccessionId = router.query.pid as string;
  const { data: gene} = useGeneSummaryQuery(mgiGeneAccessionId, router.isReady);
  const [selectedAnatomy, setSelectedAnatomy] = useState<string>(null);
  const { data } = useHistopathologyQuery(mgiGeneAccessionId, router.isReady && !!gene);
  const anatomyParam = router.query?.anatomy as string;

  useEffect(() => {
    setSelectedAnatomy(anatomyParam as string)
  }, [anatomyParam]);

  const filteredData = !!selectedAnatomy
    ? data?.filter(item => item.tissue.toLowerCase().includes(anatomyParam))
    : data;

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
            data={filteredData}
            defaultSort={["phenotypeName", "asc"]}
            additionalTopControls={
              selectedAnatomy ? (
                <span
                  style={{ fontSize: '1.3rem', cursor: "pointer", textTransform: "capitalize" }}
                  onClick={() => setSelectedAnatomy(null)}
                >
                  <Badge pill bg="secondary">
                    {selectedAnatomy}
                    &nbsp;
                    <FontAwesomeIcon icon={faXmark} />
                  </Badge>
                </span>
              ) : null
            }
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