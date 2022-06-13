import { faVenus, faMars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { BodySystem } from "../../../BodySystemIcon";
import Pagination from "../../../Pagination";
import SortableTable from "../../../SortableTable";
import styles from "./styles.module.scss";
import _ from "lodash";

const SignificantPhenotypes = ({ data }) => {
  const processed =
    data?.map((d) => ({
      ...d,
      pValue: Number(d.pValue),
      topLevelPhenotype: d.topLevelPhenotype.map((t) => t.name),
    })) || [];
  const [sorted, setSorted] = useState<any[]>(null);

  useEffect(() => {
    setSorted(_.orderBy(processed, "parameterName", "asc"));
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
          defaultSort={["parameterName", "asc"]}
          headers={[
            { width: 2, label: "Phenotype", field: "parameterName" },
            {
              width: 1,
              label: "System",
              field: "topLevelPhenotype",
            },
            { width: 2, label: "Allele", field: "alleleSymbol" },
            { width: 2, label: "Zyg", field: "zygosity" },
            { width: 2, label: "Sex", field: "sex" },
            { width: 1, label: "Life Stage", field: "lifeStageName" },
            { width: 2, label: "P Value", field: "pValue" },
          ]}
        >
          {pageData.map((d) => (
            <tr>
              <td>
                <Link href="/data/charts?accession=MGI:2444773&allele_accession_id=MGI:6276904&zygosity=homozygote&parameter_stable_id=IMPC_DXA_004_001&pipeline_stable_id=UCD_001&procedure_stable_id=IMPC_DXA_001&parameter_stable_id=IMPC_DXA_004_001&phenotyping_center=UC%20Davis">
                  <strong className={styles.link}>{d.parameterName}</strong>
                </Link>
              </td>
              <td>
                <BodySystem
                  name={d.topLevelPhenotype[0]}
                  color="primary"
                  noSpacing
                />
              </td>
              <td>
                {d.alleleSymbol.split("<")[0]}
                <sup>{d.alleleSymbol.split("<")[1].replace(">", "")}</sup>
              </td>
              <td>{d.zygosity}</td>
              <td>
                <FontAwesomeIcon icon={d.sex == "female" ? faVenus : faMars} />{" "}
                {d.sex}
              </td>
              <td>{d.lifeStageName[0]}</td>
              <td>
                {!!d.pValue
                  ? Math.round(-Math.log10(Number(d.pValue)) * 1000) / 1000
                  : "-"}
              </td>
            </tr>
          ))}
        </SortableTable>
      )}
    </Pagination>
  );
};

export default SignificantPhenotypes;
