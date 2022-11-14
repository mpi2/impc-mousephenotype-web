import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Card from "../../components/Card";
import Summary from "../../components/Phenotype/Summary";
import Search from "../../components/Search";
import _ from "lodash";
import { Alert } from "react-bootstrap";
import Pagination from "../../components/Pagination";
import SortableTable from "../../components/SortableTable";
import { formatAlleleSymbol } from "../../utils";

const Associations = ({ data }: { data: any }) => {
  const [sorted, setSorted] = useState<any[]>(null);

  useEffect(() => {
    setSorted(_.orderBy(data, "alleleSymbol", "asc"));
  }, [data]);

  if (!data) {
    return (
      <Alert style={{ marginTop: "1em" }} variant="primary">
        All data not available
      </Alert>
    );
  }

  return (
    <>
      <Pagination data={sorted}>
        {(currentPage) => (
          <SortableTable
            doSort={(sort) => {
              setSorted(_.orderBy(data, sort[0], sort[1]));
            }}
            defaultSort={["alleleSymbol", "asc"]}
            headers={[
              {
                width: 2,
                label: "Gene / allele",
                field: "alleleSymbol",
              },
              {
                width: 1,
                label: "Zygosity",
                field: "zygosity",
              },
              { width: 1, label: "Sex", field: "sex" },
              { width: 1, label: "Life stage", field: "lifeStage" },
              { width: 2, label: "Phenotype", field: "phenotype" },
              { width: 2, label: "Parameter", field: "parameter" },
              {
                width: 2,
                label: "Phenotyping Center",
                field: "phephenotypingCenternotype",
              },
              { width: 2, label: "P value", field: "pValue" },
            ]}
          >
            {currentPage.map(
              (
                {
                  alleleSymbol,
                  zygosity,
                  sex,
                  lifeStage,
                  phenotype,
                  parameter,
                  phenotypingCenter,
                  pValue,
                },
                i
              ) => {
                const allele = formatAlleleSymbol(alleleSymbol);
                return (
                  <tr key={`tr-${alleleSymbol}-${i}`}>
                    <td>
                      <strong>{allele}</strong>
                    </td>
                    <td>{zygosity}</td>
                    <td>{sex}</td>
                    <td>{lifeStage}</td>
                    <td>{phenotype}</td>
                    <td>{parameter}</td>
                    <td>{phenotypingCenter}</td>
                    <td>{pValue}</td>
                  </tr>
                );
              }
            )}
          </SortableTable>
        )}
      </Pagination>
    </>
  );
};

const Phenotype = () => {
  const router = useRouter();
  const [data, setData] = useState(null);
  useEffect(() => {
    (async () => {
      if (!router.query.id) return;
      try {
        const res = await fetch(
          `/api/v1/phenotypes/MP:0012361/geneAssociations`
        );
        if (res.ok) {
          const associatsions = await res.json();
          setData(associatsions);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [router.query.id]);
  return (
    <>
      <Search isPhenotype />
      <Container className="page">
        <Summary />

        <Card>
          <h2>IMPC Gene variants with abnormal stationary movement</h2>
          <p>
            Total number of significant genotype-phenotype associations:{" "}
            {data?.length ?? 0}
          </p>
          {!!data && <Associations data={data} />}
        </Card>
        <Card>
          <h2>The way we measure</h2>
          <p>Procedure</p>
          <p>
            <a
              className="secondary"
              href="https://www.mousephenotype.org/impress/ProcedureInfo?procID=1157"
            >
              Combined SHIRPA and Dysmorphology
            </a>
          </p>
          <p>
            <a
              className="secondary"
              href="https://www.mousephenotype.org/impress/ProcedureInfo?procID=72"
            >
              Click-box
            </a>
          </p>
          <p>
            <a
              className="secondary"
              href="https://www.mousephenotype.org/impress/ProcedureInfo?procID=11"
            >
              Modified SHIRPA
            </a>
          </p>
          <p>
            <a
              className="secondary"
              href="https://www.mousephenotype.org/impress/ProcedureInfo?procID=1213"
            >
              SHIRPA
            </a>
          </p>
          <p>
            <a
              className="secondary"
              href="https://www.mousephenotype.org/impress/ProcedureInfo?procID=27"
            >
              Shirpa (GMC)y
            </a>
          </p>
        </Card>
        <Card>
          <h2>Phenotype associations stats</h2>
          <p>
            0.78% of tested genes with null mutations on a B6N genetic
            background have a phenotype association to abnormal stationary
            movement (54/6907)
          </p>
          <p>1.07% females (15/1402) 1.00% males (14/1407)</p>
        </Card>
      </Container>
    </>
  );
};

export default Phenotype;
