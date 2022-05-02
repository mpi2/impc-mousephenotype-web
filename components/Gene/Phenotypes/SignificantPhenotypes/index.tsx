import { faFemale, faMars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "react-bootstrap";
import { BodySystem } from "../../../BodySystemIcon";
import styles from "./styles.module.scss";

const SignificantPhenotypes = ({ data }) => {
  return (
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
        <tr>
          <td>
            <strong>Decreased bone mineral content</strong>
          </td>
          <td>
            <BodySystem name="skeleton phenotype" color="primary" noSpacing />
          </td>
          <td>
            Mavs<sup>em1(IMPC)Mbp</sup>
          </td>
          <td>HOM</td>
          <td>
            <FontAwesomeIcon icon={faMars} /> Female
          </td>
          <td>Early adult</td>
          <td>
            3.17×10<sup>-06</sup>
          </td>
        </tr>
        <tr>
          <td>
            <strong>Decreased bone mineral density</strong>
          </td>
          <td>
            <BodySystem name="skeleton phenotype" color="primary" noSpacing />
          </td>
          <td>
            Mavs<sup>em1(IMPC)Mbp</sup>
          </td>
          <td>HOM</td>
          <td>
            <FontAwesomeIcon icon={faMars} /> Female
          </td>
          <td>Early adult</td>
          <td>
            2.02×10<sup>-06</sup>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default SignificantPhenotypes;
