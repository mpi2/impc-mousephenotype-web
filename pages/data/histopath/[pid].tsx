import { Card, Search } from "@/components";
import styles from "../styles.module.scss";
import Skeleton from "react-loading-skeleton";
import { Alert, Button, Container } from "react-bootstrap";
import { useRouter } from "next/router";
import { useGeneSummaryQuery } from "@/hooks";


const HistopathChartPage = () => {
  const router = useRouter();
  const {
    isLoading,
    isError,
    data: gene
  } = useGeneSummaryQuery(router.query.pid as string, router.isReady);

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
                  {gene.geneSymbol}
                </a>
              </button>{" "}
              / Histopathology
            </span>
          </div>
          <h1 className="mb-4 mt-2">
            <strong className="text-capitalize">
              Histopathology data for {gene.geneSymbol}
            </strong>
          </h1>
        </Card>
      </Container>
    </>
  )
}