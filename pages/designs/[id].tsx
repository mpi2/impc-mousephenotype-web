import { useRouter } from "next/router";
import { useState } from "react";
import { Container } from "react-bootstrap";
import Card from "../../components/Card";
import Search from "../../components/Search";
import _ from "lodash";
import SortableTable from "../../components/SortableTable";
import styles from "./styles.module.scss";

const Oligo = () => {
  const router = useRouter();
  const [data, setData] = useState(null);
  // useEffect(() => {
  //   (async () => {
  //     if (!router.query.id) return;
  //     try {
  //       const res = await fetch(`/api/v1/oligos/123`);
  //       if (res.ok) {
  //         const oligo = await res.json();
  //         setData(oligo);
  //       }
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   })();
  // }, [router.query.id]);
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
            <span> | Design Id: 48714</span>
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
            <tr>
              <td>D3</td>
              <td>54548017</td>
              <td>54548066</td>
              <td>CCACCACATCCTAAACCTTCCTTATATTGGCAAGCCTTGCTGCGCACTCT</td>
              <td>GRCm38</td>
              <td>9</td>
              <td>-1</td>
            </tr>
            <tr>
              <td>D3</td>
              <td>54548017</td>
              <td>54548066</td>
              <td>CCACCACATCCTAAACCTTCCTTATATTGGCAAGCCTTGCTGCGCACTCT</td>
              <td>GRCm38</td>
              <td>9</td>
              <td>-1</td>
            </tr>
            <tr>
              <td>D3</td>
              <td>54548017</td>
              <td>54548066</td>
              <td>CCACCACATCCTAAACCTTCCTTATATTGGCAAGCCTTGCTGCGCACTCT</td>
              <td>GRCm38</td>
              <td>9</td>
              <td>-1</td>
            </tr>
            <tr>
              <td>D3</td>
              <td>54548017</td>
              <td>54548066</td>
              <td>CCACCACATCCTAAACCTTCCTTATATTGGCAAGCCTTGCTGCGCACTCT</td>
              <td>GRCm38</td>
              <td>9</td>
              <td>-1</td>
            </tr>
            <tr>
              <td>D3</td>
              <td>54548017</td>
              <td>54548066</td>
              <td>CCACCACATCCTAAACCTTCCTTATATTGGCAAGCCTTGCTGCGCACTCT</td>
              <td>GRCm38</td>
              <td>9</td>
              <td>-1</td>
            </tr>
            <tr>
              <td>D3</td>
              <td>54548017</td>
              <td>54548066</td>
              <td>CCACCACATCCTAAACCTTCCTTATATTGGCAAGCCTTGCTGCGCACTCT</td>
              <td>GRCm38</td>
              <td>9</td>
              <td>-1</td>
            </tr>
          </SortableTable>
        </Card>
      </Container>
    </>
  );
};

export default Oligo;
