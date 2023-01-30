import { faVenus, faMars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BodySystem } from "../../../BodySystemIcon";
import Pagination from "../../../Pagination";
import SortableTable from "../../../SortableTable";
import styles from "./styles.module.scss";
import _ from "lodash";
import { formatAlleleSymbol } from "../../../../utils";

const SignificantPhenotypes = ({ data }) => {
  const processed =
    data?.map((d) => ({
      ...d,
      pValue: Number(d.pValue),
      topLevelPhenotype: d.topLevelPhenotypes[0]?.name,
      phenotype: d.phenotype.name,
      id: d.phenotype.id,
    })) || [];
  const [sorted, setSorted] = useState<any[]>(null);

  useEffect(() => {
    setSorted(_.orderBy(processed, "phenotype", "asc"));
  }, [data]);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <Pagination data={sorted}>
      {(pageData) => (
        <SortableTable
          doSort={(sort) => {
            setSorted(_.orderBy(processed, sort[0], sort[1]));
          }}
          defaultSort={["phenotype", "asc"]}
          headers={[
            { width: 4, label: "Phenotype", field: "phenotype" },
            {
              width: 2,
              label: "System",
              field: "topLevelPhenotype",
            },
            { width: 2, label: "Allele", field: "alleleSymbol" },
            { width: 1, label: "Zyg", field: "zygosity" },
            { width: 1, label: "Sex", field: "sex" },
            { width: 1, label: "Life Stage", field: "lifeStageName" },
            { width: 1, label: "P Value", field: "pValue" },
          ]}
        >
          {pageData.map((d) => {
            const allele = formatAlleleSymbol(d.alleleSymbol);
            return (
              <tr>
                <td>
                  <Link href="/data/charts?accession=MGI:2444773&allele_accession_id=MGI:6276904&zygosity=homozygote&parameter_stable_id=IMPC_DXA_004_001&pipeline_stable_id=UCD_001&procedure_stable_id=IMPC_DXA_001&parameter_stable_id=IMPC_DXA_004_001&phenotyping_center=UC%20Davis">
                    <strong className={styles.link}>
                      {_.capitalize(d.phenotype)}
                    </strong>
                  </Link>
                </td>
                <td>
                  {d.topLevelPhenotypes?.map(({ name }) => (
                    <BodySystem name={name} color="primary" noSpacing />
                  ))}
                </td>
                <td>
                  {allele[0]}
                  <sup>{allele[1]}</sup>
                </td>
                <td>{d.zygosity}</td>
                <td>
                  {(d.sex === "male" || d.sex === "female") && (
                    <>
                      <FontAwesomeIcon
                        icon={d.sex == "female" ? faVenus : faMars}
                      />{" "}
                    </>
                  )}
                  {d.sex}
                </td>
                <td>{d.lifeStageName}</td>
                <td>
                  {!!d.pValue
                    ? Math.round(-Math.log10(Number(d.pValue)) * 1000) / 1000
                    : "-"}
                </td>
              </tr>
            );
          })}
        </SortableTable>
      )}
    </Pagination>
  );
};

export default SignificantPhenotypes;
