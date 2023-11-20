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
import { formatAlleleSymbol, formatPValue } from "@/utils";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";

const SignificantPhenotypes = ({ data }) => {
  const [query, setQuery] = useState(undefined);
  const groups = data?.reduce((acc, d) => {
    const {
      phenotype: { id },
      alleleAccessionId,
      zygosity,
      sex,
      pValue,
      datasetId,
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
      topLevelPhenotype: d?.topLevelPhenotypes?.[0]?.name,
      phenotype: d.phenotype.name,
      id: d.phenotype.id,
      phenotypeId: d.phenotype.id,
    })) || [];

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

  const [sorted, setSorted] = useState<any[]>(null);

  useEffect(() => {
    setSorted(_.orderBy(processed, "phenotype", "asc"));
  }, [data]);

  const filtered = (sorted ?? []).filter(({phenotype, phenotypeId,}) =>
    (!query || `${phenotype} ${phenotypeId}`.toLowerCase().includes(query))
  );

  if (!sorted) {
    return null;
  }

  return (
    <Pagination
      data={filtered}
      additionalTopControls={
        <Form.Control
          type="text"
          style={{
            display: "inline-block",
            width: 200,
            marginRight: "2rem",
          }}
          aria-label="Filter by parameters"
          id="parameterFilter"
          className="bg-white"
          placeholder="Search "
          onChange={(el) => {
            setQuery(el.target.value.toLowerCase() || undefined);
          }}
        ></Form.Control>
      }
    >
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
                <td><strong>{d.phenotype}</strong></td>
                <td>
                  {d.topLevelPhenotypes?.map(({ name }) => (
                    <BodySystem name={name} color="system-icon black in-table" noSpacing />
                  ))}
                </td>
                <td>
                  {allele[0]}
                  <sup>{allele[1]}</sup>
                </td>
                <td style={{ textTransform: "capitalize" }}>{d.zygosity}</td>
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
                    <span className="">
                      {!!d.pValue ? formatPValue(d.pValue) : 0}&nbsp;
                    </span>
                    <Link href={`/data/charts?mgiGeneAccessionId=${d.mgiGeneAccessionId}&mpTermId=${d.id}`}>
                      <strong className={`link primary small float-right`}>
                        <FontAwesomeIcon icon={faChartLine} /> Supporting data&nbsp;
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
