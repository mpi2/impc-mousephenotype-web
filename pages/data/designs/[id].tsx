import { useRouter } from "next/router";
import { Container } from "react-bootstrap";
import styles from "./styles.module.scss";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import { Card, Search, SortableTable } from "@/components";

const Oligo = () => {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ['alleles', 'htgt', router.query.id],
    queryFn: () => fetchAPI(`/api/v1/alleles/htgt/designId:${router.query.id}`),
    enabled: router.isReady
  })

  if (isLoading) {
    return (
      <>
        <Search />
        <Container className="page"></Container>
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
                  MAVS
                </a>
              </button>{" "}
              / DESIGN OLIGOS
            </span>
          </div>
          <h1 className="mb-4 mt-2">
            <strong>High Throughput Gene Targeting</strong>
            <span> | Design Id: 48714</span>
          </h1>
          <p className="grey">Loading...</p>
        </Card>
      </>
    );
  }

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
                  MAVS
                </a>
              </button>{" "}
              / DESIGN OLIGOS
            </span>
          </div>
          <h1 className="mb-4 mt-2">
            <strong>High Throughput Gene Targeting</strong>
            <span> | Design Id: {router.query.id}</span>
          </h1>
          <img src="https://www.mousephenotype.org/data/img/target_design_trimmed.png" />
        </Card>
        <Card>
          <h2>Oligos</h2>
          <SortableTable
            headers={[
              { label: "Type", width: 1, disabled: true },
              { label: "Start", width: 1, disabled: true },
              { label: "Stop", width: 1, disabled: true },
              { label: "Sequence", width: 5, disabled: true },
              { label: "Assembly", width: 2, disabled: true },
              { label: "CHR", width: 1, disabled: true },
              { label: "Strand", width: 1, disabled: true },
            ]}
          >
            {data.map(
              ({
                assembly,
                chr,
                strand,
                oligoStart,
                oligoStop,
                featureType,
                oligoSequence,
              }) => (
                <tr>
                  <td>{featureType}</td>
                  <td>{oligoStart}</td>
                  <td>{oligoStop}</td>
                  <td>{oligoSequence}</td>
                  <td>{assembly}</td>
                  <td>{chr}</td>
                  <td>{strand}</td>
                </tr>
              )
            )}
          </SortableTable>
        </Card>
      </Container>
    </>
  );
};

export default Oligo;
