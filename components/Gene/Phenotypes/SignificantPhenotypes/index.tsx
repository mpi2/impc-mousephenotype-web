import { faVenus, faMars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Table } from "react-bootstrap";
import { BodySystem } from "../../../BodySystemIcon";
import Pagination from "../../../Pagination";
import styles from "./styles.module.scss";

const SignificantPhenotypes = ({ data }) => {
  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <Pagination data={data}>
      {(pageData) => (
        <Table striped bordered className={styles.table}>
          <thead>
            <tr>
              <th>Phenotype</th>
              <th>System</th>
              <th>Allele</th>
              <th>Zyg</th>
              <th>Sex</th>
              <th>Life Stage</th>
              <th>P Value</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((d) => (
              <tr>
                <td>
                  <Link href="/data/charts?accession=MGI:2444773&allele_accession_id=MGI:6276904&zygosity=homozygote&parameter_stable_id=IMPC_DXA_004_001&pipeline_stable_id=UCD_001&procedure_stable_id=IMPC_DXA_001&parameter_stable_id=IMPC_DXA_004_001&phenotyping_center=UC%20Davis">
                    <strong className={styles.link}>{d.parameterName}</strong>
                  </Link>
                </td>
                <td>
                  <BodySystem
                    name={d.topLevelPhenotype[0].name}
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
                  <FontAwesomeIcon
                    icon={d.sex == "female" ? faVenus : faMars}
                  />{" "}
                  {d.sex}
                </td>
                <td>{d.lifeStageName[0]}</td>
                <td>{d.pValue}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Pagination>
  );
};

export default SignificantPhenotypes;
