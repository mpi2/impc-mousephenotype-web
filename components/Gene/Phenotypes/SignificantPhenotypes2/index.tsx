import {
  faVenus,
  faMars,
  faMarsAndVenus,
  faChevronRight,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BodySystem } from "../../../BodySystemIcon";
import Pagination from "../../../Pagination";
import SortableTable from "../../../SortableTable";
import styles from "./styles.module.scss";
import _ from "lodash";
import { formatAlleleSymbol, formatPValue } from "../../../../utils";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const SignificantPhenotypes = ({ data }) => {
  const groups = data?.reduce((acc, d) => {
    const {
      phenotype: { id },
      alleleAccessionId,
      zygosity,
      sex,
      pValue,
    } = d;

    const key = `${id}-${alleleAccessionId}-${zygosity}`;
    if (acc[key]) {
      if (acc[key].pValue > pValue) {
        acc[key].pValue = Number(pValue);
        acc[key].sex = sex;
      }
    } else {
      acc[key] = { ...d };
    }
    acc[key][`pValue_${sex}`] = Number(pValue);

    return acc;
  }, {});

  const processed =
    (groups ? Object.values(groups) : []).map((d: any) => ({
      ...d,
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

  const getIcon = (sex) => {
    switch (sex) {
      case "male":
        return faMars;
      case "female":
        return faVenus;
      default:
        return faMarsAndVenus;
    }
  };

  const getSexLabel = (sex) => {
    switch (sex) {
      case "male":
        return "Male";
      case "female":
        return "Female";
      default:
        return "Combined";
    }
  };

  return (
    <Pagination data={sorted}>
      {(pageData) => (
        <SortableTable
          doSort={(sort) => {
            setSorted(_.orderBy(processed, sort[0], sort[1]));
          }}
          defaultSort={["phenotype", "asc"]}
          headers={[
            { width: 2.2, label: "Phenotype", field: "phenotype" },
            {
              width: 1,
              label: "System",
              field: "topLevelPhenotype",
            },
            { width: 1, label: "Allele", field: "alleleSymbol" },
            { width: 1, label: "Zyg", field: "zygosity" },
            { width: 1, label: "Life stage", field: "lifeStageName" },
            {
              width: 1,
              label: "Significant sexes",
              field: "pValue",
            },
            {
              width: 2,
              label: "Most significant P-value",
              field: "sex",
            },
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
                    <BodySystem name={name} color="black" noSpacing />
                  ))}
                </td>
                <td>
                  {allele[0]}
                  <sup>{allele[1]}</sup>
                </td>
                <td>{d.zygosity}</td>
                <td>{d.lifeStageName}</td>
                <td>
                  {["male", "female", "not_considered"].map((col) => {
                    const hasSignificant = d[`pValue_${col}`];
                    return hasSignificant ? (
                      <OverlayTrigger
                        placement="top"
                        trigger={["hover", "focus"]}
                        overlay={<Tooltip>{getSexLabel(col)}</Tooltip>}
                      >
                        <span className="me-2">
                          <FontAwesomeIcon icon={getIcon(col)} size="lg" />
                        </span>
                      </OverlayTrigger>
                    ) : null;
                  })}
                </td>
                <td>
                  <span className={`me-2 bold ${styles.pValueCell}`}>
                    <span className="orange-dark">
                      {formatPValue(d.pValue)}{" "}
                    </span>
                    <Link href="/data/charts?accession=MGI:2444773&allele_accession_id=MGI:6276904&zygosity=homozygote&parameter_stable_id=IMPC_DXA_004_001&pipeline_stable_id=UCD_001&procedure_stable_id=IMPC_DXA_001&parameter_stable_id=IMPC_DXA_004_001&phenotyping_center=UC%20Davis">
                      <strong className={`link small float-right`}>
                        <FontAwesomeIcon icon={faChartLine} /> Supporting data{" "}
                        <FontAwesomeIcon icon={faChevronRight} />
                      </strong>
                    </Link>
                  </span>
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
